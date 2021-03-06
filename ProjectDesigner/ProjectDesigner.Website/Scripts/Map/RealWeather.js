﻿var featureLayer = null;

function init() {
    if (map.loaded)
        mapLoaded();
    else
        dojo.connect(map, "onLoad", mapLoaded);
}

function mapLoaded() {
    //消息框图层，初始化  
    var template = new esri.InfoTemplate();
    template.setTitle("<b>${WS.pointMC}</b><br><b>${ID}</b>");
    template.setContent(getTextContent);

    featureLayer = new esri.layers.FeatureLayer(equiptmentMapURL + "/3", {
        mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
        infoTemplate: template,
        outFields: ["*"]
    });
    map.addLayer(featureLayer);
    map.infoWindow.resize(145, 270);

    dojo.connect(featureLayer, "onMouseOver", function (evt) {
        map.setMapCursor("pointer");
        var g = evt.graphic;
        map.infoWindow.setContent(g.getContent());
        map.infoWindow.setTitle(g.getTitle());
        map.infoWindow.show(evt.screenPoint, map.getInfoWindowAnchor(evt.screenPoint));
    });

    dojo.connect(featureLayer, "onMouseOut", function (evt) {
        map.setMapCursor("default");
        map.infoWindow.hide();
    });
}

dojo.addOnLoad(init);

//实时气象信息
function getTextContent(graphic) {
    var form = $('form');
    var action = form.attr('action');
    var htmlobj = $.ajax({ url: action, type: "POST", data: { "__Method": "GetRealWeather", "vdid": graphic.attributes["WS.pointid"] }, async: false });
    var result = jQuery.parseJSON(htmlobj.responseText);
    //    var defaultSymbol = new esri.symbol.PictureFillSymbol(new esri.symbol.PictureMarkerSymbol('../images/weather/symbol/温度', 24, 18));
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
    return strHtml;
}
function showSelected() {
    var grid = $.fn.grid.getInstance();
    var selected = grid.getSelectedDataItems();
    if (selected.length == 1) {
        for (i = 0; i < featureLayer.graphics.length; i++) {
            if (featureLayer.graphics[i].attributes["WS.pointid"] == selected[0].Device_Code) {
                map.infoWindow.setContent(featureLayer.graphics[i].getContent());
                map.infoWindow.setTitle(featureLayer.graphics[i].getTitle());
                map.centerAt(featureLayer.graphics[i].geometry);
                map.infoWindow.show(featureLayer.graphics[i].geometry, esri.dijit.InfoWindow.ANCHOR_UPPERRIGHT);
                break;
            }
        }
    }
    if (selected.length > 1) {
        $(selected).each(function (i, s) {
            var markerSymbol = new esri.symbol.PictureMarkerSymbol('../images/Map/mark.png', 23, 25);
            for (i = 0; i < featureLayer.graphics.length; i++) {
                if (featureLayer.graphics[i].attributes["WS.pointid"] == s.Code) {
                    featureLayer.graphics[i].setSymbol(markerSymbol);
                    break;
                }
            }
        });
    }
}