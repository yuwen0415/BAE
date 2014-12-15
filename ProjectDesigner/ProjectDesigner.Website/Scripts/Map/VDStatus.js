var featureLayer = null;

function init() {
    if (map.loaded)
        mapLoaded();
    else
        dojo.connect(map, "onLoad", mapLoaded);
}

function mapLoaded() {
    //消息框图层，初始化  
    var defaultSymbol = new esri.symbol.PictureMarkerSymbol();
    var renderer1 = new esri.renderer.UniqueValueRenderer(defaultSymbol, "RunStatusFlag");
    renderer1.addValue(" ", new esri.symbol.PictureMarkerSymbol('../images/DeviceState/交调设备/0.png', 21, 18)); //不正常
    renderer1.addValue("0", new esri.symbol.PictureMarkerSymbol('../images/DeviceState/交调设备/0.png', 21, 18)); //不正常
    renderer1.addValue("1", new esri.symbol.PictureMarkerSymbol('../images/DeviceState/交调设备/1.png', 21, 18)); //正常
    var template = new esri.InfoTemplate();
    template.setTitle("<b>${sde.SDE.VD.pointMC}</b>");
    template.setContent(getTextContent);

    featureLayer = new esri.layers.FeatureLayer(equiptmentMapURL + "/1", {
        mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
        infoTemplate: template,
        outFields: ["*"]
    });
    featureLayer.setDefinitionExpression("sde.SDE.VD.AUTO = 'T'");
    map.infoWindow.resize(220, 250);
    featureLayer.setRenderer(renderer1);
    map.addLayer(featureLayer);
    createHint(featureLayer, "交调设备：", "sde.SDE.VD.pointMC");

    dojo.connect(featureLayer, "onClick", function (evt) {
        infowinFixscreen(evt);
    });
}

dojo.addOnLoad(init);

//交调信息内容
function getTextContent(graphic) {
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

    return strHtml;
}

function showVideo(address) {
    if (address == '')
        alert("该站点未开通视频服务");
    else
        $(document).win({ url: 'Video.html', width: 520, height: 420, data: { addr: address} }).show();
}

function showRealData(obid) {
    $(document).win({ url: 'http://61.154.9.71:8060/JD1/newRealData/main.html', width: 1020, height: 550, data: { sid: obid} }).show();
}

function showSelected() {
    var grid = $.fn.grid.getInstance();
    var selected = grid.getSelected();
    if (selected != undefined && selected.length > 1) {
        selected.each(function () {
            var id = $(this).attr('data-itemid');
            var markerSymbol = new esri.symbol.PictureMarkerSymbol('../images/Map/mark.png', 23, 25);
            for (i = 0; i < featureLayer.graphics.length; i++) {
                if (featureLayer.graphics[i].attributes["sde.SDE.VD.pointid"] == id) {
                    featureLayer.graphics[i].setSymbol(markerSymbol);
                    break;
                }
            }
        });
    }
    else {
        if (selected != undefined) {
            for (i = 0; i < featureLayer.graphics.length; i++) {
                if (featureLayer.graphics[i].attributes["sde.SDE.VD.pointid"] == selected.attr('data-itemid')) {
                    map.infoWindow.setContent(featureLayer.graphics[i].getContent());
                    map.infoWindow.setTitle(featureLayer.graphics[i].getTitle());
                    map.centerAt(featureLayer.graphics[i].geometry);
                    //infowinFixscreen1(featureLayer.graphics[i].geometry);
                    map.infoWindow.show(featureLayer.graphics[i].geometry, esri.dijit.InfoWindow.ANCHOR_UPPERRIGHT);
                    break;
                }
            }
        }
    }
}