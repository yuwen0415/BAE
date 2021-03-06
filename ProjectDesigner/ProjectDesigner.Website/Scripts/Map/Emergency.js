﻿var queryTask = null;
var query = null;
var points = new Array();
var pointLayer = null;
var routeLayer = null;
var openFlag = false, ce = false, fixPix = false, includePoi = true;
var qt = null, ipt = null;
var method = "getPOIS";
var cXmin = 0, cYmin = 0, cXmax = 0, cYmax = 0, x = 0, y = 0;
var curXmin = 0, curYmin = 0, curXmax = 0, curYmax = 0;
var queryDistance = 1000;

function init() {
    if (map.loaded)
        mapLoaded();
    else
        dojo.connect(map, "onLoad", mapLoaded);
}

function mapLoaded() {
    $('#infoSwich').hover(function () {
        if (openFlag)
            $('#infoSwich').css('backgroundPosition', '34px 0');
        else
            $('#infoSwich').css('backgroundPosition', '0 0');
    }, function () {
        if (openFlag)
            $('#infoSwich').css('backgroundPosition', '17px 0');
        else
            $('#infoSwich').css('backgroundPosition', '51px 0');
    });

    $('#pnlSearch').find('a').bind("click", function () {
        $(this).toggleClass('selected');
        appendTab($(this));
    });
    dojo.connect(map, "onLoad", mapLoaded);
    //dojo.connect(map, "onUpdateEnd", doSearch);

    dojo.connect(toolbar, "onDrawEnd", function (geometry) {
        switch (geometry.type) {
            case "extent":
                if (searchFlag) {
                    map.graphics.clear();
                    var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASHDOT, new dojo.Color([255, 0, 0]), 0.6), new dojo.Color([255, 255, 0, 0.25]));
                    graphic = new esri.Graphic(geometry, symbol);
                    rangeLayer.add(graphic);
                }
                fixPix = true;
                extentSearch(geometry);
                break;
        }
        toolbar.deactivate();
    });

    var tempCAM = new esri.InfoTemplate();
    tempCAM.setTitle(getTextTitle);
    tempCAM.setContent(getTextContentCAM);

    fea2 = new esri.layers.FeatureLayer(equiptmentMapURL + "/2", {
        mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
        infoTemplate: tempCAM,
        outFields: ["*"]
    });
    map.addLayer(fea2);
    layerVisibility(fea2);
    createHint(fea2, "视频监控设备：", "CName");

    routeLayer = new esri.layers.GraphicsLayer();
    map.addLayer(routeLayer);

    pointLayer = new esri.layers.GraphicsLayer();
    map.addLayer(pointLayer);

    bufferLayer = new esri.layers.GraphicsLayer();
    map.addLayer(bufferLayer);

    queryTask = new esri.tasks.QueryTask(BaseDataMapURL + "/2");
    query = new esri.tasks.Query();
    query.spatialRelationship = esri.tasks.Query.SPATIAL_REL_INTERSECTS;
    query.returnGeometry = true;
    query.outFields = ["*"];

    map.infoWindow.resize(220, 200);

    dojo.connect(map.infoWindow._hide, "onclick", function () {
        map.graphics.clear();
    });

    dojo.connect(map.infoWindow, "onShow", function () {
        if (document.getElementById('vmsDiv') != undefined)
            new Marquee(["vmsDiv", "vmsUl"], 2, 1, 330, 80, 50, 0, 0);
    });

    $("#layerList").hide();
}

dojo.addOnLoad(init);

//视频
function getTextTitle(graphic) {
    var form = $('form');
    var action = form.attr('action');
    var htmlobj = $.ajax({ url: action, type: "POST", data: { "__Method": "GetCamTitle", "camid": graphic.attributes["CCTV.ID"] }, async: false });
    var result = eval(htmlobj.responseText);
    return "<b>" + result + "</b>";
}

function getTextContentCAM(graphic) {
    var form = $('form');
    var action = form.attr('action');
    var htmlobj = $.ajax({ url: action, type: "POST", data: { "__Method": "GetCamAddress", "camid": graphic.attributes["CCTV.ID"] }, async: false });
    video_start_realtime(eval(htmlobj.responseText));
    map.infoWindow.resize(280, 230);
    return $("#divVideo").html();
}

function layerVisibility(layer) {
    (layer.visible) ? layer.hide() : layer.show();
}

function btnSearchClick() {
    if (!includePoi) { resetRang(); }
    else {
        ce = true;
        fixPix = false;
        curXmin = map.extent.xmin;
        curYmin = map.extent.ymin;
        curXmax = map.extent.xmax;
        curYmax = map.extent.ymax;

        $('#pnlSearch').find('a').removeClass('selected');

        var form = $('form');
        var action = form.attr('action');
        var htmlobj = $.ajax({ url: action, type: "POST", data: { "__Method": "getPOI_Category", "s": $("#POI").val(), "p": $("#txtPageIndex").val(), "xmin": curXmin, "ymin": curYmin, "xmax": curXmax, "ymax": curYmax }, async: false });
        var result = eval(htmlobj.responseText);

        if (!(!result)) {
            $(".tab").html('');
            for (var i in result) {
                var v = $('#pnlSearch').find('a[data-type = "' + result[i].Category_Code + '"]').get(0);
                if (!!(v)) {
                    $(v).addClass('selected');
                    appendTab(v);
                }
            }
        }
    }
}

function extentSearch(geo) {
    ce = true;
    includePoi = true;

    curXmin = geo.xmin;
    curYmin = geo.ymin;
    curXmax = geo.xmax;
    curYmax = geo.ymax;

    $('#pnlSearch').find('a').removeClass('selected');

    var form = $('form');
    var action = form.attr('action');
    var htmlobj = $.ajax({ url: action, type: "POST", data: { "__Method": "getPOI_CategoryByExtent", "s": $("#POI").val(), "p": $("#txtPageIndex").val(), "xmin": curXmin, "ymin": curYmin, "xmax": curXmax, "ymax": curYmax }, async: false });
    var result = eval(htmlobj.responseText);

    if (!(!result)) {
        $(".tab").html('');
        for (var i in result) {
            var v = $('#pnlSearch').find('a[data-type = "' + result[i].Category_Code + '"]').get(0);
            if (!!(v)) {
                $(v).addClass('selected');
                appendTab(v);

            }
        }
    }
}

function eventSearch(geo) {
    includePoi = false;

    x = geo.x;
    y = geo.y;
    ipt = geo;
    queryDistance = $("#txtRadius").val();

    $('#pnlSearch').find('a').removeClass('selected');

    var form = $('form');
    var action = form.attr('action');
    var htmlobj = $.ajax({ url: action, type: "POST", data: { "__Method": "getPOI_CategoryByEvent", "s": $("#POI").val(), "p": $("#txtPageIndex").val(), "x": x, "y": y, "l": queryDistance }, async: false });
    var result = eval(htmlobj.responseText);

    if (!(!result)) {
        $(".tab").html('');
        for (var i in result) {
            var v = $('#pnlSearch').find('a[data-type = "' + result[i].Category_Code + '"]').get(0);
            if (!!(v)) {
                $(v).addClass('selected');
                appendTab(v);
            }
        }
    }
}

function doSearch() {
    if (!fixPix) {
        curXmin = map.extent.xmin;
        curYmin = map.extent.ymin;
        curXmax = map.extent.xmax;
        curYmax = map.extent.ymax;
    }

    points = [];
    var charArr = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    map.infoWindow.hide();
    routeLayer.clear();
    pointLayer.clear();
    $("#pnlSearchResult").find("ul").html("");
    if ($('#pnlSearch').find('a.selected').length > 0 || $("#POI").val() != "") {
        $('#mapInfoCon').show(mapResize());

        var form = $('form');
        var action = form.attr('action');
        var htmlobj = $.ajax({ url: action, type: "POST", data: { "__Method": method, "s": $("#POI").val(), "p": $("#txtPageIndex").val(), "xmin": curXmin, "ymin": curYmin, "xmax": curXmax, "ymax": curYmax, "x": x, "y": y, "l": queryDistance, ipoi: includePoi }, async: false });
        var result = JSON.parse(htmlobj.responseText);
        var items = result.Items;
        var total = result.TotalHits;
        $("#spanTotal").text(total);
        $("#spanP1").text($("#txtPageIndex").val() == 1 ? 1 : ($("#txtPageIndex").val() - 1) * 5 + 1);
        $("#spanP2").text($("#txtPageIndex").val() * 5 > total ? total : $("#txtPageIndex").val() * 5);
        $("#spanTotal").text(total);
        $("#txtTotalPage").val(Math.ceil(total / 5));

        if (!(!items)) {
            for (var i in items) {
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
                    "Tel": items[i].Tel,
                    "Ref_Code": items[i].Ref_Code,
                    "Ref_Name": items[i].Ref_Name,
                    "Quantity": items[i].Quantity
                };

                var pt = new esri.geometry.Point(items[i].PoiX, items[i].PoiY, map.spatialReference);
                var markUrl = "../images/Map/mark1.png";
                var symbol = new esri.symbol.PictureMarkerSymbol(markUrl, 11, 15);
                var pindex = $("#txtPageIndex").val();

                if (parseInt($("#spanP1").text()-1) <= i && i <= parseInt($("#spanP2").text() - 1)) {
                    markUrl = "../images/Map/mark_blue_" + (parseInt(i) % 5 + 1) + ".png";
                    symbol = new esri.symbol.PictureMarkerSymbol(markUrl, 20, 24);

                    if (items[i].PoiX < cXmin || cXmin == 0)
                        cXmin = items[i].PoiX;
                    if (items[i].PoiX > cXmax || cXmax == 0)
                        cXmax = items[i].PoiX;

                    if (items[i].PoiY < cYmin || cYmin == 0)
                        cYmin = items[i].PoiY;
                    if (items[i].PoiY > cYmax || cYmax == 0)
                        cYmax = items[i].PoiY;

                    createSearchResult(charArr[parseInt(i) % 5], attr);
                }

                var infoTemplate1 = new esri.InfoTemplate(getInfowinTitle, getInfowinContent);
                var graphic = new esri.Graphic(pt, symbol, attr, infoTemplate1);

                points[i] = graphic;

                pointLayer.add(graphic);

                // if (ce)
                //     map.setExtent(new esri.geometry.Extent(cXmin - 0.05, cYmin - 0.05, cXmax + 0.05, cYmax + 0.05));
            }
        }

        $("#pnlSearchResult").find("li").each(function (index) {
            var g = points[index + 5* ($("#txtPageIndex").val() - 1)];
            var oldsymbol = g.symbol;
            var newsymbol = new esri.symbol.PictureMarkerSymbol("../images/Map/mark_red_" + (parseInt(index) + 1) + ".png", 20, 24);

            $(this).hover(function () {
                g.setSymbol(newsymbol);
            },
            function () {
                g.setSymbol(oldsymbol);
            });

            $(this).click(function () {
                //zoomTo(g);
                map.infoWindow.setContent(g.getContent());
                map.infoWindow.setTitle(g.getTitle());
                map.infoWindow.show(g.geometry, map.getInfoWindowAnchor(g.geometry));
                //singleClick(g.attributes.Route_Code);
            });
        });

        $("#pnlSearchResult").show();
    }
    ce = false;
}

function createSearchResult(label, attr) {
    var ul = $("#pnlSearchResult").find("ul");
    var li = $("<li></li>");
    var liHtml = "";
    switch (attr.Category_Code) {
        case "11":
            liHtml = "<div class='icon'>" + label + "</div>" +
                    "<div class='content'>" +
                    "<span><b>" + attr.Place + "</b>" + (!attr.Alias ? "" : "（" + attr.Alias + "）") + "</span>" +
                    (!attr.RoadCode ? "" : "<label>" + attr.RoadCode + "</label>") +
                    (attr.StartStake == null ? "" : "<label>(" + attr.StartStake + " - " + attr.EndStake + ")</label><br />") +
                    (!attr.ManageUnitName ? "" : "<label>" + attr.ManageUnitName + "</label><br />") +
                    "</div>";
            break;
        case "12":
            liHtml = "<div class='icon'>" + label + "</div>" +
                    "<div class='content'>" +
                    "<span><b>" + attr.Place + "</b>" + (!attr.Alias ? "" : "（" + attr.Alias + "）") + "</span>" +
                    (!attr.RoadCode ? "" : "<label>" + attr.RoadCode + "</label>") +
                    (attr.StartStake == null ? "" : "<label>(" + attr.StartStake + " - " + attr.EndStake + ")</label><br />") +
                    (!attr.ManageUnitName ? "" : "<label>" + attr.ManageUnitName + "</label><br />") +
                    "</div>";
            break;
        case "13":
            liHtml = "<div class='icon'>" + label + "</div>" +
                    "<div class='content'>" +
                    "<span><b>" + attr.Place + "</b>" + (!attr.Alias ? "" : "（" + attr.Alias + "）") + "</span>" +
                    (!attr.RoadCode ? "" : "<label>" + attr.RoadCode + "</label>") +
                    (attr.StartStake == null ? "" : "<label>(" + attr.StartStake + " - " + attr.EndStake + ")</label><br />") +
                    (!attr.ManageUnitName ? "" : "<label>" + attr.ManageUnitName + "</label><br />") +
                    "</div>";
            break;
        case "35":
            liHtml = "<div class='icon'>" + label + "</div>" +
                    "<div class='content'>" +
                    "<span><b>" + attr.Place + "</b></span>" +
                    (!attr.Ref_Name ? "" : "<label>" + attr.Ref_Name + "</label><br />") + 
                    (attr.Quantity == null ? "" : "<label>数量：" + attr.Quantity + "</label><br />") + 
                    "</div>";
            break;
        case "43":
            liHtml = "<div class='icon'>" + label + "</div>" +
                    "<div class='content'>" +
                    "<span><b>" + attr.Address + "</b></span></div>";
            break;
        default:
            liHtml = "<div class='icon'>" + label + "</div>" +
                    "<div class='content'>" +
                    "<span><b>" + attr.Place + "</b>" + (!attr.Alias ? "" : "（" + attr.Alias + "）") + "</span>" +
                    (!attr.RoadCode ? "" : "<label>" + attr.RoadCode + "</label>") +
                    (attr.StartStake == null ? "" : "<label>(" + attr.StartStake + " - " + attr.EndStake + ")</label><br />") +
                    (!attr.ManageUnitName ? "" : "<label>" + attr.ManageUnitName + "</label><br />") +
                    "</div>";
            break;
    }

    li.html(liHtml);
    li.appendTo($("#pnlSearchResult").find("ul"));
}

function doQueryResult(fset) {
    var s = new esri.symbol.SimpleLineSymbol(
          esri.symbol.SimpleLineSymbol.STYLE_SOLID,
          new dojo.Color([255, 0, 0, 0.65]), 5
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
    map.graphics.clear();
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
          new dojo.Color([0, 0, 255, 0.65]), 5
        );

    var resultFeatures = fset.features;
    for (var i = 0, il = resultFeatures.length; i < il; i++) {
        var graphic = resultFeatures[i];
        graphic.setSymbol(s1);
        graphic.setInfoTemplate(null);
        map.graphics.add(graphic);
    }
}

function mapResize() {
    openFlag = !openFlag;
    if (openFlag)
        $("#infoSwich").attr("title", "关闭");
    else
        $("#infoSwich").attr("title", "打开");
    if (map != null) {
        map.resize();
        map.reposition();
    };
}

function prePage() {
    if (parseInt($("#txtPageIndex").val()) <= 1) {
        $("#txtPageIndex").val(1);
       // alert("当前是第一页！")
    }
    else {
        $("#txtPageIndex").val(parseInt($("#txtPageIndex").val()) - 1);
        doSearch();
    }
}

function nextPage() {
    if ($("#txtPageIndex").val() == $("#txtTotalPage").val()) {
       // alert("已经是最后一页了！")
    }
    else {

        $("#txtPageIndex").val(parseInt($("#txtPageIndex").val()) + 1);
        doSearch();
    }
}

function getQT(obj) {
    qt = $(obj).data("method");
    method = $(obj).data("method");
}

function appendTab(obj) {
    if (!$(".tab").parent().is(':visible'))
        $(".tab").parent().show();

    if (!$("#divPageinfo").is(':visible'))
        $("#divPageinfo").show();

    var tabid = "tab" + $(obj).data("type");
    if ($(".tab").find("#" + tabid).length == 0) {
        $(".tab").append("<li id='" + tabid + "' onclick='changeTab(this);'><a href='#'>" + $(obj).html() + "</a></li>");
        changeTab($('#' + tabid));
    }
    else {
        var tid = "#" + tabid;

        var o = null;
        if ($(tid).is(':visible')) {
            o = $(tid).prev();
            if (o.length == 0) {
                o = $(tid).next();
            }

            if (o.length == 0)
                $('#pnlSearchResult ul').html('');
            else
                changeTab(o);
        }

        $(".tab").find(tid).remove();
        if ($(".tab").find('li').length == 0) {
            $(".tab").parent().hide();
            $("#divPageinfo").hide();
        }
    }
}

function changeTab(obj) {
    var w = 40;
    $('.tab').find('li:visible').each(function () {
        w += $(this).width();
        $(this).removeClass('selected');
    });

    if (w >= $(obj).parent().width())
        $(obj).prevAll().hide();

    $(obj).addClass("selected");

    getTabData(obj);
}

function prevOne() {
    var w = 40;
    var c = $(".tab").find('.selected').prev();
    var pw = c.parent().width();

    if (c.length > 0) {
        c.show();
        $('.tab').find('li:visible').each(function () {
            $(this).removeClass('selected');
            w += $(this).width();
            if (w >= pw)
                $(this).hide();
        });
        c.addClass('selected')
    }

    getTabData(c);
}

function nextOne() {
    var c = $(".tab").find('.selected').next();
    if (c.length > 0) {
        c.show();
        changeTab(c);
    }
}

function getTabData(o) {
    var i = $(o).attr("id").replace('tab', '');
    var v = $('#pnlSearch').find('a[data-type = "' + i + '"]').get(0);
    $("#txtPageIndex").val(1);
    getQT(v);
    doSearch();
}

function getInfowinTitle(g) {
    var liHtml = "";
    switch (g.attributes["Category_Code"]) {
        case "11":
            liHtml = g.attributes["Place"] + "(" + g.attributes["Alias"] + ")";
            break;
        case "43":
            liHtml = g.attributes["Address"];
            break;
        default:
            liHtml = g.attributes["Place"];
            break;
    }

    return liHtml;
}

function getInfowinContent(g) {
    var liHtml = "";
    switch (g.attributes["Category_Code"]) {
        case "11":
            map.infoWindow.resize(220, 200);
            liHtml = "<label>路线代码: " + (!g.attributes["Route_Code"] ? "" : g.attributes["Route_Code"]) +
                    "</label><br /><label>起点桩号: " + (g.attributes["StartStake"] == null ? "" : g.attributes["StartStake"]) +
                    "</label><br /><label>止点桩号: " + g.attributes["EndStake"] +
                    "</label><br /><label>管理单位: " + (!g.attributes["ManageUnitName"] ? "" : g.attributes["ManageUnitName"]) +
                    "</label><br /><label>电话: " + (!g.attributes["Tel"] ? "" : g.attributes["Tel"]) +
                    "</label><br />";
            break;
        case "12":
            map.infoWindow.resize(220, 200);
            liHtml = "<label>路线代码: " + (!g.attributes["Route_Code"] ? "" : g.attributes["Route_Code"]) +
                    "</label><br /><label>起点桩号: " + (g.attributes["StartStake"] == null ? "" : g.attributes["StartStake"]) +
                    "</label><br /><label>止点桩号: " + g.attributes["EndStake"] +
                    "</label><br /><label>管理单位: " + (!g.attributes["ManageUnitName"] ? "" : g.attributes["ManageUnitName"]) +
                    "</label><br /><label>电话: " + (!g.attributes["Tel"] ? "" : g.attributes["Tel"]) +
                    "</label><br />";
            break;
        case "13":
            map.infoWindow.resize(200, 50);
            break;
        case "21":
            map.infoWindow.resize(220, 100);
            liHtml = "<label>地址: " + (!g.attributes["Address"] ? "" : g.attributes["Address"]) +
                    "</label><br /><label>电话: " + (!g.attributes["Tel"] ? "" : g.attributes["Tel"]) +
                    "</label><br />";
            break;
        case "35":
            map.infoWindow.resize(220, 100);
            liHtml = "<label>物资名称: " + (!g.attributes["Ref_Name"] ? "" : g.attributes["Ref_Name"]) +
                    "</label><br /><label>数量: " + (g.attributes["Quantity"] == null ? "" : g.attributes["Quantity"]) +
                    "</label><br />";
            break;
        case "41":
            map.infoWindow.resize(220, 130);
            var totalday = 0;
            var totalperiod = 0;

            $.getJSON("http://61.154.9.71:8060/jd1/Ajaxdocument/handlerP.ashx?t=" + new Date().getTime() + "&d=02&s=" + g.attributes["Ref_Code"] + "&callback=?", function (jsonp) {
                if (!!jsonp) {
                    totalday = jsonp[0].TOTALDAY;
                    $("#TotalDay").text(jsonp[0].TOTALDAY);
                }
            });

            $.getJSON("http://61.154.9.71:8060/jd1/Ajaxdocument/handlerP.ashx?t=" + new Date().getTime() + "&d=01&s=" + g.attributes["Ref_Code"] + "&callback=?", function (jsonp) {
                if (!!jsonp) {
                    totalperiod = jsonp[0].TOTALPERIOD;
                    $("#TotalPeriod").text(jsonp[0].TOTALPERIOD);
                }
            });

            liHtml = "<label>观测站编号: " + (!g.attributes["Ref_Code"] ? "" : g.attributes["Ref_Code"]) +
                     "</label><br /><label>当前时段交通量: <span id='TotalPeriod' style='color:red'>" + totalperiod + "</span>" +
                     "</label><br /><label>当日累计交通量: <span id='TotalDay' style='color:red'>" + totalday + "</span>" +
                     "</label><br />";
            break;

        case "42":
            map.infoWindow.resize(280, 230);
            var form = $('form');
            var action = form.attr('action');
            var htmlobj = $.ajax({ url: action, type: "POST", data: { "__Method": "GetCamAddress", "camid": g.attributes["Ref_Code"] }, async: false });
            video_start_realtime(eval(htmlobj.responseText));
            liHtml = $("#divVideo").html();
            break;

        case "43":
            var form = $('form');
            var action = form.attr('action');
            var htmlobj = $.ajax({ url: action, type: "POST", data: { "__Method": "GetVMSText", "vmsid": g.attributes["Ref_Code"] }, async: false });
            var strs = htmlobj.responseText.replace(/\"/g, "");

            map.infoWindow.resize(350, 120);
            liHtml = "<div id='vmsDiv'><ul id='vmsUl'><li>" + strs + "</li></ul></div>";

            break;
        case "44":
            var form = $('form');
            var action = form.attr('action');
            var htmlobj = $.ajax({ url: action, type: "POST", data: { "__Method": "GetRealWeather", "vdid": g.attributes["Ref_Code"] }, async: false });
            var result = jQuery.parseJSON(htmlobj.responseText);
            
            var symbol = new esri.symbol.PictureMarkerSymbol({
                "url": "../images/weather/symbol/温度",
                "height": 20,
                "width": 20,
                "type": "esriPMS"
            });
            map.infoWindow.resize(145, 270);
            for (var i in result) {
                liHtml = "<style type='text/css'>img{vertical-align:middle; line-height:20px;}</style><img src='../images/weather/symbol/温度.png'/>&nbsp;温度:" + result[i].Temperature + "℃ <br>  <style type='text/css'>img{vertical-align:middle; line-height:20px;}</style><img src='../images/weather/symbol/湿度.png'/>&nbsp;湿度:" + result[i].Humidity +
                    "%<br> <style type='text/css'>img{vertical-align:middle; line-height:20px;}</style><img src='../images/weather/symbol/能见度.png'/>&nbsp;能见度:" + result[i].Visibility + " km<br><style type='text/css'>img{vertical-align:middle; line-height:20px;}</style> <img src='../images/weather/symbol/风向.png'/>&nbsp;风向:" + result[i].WindDirection + "  <br> <style type='text/css'>img{vertical-align:middle; line-height:20px;}</style><img src='../images/weather/symbol/风速.png'/>&nbsp;风速:" + result[i].WindSpeed +
                    "m/s<br> <style type='text/css'>img{vertical-align:middle; line-height:20px;}</style><img src='../images/weather/symbol/气压.png'/>&nbsp;气压:" + result[i].Pressure + "hPa<br>  <style type='text/css'>img{vertical-align:middle; line-height:20px;}</style><img src='../images/weather/symbol/雨量.png'/>&nbsp;雨量:--mm<br><style type='text/css'>img{vertical-align:middle; line-height:20px;}</style> <img src='../images/weather/symbol/路况.png'/>&nbsp;路况:" + result[i].PavementStatus_Name + "<br>";
            }
           
            break;
            
        default:
            map.infoWindow.resize(200, 50);
            break;
    }

    return liHtml;
}

function resetRang() {
    if (!!ipt) {
        rangeLayer.clear();
        eventSearch(ipt);
        doBuffer(ipt);
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
          esri.symbol.SimpleLineSymbol.STYLE_DASHDOT,
          new dojo.Color([255, 0, 0, 0.65]), 2
        ),
        new dojo.Color([255, 255, 0, 0.2])
      );

    dojo.forEach(geometries, function (geometry) {
        var graphic = new esri.Graphic(geometry, symbol);
        rangeLayer.add(graphic);
    });
}

function mgclear() {
    map.graphics.clear();
    pointLayer.clear();
    routeLayer.clear();
    rangeLayer.clear();
    stakeLayer.clear();

    includePoi = true;
    ipt = null;
    map.infoWindow.hide();
    $(".tab").html('');
    $('#pnlSearch').find('a').removeClass('selected');
    $("#pnlSearchResult").find("ul").html("");
    $("#divPageinfo").hide();
}