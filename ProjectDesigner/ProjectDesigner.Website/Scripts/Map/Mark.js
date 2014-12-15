dojo.require("esri.map");
dojo.require("esri.tasks.find");
dojo.require("esri.tasks.query");
dojo.require("esri.tasks.geometry");
dojo.require("esri.layers.FeatureLayer");
dojo.require("esri.toolbars.draw");
dojo.require("esri.toolbars.navigation");
dojo.require("dijit.Toolbar");

var map;
var toolbar, navToolbar;
var loading;
var resizeTimer;
var baseMap, equiptmentMap, findTask, findParams;
var visible = [];
var gsvc = null, queryDistance = 35;
var queryTask = null;
var query = null;
var points = new Array();
var pointLayer = null, routeLayer = null, lineLayer = null, bufferLayer = null;
var symbolPoint = new esri.symbol.PictureMarkerSymbol('../images/Map/stake_hover.png', 11, 24);
var sr = null, sk = 0;
var symbolLine = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 8);


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

    // Scales in DPI 96
    "lods": [
                { "level": 0, "resolution": 0.010998662747495976, "scale": 4622333.6799999997 },
                { "level": 1, "resolution": 0.005499331373747988, "scale": 2311166.8399999999 },
                { "level": 2, "resolution": 0.002749665686873994, "scale": 1155583.4199999999 },
                { "level": 3, "resolution": 0.001374832843436997, "scale": 577791.70999999996 },
                { "level": 4, "resolution": 0.00068741640982119352, "scale": 288895.84999999998 },
                { "level": 5, "resolution": 0.00034370821680790179, "scale": 144447.92999999999 },
                { "level": 6, "resolution": 0.00017185409650664589, "scale": 72223.960000000006 },
                { "level": 7, "resolution": 8.5927048253322947e-005, "scale": 36111.980000000003 },
                { "level": 8, "resolution": 4.2963524126661473e-005, "scale": 18055.990000000002 },
                { "level": 9, "resolution": 2.1481773960635764e-005, "scale": 9028 },
                { "level": 10, "resolution": 1.0740886980317882e-005, "scale": 4514 },
	            { "level": 11, "resolution": 5.3704434901589409e-006, "scale": 2257 }
            ]
});

function getInitExtent() {
    var e = $.cookie("hnempInitExtent").split('&');
    var xmin = 114.211057, ymin = 24.014221, xmax = 121.195207, ymax = 27.374313;
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

    initialPoint = { "xmin": parseFloat(xmin), "ymin": parseFloat(ymin), "xmax": parseFloat(xmax), "ymax": parseFloat(ymax) };
}

function init() {
    getInitExtent();
    esri.config.defaults.io.proxyUrl = "../../proxy.ashx";
    FJLayer(params);
    loading = $("#loadingImg");

    esri.config.defaults.map.slider = { right: "30px", top: "30px", height: "200px" };

    map = new esri.Map("map", { logo: false });

    toolbar = new esri.toolbars.Draw(map);
    navToolbar = new esri.toolbars.Navigation(map);

    dojo.connect(map, "onLoad", mapLoaded);
    dojo.connect(map, "onLoad", showLoading);
    dojo.connect(map, "onZoomStart", showLoading);
    dojo.connect(map, "onPanStart", showLoading);
    dojo.connect(map, "onUpdateStart", showLoading);
    dojo.connect(map, "onUpdateEnd", hideLoading);
    dojo.connect(toolbar, "onDrawEnd", addToMap);

    //baseMap = new jtt.FJWmtsLayer();
    //map.addLayer(baseMap);

    if (connWeb) {
        baseMap = new jtt.FJWmtsLayer();
        map.addLayer(baseMap);
    }
    else {
        baseMap = new esri.layers.ArcGISTiledMapServiceLayer(FjMapURL);
        map.addLayer(baseMap);

        var spatialRef = new esri.SpatialReference({ wkid: 4326 });
        var startExtent = new esri.geometry.Extent();
        startExtent.xmin = initialPoint.xmin;
        startExtent.ymin = initialPoint.ymin;
        startExtent.xmax = initialPoint.xmax;
        startExtent.ymax = initialPoint.ymax;
        startExtent.spatialReference = spatialRef;
        map.setExtent(startExtent);
    }

    var tempCAM = new esri.InfoTemplate();
    tempCAM.setTitle(getTextTitle);
    tempCAM.setContent(getTextContentCAM);

    fea2 = new esri.layers.FeatureLayer(equiptmentMapURL + "/2", {
        mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
        infoTemplate: tempCAM,
        outFields: ["*"]
    });

    var defaultSymbol = new esri.symbol.PictureMarkerSymbol();
    var renderer1 = new esri.renderer.UniqueValueRenderer(defaultSymbol, "RunStatusFlag");
    renderer1.addValue(" ", new esri.symbol.PictureMarkerSymbol('../images/DeviceState/视频设备/0.png', 21, 18)); //不正常
    renderer1.addValue("0", new esri.symbol.PictureMarkerSymbol('../images/DeviceState/视频设备/0.png', 21, 18)); //不正常
    renderer1.addValue("1", new esri.symbol.PictureMarkerSymbol('../images/DeviceState/视频设备/1.png', 21, 18)); //正常

    fea2.setRenderer(renderer1);

    map.addLayer(fea2);
    //layerVisibility(fea2);
    createHint(fea2, "视频监控设备：", "CName");

    bufferLayer = new esri.layers.GraphicsLayer();
    map.addLayer(bufferLayer)

    routeLayer = new esri.layers.GraphicsLayer();
    map.addLayer(routeLayer);

    lineLayer = new esri.layers.GraphicsLayer();
    map.addLayer(lineLayer);

    pointLayer = new esri.layers.GraphicsLayer();
    map.addLayer(pointLayer);

    markLayer = new esri.layers.GraphicsLayer();
    map.addLayer(markLayer);

    queryTask = new esri.tasks.QueryTask(BaseDataMapURL + "/2");
    query = new esri.tasks.Query();
    query.spatialRelationship = esri.tasks.Query.SPATIAL_REL_INTERSECTS;
    query.returnGeometry = true;
    query.outFields = ["*"];

    map.infoWindow.resize(220, 200);

    dojo.connect(map.infoWindow._hide, "onclick", function () {
        lineLayer.clear();
    });

    dojo.connect(pointLayer, "onClick", function (evt) {
        singleClick(evt.graphic.attributes.Route_Code);
    });

    dojo.connect(window, "onresize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () { map.resize(); map.reposition(); }, 500);
    });

    gsvc = new esri.tasks.GeometryService(GeometryServiceURL);

    dojo.connect(gsvc, "onBufferComplete", queryBuffer);
}

function mapLoaded() {
    dojo.connect(dijit.byId('map'), 'resize', map, map.resize);
    $("#layerList").hide();
}

function showLoading() {
    loading.show();
}

function hideLoading(error) {
    loading.hide();
}

dojo.addOnLoad(init);

var PointScreen;
function addToMap(geometry) {
    map.graphics.clear();
    bufferLayer.clear();
    toolbar.deactivate();
    map.showZoomSlider();
    var graphic = null;
    switch (geometry.type) {
        case "point":
            var symbol = new esri.symbol.PictureMarkerSymbol('../images/Map/mark.png', 23, 25);
            PointScreen = map.toScreen(geometry);
            sr = ""; 
            sk = "";
            latToProject(32650, geometry);
            graphic = new esri.Graphic(geometry, symbol, null, new esri.InfoTemplate(getStakeTitle1, getStakeContent));
            map.graphics.add(graphic);
            zoomTo(graphic);
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
            var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASHDOT, new dojo.Color([255, 0, 0]), 2), new dojo.Color([255, 255, 0, 0.25]));
            graphic = new esri.Graphic(geometry, symbol);
            map.graphics.add(graphic);
            break;
        case "multipoint":
            var symbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_DIAMOND, 20, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 0, 0]), 1), new dojo.Color([255, 255, 0, 0.5]));
            graphic = new esri.Graphic(geometry, symbol);
            map.graphics.add(graphic);
            break;
    }

    $("#x").val(geometry.x);
    $("#y").val(geometry.y);

    doBuffer(geometry);

}

//定位
function zoomTo(graphic) {
    switch (graphic.geometry.type) {
        case "point":
            var scrPoint = esri.geometry.toScreenPoint(map.extent, map.width, map.height, graphic.geometry);
            map.setExtent(new esri.geometry.Extent(graphic.geometry.x - 0.003, graphic.geometry.y - 0.003, graphic.geometry.x + 0.003, graphic.geometry.y + 0.003));
            break;
        case "polyline":
            map.setExtent(graphic.geometry.getExtent());
            break;
        case "polygon":
            map.setExtent(graphic.geometry.getExtent());
            break;
        case "multipoint":
            var symbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_DIAMOND, 20, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 0, 0]), 1), new dojo.Color([255, 255, 0, 0.5]));
            break;
    }
}

function showOldMark(x, y) {
    map.graphics.clear();
    var markerSymbol = new esri.symbol.PictureMarkerSymbol('../images/Map/mark.png', 23, 25);
    var point = new esri.Graphic(new esri.geometry.Point({ "x": x, "y": y, " spatialReference": { " wkid": map.spatialReference} }), markerSymbol, '', null);
    map.graphics.add(point);
    map.setExtent(new esri.geometry.Extent(parseFloat(x) - 0.05, parseFloat(y) - 0.05, parseFloat(x) + 0.05, parseFloat(y) + 0.05));
}

function layerVisibility(layer) {
    (layer.visible) ? layer.hide() : layer.show();
}

//视频
function getTextTitle(graphic) {
    var form = $('form');
    var action = form.attr('action');
    var htmlobj = $.ajax({ url: action, type: "POST", data: { "__Method": "GetCamTitle", "camid": graphic.attributes["sde.SDE.CCTV.ID"] }, async: false });
    var result = eval(htmlobj.responseText);
    return "<b>" + result + "</b>";
}

function getTextContentCAM(graphic) {
    var form = $('form');
    var action = form.attr('action');
    var htmlobj = $.ajax({ url: action, type: "POST", data: { "__Method": "GetCamAddress", "camid": graphic.attributes["sde.SDE.CCTV.ID"] }, async: false });
    video_start_realtime(eval(htmlobj.responseText));
    map.infoWindow.resize(280, 230);
    return $("#divVideo").html();
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

function btnSearchClick() {
    $("#spanTotal").text("");
    $("#spanP1").text("");
    $("#spanP2").text("");
    $("#spanTotal").text("");
    $("#txtTotalPage").val("");
    $("#txtPageIndex").val(1);

    $("#divPageinfo").hide();

    doSearch();
}

function doSearch() {
    var cXmin = 0, cYmin = 0, cXmax = 0, cYmax = 0;
    points = [];
    var charArr = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    map.infoWindow.hide();
    routeLayer.clear();
    pointLayer.clear();
    $("#pnlSearchResult").find("ul").html("");
    if ($("#address").val() != "") {
        $('#mapInfoCon').show(mapResize());

        var form = $('form');
        var action = form.attr('action');
        var htmlobj = $.ajax({ url: action, type: "POST", data: { "__Method": "getPOIS", "s": $("#address").val(), "p": $("#txtPageIndex").val() }, async: false });
        var result = JSON.parse(htmlobj.responseText);
        var items = result.Items;
        var total = result.TotalHits;
        $("#spanTotal").text(total);
        $("#spanP1").text($("#txtPageIndex").val() == 1 ? 1 : ($("#txtPageIndex").val() - 1) * 5 + 1);
        $("#spanP2").text($("#txtPageIndex").val() * 5 > total ? total : $("#txtPageIndex").val() * 5);
        $("#spanTotal").text(total);
        $("#txtTotalPage").val(Math.ceil(total / 5));

        $("#divPageinfo").show();

        if (!(!items)) {
            for (var i in items) {
                var pt = new esri.geometry.Point(items[i].PoiX, items[i].PoiY, map.spatialReference);
                var markUrl = "../images/Map/mark_blue_" + (parseInt(i) + 1) + ".png";
                var symbol = new esri.symbol.PictureMarkerSymbol(markUrl, 16, 18);
                var attr = {
                    "X": items[i].PoiX,
                    "Y": items[i].PoiY,
                    "Address": items[i].Address,
                    "Place": items[i].Place,
                    "Alias": items[i].Alias,
                    "Route_Code": items[i].Route_Code,
                    "RoadCode": items[i].RoadCode,
                    "Category_Code": items[i].Category_Code,
                    "ManageUnit": items[i].ManageUnit,
                    "ManageUnitName": items[i].ManageUnitName,
                    "StartStake": items[i].StartStake == null ? null : items[i].StartStake + "K",
                    "EndStake": items[i].EndStake == null ? "" : items[i].EndStake + "K",
                    "Tel": items[i].Tel
                };

                if (items[i].PoiX < cXmin || cXmin == 0)
                    cXmin = items[i].PoiX;
                if (items[i].PoiX > cXmax || cXmax == 0)
                    cXmax = items[i].PoiX;

                if (items[i].PoiY < cYmin || cYmin == 0)
                    cYmin = items[i].PoiY;
                if (items[i].PoiY > cYmax || cYmax == 0)
                    cYmax = items[i].PoiY;

                var infoTemplate1 = items[i].Category_Code == "9" ? new esri.InfoTemplate(getInfowinTitle9, getInfowinContent9) : new esri.InfoTemplate(getInfowinTitle1, getInfowinContent1);
                var graphic = new esri.Graphic(pt, symbol, attr, infoTemplate1);

                points[i] = graphic;

                pointLayer.add(graphic);
                createSearchResult(charArr[i], attr);

                map.setExtent(new esri.geometry.Extent(cXmin - 0.05, cYmin - 0.05, cXmax + 0.05, cYmax + 0.05));

                dojo.connect(queryTask, "onComplete", doQueryResult);
                query.where = "Code = '" + items[i].Route_Code + "'";
                queryTask.execute(query);
            }
        }

        $("#pnlSearchResult").find("li").each(function (index) {
            var g = points[index];
            var oldsymbol = g.symbol;
            var newsymbol = new esri.symbol.PictureMarkerSymbol("../images/Map/mark_red_" + (parseInt(index) + 1) + ".png", 16, 16);

            $(this).hover(function () {
                g.setSymbol(newsymbol);
            },
            function () {
                g.setSymbol(oldsymbol);
            });

            $(this).click(function () {
                zoomTo(g);
                map.infoWindow.resize(220, 200);
                map.infoWindow.setContent(g.getContent());
                map.infoWindow.setTitle(g.getTitle());
                map.infoWindow.show(g.geometry, map.getInfoWindowAnchor(g.geometry));
                singleClick(g.attributes.Route_Code);
            });
        });

        $("#pnlSearchResult").show();
    }
}

function getInfowinTitle1(g) {
    return g.attributes["Place"] + (!g.attributes["Alias"] ? "" : "(" + g.attributes["Alias"] + ")");
}

function getInfowinContent1(g) {
    map.infoWindow.resize(220, 200);
    return "<label>路段代码：" + nullEmpty(g.attributes["Route_Code"]) + "</label><br /><label>起点桩号：" + nullEmpty(g.attributes["StartStake"]) + "</label><br /><label>止点桩号：" + nullEmpty(g.attributes["EndStake"]) + "</label><br /><label>管养单位：" + nullEmpty(g.attributes["ManageUnitName"]) + "</label><br /><label>电话: " + nullEmpty(g.attributes["Tel"]) + "</label><br />";
}

function getInfowinTitle9(g) {
    return g.attributes["Place"];
}

function getInfowinContent9() {
    map.infoWindow.resize(200, 40);
    return null;
}

function createSearchResult(label, attr) {
    var ul = $("#pnlSearchResult").find("ul");
    var li = $("<li></li>");
    var liHtml = "<div class='icon'>" + label + "</div>" +
    "<div class='content'>" +
    "<span><b>" + attr.Place + "</b>" + (!attr.Alias ? "" : "（" + attr.Alias + "）") + "</span>" +
    (!attr.RoadCode ? "" : "<label>" + attr.RoadCode + "</label>") +
    (attr.StartStake == null ? "" : "<label>(" + attr.StartStake + " - " + attr.EndStake + ")</label><br />") +
    (!attr.ManageUnitName ? "" : "<label>" + attr.ManageUnitName + "</label><br />") +
    "</div>";
    li.html(liHtml);
    li.appendTo($("#pnlSearchResult").find("ul"));
}

function doQueryResult(fset) {
    var s = new esri.symbol.SimpleLineSymbol(
          esri.symbol.SimpleLineSymbol.STYLE_SOLID,
          new dojo.Color([0, 0, 255, 0.65]), 5
        );

    var resultFeatures = fset.features;
    for (var i = 0, il = resultFeatures.length; i < il; i++) {
        var graphic = resultFeatures[i];
        graphic.setSymbol(s);
        graphic.setInfoTemplate(null);
        routeLayer.add(graphic);
    }
}

function singleClick(routecode) {
    lineLayer.clear();
    var queryTask1 = new esri.tasks.QueryTask(BaseDataMapURL + "/2");
    var query1 = new esri.tasks.Query();
    query1.spatialRelationship = esri.tasks.Query.SPATIAL_REL_INTERSECTS;
    query1.returnGeometry = true;
    query1.outFields = ["*"];
    dojo.connect(queryTask1, "onComplete", singleQuery);
    query1.where = "Code = '" + routecode + "'";
    queryTask1.execute(query1);
}

function singleQuery(fset) {
    var s1 = new esri.symbol.SimpleLineSymbol(
          esri.symbol.SimpleLineSymbol.STYLE_SOLID,
          new dojo.Color([255, 0, 0, 1]), 5
        );

    var resultFeatures = fset.features;
    for (var i = 0, il = resultFeatures.length; i < il; i++) {
        var graphic = resultFeatures[i];
        graphic.setSymbol(s1);
        graphic.setInfoTemplate(null);
        lineLayer.add(graphic);
    }
}

function prePage() {
    if (parseInt($("#txtPageIndex").val()) <= 1) {
        $("#txtPageIndex").val(1);
        //  alert("当前是第一页！")
    }
    else {
        $("#txtPageIndex").val(parseInt($("#txtPageIndex").val()) - 1);
        doSearch();
    }
}

function nextPage() {
    if ($("#txtPageIndex").val() == $("#txtTotalPage").val()) {
        //  alert("已经是最后一页了！")
    }
    else {

        $("#txtPageIndex").val(parseInt($("#txtPageIndex").val()) + 1);
        doSearch();
    }
}

function doBuffer(geometries) {
    var paramsBuf = new esri.tasks.BufferParameters();

    paramsBuf.geometries = [geometries];
    paramsBuf.distances = [queryDistance];
    paramsBuf.unit = esri.tasks.GeometryService.UNIT_METER;
    paramsBuf.outSpatialReference = new esri.SpatialReference({ wkid: 4326 });

    gsvc.buffer(paramsBuf, showBuffer);
}

function showBuffer(geometries) {
    var symbol = new esri.symbol.SimpleFillSymbol(
        esri.symbol.SimpleFillSymbol.STYLE_SOLID,
        new esri.symbol.SimpleLineSymbol(
          esri.symbol.SimpleLineSymbol.STYLE_SOLID,
          new dojo.Color([0, 0, 255, 0.65]), 2
        ),
        new dojo.Color([0, 0, 255, 0.35])
      );

    dojo.forEach(geometries, function (geometry) {
        var graphic = new esri.Graphic(geometry, symbol);
        bufferLayer.add(graphic);
    });
}

function queryBuffer(geometries) {
    queryTask = new esri.tasks.QueryTask(BaseDataMapURL + "/2");
    query = new esri.tasks.Query();
    query.geometry = geometries[0];
    query.spatialRelationship = esri.tasks.Query.SPATIAL_REL_INTERSECTS;
    query.returnGeometry = true;
    query.outFields = ["*"];
    query.where = "Route_Code <> ''";

    queryTask.execute(query);
    dojo.connect(queryTask, "onComplete", doQueryBResult);
}

function doQueryBResult(fset) {
    var garr = [];
    var symbol = new esri.symbol.SimpleLineSymbol(
          esri.symbol.SimpleLineSymbol.STYLE_SOLID,
          new dojo.Color([255, 0, 0, 0.65]), 5
        );

    var symbol1 = new esri.symbol.SimpleLineSymbol(
          esri.symbol.SimpleLineSymbol.STYLE_SOLID,
          new dojo.Color([13, 198, 70, 0.65]), 5
        );

    var infoTemplate = new esri.InfoTemplate(getInfowinTitle2, getInfowinContent2);

    var resultFeatures = fset.features;
    $('#rlist').html('');
    for (var i = 0, il = resultFeatures.length; i < il; i++) {
        var graphic = resultFeatures[i];
        graphic.setSymbol(symbol1);
        graphic.setInfoTemplate(infoTemplate);
        map.graphics.add(graphic);
        garr.push(graphic);

        if (il > 1) {
            var radio = $('<input>').attr({
                type: 'radio', name: 'rr', value: i, id: 'rr' + i
            });

            var text = graphic.attributes['SHORTNAME'] + "(" + graphic.attributes['CODE'] + ")";
            $('#rlist').append(radio).append(text).append('<br />');
        }
        else {
            $('#lblRoute_Code').text(graphic.attributes['CODE']);
            $('#lblRoute_Name').text(graphic.attributes['SHORTNAME']);
        }
    }

    $('#divRoadChoose input:radio').change(function () {
        cv = $(this).val();
        $.each(garr, function (i, v) {
            if (i == cv) {
                v.setSymbol(symbol);
                $('#lblRoute_Code').text(v.attributes['CODE']);
                $('#lblRoute_Name').text(v.attributes['SHORTNAME']);
            }
            else {
                v.setSymbol(symbol1);
            }
        });
    });

    if (resultFeatures.length > 1) {
        $("#divRoadChoose").css({
            position: "absolute",
            top: (PointScreen.y - $("#divRoadChoose").height() - 20) + "px",
            left: (PointScreen.x + 10) + "px"
        }).show();
    }
}

function getInfowinTitle2(g) {
    return "名称: " + g.attributes["SHORTNAME"];
}

function getInfowinContent2(g) {
    map.infoWindow.resize(220, 200);
    return "路段代码：" + nullEmpty(g.attributes["ROUTE_CODE"]) + "<br />起点桩号：" + nullEmpty(g.attributes["STARTPOST"]) + "<br />止点桩号：" + nullEmpty(g.attributes["ENDPOST"]) + "<br />管养单位：" + nullEmpty(g.attributes["MUNITNAME"]) + "<br />";
}

function stakeLocation() {
    if ($("input[name='trad']:checked").val() == "1")
        searchPointLocation();
    else
        searchLineLocation();
}

function searchPointLocation() {
    if ($('#sRouteCode').val() == "") {
        alert("路线不能为空。");
        return;
    }

    if ($('#sStake0').val() == "") {
        alert("请输入桩号。");
        return;
    }

    var params = { f: "json",
        routeIDFieldName: "Route_Code",
        routeID: $('#sRouteCode').val().toUpperCase(),
        measure: $('#sStake0').val()
    }

    esri.request({
        url: DSPointLocationURL,
        content: params,
        callbackParamName: "callback",
        load: function (result) {
            console.log(result);
            if (result.hasError) {
                alert("无法定位相关地点，请检查桩号是否正确。");
            }
            else {
                map.graphics.clear();
                var pt = new esri.geometry.Point(result.geometries.points[0], new esri.SpatialReference({ wkid: 32650 }));
                projectToLatLong(4326, pt);
            }

        },
        error: function (error) {
            alert("请输入正确的桩号或路线。");
        }
    });
}

function searchLineLocation() {
    if ($('#sRouteCode').val() == "") {
        alert("路线不能为空。");
        return;
    }

    if ($('#sStake1').val() == "" || $('#sStake2').val() == "") {
        alert("请输入桩号范围。");
        return;
    }

    if ($('#sStake2').val() < $('#sStake1').val()) {
        alert("止点桩号不能小于起点桩号。");
        return;
    }

    var params = { f: "json",
        routeIDFieldName: "Route_Code",
        routeID: $('#sRouteCode').val().toUpperCase(),
        fromMeasure: $('#sStake1').val(),
        toMeasure: $('#sStake2').val()
    }

    esri.request({
        url: DSLineLocationURL,
        content: params,
        callbackParamName: "callback",
        load: function (result) {
            if (result.hasError) {
                alert("无法定位相关路线，请检查桩号范围是否正确。");
            }
            else {
                if (result.geometries) {
                    map.graphics.clear();
                    var polylineJson = {
                        "paths": result.geometries.paths,
                        "spatialReference": { "wkid": 32650 }
                    };

                    var line = new esri.geometry.Polyline(polylineJson);
                    projectToLatLongLine(4326, line);
                }
            }
        },
        error: function (error) {
            alert("请输入正确的路线或桩号范围。");
        }
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
            }
        }
    });
}

function projectToLatLong(outsr, geometries) {
    var outSR = new esri.SpatialReference({ wkid: outsr });
    gsvc.project([geometries], outSR, function (projectedPoints) {
        var graphic = new esri.Graphic(projectedPoints[0], symbolPoint, null, new esri.InfoTemplate(getStakeTitle, getStakeContent));
        map.graphics.add(graphic);
        zoomTo(graphic);
        map.infoWindow.resize(200, 60);
        map.infoWindow.setContent(graphic.getContent());
        map.infoWindow.setTitle(graphic.getTitle());
        map.infoWindow.show(projectedPoints[0]);
    });
}

function projectToLatLongLine(outsr, geometries) {
    var outSR = new esri.SpatialReference({ wkid: outsr });
    gsvc.project([geometries], outSR, function (projectedPoints) {
        var graphic = new esri.Graphic(projectedPoints[0], symbolLine, null, new esri.InfoTemplate(getStakeLineTitle, getStakeLineContent));
        map.graphics.add(graphic);
        zoomTo(graphic);
    });
}

function getStakeTitle() {
    return "<label>路线: " + $('#sRouteCode').val().toUpperCase() + " </label><br />桩号: " + $('#sStake0').val() + "K";
}

function getStakeTitle1() {
    return "<label>路线: " +  sr + " </label><br />桩号: " + sk + "K";
}

function getStakeLineTitle() {
    return "路线: " + $('#sRouteCode').val().toUpperCase() + " <br />起止桩号: " + $('#sStake1').val() + "K - " + $('#sStake2').val() + "K  <br />里程总长: " + (parseFloat($('#sStake2').val()) - parseFloat($('#sStake1').val())).toFixed(3) + "K";
}

function getProjectTitle() {
    map.infoWindow.resize(200, 80);
    return "路线:" + $('#sRouteCode').val().toUpperCase() + " </ br>桩号:" + $('#sStake0').val() + "K";
}

function getStakeContent() {
    map.infoWindow.resize(200, 60);
    return null;
}

function getStakeLineContent() {
    map.infoWindow.resize(220, 100);
    return null;
}

function latToProject(outsr, geometries) {
    var outSR = new esri.SpatialReference({ wkid: outsr });
    gsvc.project([geometries], outSR, function (projectedPoints) {
        markStake(projectedPoints[0]);
    });
}