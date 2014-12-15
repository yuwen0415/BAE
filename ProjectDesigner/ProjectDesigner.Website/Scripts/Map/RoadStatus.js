/// <reference path="../jquery-1.7.min.js" />

var layerConList = [], visible = [], queryble = [];
var queryTask = null;
var query = null;
var points = new Array();
var pointLayer = null, lineLayer = null;

function init() {
    if (map.loaded)
        mapLoaded();
    else
        dojo.connect(map, "onLoad", mapLoaded);
}

function mapLoaded() {
    lengthParams = new esri.tasks.LengthsParameters();

    //X401底图
    var X401ImageMap = new esri.layers.ArcGISDynamicMapServiceLayer(x401ImageURL);
    map.addLayer(X401ImageMap);

    layerRoadMap = new esri.layers.ArcGISDynamicMapServiceLayer(equiptmentMapURL);
    EmergencyMapURL = new esri.layers.ArcGISDynamicMapServiceLayer(EmergencyMapURL);

    if (layerRoadMap.loaded) {
        buildLayerList(layerRoadMap);
    }
    else {
        dojo.connect(layerRoadMap, "onLoad", buildLayerList);
    }

    lineLayer = new esri.layers.GraphicsLayer();
    map.addLayer(lineLayer);

    pointLayer = new esri.layers.GraphicsLayer();
    map.addLayer(pointLayer);

    var tempVD = new esri.InfoTemplate();
    tempVD.setTitle("<b>交调设备：${sde.SDE.VD.pointMC}</b>");
    tempVD.setContent(getTextContentVD);

    fea1 = new esri.layers.FeatureLayer(equiptmentMapURL + "/1", {
        mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
        infoTemplate: tempVD,
        outFields: ["*"]
    });
    fea1.setDefinitionExpression("AUTO = 'T'");
    map.addLayer(fea1);
    createHint(fea1, "交调设备：", "sde.SDE.VD.pointMC");

    dojo.connect(fea1, "onClick", function (evt) {
        infowinFixscreen(evt, 300, 310);
    });

    var tempCAM = new esri.InfoTemplate();
    tempCAM.setTitle("<b>视频监控设备：${CName}</b>");
    tempCAM.setContent(getTextContentCAM);

    fea2 = new esri.layers.FeatureLayer(equiptmentMapURL + "/2", {
        mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
        infoTemplate: tempCAM,
        outFields: ["*"]
    });
    map.addLayer(fea2);
    createHint(fea2, "视频监控设备：", "CName");

    dojo.connect(fea2, "onClick", function (evt) {
        infowinFixscreen(evt, 300, 310);
    });

    var tempWS = new esri.InfoTemplate();
    tempWS.setTitle("<b>气象设备：${sde.SDE.WS.pointMC}</b>");
    tempWS.setContent(getTextContentWS);

    fea3 = new esri.layers.FeatureLayer(equiptmentMapURL + "/3", {
        mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
        infoTemplate: tempWS,
        outFields: ["*"]
    });
    map.addLayer(fea3);
    createHint(fea3, "气象设备：", "sde.SDE.WS.pointMC");

    dojo.connect(fea3, "onClick", function (evt) {
        infowinFixscreen(evt, 300, 340);
    });

    var tempVMS = new esri.InfoTemplate();
    tempVMS.setTitle("<b>可变情报板：${sde.SDE.VMS.所在位置}</b>");
    tempVMS.setContent(getTextContentVMS);

    fea4 = new esri.layers.FeatureLayer(equiptmentMapURL + "/4", {
        mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
        infoTemplate: tempVMS,
        outFields: ["*"]
    });

//    dojo.connect(map.infoWindow, "onShow", function () {
//        if (document.getElementById('vmsDiv') != undefined)
//            new Marquee(["vmsDiv", "vmsUl"], 2, 1, 330, 80, 50, 0, 0);
//    });

    map.addLayer(fea4);
    createHint(fea4, "可变情报板：", "sde.SDE.VMS.所在位置");

    dojo.connect(fea4, "onClick", function (evt) {
        infowinFixscreen(evt, 300, 200);
    });

    var tempLamp = new esri.InfoTemplate();
    tempLamp.setTitle("<b>路灯控制柜：${ID}</b>");
    tempLamp.setContent("名称:${NAME}");

    fea6 = new esri.layers.FeatureLayer(equiptmentMapURL + "/6", {
        mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
        infoTemplate: tempLamp,
        outFields: ["*"]
    });
    layerVisibility(fea6);
    map.addLayer(fea6);
    createHint(fea6, "路灯控制柜：", "ID");

    dojo.connect(fea6, "onClick", function (evt) {
        infowinFixscreen(evt, 200, 200);
    });


    //区域气象  
    var defaultSymbol = new esri.symbol.PictureMarkerSymbol();
    var renderer1 = new esri.renderer.UniqueValueRenderer(defaultSymbol, "DayWeatherKind_Code");
    renderer1.addValue("1", new esri.symbol.PictureMarkerSymbol('../images/weather/晴.png', 24, 18)); //晴
    renderer1.addValue("2", new esri.symbol.PictureMarkerSymbol('../images/weather/多云.png', 24, 18)); //多云
    renderer1.addValue("3", new esri.symbol.PictureMarkerSymbol('../images/weather/阴.png', 24, 18)); //阴
    renderer1.addValue("4", new esri.symbol.PictureMarkerSymbol('../images/weather/阵雨.png', 24, 18)); //阵雨
    renderer1.addValue("5", new esri.symbol.PictureMarkerSymbol('../images/weather/雷阵雨.png', 24, 18)); //雷阵雨
    renderer1.addValue("6", new esri.symbol.PictureMarkerSymbol('../images/weather/雷阵雨伴有冰雹.png', 24, 18)); //雷阵雨伴有冰雹
    renderer1.addValue("7", new esri.symbol.PictureMarkerSymbol('../images/weather/雨夹雪.png', 24, 18)); //雨夹雪
    renderer1.addValue("8", new esri.symbol.PictureMarkerSymbol('../images/weather/小雨.png', 24, 18)); //小雨
    renderer1.addValue("9", new esri.symbol.PictureMarkerSymbol('../images/weather/中雨.png', 24, 18)); //中雨
    renderer1.addValue("10", new esri.symbol.PictureMarkerSymbol('../images/weather/大雨.png', 24, 18)); //大雨
    renderer1.addValue("11", new esri.symbol.PictureMarkerSymbol('../images/weather/暴雨.png', 24, 18)); //暴雨
    renderer1.addValue("12", new esri.symbol.PictureMarkerSymbol('../images/weather/大暴雨.png', 24, 18)); //大暴雨
    renderer1.addValue("13", new esri.symbol.PictureMarkerSymbol('../images/weather/特大暴雨.png', 24, 18)); //特大暴雨
    renderer1.addValue("14", new esri.symbol.PictureMarkerSymbol('../images/weather/雾.png', 24, 18)); //雾

    var tempAW = new esri.InfoTemplate();
    tempAW.setTitle("<b>${JYZMerge.FSMC}</b>");
    tempAW.setContent(getTextContentAW);

    fea7 = new esri.layers.FeatureLayer(AreaURL + "/0", {
        mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
        infoTemplate: tempAW,
        outFields: ["*"]
    });
    fea7.setRenderer(renderer1);
    layerVisibility(fea7);
    map.addLayer(fea7);

    dojo.connect(fea7, "onMouseMove", function (evt) {
        map.setMapCursor("pointer");
        var g = evt.graphic;
        map.infoWindow.setContent(g.getContent());
        map.infoWindow.setTitle(g.getTitle());
        map.infoWindow.show(evt.screenPoint, map.getInfoWindowAnchor(evt.screenPoint));
    });
    dojo.connect(fea7, "onMouseOut", function () {
        map.setMapCursor("default");
        map.infoWindow.hide();
    });

    //实时气象
    var tempRW = new esri.InfoTemplate();
    tempRW.setTitle("<b>${sde.SDE.WS.pointMC}</b><br><b>${ID}</b>");
    tempRW.setContent(getTextContentRW);

    fea8 = new esri.layers.FeatureLayer(equiptmentMapURL + "/3", {
        mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
        infoTemplate: tempRW,
        outFields: ["*"]
    });
    layerVisibility(fea8);
    map.addLayer(fea8);

    dojo.connect(fea8, "onMouseOver", function (evt) {
        map.setMapCursor("pointer");
        var g = evt.graphic;
        map.infoWindow.setContent(g.getContent());
        map.infoWindow.setTitle(g.getTitle());
        map.infoWindow.show(evt.screenPoint, map.getInfoWindowAnchor(evt.screenPoint));
    });

    dojo.connect(fea8, "onMouseOut", function (evt) {
        map.setMapCursor("default");
        map.infoWindow.hide();
    });

    CreateIncident();
    dojo.connect(window, "onresize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () { map.resize(); map.reposition(); }, 500);
    });

    dojo.connect(map.infoWindow._hide, "onclick", function () {
        lineLayer.clear();
    });

    dojo.connect(pointLayer, "onClick", function (evt) {
        singleClick(evt.graphic.attributes.Route_Code);
        infowinFixscreen(evt);
    });
}

dojo.addOnLoad(init);

function buildLayerList(layer) {
    var l = layerConList.length;
    layerConList.push(layer);

    var html = "";
    var items = dojo.map(layer.layerInfos, function (info, index) {
        if (info.defaultVisibility) {
            visible.push(info.id);
        }

        if (info.subLayerIds == null) {
            html += "<li><input type='checkbox' class='list_item' data-index= '" + l + "'" + (info.defaultVisibility ? "checked='checked'" : "") + " id='" + info.id + "'onclick='updateLayerVisibility(fea" + info.id + ");' /><label for='" + info.id + "'>" + info.name + "</label></li>";
        }
        else {
            html += html == "" ? "<ul>" : "</ul></li><ul>";
            html += "<li><label for='" + info.id + "'>" + info.name + "</label><ul>";
        }
    });

    $("#layerList").append(html);
    buildOther();
}

function updateLayerVisibility(id) {
    var inputs = dojo.query(".list_item"), input;

    visible = [];

    dojo.forEach(inputs, function (input) {
        if (input.checked) {
            visible.push(input.id);
        }
    });

    if (visible.length === 0) {
        visible.push(-1);
    }

    layerRoadMap.setVisibleLayers(visible);
    layerVisibility(id);
}

function layerVisibility(layer) {
    (layer.visible) ? layer.hide() : layer.show();
}

function buildOther() {
    var htmlEvent = "<ul><li><label>事件</label><ul><li><input type='checkbox' onclick='updateLayerVisibility(fea9);'><label> 未完结事件</label></li></ul></li></ul>";
    $("#layerList").append(htmlEvent);
    var htmlMeteorological = "<ul><li><label>气象</label><ul><li><input type='checkbox' onclick='updateLayerVisibility(fea7);'><label> 区域气象</label></li><li><input type='checkbox' onclick='updateLayerVisibility(fea8);'><label> 实时气象</label></li></ul></li></ul>";
    $("#layerList").append(htmlMeteorological);
}


//交调信息内容
function getTextContentVD(graphic) {
    var form = $('form');
    var action = form.attr('action');
    var htmlobj = $.ajax({ url: action, type: "POST", data: { "__Method": "GetVDInfo", "vdid": graphic.attributes["sde.SDE.VD.pointid"] }, async: false });
    var result = jQuery.parseJSON(htmlobj.responseText);

    var totalday = 0;
    var totalperiod = 0;

    $.getJSON("http://61.154.9.71:8060/jd1/Ajaxdocument/handlerP.ashx?t=" + new Date().getTime() + "&d=02&s=" + graphic.attributes["sde.SDE.VD.pointid"] + "&callback=?", function (jsonp) {
        if (!!jsonp) {
            totalday = jsonp[0].TOTALDAY;
            $("#TotalDay").text(jsonp[0].TOTALDAY);
        }
    });

    $.getJSON("http://61.154.9.71:8060/jd1/Ajaxdocument/handlerP.ashx?t=" + new Date().getTime() + "&d=01&s=" + graphic.attributes["sde.SDE.VD.pointid"] + "&callback=?", function (jsonp) {
        if (!!jsonp) {
            totalperiod = jsonp[0].TOTALPERIOD;
            $("#TotalPeriod").text(jsonp[0].TOTALPERIOD); // 本日累计交通量（辆）
        }
    });

    var strHtml;
    for (var i in result) {
        strHtml = "观测站编号：" + result[i].Id + "<br> 路线编号：" + result[i].RouteCode +
                    " <br> 路线名称：" + result[i].RouteName + " <br> 所在地市：" + result[i].CityName + " <br> 所在区县：" + result[i].AreaName +
                    "<br>" + "&nbsp;&nbsp;&nbsp;&nbsp;<a href='#' onclick='showRealData(\"" + result[i].Id + "\")'>实时数据</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + (!result[i].VedioAddress ? "<a>实时视频</a>" : "<a href='#' onclick='showVideo(\"" + result[i].VedioAddress + "\")'>实时视频</a>") + "<br><hr>当日累计交通量：<span id='TotalDay' style='color:red'>" + totalday + "</span><br>当前时段交通量：<span id='TotalPeriod' style='color:red'>" + totalperiod + "</span><br>";
    }
    map.infoWindow.resize(220, 250);
    return strHtml;
}

//视频
function getTextContentCAM(graphic) {
    var form = $('form');
    var action = form.attr('action');
    var htmlobj = $.ajax({ url: action, type: "POST", data: { "__Method": "GetCamAddress", "camid": graphic.attributes["sde.SDE.CCTV.ID"] }, async: false });
    video_start_realtime(eval(htmlobj.responseText));
    map.infoWindow.resize(280, 230);
    return $("#divVideo").html();
}

//可变情报板
function getTextContentVMS(graphic) {
    $.fn.ajaxPost({ method: 'GetVMSText', params: { 'vmsid': graphic.attributes["sde.SDE.VMS.IDS"] }, callback: function (data) {
        if (data && data.length > 0) {
            $('#cmsviewer').stop(false, false);
            $('#ImageLeft').attr('src', data[0].LPicture_Url);
            $('#ImageRight').attr('src', data[0].RPicture_Url);
            $('#txtMessage').attr('value', data[0].TextContent);
            $('#txtMessage').css({
                "color": getColor(data[0].TextColor),
                "font-size": (parseInt(data[0].TextFont.slice(4))).toString() + "px",
                "background": getColor(data[0].TextBackgroudColor)
            });
            CMSAnimationList(data, -1);
        }
        else {
            $('#ImageLeft').attr('src', "../images/CMSItemsPicture/empt.bmp");
            $('#ImageRight').attr('src', "../images/CMSItemsPicture/empt.bmp");
            $('#txtMessage').attr('value', "情报板内容显示");
            $('#txtMessage').css({
                "color": "red",
                "font-size": "32px",
                "background": "black"
            });
            ClearAnimation();
        }
    }
    })

    map.infoWindow.resize(500, 90);
    return $('#cms').html();
}

function getTextContentWS(graphic) {
    var form = $('form');
    var action = form.attr('action');
    var htmlobj = $.ajax({ url: action, type: "POST", data: { "__Method": "GetRealWeather", "vdid": graphic.attributes["sde.SDE.WS.pointid"] }, async: false });
    var result = jQuery.parseJSON(htmlobj.responseText);
    var symbol = new esri.symbol.PictureMarkerSymbol({
        "url": "../images/weather/symbol/温度",
        "height": 20,
        "width": 20,
        "type": "esriPMS"
    });

    var strHtml;
    for (var i in result) {
        strHtml = "<style type='text/css'>img{vertical-align:middle; line-height:20px;}</style><img src='../images/weather/symbol/温度.png'/>&nbsp;温度:" + result[i].Temperature + "℃ <br>  <style type='text/css'>img{vertical-align:middle; line-height:20px;}</style><img src='../images/weather/symbol/湿度.png'/>&nbsp;湿度:" + result[i].Humidity +
                    "%<br> <style type='text/css'>img{vertical-align:middle; line-height:20px;}</style><img src='../images/weather/symbol/能见度.png'/>&nbsp;能见度:" + result[i].Visibility + " km<br><style type='text/css'>img{vertical-align:middle; line-height:20px;}</style> <img src='../images/weather/symbol/风向.png'/>&nbsp;风向:" + result[i].WindDirection + "  <br> <style type='text/css'>img{vertical-align:middle; line-height:20px;}</style><img src='../images/weather/symbol/风速.png'/>&nbsp;风速:" + result[i].WindSpeed +
                    "m/s<br> <style type='text/css'>img{vertical-align:middle; line-height:20px;}</style><img src='../images/weather/symbol/气压.png'/>&nbsp;气压:" + result[i].Pressure + "hPa<br>  <style type='text/css'>img{vertical-align:middle; line-height:20px;}</style><img src='../images/weather/symbol/雨量.png'/>&nbsp;雨量:--mm<br><style type='text/css'>img{vertical-align:middle; line-height:20px;}</style> <img src='../images/weather/symbol/路况.png'/>&nbsp;路况:" + result[i].PavementStatus_Name + "<br>";
    }
    map.infoWindow.resize(160, 270);
    return strHtml;
}

function showVideo(address) {
    if (address == '')
        alert("该站点未开通视频服务");
    else
        $(document).win({ url: 'Video.html', width: 520, height: 420, data: { addr: address} }).show();
}

//区域气象信息
function getTextContentAW(graphic) {
    var form = $('form');
    var action = form.attr('action');
    var htmlobj = $.ajax({ url: action, type: "POST", data: { "__Method": "GetWeather", "vdid": graphic.attributes.Area_Code }, async: false });
    var result = jQuery.parseJSON(htmlobj.responseText);
    var strHtml;
    for (var i in result) {
        strHtml = "<style type='text/css'>img{vertical-align:middle; line-height:20px;}</style><img  src='../images/weather/" + result[i].DayWeatherKind_Name + ".gif'/>&nbsp;白天天气：" + result[i].DayWeatherKind_Name + " <br> <img  src='../images/weather/Night/" + result[i].NightWeatherKind_Name + ".bmp'/>&nbsp;夜间天气：" + result[i].NightWeatherKind_Name + " <br><img  src='../images/weather/symbol/温度.png'/>&nbsp;温度：" + result[i].Temperature + " <br> <img  src='../images/weather/symbol/湿度.png'/>&nbsp;相对湿度：" + result[i].Humidity +
                    " <br> <img  src='../images/weather/symbol/风速.png'/>&nbsp;风速：" + result[i].WindSpeed + " <br> <img  src='../images/weather/symbol/风向.png'/>&nbsp;风向：" + result[i].WindDirection + " <br>";
    }
    map.infoWindow.resize(160, 190);
    return strHtml;
}

//实时气象信息
function getTextContentRW(graphic) {
    var form = $('form');
    var action = form.attr('action');
    var htmlobj = $.ajax({ url: action, type: "POST", data: { "__Method": "GetRealWeather", "vdid": graphic.attributes["sde.SDE.WS.pointid"] }, async: false });
    var result = jQuery.parseJSON(htmlobj.responseText);

    var symbol = new esri.symbol.PictureMarkerSymbol({
        "url": "../images/weather/symbol/温度",
        "height": 20,
        "width": 20,
        "type": "esriPMS"
    });

    var strHtml;
    for (var i in result) {
        strHtml = "<style type='text/css'>img{vertical-align:middle; line-height:20px;}</style><img src='../images/weather/symbol/温度.png'/>&nbsp;温度:" + result[i].Temperature + "℃ <br>  <style type='text/css'>img{vertical-align:middle; line-height:20px;}</style><img src='../images/weather/symbol/湿度.png'/>&nbsp;湿度:" + result[i].Humidity +
                    "%<br> <style type='text/css'>img{vertical-align:middle; line-height:20px;}</style><img src='../images/weather/symbol/能见度.png'/>&nbsp;能见度:" + result[i].Visibility + " km<br><style type='text/css'>img{vertical-align:middle; line-height:20px;}</style> <img src='../images/weather/symbol/风向.png'/>&nbsp;风向:" + result[i].WindDirection + "  <br> <style type='text/css'>img{vertical-align:middle; line-height:20px;}</style><img src='../images/weather/symbol/风速.png'/>&nbsp;风速:" + result[i].WindSpeed +
                    "m/s<br> <style type='text/css'>img{vertical-align:middle; line-height:20px;}</style><img src='../images/weather/symbol/气压.png'/>&nbsp;气压:" + result[i].Pressure + "hPa<br>  <style type='text/css'>img{vertical-align:middle; line-height:20px;}</style><img src='../images/weather/symbol/雨量.png'/>&nbsp;雨量:--mm<br><style type='text/css'>img{vertical-align:middle; line-height:20px;}</style> <img src='../images/weather/symbol/路况.png'/>&nbsp;路况:" + result[i].PavementStatus_Name + "<br>";
    }
    map.infoWindow.resize(145, 270);
    return strHtml;
}

//事件
function CreateIncident() {
    fea9 = new esri.layers.GraphicsLayer();

    dojo.connect(fea9, "onMouseOver", function (evt) {
        map.setMapCursor("pointer");
    });

    dojo.connect(fea9, "onMouseOut", function (evt) {
        map.setMapCursor("default");
    });

    var form = $('form');
    var action = form.attr('action');
    var htmlobj = $.ajax({ url: action, type: "POST", data: { "__Method": "GetIncidentPoint" }, async: false });
    var result = eval(htmlobj.responseText);

    var symbol;

    for (var i = 0; i < result.length; i++) {
        var pt = new esri.geometry.Point(result[i].X, result[i].Y, map.spatialReference);
        var imgtext = result[i].StatusFlag == 2 ? "灰" : "";
        if (result[i].IsEmergency == true) {
            symbol = new esri.symbol.PictureMarkerSymbol({
                "url": "../images/Map/应急" + imgtext + ".png", //应急.png
                "height": 15,
                "width": 15,
                "type": "esriPMS"
            });
        }
        else
            if (result[i].IsBlock == true) {
                symbol = new esri.symbol.PictureMarkerSymbol({
                    "url": "../images/Map/阻断" + imgtext + ".png", //阻断.png
                    "height": 15,
                    "width": 15,
                    "type": "esriPMS"
                });
            }
            else {
                if (result[i].IsDailyCuring == true) {
                    symbol = new esri.symbol.PictureMarkerSymbol({
                        "url": "../images/Map/日常养护" + imgtext + ".png", //日常养护事件.png
                        "height": 15,
                        "width": 15,
                        "type": "esriPMS"
                    });
                }
                else {
                    symbol = new esri.symbol.PictureMarkerSymbol({
                        "url": "../images/Map/日常事件" + imgtext + ".png",
                        "height": 15,
                        "width": 15,
                        "type": "esriPMS"
                    });
                }
            }
        var attr = {
            "ID": result[i].ID,
            "X": result[i].X,
            "Y": result[i].Y,
            "FindTime": formatDate(result[i].FindTime),
            "Place": result[i].Place,
            "Category_Name": result[i].Category_Name,
            "BlockIncidentCategory_Name": result[i].BlockIncidentCategory_Name,
            "IncidentLevel_Name": result[i].IncidentLevel_Name,
            "StatusFlag": result[i].StatusFlag == "0" ? "未处理" : result[i].StatusFlag == "1" ? "处理中" : result[i].StatusFlag == "2" ? "已处理" : result[i].StatusFlag == "3" ? "已转移" : "已完结",
            "Road": (result[i].RouteName + result[i].Route_Code) == '' ? '未知' : result[i].RouteName + result[i].Route_Code,
            "EstResumeTime": formatDate(result[i].EstResumeTime),
            "ActResumeTime": formatDate(result[i].ActResumeTime),
            "FieldDescription": result[i].FieldDescription,
            "IsBlock": result[i].IsBlock
        };
        var infoTemplate1 = new esri.InfoTemplate("${BlockIncidentCategory_Name}(ID:<a href='#' onclick=\"WinTitleClick('${ID}')\">${ID}</a>)", "路线: ${Road} </br>发生时间: ${FindTime} <br/>预计恢复通车时间: ${EstResumeTime} <br/>实际恢复通车时间: ${ActResumeTime} <br/>现场情况描述: ${FieldDescription} <br/>状态: ${StatusFlag} <br/>");
        var infoTemplate2 = new esri.InfoTemplate("${Category_Name}(ID:<a href='#' onclick=\"WinTitleClick('${ID}')\">${ID}</a>)", "路线: ${Road} </br>发生时间: ${FindTime} <br/>现场情况描述: ${FieldDescription} <br/>状态: ${StatusFlag} <br/>");
        var infoTemplate3 = new esri.InfoTemplate("${Category_Name}(ID:<a href='#' onclick=\"WinTitleClick('${ID}')\">${ID}</a>)", "路线: ${Road} </br>发生时间: ${FindTime} <br/>现场情况描述: ${FieldDescription} <br/>状态: ${StatusFlag} <br/>");
        var graphic = null;
        if (result[i].IsBlock)
            graphic = new esri.Graphic(pt, symbol, attr, infoTemplate1);
        else
            graphic = new esri.Graphic(pt, symbol, attr, infoTemplate2);

        fea9.add(graphic);
    }
    layerVisibility(fea9);
    map.addLayer(fea9);

    dojo.connect(fea9, "onClick", function (evt) {
        map.infoWindow.resize(250, 220);
        infowinFixscreen(evt);
    });
}

function WinTitleClick(id) {
    var data = {};
    data.id = id;
    data.type = 'edit';

    $(this).win({ url: "/Guard/IncidentEdit.aspx",
        data: data,
        height: 600,
        width: 1028
    }).show();
}

function showRealData(obid) {
    $(document).win({ url: 'http://61.154.9.71:8060/JD1/newRealData/main.html', width: 1020, height: 550, data: { sid: obid} }).show();
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
    map.infoWindow.resize(220, 200);
    var cXmin = 0, cYmin = 0, cXmax = 0, cYmax = 0;
    points = [];
    var charArr = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    pointLayer.clear();
    map.infoWindow.hide();
    map.graphics.clear();
    $("#pnlSearchResult").find("ul").html("");

    if ($("#POI").val() != "") {
        $('#mapInfoCon').show(mapResize());

        var form = $('form');
        var action = form.attr('action');
        var htmlobj = $.ajax({ url: action, dataType: "json", type: "POST", data: { "__Method": "getPOIS", "s": $("#POI").val(), "p": $("#txtPageIndex").val() }, async: false });
        var result = JSON.parse(htmlobj.responseText);
        var items = result.Items;
        var total = result.TotalHits;

        $("#spanTotal").text(total);
        $("#spanP1").text($("#txtPageIndex").val() == 1 ? 1 : ($("#txtPageIndex").val() - 1) * 5 + 1);
        $("#spanP2").text($("#txtPageIndex").val() * 5 > total ? total : $("#txtPageIndex").val() * 5);
        $("#spanTotal").text(total);
        $("#txtTotalPage").val(Math.ceil(total / 5));

        if (total > 0)
            $("#divPageinfo").show();

        if (!(!items)) {
            for (var i in items) {
                var pt = new esri.geometry.Point(items[i].PoiX, items[i].PoiY, map.spatialReference);
                var markUrl = "../images/Map/mark_red_" + (parseInt(i) + 1) + ".png";
                var symbol = new esri.symbol.PictureMarkerSymbol(markUrl, 23, 25);
                var attr = {
                    "X": items[i].PoiX,
                    "Y": items[i].PoiY,
                    "Address": items[i].Address,
                    "Place": items[i].Place,
                    "Alias": items[i].Alias,
                    "Route_Code": items[i].Route_Code,
                    "RoadCode": items[i].RoadCode,
                    "Category_Code": items[i].Category_Code,
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

                var infoTemplate1 = new esri.InfoTemplate(getInfowinTitle, getInfowinContent);

                var graphic = new esri.Graphic(pt, symbol, attr, infoTemplate1);

                points[i] = graphic;

                pointLayer.add(graphic);
                createSearchResult(charArr[i], attr);
                map.setExtent(new esri.geometry.Extent(cXmin - 0.05, cYmin - 0.05, cXmax + 0.05, cYmax + 0.05));
            }
        }

        $("#pnlSearchResult").find("li").each(function (index) {
            var g = points[index];
            var oldsymbol = g.symbol;
            var symbol = new esri.symbol.PictureMarkerSymbol("../images/Map/mark_blue_" + (parseInt(index) + 1) + ".png", 23, 25);

            $(this).hover(function () {
                g.setSymbol(symbol);
            },
            function () {
                g.setSymbol(oldsymbol);
            });

            $(this).click(function () {
                zoomTo(g);
                map.infoWindow.setContent(g.getContent());
                map.infoWindow.setTitle(g.getTitle());
                map.infoWindow.show(g.geometry, map.getInfoWindowAnchor(g.geometry));
                singleClick(g.attributes.Route_Code);
            });
        });

        $("#pnlSearchResult").show();
    }

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

function prePage() {
    if (parseInt($("#txtPageIndex").val()) <= 1) {
        $("#txtPageIndex").val(1);
        //alert("当前是第一页！")
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

function getInfowinTitle(g) {
    if (g.attributes["Category_Code"].indexOf("11") == 0 || g.attributes["Category_Code"].indexOf("12") == 0) {
        return g.attributes["Place"] + "(" + g.attributes["Alias"] + ")";
    }
    else
        return g.attributes["Place"];
}

function getInfowinContent(g) {
    if (g.attributes["Category_Code"].indexOf("11") == 0 || g.attributes["Category_Code"].indexOf("12") == 0) {
        map.infoWindow.resize(220, 200);
        return "<label>路线代码: " + (!g.attributes["Route_Code"] ? "" : g.attributes["Route_Code"]) +
        "</label><br /><label>起点桩号: " + (g.attributes["StartStake"] == null ? "" : g.attributes["StartStake"]) +
        "</label><br /><label>止点桩号: " + g.attributes["EndStake"] +
        "</label><br /><label>管理单位: " + (!g.attributes["ManageUnitName"] ? "" : g.attributes["ManageUnitName"]) +
        "</label><br /><label>电话: " + (!g.attributes["Tel"] ? "" : g.attributes["Tel"]) +
        "</label><br />";
    }
    else
        map.infoWindow.resize(200, 50);
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
            if (result.hasError) {
                alert("无法定位相关地点，请检查桩号是否正确。");
            }
            else {
                map.graphics.clear();
                var pt = new esri.geometry.Point(result.geometries.points[0], new esri.SpatialReference({ wkid: 32650 }));
                projectToLL(4326, pt, showStakePoint);
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

    if (parseFloat($('#sStake2').val()) < parseFloat($('#sStake1').val())) {
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
                alert("无法定位相关路线，请检查桩号是否正确。");
            }
            else {
                if (result.geometries) {
                    map.graphics.clear();
                    var polylineJson = {
                        "paths": result.geometries.paths,
                        "spatialReference": { "wkid": 32650 }
                    };

                    var line = new esri.geometry.Polyline(polylineJson);
                    projectToLL(4326, line, showStakeRange);
                }
            }
        },
        error: function (error) {
            alert("请输入正确的路线或桩号范围。");
        }
    });
}

function showStakePoint(g) {
    var graphic = new esri.Graphic(g, symbolPoint, null, new esri.InfoTemplate(getStakeTitle, getStakeContent));
    map.graphics.add(graphic);
    zoomTo(graphic);
    map.infoWindow.resize(200, 60);
    map.infoWindow.setContent(graphic.getContent());
    map.infoWindow.setTitle(graphic.getTitle());
    map.infoWindow.show(g);
}

function getStakeTitle() {
    return "路线: " + $('#sRouteCode').val().toUpperCase() + " <br />桩号: " + $('#sStake0').val() + "K";
}

function getStakeContent() {
    map.infoWindow.resize(200, 60);
    return null;
}

function showStakeRange(g) {
    var graphic = new esri.Graphic(g, symbolLine, null, new esri.InfoTemplate(getStakeLineTitle, getStakeLineContent));
    map.graphics.add(graphic);
    zoomTo(graphic);
}

function getStakeLineTitle() {
    return "路线: " + $('#sRouteCode').val().toUpperCase() + " <br />起止桩号: " + $('#sStake1').val() + "K - " + $('#sStake2').val() + "K  <br />里程总长: " + (parseFloat($('#sStake2').val()) - parseFloat($('#sStake1').val())).toFixed(3) + "K";
}

function getStakeLineContent() {
    map.infoWindow.resize(220, 100);
    return null;
}