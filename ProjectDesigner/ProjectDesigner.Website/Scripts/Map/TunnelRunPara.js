var featureLayer = null;

function init() {
    if (map.loaded)
        mapLoaded();
    else
        dojo.connect(map, "onLoad", mapLoaded);
}

function mapLoaded() {
    var defaultSymbol = new esri.symbol.PictureMarkerSymbol('../images/map/隧道正常.png', 22, 13);
    var renderer1 = new esri.renderer.UniqueValueRenderer(defaultSymbol, "RunStatus_Code");
    renderer1.addValue("0", new esri.symbol.PictureMarkerSymbol('../images/map/隧道正常.png', 22, 13));
    renderer1.addValue("1", new esri.symbol.PictureMarkerSymbol('../images/map/隧道正常.png', 22, 13));
    renderer1.addValue("2", new esri.symbol.PictureMarkerSymbol('../images/map/隧道不正常.png', 22, 13));


    //消息框图层，初始化  
    var template = new esri.InfoTemplate();
    template.setTitle("<b>${sde.SDE.TunnelBaseData.FSMC}</b>");
    template.setContent("隧道编码: ${sde.SDE.TunnelBaseData.sdbm} </br>路线编码: ${sde.SDE.TunnelBaseData.LXBM} </br>路线名称: ${sde.SDE.TunnelBaseData.LXMC} </br>管养单位: ${sde.SDE.TunnelBaseData.DWMC} </br>隧道状态: 结构稳定</br>");

    featureLayer = new esri.layers.FeatureLayer(BaseDataMapURL + "/1", {
        mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
        infoTemplate: template,
        outFields: ["*"]
    });
    map.infoWindow.resize(200, 180);
    featureLayer.setRenderer(renderer1);
    map.addLayer(featureLayer);
    createHint(featureLayer, "", "sde.SDE.TunnelBaseData.FSMC");

    dojo.connect(featureLayer, "onClick", function (evt) {
        infowinFixscreen(evt);
    });
}

dojo.addOnLoad(init);

//视频
function getTextContent(graphic) {
    //    var form = $('form');
    //    var action = form.attr('action');
    //    var htmlobj = $.ajax({ url: action, type: "POST", data: { "__Method": "GetCamAddress", "camid": graphic.attributes.ID }, async: false });
}

function showSelected() {
    var grid = $.fn.grid.getInstance();
    var selected = grid.getSelectedDataItems();
    if (selected.length == 1) {
        for (i = 0; i < featureLayer.graphics.length; i++) {
            if (featureLayer.graphics[i].attributes["sde.SDE.TunnelBaseData.sdbm"] == selected[0].Tunnel_Code) {
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
                if (featureLayer.graphics[i].attributes["sde.SDE.TunnelBaseData.sdbm"] == s.Tunnel_Code) {
                    featureLayer.graphics[i].setSymbol(markerSymbol);
                    break;
                }
            }
        });
    }
}