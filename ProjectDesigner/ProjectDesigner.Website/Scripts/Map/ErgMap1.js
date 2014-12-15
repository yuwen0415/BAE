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
var ergCityLayer = null, ergCountyLayer = null, buildCityLayer = null, trafficLayer = null, blockLayer = null, ergStationLayer = null;

var ergFlag = true;

var seriesData;
var categories;
var title;
var subTitle;
var yAxisTitle;
var chartType = 'column';
var chart;
var isSetLocation = false;


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
            ]
});

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
        map.addLayer(new esri.layers.ArcGISTiledMapServiceLayer(FjMapURL, { displayLevels: [1, 2, 3, 4, 5, 6] }));

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

    ergStationLayer = new esri.layers.GraphicsLayer();
    map.addLayer(ergStationLayer);

    blockLayer = new esri.layers.GraphicsLayer();
    map.addLayer(blockLayer);

    initDoc();
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


    dojo.connect(window, "onresize", function () { 
        setTimeout(function () { map.resize(); map.reposition(); }, 500);
    });

//    dojo.connect(map, "onExtentChange", function (extent, delta, outLevelChange, outLod) {
//        if (ergFlag) {
//            if (outLod.level == 0 || outLod.level == 1) {
//                AddLayerToMap(ergCityLayer);
//                RemoveLayerInMap(ergCountyLayer);
//                ergStationLayer.clear();
//            }
//            if (outLod.level == 2 || outLod.level == 3) {
//                RemoveLayerInMap(ergCityLayer);
//                AddLayerToMap(ergCountyLayer);
//                ergStationLayer.clear();
//            }
//            if (outLod.level == 4 || outLod.level == 5) {
//                RemoveLayerInMap(ergCityLayer);
//                RemoveLayerInMap(ergCountyLayer);
//                if (ergStationLayer.graphics.length == 0) getErgStations();
//            }
//        }

//    });

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
    if (!LayerIdsIndexOf(layer.id))
        map.addLayer(layer);
    else
        return;
}

function RemoveLayerInMap(layer) {
    if (!LayerIdsIndexOf(layer.id))
        return;
    else
        map.removeLayer(layer);
}

function LayerIdsIndexOf(id) {
    for (var i = 0; i < map.graphicsLayerIds.length; i++) {
        if (map.graphicsLayerIds[i] == id)
            return true;
    }
    return false;
}

function initDoc() {
    $('#blockSearchView').hide();
    $('#blockSituationView').hide();
    $('#trafficflowView').hide();

    $('.search td input').each(function (i) {
        $(this).css('cursor', 'pointer');
        if (!$(this).is('.selected')) {
            $(this).addClass('button_out')
        };

        $(this).click(function () {
            if (!$(this).is('.selected')) {
                $('.search td input.selected').removeClass('selected').removeClass('button_over').addClass("button_out");
                $(this).removeClass('button_out').addClass('selected button_over');
            }

            if ($(this).attr('id') == "btnResource")
                ergFlag = true;
            else
                ergFlag = false;

            navToolbar.zoomToFullExtent();

            if (ergCityLayer) map.removeLayer(ergCityLayer);
            if (ergCountyLayer) map.removeLayer(ergCountyLayer);
            if (buildCityLayer) map.removeLayer(buildCityLayer);
            ergStationLayer.clear();
            blockLayer.clear();
            if (trafficLayer) map.removeLayer(trafficLayer);

            map.infoWindow.hide();
        });
    });

    $('.map_list a.close').each(function (i) {
        $(this).click(function () {
            $(this).parent().parent().hide(rate);
        });
    });

    $('#upView').click(function () {
        var selected = $('#mapSearch input.selected');
        if (selected.size() == 0) {
            $('#ergOrgViewCon').show(rate)
        } else {
            switch (selected.attr('id')) {
                case 'btnBlock':
                    $('#blockSearchView').show(rate);
                    return;
                case 'btnTraffic':
                    $('#trafficflowView').show(rate);
                    return;
                case 'btnResource':
                    $('#ergOrgViewCon').show(rate);
                    return;
                default:
                    return;
            }
        }

    });

    $('#downView').click(function () {
        var selected = $('#mapSearch input.selected');
        if (selected.size() == 0) {
            $('#ergResViewCon').show(rate);
        } else {

            switch (selected.attr('id')) {
                case 'btnBlock':
                    $('#blockSituationView').show(rate);
                    return;
                case 'btnTraffic':
                    $('#trafficflowView').show(rate);
                    return;
                case 'btnResource':
                    $('#ergResViewCon').show(rate);
                    return;
                default:
                    return;
            }
        }
    });

    $('#btnResource').click(function () {
        doBuild();
        doBlock(true);
        doEmergency();
    });
    $('#btnBErg').click(function () { 
        $('#blockSearchView').hide(rate);
        $('#blockSituationView').hide(rate);
        $('#trafficflowView').hide(rate);

        $('#ergOrgViewCon').show(rate);
        $('#ergResViewCon').show(rate);
    })
    $('#btnBuild').click(function () {
        $('#blockSearchView').hide(rate);
        $('#blockSituationView').hide(rate);
        $('#trafficflowView').hide(rate);
        $('#ergOrgViewCon').hide(rate);
        $('#ergResViewCon').hide(rate);
    });

    $('#btnBlock').click(function () {
        doBlock();
    });

    $('#btnTraffic').click(function () {
        doTrafficFlow();
    });

    doBuild();
    doBlock(true);
    doEmergency();
};

//应急
function doEmergency() {
    $('#blockSearchView').hide(rate);
    $('#blockSituationView').hide(rate);
    $('#trafficflowView').hide(rate);

    $('#ergOrgViewCon').show(rate);
    $('#ergResViewCon').show(rate);

    getErgAreas("35", "福建省", "", "");
    getErgStations();

    ergCityLayer = new esri.layers.FeatureLayer(FjAreaURL + "/0", {
        mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
        infoTemplate: new esri.InfoTemplate(getErgCityTitle, getErgCityContent),
        outFields: ["*"]
    });

    //map.addLayer(ergCityLayer);
    createHint(ergCityLayer, "", "CHNAME");

    dojo.connect(ergCityLayer, "onClick", function (evt) {
        infowinFixscreen(evt);
    });

    ergCountyLayer = new esri.layers.FeatureLayer(FjAreaURL + "/1", {
        mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
        infoTemplate: new esri.InfoTemplate(getErgCountyTitle, getErgCountyContent),
        outFields: ["*"]
    });

    //map.addLayer(ergCountyLayer);
    createHint(ergCountyLayer, "", "FSMC");

    dojo.connect(ergCountyLayer, "onClick", function (evt) {
        infowinFixscreen(evt);
    });

    ergStationLayer = new esri.layers.GraphicsLayer();

    dojo.connect(ergStationLayer, "onClick", function (evt) {
        infowinFixscreen(evt);
    });
}

function getErgAreas(code, name) {
    if (code.toString().length > 2) {
        var fli = $('.city').find('li a').eq(0);
        $('.city li').eq(4).html("<a href='#' onclick=\"getErgAreas('" + fli.data("code") + "','" + fli.data("name") + "'); ergMapZoomTo('" + code + "');\">返回上级</a>");
    }
    else { $('.city li').eq(4).html('') };

    $('.city').find('li').eq(0).html("<a href='#' data-code ='" + code + "' data-name ='" + name + "' onclick='ergMapZoomTo(\"" + code + "\");'>" + name + "</a>");

    $().ajaxPost({ method: 'GetAreaByPCode', 'params': { 'pcode': code }, enableValidate: false, callback: function (data) {
        if (data) {
            $('.city li').eq(2).html('');
            for (var i = 0; i < data.length; i++) {
                $('.city li').eq(2).append("<a href='#' data-code ='" + data[i].Code + "' data-name ='" + data[i].Cname + "'>" + data[i].Cname + "</a>");
            }

            $('.city li').eq(2).find('a').click(function () {
                if ($(this).data('code').toString().length < 6)
                    getErgAreas($(this).data('code'), $(this).data('name'));
                ergMapZoomTo($(this).data('code'));
            });

            var orgcode = $.cookie('OrgCode');
            if (orgcode && orgcode.length == 5 && data[0].Code.length == 4 && !isSetLocation) {
                $('.city li').eq(2).find('a[data-code="' + orgcode.replace('351', '35') + '"]').click();
                isSetLocation = true;
            }
        }
    }
    });

    $('#ergResViewCon .resview').html(getResViewCon(code.toString().length == 2 ? '' : code));
}

function getResViewCon(code) {
    var form = $('form');
    var action = form.attr('action');
    var htmlobj = $.ajax({ url: action, type: "POST", data: { "__Method": "GetErgCityDetail", "code": code }, async: false });
    var result = jQuery.parseJSON(htmlobj.responseText);

    var strHtml = "<table cellpadding='0' cellspacing='0' id='hongzhi'><tr><th colspan='3'>" + result.title + "</th><th colspan='2'>其中</th></tr><tr style='border-left: 1px dotted #999999;'><td width='120px'>名称</td><td width='100px'>数量</td><td width='30px'>单位</td><td width='50px'>公路局</td><td width='50px'>交通局</td></tr>";
    for (var i in result.Items) {
        strHtml += "<tr style='border-left: 1px dotted #999999;'><td>" + result.Items[i].MC + "</td><td style='text-align:right;padding-right: 5px;'>" + result.Items[i].SL + "</td><td>" + result.Items[i].DW + "</td><td style='text-align:right;padding-right: 5px;'>" + result.Items[i].SUM1 + "</td><td style='text-align:right;padding-right: 5px;'>" + result.Items[i].SUM2 + "</td>";
    }
    strHtml += "<tr style='border-left: 1px dotted #999999;'><td colspan='5'>" + result.contact + "</td></tr>"
    strHtml += "</table>";

    return strHtml;
}

function getErgStations() {
    ergStationLayer.clear();

    $.fn.ajaxPost({ method: 'GetErgStations',
        callback: function (data) {
            if (data.TotalHits > 0)
                CreateErgStations(data.Items);
        }
    });
}

function CreateErgStations(datalist) {
    var Symbol = new esri.symbol.PictureMarkerSymbol('../images/Map/wh.jpg', 16, 16);
    var emptySymbol = new esri.symbol.PictureMarkerSymbol('../images/Map/wh1.jpg', 16, 16);

    for (var i in datalist) {
        if (datalist[i].X > 0) {
            var pt = new esri.geometry.Point(datalist[i].X, datalist[i].Y, map.spatialReference);

            var attr = {
                "CName": datalist[i].CBDD,
                "DS": datalist[i].DS,
                "QX": datalist[i].QX,
                "IsEmpty": datalist[i].SLCOUNT
            };

            var infoTemplate = new esri.InfoTemplate(getErgStationTitle, getErgStationContent);
            var symbol = datalist[i].SLCOUNT == 1 ? Symbol : emptySymbol;
            var graphic = new esri.Graphic(pt, symbol, attr, infoTemplate);
            ergStationLayer.add(graphic);
        }
    }

    createHint(ergStationLayer, "班站：", "CName");

    dojo.connect(ergStationLayer, "onClick", function (evt) {
        infowinFixscreen(evt);
    });

    map.addLayer(ergStationLayer);
}

function getErgCityTitle(g) {
    return g.attributes["CHNAME"];
}

function getErgCityContent(g) {
    map.infoWindow.resize(400, 280);
    var form = $('form');
    var action = form.attr('action');
    var htmlobj = $.ajax({ url: action, type: "POST", data: { "__Method": "GetErgCityDetail", "code": g.attributes["AreaCode"] }, async: false });
    var result = jQuery.parseJSON(htmlobj.responseText);

    var strHtml = "<table cellpadding='0' cellspacing='0' id='hongzhi'><tr><th colspan='3'>" + result.title + "</th><th colspan='2'>其中</th></tr><tr style='border-left: 1px dotted #999999;'><td width='120px'>名称</td><td width='100px'>数量</td><td width='30px'>单位</td><td width='50px'>公路局</td><td width='50px'>交通局</td></tr>";
    for (var i in result.Items) {
        strHtml += "<tr style='border-left: 1px dotted #999999;'><td>" + result.Items[i].MC + "</td><td style='text-align:right;padding-right: 5px;'>" + result.Items[i].SL + "</td><td>" + result.Items[i].DW + "</td><td style='text-align:right;padding-right: 5px;'>" + result.Items[i].SUM1 + "</td><td style='text-align:right;padding-right: 5px;'>" + result.Items[i].SUM2 + "</td>";
    }
    strHtml += "<tr style='border-left: 1px dotted #999999;'><td colspan='5'>" + result.contact + "</td></tr>"
    strHtml += "</table>";

    return strHtml;
}

function getErgCountyTitle(g) {
    return g.attributes["FSMC"];
}

function getErgCountyContent(g) {
    map.infoWindow.resize(400, 280);
    var form = $('form');
    var action = form.attr('action');
    var htmlobj = $.ajax({ url: action, type: "POST", data: { "__Method": "GetErgCountyDetail", "code": g.attributes["AreaCode"] }, async: false });
    var result = jQuery.parseJSON(htmlobj.responseText);
    var strHtml = "<table cellpadding='0' cellspacing='0' id='hongzhi' style='width:355px'><tr><th>没有任何应急资源</th></tr></table>";
    if (result) {
        strHtml = "<table cellpadding='0' cellspacing='0' id='hongzhi'><tr><th colspan='3'>" + result.title + "</th><th colspan='2'>其中</th></tr><tr style=''><td width='120px'>名称</td><td width='100px'>数量</td><td width='30px'>单位</td><td width='50px'>公路局</td><td width='50px'>交通局</td></tr>";
        for (var i in result.Items) {
            strHtml += "<tr style=''><td>" + result.Items[i].MC + "</td><td style='text-align:right;padding-right: 5px;'>" + result.Items[i].SL + "</td><td>" + result.Items[i].DW + "</td><td style='text-align:right;padding-right: 5px;'>" + result.Items[i].SUM1 + "</td><td style='text-align:right;padding-right: 5px;'>" + result.Items[i].SUM2 + "</td>";
        }
        strHtml += "<tr style=''><td colspan='5'>" + result.contact + "</td></tr>"
        strHtml += "</table>";
    }

    return strHtml;
}

function getErgStationTitle(g) {
    return "班站名称: " + g.attributes["CName"];
}

function getErgStationContent(g) {
    map.infoWindow.resize(280, 280);
    var form = $('form');
    var action = form.attr('action');
    var htmlobj = $.ajax({ url: action, type: "POST", data: { "__Method": "GetErgStationDetail", "name": g.attributes["CName"], 'QX': g.attributes["QX"], 'DS': g.attributes["DS"] }, async: false });
    var result = jQuery.parseJSON(htmlobj.responseText);

    var strHtml = "<table cellpadding='0' cellspacing='0' id='hongzhi'><tr><th colspan='3'>" + result.title + "</th></tr><tr style='border-left: 1px dotted #999999;'><td width='120px'>名称</td><td width='100px'>数量</td><td width='30px'>单位</td></tr>";
    for (var i in result.Items) {
        strHtml += "<tr style='border-left: 1px dotted #999999;'><td>" + result.Items[i].MC + "</td><td style='text-align:right;padding-right: 5px;'>" + result.Items[i].SL + "</td><td>" + result.Items[i].DW + "</td>";
    }
    strHtml += "<tr style='border-left: 1px dotted #999999;'><td colspan='3'>" + result.contact + "</td></tr>"
    strHtml += "</table>";

    return strHtml;
}


function ergMapZoomTo(code) {
    var at = code.toString().length > 4 ? "Q" : (code.toString().length == 2 ? "A" : "S");
    if (at == "S") {
        if (ergCityLayer.graphics.length == 0) {
            AddLayerToMap(ergCityLayer);
        }
        setTimeout(function () {
            for (i = 0; i < ergCityLayer.graphics.length; i++) {
                if (ergCityLayer.graphics[i].attributes["AreaCode"] == code) {
                    map.centerAndZoom(ergCityLayer.graphics[i].geometry, 3); break;
                }
            }
            RemoveLayerInMap(ergCityLayer);
        }, 200);
    }
    if (at == "Q") {
        if (ergCountyLayer.graphics.length == 0) {
            AddLayerToMap(ergCountyLayer);
        }
        setTimeout(function () {
            for (i = 0; i < ergCountyLayer.graphics.length; i++) {
                if (ergCountyLayer.graphics[i].attributes["AreaCode"] == code) {
                    map.centerAndZoom(ergCountyLayer.graphics[i].geometry, 5);
                    break;
                }
            }
            RemoveLayerInMap(ergCountyLayer);
        }, 200);
    }
    if (at == "A") {
        navToolbar.zoomToFullExtent();
    }
}


//在建
function doBuild() {
    $('#blockSearchView').hide(rate);
    $('#blockSituationView').hide(rate);
    $('#trafficflowView').hide(rate);
    $('#ergOrgViewCon').hide(rate);
    $('#ergResViewCon').hide(rate);
     

    buildCityLayer = new esri.layers.FeatureLayer(FjAreaURL + "/0", {
        mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
        infoTemplate: new esri.InfoTemplate(getBuildCityTitle, getBuildCityContent), 
        outFields: ["*"]
    });
    buildCityLayer.setDefinitionExpression("PROJECT = 1");
    map.addLayer(buildCityLayer);
    createHint(buildCityLayer, "", "CHNAME");

    dojo.connect(buildCityLayer, "onClick", function (evt) {
        infowinFixscreen(evt);
    });
}

function getBuildCityTitle(g) {
    return g.attributes["CHNAME"];
}

function getBuildCityContent(g) {
    map.infoWindow.resize(600, 280);
    var form = $('form');
    var action = form.attr('action');
    var htmlobj = $.ajax({ url: action, type: "POST", data: { "__Method": "GetBuildCityDetail", "code": g.attributes["AreaCode"] }, async: false });
    var result = jQuery.parseJSON(htmlobj.responseText);

    var strHtml = "<table cellpadding='0' cellspacing='0' id='hongzhi'><tr><td width='60px' rowspan=2>区县</td><td width='140px' rowspan=2>项目名称</td><td width='60px' rowspan=2>应急人数</td><td colspan=3>应急机械</td><td width='80px' rowspan=2>业主联系人</td><td width='80px' rowspan=2>电话</td></tr><tr><td width='50px'>装载机</td><td width='50px'>挖掘机</td><td width='50px'>自卸车</td></tr>";
    for (var i in result) {
        strHtml += "<tr><td>" + result[i].QX + "</td><td>" + result[i].XMMC + "</td><td>" + result[i].DWRS + "</td><td>" + result[i].ZZJ + "</td><td>" + result[i].WJZ + "</td><td>" + result[i].ZXC + "</td><td>" + result[i].LXR + "</td><td>" + result[i].DH + "</td></tr>";
    }
    strHtml += "</table><br />";

    return strHtml;
}

//阻断
function doBlock(isDefault) {
    $('#ergOrgViewCon').hide(rate);
    $('#ergResViewCon').hide(rate);
    $('#trafficflowView').hide(rate);

    if (!isDefault) {
        $('#blockSearchView').show(rate);
        $('#blockSituationView').show(rate);
    }
    dojo.connect(blockLayer, "onClick", function (evt) {
        infowinFixscreen(evt);
    });

    GetBlocks();
}

function GetBlocks() {
    blockLayer.clear();
    $.fn.ajaxPost({ method: 'GetDisasterRoadBlockCount',
        callback: function (item) {
            if (item) {
                var info = $('#blockSituationView .blockInfo');
                info.find('span').eq(0).text(item.GSCount);
                info.find('span').eq(1).text(item.GCount);
                info.find('span').eq(2).text(item.SCount);
                info.find('span').eq(3).text(item.ResumeCount);
                info.find('span').eq(4).text(item.BlockCount);
                info.find('span').eq(5).text(item.GBlockCount);
                info.find('span').eq(6).text(item.SBlockCount);
            }
        }
    });
    $.fn.ajaxPost({ method: 'GetBlocks',
        callback: function (data) {
            if (data.TotalHits > 0)
                CreateBlocks(data.Items);
            else
                alert('没有符合条件的数据。');
        }
    });


    $.fn.grid.getInstance("block").changePageIndex(1);

    var blockgrid = $.fn.grid.getInstance("block");

    blockgrid.dbclick(function (row) {
        showBlockPoint(row.attr('data-itemid'));
    });
}

function showBlockPoint(sid) {
    for (i = 0; i < blockLayer.graphics.length; i++) {
        if (blockLayer.graphics[i].attributes["ID"] == sid) {
            map.infoWindow.setContent(blockLayer.graphics[i].getContent());
            map.infoWindow.setTitle(blockLayer.graphics[i].getTitle());
            map.centerAt(blockLayer.graphics[i].geometry);
            map.infoWindow.show(blockLayer.graphics[i].geometry, esri.dijit.InfoWindow.ANCHOR_UPPERRIGHT);
            break;
        }
    }
}

function CreateBlocks(datalist) {
    var blockSymbol = new esri.symbol.PictureMarkerSymbol('../images/Map/通阻.png', 20, 20);
    var unBlockSymbol = new esri.symbol.PictureMarkerSymbol('../images/Map/通阻灰.png', 20, 20);

//    var blockSymbol = new esri.symbol.SimpleMarkerSymbol().setColor("red").setSize(10);
//    var unBlockSymbol = new esri.symbol.SimpleMarkerSymbol().setColor("green").setSize(10);

    for (var i in datalist) {
        if (datalist[i].BEGIN_X > 0) {
            var pt = new esri.geometry.Point(datalist[i].BEGIN_X, datalist[i].BEGIN_Y, map.spatialReference);

            var attr = {
                "ZH_GD_NAME": datalist[i].ZH_GD_NAME,
                "CITY": datalist[i].CITY,
                "COUNTY": datalist[i].COUNTY,
                "ROADCODE": datalist[i].ROADCODE,
                "CURRSTATUS": datalist[i].CURRSTATUS,
                "MANAGE": datalist[i].MANAGE,
                "STARTINTERDICTION": datalist[i].STARTINTERDICTION,
                "RESUMETIME": datalist[i].RESUMETIME,
                "LOCALELINKMAN": datalist[i].LOCALELINKMAN,
                "ID": datalist[i].ID
            };

            var infoTemplate = new esri.InfoTemplate(getBlockTitle, getBlockContent);
            var symbol = datalist[i].ISOPENTO == "是" ? unBlockSymbol : blockSymbol;
            var graphic = new esri.Graphic(pt, symbol, attr, infoTemplate);
            blockLayer.add(graphic);
        }
    }
    createHint(blockLayer, "", "ZH_GD_NAME");
}

function getBlockTitle(g) {
    return "灾害名称: " + g.attributes["ZH_GD_NAME"];
}

function getBlockContent(g) {
    map.infoWindow.resize(280, 280);
    return "所在地市：" + nullEmpty(g.attributes["CITY"]) +
            "<br />所在区县：" + nullEmpty(g.attributes["COUNTY"]) +
            "<br />路线编号：" + nullEmpty(g.attributes["ROADCODE"]) +
            "<br />通阻情况：" + nullEmpty(g.attributes["CURRSTATUS"]) +
            "<br />管理单位：" + nullEmpty(g.attributes["MANAGE"]) +
            "<br />阻断起始时间：" + nullEmpty(g.attributes["STARTINTERDICTION"]) +
            "<br />预计恢复时间：" + nullEmpty(g.attributes["RESUMETIME"]) +
            "<br />现场联系人及电话：" + nullEmpty(g.attributes["LOCALELINKMAN"]) +
            "<br />" +
            "&nbsp;&nbsp;<a href='#' onclick='showBlockDetail(\"" + g.attributes["ID"] + "\")'>详细</a>" +
            "<br />";
}

function showBlockDetail(bid) {
    $(document).win({ url: 'ErgBlockDetail.aspx', width: 1020, height: 600, data: { r: Math.random().toString(), id: bid, type: 'view'} }).show();
}

//交通量
function doTrafficFlow() {
    $('#ergOrgViewCon').hide(rate);
    $('#ergResViewCon').hide(rate);
    $('#blockSearchView').hide(rate);
    $('#blockSituationView').hide(rate);

    $('#trafficflowView').show(rate);

    var defaultSymbol = new esri.symbol.PictureMarkerSymbol();
    var renderer = new esri.renderer.UniqueValueRenderer(defaultSymbol, "RunStatusFlag");
    renderer.addValue(" ", new esri.symbol.PictureMarkerSymbol('../images/DeviceState/交调设备/0.png', 21, 18)); //不正常
    renderer.addValue("0", new esri.symbol.PictureMarkerSymbol('../images/DeviceState/交调设备/0.png', 21, 18)); //不正常
    renderer.addValue("1", new esri.symbol.PictureMarkerSymbol('../images/DeviceState/交调设备/1.png', 21, 18)); //正常
    var template = new esri.InfoTemplate();
    template.setTitle("<b>${sde.SDE.VD.pointMC}</b>");
    template.setContent(getTrafficContent);

    trafficLayer = new esri.layers.FeatureLayer(equiptmentMapURL + "/1", {
        mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
        infoTemplate: template,
        outFields: ["*"]
    });
    trafficLayer.setDefinitionExpression("sde.SDE.VD.AUTO = 'T'");
    trafficLayer.setRenderer(renderer);
    map.addLayer(trafficLayer);
    createHint(trafficLayer, "交调设备：", "sde.SDE.VD.pointMC");
    dojo.connect(trafficLayer, "onClick", function (evt) {
        infowinFixscreen(evt);
    });

    $('#ddlCityTraffic').change(function (e) { $.fn.grid.getInstance("traffic").changePageIndex(1) });

    var trafficgrid = $.fn.grid.getInstance("traffic");

    trafficgrid.dbclick(function (row) {
        showTraffiPoint(row.attr('data-itemid'));
    });
}

function getTrafficContent(graphic) {
    map.infoWindow.resize(400, 300);
    strhtml = "<div id='d" + graphic.attributes["sde.SDE.VD.pointid"] + "' style='width: 380px; height: 250px;'></div>";
    genChart('d' + graphic.attributes["sde.SDE.VD.pointid"], graphic.attributes["sde.SDE.VD.pointid"]);
    return strhtml;
}

function genChart(renderTo, sid) {
    $.getJSON("http://61.154.9.71:8060/jd1/Ajaxdocument/GetTrafficFlowForHnemp.ashx?t=" + new Date().getTime() + "&type=ErgMapTraffic&sid=" + sid + "&callback=?", function (jsonp) {
        if (jsonp) {
            categories = jsonp.categories;
            seriesData = jsonp.dataList;
            title = jsonp.title;
            subTitle = jsonp.subTitle;
            yAxisTitle = jsonp.ycTitle;

            chart = new Highcharts.Chart({
                chart: {
                    renderTo: renderTo,
                    defaultSeriesType: chartType,
                    marginRight: 0
                },
                exporting: {
                    enabled: false
                },
                title: {
                    text: title,
                    style: {
                        color: '#BDBDBD'
                    }
                },
                subtitle: {
                    text: subTitle,
                    style: {
                        color: '#BDBDBD'
                    }
                },
                xAxis: {
                    categories: categories,
                    labels: {
                        rotation: -45,
                        align: 'right',
                        style: { font: 'normal small-caps normal 10pt Courier' }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: yAxisTitle
                    }
                },
                legend: {
                    layout: 'vertical',
                    backgroundColor: '#FFFFFF',
                    align: 'left',
                    verticalAlign: 'top',
                    x: 875,
                    y: 130,
                    floating: true,
                    shadow: true
                },
                tooltip: {
                    formatter: function () {
                        return this.x + "时交通量为：" + this.y;
                    }
                },
                credits: {
                    enabled: true,
                    position: {
                        align: 'right',
                        x: -10,
                        y: -10
                    },
                    href: "",
                    style: {
                        color: '#909090'
                    },
                    text: ""
                },
                plotOptions: {
                    line: {
                        animation: true,

                        dataLabels: {
                            enabled: true
                        },
                        enableMouseTracking: true
                    }
				,
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    },
                    marker: {
                        enabled: true,
                        radius: 3,
                        states: {
                            hover: {
                                enabled: true
                            },
                            select: {
                                enabled: false
                            }
                        }
                    }
                },
                series: seriesData
            });
        }
    });
}

function changeType(chart, series, newType) {
    newType = newType.toLowerCase();
    for (var i = 0; i < series.length; i++) {
        serie = series[0];
        try {
            serie.chart.addSeries({
                type: newType,
                stack: serie.stack,
                yaxis: serie.yaxis,
                name: serie.name,
                color: serie.color,
                data: serie.options.data
            },
                false);
            serie.remove();
        } catch (e) {
            alert(newType & ': ' & e);
        }
    }
}

function showTraffiPoint(sid) {
    for (i = 0; i < trafficLayer.graphics.length; i++) {
        if (trafficLayer.graphics[i].attributes["sde.SDE.VD.pointid"] == sid) {
            map.infoWindow.setContent(trafficLayer.graphics[i].getContent());
            map.infoWindow.setTitle(trafficLayer.graphics[i].getTitle());
            map.centerAt(trafficLayer.graphics[i].geometry);
            map.infoWindow.show(trafficLayer.graphics[i].geometry, esri.dijit.InfoWindow.ANCHOR_UPPERRIGHT);
            break;
        }
    }
}