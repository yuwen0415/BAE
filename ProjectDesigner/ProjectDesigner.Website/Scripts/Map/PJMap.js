dojo.require("esri.map");
dojo.require("esri.tasks.query");
dojo.require("esri.tasks.geometry");
dojo.require("esri.layers.FeatureLayer");
dojo.require("esri.layers.graphics");
dojo.require("esri.graphic");
dojo.require("esri.toolbars.draw");
dojo.require("esri.toolbars.navigation");
dojo.require("dijit.Toolbar");
dojo.require("esri.dijit.Scalebar");
dojo.require("esri.dijit.OverviewMap");
dojo.require("esri.dijit.Measurement");

var map, tileLayer = null, scalebar = null, overviewMapDijit = null;
var toolbar, navToolbar;
var loading;
var resizeTimer, measurement, infoTemplate;
var visible = [], queryble = [];
var gsvc = null;
var symbolPoint = new esri.symbol.PictureMarkerSymbol('../images/Map/stake_hover.png', 11, 24);
var symbolMarker = new esri.symbol.PictureMarkerSymbol('../images/Map/mark.png', 23, 25);
var symbolLine = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 8);
var searchFlag = false, markFlag = false;
var pointLocation = null;
var rangeLayer = null, stakeLayer = null;
var sr = null, sk = null;
var handleonDrawEnd = null;

function nullEmpty(o){return o ? o : "";}

function getInitExtent() {
    //var xmin = 117.77702924560307, ymin = 24.383707587276408, xmax = 118.4386675654091, ymax = 24.93054735293662;  //厦门
    var xmin = 114.211057, ymin = 24.014221, xmax = 121.195207, ymax = 27.374313;  //全省
    if (nullEmpty($.cookie("hnempInitExtent")) != "") {
        var e = $.cookie("hnempInitExtent").split('&');
        for (var i = 0, len = e.length; i < len; i++) {
            var item = e[i].split("=");
            if (item[0] == "xmin") {
                xmin = item[1];
            }
            if (item[0] == "ymin") {
                ymin = item[1];
            }
            if (item[0] == "xmax") {
                xmax = item[1];
            }
            if (item[0] == "ymax") {
                ymax = item[1];
            }
        }
    }

    initialPoint = { "xmin": parseFloat(xmin), "ymin": parseFloat(ymin), "xmax": parseFloat(xmax), "ymax": parseFloat(ymax) };
}

function init0() {
    getInitExtent();
    FJLayer();
    esri.config.defaults.io.proxyUrl = "../../proxy.ashx";
    map = new esri.Map("map", { logo: false });

    toolbar = new esri.toolbars.Draw(map);
    navToolbar = new esri.toolbars.Navigation(map);

    loading = $("#loadingImg");
    esri.config.defaults.map.slider = { right: "30px", top: "30px", height: "200px" };
    map.infoWindow.resize(500, 400);

    dojo.connect(map, "onLoad", mapLoaded0);
    dojo.connect(map, "onLoad", showLoading);
    dojo.connect(map, "onZoomStart", showLoading);
    dojo.connect(map, "onPanStart", showLoading);
    dojo.connect(map, "onUpdateStart", showLoading);
    dojo.connect(map, "onUpdateEnd", hideLoading);
    handleonDrawEnd = dojo.connect(toolbar, "onDrawEnd", addToMap);

    gsvc = new esri.tasks.GeometryService(GeometryServiceURL);

    if (connWeb) {
        tileLayer = new jtt.FJWmtsLayer();
        map.addLayer(new jtt.FJWmtsLayer());
    }
    else {   
        tileLayer = new esri.layers.ArcGISTiledMapServiceLayer(FjMapURL);
        map.addLayer(tileLayer);

        var spatialRef = new esri.SpatialReference({ wkid: 4326 });
        var startExtent = new esri.geometry.Extent();
        startExtent.xmin = initialPoint.xmin;
        startExtent.ymin = initialPoint.ymin;
        startExtent.xmax = initialPoint.xmax;
        startExtent.ymax = initialPoint.ymax;
        startExtent.spatialReference = spatialRef;
        map.setExtent(startExtent);
    }

    //矢量底图
    vectorBasemap = new esri.layers.ArcGISTiledMapServiceLayer(vectorBasemapURL, { displayLevels: [6, 7, 8, 9] });
    map.addLayer(vectorBasemap);

    //影像底图
    imageBasemap = new esri.layers.ArcGISTiledMapServiceLayer(imageBasemapURL, { displayLevels: [6, 7, 8, 9] });

    dojo.connect(window, "onresize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () { map.resize(); map.reposition(); }, 500);
    });

    rangeLayer = new esri.layers.GraphicsLayer();
    map.addLayer(rangeLayer);

    stakeLayer = new esri.layers.GraphicsLayer();
    map.addLayer(stakeLayer);
}

function mapLoaded0() {
    dojo.connect(dijit.byId('map'), 'resize', map, map.resize);
    //add the scalebar 
    scalebar = new esri.dijit.Scalebar({
        map: map,
        scalebarUnit: 'metric',
        attachTo: "bottom-left"
    });

    //add the overview map 
    overviewMapDijit = new esri.dijit.OverviewMap({
        map: map,
        baseLayer: tileLayer,
        attachTo: "bottom-right",
        color: "#84BADD",
        width: 225,
        height: 150,
        expandFactor: 2,
        opacity: 0.50,
        visible: false
    });
    overviewMapDijit.startup();

    measurement = new esri.dijit.Measurement({
        map: map,
        defaultAreaUnit: esri.Units.SQUARE_METERS,
        defaultLengthUnit: esri.Units.KILOMETERS
    }, dojo.byId('measurementDiv'));

    measurement.startup();

    dojo.connect(measurement, "onMeasureEnd", function (activeTool) {
        this.setTool(activeTool, false);
    });

    $("#measurement").hide(); 
}

dojo.addOnLoad(init0);

function showLoading() {
    loading.show();
}

function hideLoading(error) {
    loading.hide();
}

function mgclear() {
    map.graphics.clear();
    rangeLayer.clear();
    stakeLayer.clear();
    map.infoWindow.hide();
}

function showLayerList() {
    if ($("#layerList").is(":hidden")) {
        $("#layerSwitch").text("关闭图层控制");
        $("#layerList").show();
    }
    else {
        $("#layerSwitch").text("打开图层控制");
        $("#layerList").hide();
    }
}

function showMeasure() {
    measurement.clearResult();
    if ($("#measurement").is(":hidden")) {
        $(".MeasureDistance").text('关闭测量');
        $("#measurement").show();
    }
    else {
        $(".MeasureDistance").text('测量');
        $("#measurement").hide();
    }
}

function addToMap(geometry) {
    toolbar.deactivate();
    map.showZoomSlider();
    var graphic = null;
    switch (geometry.type) {
        case "point":
            var symbol = new esri.symbol.PictureMarkerSymbol('../images/Map/mark.png', 23, 25);
            if (markFlag) {
                sr = null;
                sk = null;
                stakeLayer.clear();
                graphic = new esri.Graphic(geometry, symbolPoint, null, new esri.InfoTemplate(getStakeMarkerTitle, getStakeMarkerContent));
                zoomTo(graphic);
                stakeLayer.add(graphic);
                pointLocation = graphic;
                projectToLL(32650, geometry, markStake);
            } else {
                if (searchFlag) {
                    graphic = new esri.Graphic(geometry, symbol);
                    zoomTo(graphic);
                    map.graphics.add(graphic);
                    eventSearch(geometry);
                    doBuffer(geometry);
                }
                else {
                    graphic = new esri.Graphic(geometry, symbol);
                    map.graphics.add(graphic);
                }
            }
            break;
        case "polyline":
            var symbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([255, 0, 0]), 1);
            graphic = new esri.Graphic(geometry, symbol);
            map.graphics.add(graphic);
            break;
        case "polygon":
            var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASHDOT, new dojo.Color([255, 0, 0]), 2), new dojo.Color([255, 255, 0, 0.25]));
            graphic = new esri.Graphic(geometry, symbol);
            map.graphics.add(graphic);
            break;
        case "extent":
            var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASHDOT, new dojo.Color([255, 0, 0]), 0.6), new dojo.Color([255, 255, 0, 0.25]));
            graphic = new esri.Graphic(geometry, symbol);
            rangeLayer.add(graphic);
            break;
        case "multipoint":
            var symbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_DIAMOND, 20, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 0, 0]), 1), new dojo.Color([255, 255, 0, 0.5]));
            graphic = new esri.Graphic(geometry, symbol);
            map.graphics.add(graphic);
            break;
    }

    searchFlag = false;
    markFlag = false;
}

function chageMaptype(type) {
    var layer = map.getLayer(map.layerIds[1]);
    map.removeLayer(layer);
    switch (type) {
        case "image":
            map.addLayer(imageBasemap, 1)
            break
        case "vector":
            map.addLayer(vectorBasemap, 1)
            break
        default:
            break
    }
}

function infowinFixscreen(evt) {
    map.infoWindow.setFixedAnchor(esri.dijit.InfoWindow.ANCHOR_UPPERRIGHT);
    var maxPoint = new esri.geometry.Point(map.extent.xmax, map.extent.ymax)
    var centerPoint = new esri.geometry.Point(map.extent.getCenter());

    var maxPointScreen = map.toScreen(maxPoint);
    var centerPointScreen = map.toScreen(centerPoint);

    var xDiff = Math.abs(maxPointScreen.x - evt.screenPoint.x) - map.infoWindow.width - 30;
    var yDiff = Math.abs(maxPointScreen.y - evt.screenPoint.y) - map.infoWindow.height - 70;

    if (xDiff < 0) { centerPointScreen.x -= xDiff; }
    if (yDiff < 0) { centerPointScreen.y += yDiff; }

    centerPoint = map.toMap(centerPointScreen);
    map.centerAt(centerPoint);
    map.infoWindow.show(evt.screenPoint, esri.dijit.InfoWindow.ANCHOR_UPPERRIGHT);
}

function infowinFixscreen1(geometry) {
    map.infoWindow.setFixedAnchor(esri.dijit.InfoWindow.ANCHOR_UPPERRIGHT);
    var maxPoint = new esri.geometry.Point(map.extent.xmax, map.extent.ymax)
    var centerPoint = new esri.geometry.Point(map.extent.getCenter());

    var maxPointScreen = map.toScreen(maxPoint);
    var centerPointScreen = map.toScreen(centerPoint);
    var geoScreenPoint = map.toScreen(geometry);

    var xDiff = Math.abs(maxPointScreen.x - geoScreenPoint.x) - map.infoWindow.width - 30;
    var yDiff = Math.abs(maxPointScreen.y - geoScreenPoint.y) - map.infoWindow.height - 70;

    if (xDiff < 0) { centerPointScreen.x -= xDiff; }
    if (yDiff < 0) { centerPointScreen.y += yDiff; }

    centerPoint = map.toMap(centerPointScreen);
    map.centerAt(centerPoint);
    map.infoWindow.show(geoScreenPoint, esri.dijit.InfoWindow.ANCHOR_UPPERRIGHT);
}

function createHint(obj, label, fileds) {
    var hint = $("<div class='hover_info'></div>");
    var filedArr = fileds.split(',');
    dojo.connect(obj, "onMouseOver", function (evt) {
        map.setMapCursor("pointer");
        var cont = "";
        for (var i in filedArr) {
            cont += evt.graphic.attributes[filedArr[i]] + ",";
        }
        hint.html(label + cont.substring(0, cont.length - 1));
        hint.css({ "top": evt.screenPoint.y, "left": evt.screenPoint.x, "z-index": 999 });
        hint.appendTo($("#map"));
        hint.show();
    });

    dojo.connect(obj, "onMouseOut", function (evt) {
        map.setMapCursor("default");
        $(".hover_info").hide();
    });
}

function zoomTo(graphic) {
    switch (graphic.geometry.type) {
        case "point":
            var scrPoint = esri.geometry.toScreenPoint(map.extent, map.width, map.height, graphic.geometry);
            map.setExtent(new esri.geometry.Extent(graphic.geometry.x - 0.02, graphic.geometry.y - 0.02, graphic.geometry.x + 0.02, graphic.geometry.y + 0.02));
            break;
        case "polyline":
            map.setExtent(graphic.geometry.getExtent());
            break;
        case "polygon":
            map.setExtent(graphic.geometry.getExtent());
            break;
    }
}

function showCoordinates(evt) {
    var mp = evt.mapPoint;
    alert(mp.x + ", " + mp.y);
}

function fixExtent() {
    var currE = map.extent;
    var fixXmin = currE.xmin < fullPoint.xmin ? fullPoint.xmin : currE.xmin;
    var fixYmin = currE.ymin < fullPoint.ymin ? fullPoint.ymin : currE.ymin;
    var fixXmax = currE.xmax > fullPoint.xmax ? fullPoint.xmax : currE.xmax;
    var fixYmax = currE.ymax > fullPoint.ymax ? fullPoint.ymax : currE.ymax;

    var fixE = new esri.geometry.Extent(fixXmin, fixYmin, fixXmax, fixYmax, map.spatialReference);
    map.setExtent(fixE);
}

function projectToLL(outsr, geometries, callback) {
    var outSR = new esri.SpatialReference({ wkid: outsr });
    gsvc.project([geometries], outSR, function (projectedFeatures) {
        callback(projectedFeatures[0]);
    });
}

function markStake(geometry) {
    var params = {
        f: "json",
        location: dojo.toJson(geometry.toJson()),
        tolerance: 35,
        routeIDFieldName: "Route_Code"
    };

    esri.request({
        url: DSIdentifyRouteURL,
        content: params,
        callbackParamName: "callback",
        load: function (result) {
            if (result.location.length > 0) {
                sr = result.location[0].routeID;
                sk = result.location[0].measure.toFixed(3);
                map.infoWindow.setContent(pointLocation.getContent());
                map.infoWindow.setTitle(pointLocation.getTitle());
                map.infoWindow.show(pointLocation.geometry);
            }
        }
    });
}

function getStakeMarkerTitle() {
    return "<label>路线: " + nullEmpty(sr) + " </label><br />桩号: " + nullEmpty(sk) + "K";
}

function getStakeMarkerContent() {
    map.infoWindow.resize(220, 60);
    return null;
}

function dateDiff(interval, date1, date2) {
    var objInterval = { 'D': 1000 * 60 * 60 * 24, 'H': 1000 * 60 * 60, 'M': 1000 * 60, 'S': 1000, 'T': 1 };
    interval = interval.toUpperCase();
    var dt1 = Date.parse(date1.replace(/-/g, '/'));
    var dt2 = Date.parse(date2.replace(/-/g, '/'));
    try {
        return Math.round((dt2 - dt1) / eval('(objInterval.' + interval + ')'));
    }
    catch (e) {
        return e.message;
    }
}

function AddLayerToMap(layer) {
    if (map.graphicsLayerIds.indexOf(layer.id) == -1)
        map.addLayer(layer);
    else
        return;
}

function RemoveLayerInMap(layer) {
    if (map.graphicsLayerIds.indexOf(layer.id) == -1)
        return;
    else
        map.removeLayer(layer);
}