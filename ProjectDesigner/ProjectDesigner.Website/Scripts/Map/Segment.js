var featureLayer = null;
var queryTask = new esri.tasks.QueryTask(BaseDataMapURL + "/2");
var query = new esri.tasks.Query();
var sid = "";
var segmentLayer = new esri.layers.GraphicsLayer();

function init() {
    if (map.loaded)
        mapLoaded();
    else
        dojo.connect(map, "onLoad", mapLoaded);
}

function mapLoaded() {
    dojo.connect(map, "onLoad", mapLoaded);
    featureLayer = new esri.layers.FeatureLayer(BaseDataMapURL + "/2", {
        mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
        infoTemplate: null,
        outFields: ["*"]
    });

    //map.addLayer(featureLayer);
}

function mapLoaded() {
    map.addLayer(segmentLayer);

    dojo.connect(segmentLayer, "onClick", function (evt) {
        infowinFixscreen(evt, 300, 280);
    });
}
dojo.addOnLoad(init);

function showSelected() {
    segmentLayer.clear();
    var grid = $.fn.grid.getInstance();
    var selected = grid.getSelectedDataItems();

    if (selected.length > 0) {
        for (i = 0; i < selected.length; i++) {
            //sid = selected[i].ID;
            doQueryByCode(selected[i].Code);
        }
    }
}

function doQueryByCode(code) {
    query.returnGeometry = true;
    query.outFields = ["ROUTE_CODE", "SHORTNAME", "MUNITNAME", "CODE"];
    query.outSpatialReference = { "wkid": map.spatialReference };
    query.where = "ROUTE_CODE LIKE '%" + code + "%'or CODE LIKE '%" + code + "%' or SHORTNAME LIKE '%" + code + "%'";
    dojo.connect(queryTask, "onComplete", doQueryResult);
    queryTask.execute(query);
}

function doQueryResult(fset) {
    if (fset.features.length == 0) {
        alert("未找到该路线(段)，请联系管理员。");
        return;
    }
    var s = new esri.symbol.SimpleLineSymbol(
          esri.symbol.SimpleLineSymbol.STYLE_SOLID,
          new dojo.Color([0, 0, 255, 0.65]), 5
        );

    var infoTemplate = new esri.InfoTemplate(getSegTitle, getSegContent);

    var resultFeatures = fset.features;
    for (var i = 0, il = resultFeatures.length; i < il; i++) {
        var graphic = resultFeatures[i];
        graphic.setSymbol(s);
        graphic.setInfoTemplate(infoTemplate);
        segmentLayer.add(graphic);
    }

    zoomTo(resultFeatures[0]);
}

function getSegTitle(g) {
    return "路段编号: " + g.attributes["CODE"];
}

function getSegContent(g) {
    var form = $('form');
    var action = form.attr('action');
    var htmlobj = $.ajax({ url: action, type: "POST", data: { "__Method": "GetSegmentInfo", "sid": sid, "code": g.attributes["CODE"] }, async: false });
    var result = jQuery.parseJSON(htmlobj.responseText);

    map.infoWindow.resize(220, 200);
    return "路段名称：" + result.CName + "<br />起点桩号：" + result.StartPost + "<br />止点桩号：" + result.EndPost + "<br />管养单位：" + result.ManageUnit_Name + "<br />电话：" + nullEmpty(result.ManageUnit_Tel) + "<br />";
}