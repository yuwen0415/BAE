function init() {
    var featureLayer = new esri.layers.ArcGISDynamicMapServiceLayer("http://61.154.9.71:8060/ArcGIS/rest/services/lw-yjd/MapServer");
    map.addLayer(featureLayer);
}

dojo.addOnLoad(init);