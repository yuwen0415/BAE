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
                $('.selected').removeClass('selected').removeClass('button_over').addClass("button_out");
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
        $('#ergOrgViewCon').show(rate);
    });

    $('#downView').click(function () {
        $('#ergResViewCon').show(rate);
    });

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
    var htmlobj = $.ajax({ url: action, type: "POST", data: { "__Method": "GetErgStationDetail", "name": g.attributes["CName"] }, async: false });
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