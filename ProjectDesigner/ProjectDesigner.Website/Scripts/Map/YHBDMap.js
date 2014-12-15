/// <reference path="../jquery-1.7.min.js" />

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
dojo.require("esri.dijit.Measurement");

var map, loading;
var toolbar, navToolbar, measurement;
var resizeTimer;
var gsvc = null;
var rate = 500;
var yhbdLayer = null;

var ergFlag = true;

var seriesData;
var categories;
var title;
var subTitle;
var yAxisTitle;
var chartType = 'column';
var chart;

function nullEmpty(o) { return o ? o : ""; }

var params = new esri.layers.TileInfo({
    "dpi": 96,
    "format": "image/png",
    "compressionQuality": 0,
    "spatialReference": {
        "wkid": 4326
    },
    "rows": 256,
    "cols": 256,
    "origin": {
        "x": -180,
        "y": 90
    },
    "lods": [
                { "level": 1, "resolution": 0.005499331373747988, "scale": 2311166.8399999999 },
                { "level": 2, "resolution": 0.002749665686873994, "scale": 1155583.4199999999 },
                { "level": 3, "resolution": 0.001374832843436997, "scale": 577791.70999999996 },
                { "level": 4, "resolution": 0.00068741640982119352, "scale": 288895.84999999998 },
                { "level": 5, "resolution": 0.00034370821680790179, "scale": 144447.92999999999 },
                { "level": 6, "resolution": 0.00017185409650664589, "scale": 72223.960000000006 },
                { "level": 7, "resolution": 8.5927048253322947e-005, "scale": 36111.980000000003 },
                { "level": 8, "resolution": 4.2963524126661473e-005, "scale": 18055.990000000002 },
                { "level": 9, "resolution": 2.1481773960635764e-005, "scale": 9028 }
            ]
});

function getInitExtent() {
    var xmin = 117.77702924560307, ymin = 24.383707587276408, xmax = 118.4386675654091, ymax = 24.93054735293662;  //厦门
    //var xmin = 114.211057, ymin = 24.014221, xmax = 121.195207, ymax = 27.374313;  //全省
//    if (nullEmpty($.cookie("hnempInitExtent")) != "") {
//        var e = $.cookie("hnempInitExtent").split('&');
//        for (var i = 0, len = e.length; i < len; i++) {
//            var item = e[i].split("=");
//            if (item[0] == "xmin") {
//                xmin = item[1];
//            }
//            if (item[0] == "ymin") {
//                ymin = item[1];
//            }
//            if (item[0] == "xmax") {
//                xmax = item[1];
//            }
//            if (item[0] == "ymax") {
//                ymax = item[1];
//            }
//        }
//    }
    initialPoint = { "xmin": parseFloat(xmin), "ymin": parseFloat(ymin), "xmax": parseFloat(xmax), "ymax": parseFloat(ymax) };
}

function init() {
    $('body').addClass('claro');
    $('#map').height($(document).height() - 32);
    $('#map_zoom_slider').css({ "right": "", "left": "30px" });

    getInitExtent();
    FJLayer(params);
    esri.config.defaults.io.proxyUrl = "../../proxy.ashx";
    map = new esri.Map("map", { logo: false });

    toolbar = new esri.toolbars.Draw(map);
    navToolbar = new esri.toolbars.Navigation(map);

    loading = $("#loadingImg");
    esri.config.defaults.map.slider = { left: "30px", top: "30px", height: "200px" };

    dojo.connect(map, "onLoad", mapLoaded);
    dojo.connect(map, "onLoad", showLoading);
    dojo.connect(map, "onZoomStart", showLoading);
    dojo.connect(map, "onPanStart", showLoading);
    dojo.connect(map, "onUpdateStart", showLoading);
    dojo.connect(map, "onUpdateEnd", hideLoading);

    gsvc = new esri.tasks.GeometryService(GeometryServiceURL);

    if (connWeb) {
        map.addLayer(new jtt.FJWmtsLayer());
    }
    else {
        map.addLayer(new esri.layers.ArcGISTiledMapServiceLayer(FjMapURL, { displayLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9] }));

        var spatialRef = new esri.SpatialReference({ wkid: 4326 });
        var startExtent = new esri.geometry.Extent();
        startExtent.xmin = initialPoint.xmin;
        startExtent.ymin = initialPoint.ymin;
        startExtent.xmax = initialPoint.xmax;
        startExtent.ymax = initialPoint.ymax;
        startExtent.spatialReference = spatialRef;
        map.setExtent(startExtent);
    }

    dojo.connect(window, "onresize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () { map.resize(); map.reposition(); }, 500);
    });

    yhbdLayer = new esri.layers.FeatureLayer(yhbdURL + "/0", {
        mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
        infoTemplate: new esri.InfoTemplate(getTitle, getContent),
        outFields: ["*"]
    });

    map.addLayer(yhbdLayer);
}

function mapLoaded() {
    dojo.connect(dijit.byId('map'), 'resize', map, map.resize);

    scalebar = new esri.dijit.Scalebar({
        map: map,
        scalebarUnit: 'metric',
        attachTo: "bottom-left"
    });

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

dojo.addOnLoad(init);

function showLoading() {
    loading.show();
}

function hideLoading(error) {
    loading.hide();
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


function getTitle(g) {
}

function getContent(g) { 
}