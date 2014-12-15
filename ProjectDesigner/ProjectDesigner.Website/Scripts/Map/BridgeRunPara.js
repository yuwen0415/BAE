var featureLayer = null;
var defaultSymbol = null;
var renderer = null;
var template = null;

function init() {
    if (map.loaded)
        mapLoaded();
    else
        dojo.connect(map, "onLoad", mapLoaded);
}

function mapLoaded() {
    dojo.connect(map, "onExtentChange", function (extent, delta, outLevelChange, outLod) {
        showLoading();
        setTimeout(function () { BridgeExtentChange(outLod); }, 10);
    });

    defaultSymbol = new esri.symbol.PictureMarkerSymbol('../images/map/正常桥梁.png', 22, 13);
    renderer = new esri.renderer.UniqueValueRenderer(defaultSymbol, "TechRating");
    renderer.addValue("1", new esri.symbol.PictureMarkerSymbol('../images/map/正常桥梁.png', 22, 13));
    renderer.addValue("2", new esri.symbol.PictureMarkerSymbol('../images/map/正常桥梁.png', 22, 13));
    renderer.addValue("3", new esri.symbol.PictureMarkerSymbol('../images/map/问题桥梁.png', 22, 13));
    renderer.addValue("4", new esri.symbol.PictureMarkerSymbol('../images/map/危桥.png', 22, 13));
    renderer.addValue("5", new esri.symbol.PictureMarkerSymbol('../images/map/危桥.png', 22, 13));


    //消息框图层，初始化  
    template = new esri.InfoTemplate();
    template.setTitle("<b>${sde.SDE.BridgeBaseData.FSMC}</b>");
    template.setContent(getTextContent);

    map.infoWindow.resize(200, 180);
}

dojo.addOnLoad(init);

function getTextContent(g) {
    var form = $('form');
    var action = form.attr('action');
    var htmlobj = $.ajax({ url: action, type: "POST", data: { "__Method": "GetBridgeInfo", "bid": g.attributes["sde.SDE.BridgeBaseData.qlbm"] }, async: false });
    var result = jQuery.parseJSON(htmlobj.responseText);

    return "桥梁编码: " + g.attributes["sde.SDE.BridgeBaseData.qlbm"] + "</br>路线编码: " + g.attributes["sde.SDE.BridgeBaseData.LXBM"] + "</br>路线名称: " + g.attributes["sde.SDE.BridgeBaseData.LXMC"] + " </br>管养单位: " + g.attributes["sde.SDE.BridgeBaseData.DWMC"] + "</br>技术等级: " + result[0].TechRatingName + "</br>";
}

function showSelected() {
    var grid = $.fn.grid.getInstance();
    var selected = grid.getSelectedDataItems();
    if (selected.length == 1) {
        for (i = 0; i < featureLayer.graphics.length; i++) {
            if (featureLayer.graphics[i].attributes["sde.SDE.BridgeBaseData.qlbm"] == selected[0].Bridge_Code) {
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
                if (featureLayer.graphics[i].attributes["BridgBaseData.qlbm"] == selected[0].Bridge_Code) {
                    featureLayer.graphics[i].setSymbol(markerSymbol);
                    break;
                }
            }
        });
    }
}

function BridgeExtentChange(lod) {
    if (featureLayer != null)
        featureLayer.clear();

    featureLayer = new esri.layers.FeatureLayer(BaseDataMapURL + "/0", {
        mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
        infoTemplate: template,
        outFields: ["*"]
    });

    featureLayer.setDefinitionExpression("sde.SDE.BridgeBaseData.GRADE  <= '" + (lod.level + 1) + "'");


    featureLayer.setRenderer(renderer);
    map.addLayer(featureLayer);
    createHint(featureLayer, "", "sde.SDE.BridgeBaseData.FSMC");

    dojo.connect(featureLayer, "onClick", function (evt) {
        infowinFixscreen(evt);
    });
}