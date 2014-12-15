var featureLayer = null;

function init() {
    if (map.loaded)
        mapLoaded();
    else
        dojo.connect(map, "onLoad", mapLoaded);
}

function mapLoaded() {
    //消息框图层，初始化  
    //    var Symbol1 = new esri.symbol.PictureMarkerSymbol('../images/weather/1.png', 24, 18);
    var defaultSymbol = new esri.symbol.PictureMarkerSymbol();
    var renderer1 = new esri.renderer.UniqueValueRenderer(defaultSymbol, "DayWeatherKind_Code");
    renderer1.addValue("1", new esri.symbol.PictureMarkerSymbol('../images/weather/晴.png', 24, 18)); //晴
    renderer1.addValue("2", new esri.symbol.PictureMarkerSymbol('../images/weather/多云.png', 24, 18));//多云
    renderer1.addValue("3", new esri.symbol.PictureMarkerSymbol('../images/weather/阴.png', 24, 18)); //阴
    renderer1.addValue("4", new esri.symbol.PictureMarkerSymbol('../images/weather/阵雨.png', 24, 18));//阵雨
    renderer1.addValue("5", new esri.symbol.PictureMarkerSymbol('../images/weather/雷阵雨.png', 24, 18));//雷阵雨
    renderer1.addValue("6", new esri.symbol.PictureMarkerSymbol('../images/weather/雷阵雨伴有冰雹.png', 24, 18)); //雷阵雨伴有冰雹
    renderer1.addValue("7", new esri.symbol.PictureMarkerSymbol('../images/weather/雨夹雪.png', 24, 18)); //雨夹雪
    renderer1.addValue("8", new esri.symbol.PictureMarkerSymbol('../images/weather/小雨.png', 24, 18)); //小雨
    renderer1.addValue("9", new esri.symbol.PictureMarkerSymbol('../images/weather/中雨.png', 24, 18)); //中雨
    renderer1.addValue("10", new esri.symbol.PictureMarkerSymbol('../images/weather/大雨.png', 24, 18)); //大雨
    renderer1.addValue("11", new esri.symbol.PictureMarkerSymbol('../images/weather/暴雨.png', 24, 18)); //暴雨
    renderer1.addValue("12", new esri.symbol.PictureMarkerSymbol('../images/weather/大暴雨.png', 24, 18)); //大暴雨
    renderer1.addValue("13", new esri.symbol.PictureMarkerSymbol('../images/weather/特大暴雨.png', 24, 18)); //特大暴雨
    renderer1.addValue("14", new esri.symbol.PictureMarkerSymbol('../images/weather/雾.png', 24, 18)); //雾
    var template = new esri.InfoTemplate();
    template.setTitle("<b>${sde.SDE.AreaPoints.FSMC}</b>");
    template.setContent(getTextContent);

    featureLayer = new esri.layers.FeatureLayer(AreaURL + "/0", {
        mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
        infoTemplate: template,
        outFields: ["*"]
    });
    map.infoWindow.resize(160, 190);
    featureLayer.setRenderer(renderer1);
//    template.setRenderer(renderer2);
    map.addLayer(featureLayer);
    //createHint(featureLayer, "", "JYZMerge.FSMC");

//    dojo.connect(featureLayer, "onClick", function (evt) {
//        infowinFixscreen(evt);
//    });

    dojo.connect(featureLayer, "onMouseMove", function (evt) {
        map.setMapCursor("pointer");
        var g = evt.graphic;
        map.infoWindow.setContent(g.getContent());
        map.infoWindow.setTitle(g.getTitle());
        map.infoWindow.show(evt.screenPoint, map.getInfoWindowAnchor(evt.screenPoint));
    });
    dojo.connect(featureLayer, "onMouseOut", function () {
        map.setMapCursor("default");
        map.infoWindow.hide();
    });
}

dojo.addOnLoad(init);

//区域气象信息
function getTextContent(graphic) {
    var form = $('form');
    var action = form.attr('action');
    var htmlobj = $.ajax({ url: action, type: "POST", data: { "__Method": "GetWeather", "vdid": graphic.attributes.Area_Code }, async: false });
    var result = jQuery.parseJSON(htmlobj.responseText);
    var strHtml;
    for (var i in result) {
        strHtml = "<style type='text/css'>img{vertical-align:middle; line-height:20px;}</style><img  src='../images/weather/" + result[i].DayWeatherKind_Name + ".gif'/>&nbsp;白天天气：" + result[i].DayWeatherKind_Name + " <br> <img  src='../images/weather/Night/" + result[i].NightWeatherKind_Name + ".bmp'/>&nbsp;夜间天气：" + result[i].NightWeatherKind_Name + " <br><img  src='../images/weather/symbol/温度.png'/>&nbsp;温度：" + result[i].Temperature + " <br> <img  src='../images/weather/symbol/湿度.png'/>&nbsp;相对湿度：" + result[i].Humidity +
                    " <br> <img  src='../images/weather/symbol/风速.png'/>&nbsp;风速：" + result[i].WindSpeed + " <br> <img  src='../images/weather/symbol/风向.png'/>&nbsp;风向：" + result[i].WindDirection + " <br>";
    }
    return strHtml;
}
function showSelected() {
    var grid = $.fn.grid.getInstance();
    var selected = grid.getSelectedDataItems();
    if (selected.length == 1) {
        for (i = 0; i < featureLayer.graphics.length; i++) {
            if (featureLayer.graphics[i].attributes["sde.SDE.AreaPoints.IDS"] == selected[0].Area_Code) {
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
                if (featureLayer.graphics[i].attributes["sde.SDE.AreaPoints.IDS"] == s.Tunnel_Code) {
                    featureLayer.graphics[i].setSymbol(markerSymbol);
                    break;
                }
            }
        });
    }
}