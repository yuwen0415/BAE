/*WMS图层参数*/
var standardParams = {
    version: "1.1.1",
    request: "GetMap",
    service: "WMS",
    srs: "EPSG:4326",
    bbox: "-180,-90,180,90",
    styles: "default",
    format: "image/png",
    width: "400",
    height: "300",
    transparent: true,
    exceptions: "application/vnd.ogc.se_xml",
    spatialReference: {
        "wkid": 4326
    }
};

var initialPoint = { "xmin": 114.211057, "ymin": 24.014221, "xmax": 121.195207, "ymax": 27.374313 };
var fullPoint = { "xmin": 110.609196135023, "ymin": 21.3320494007504, "xmax": 126.941286336858, "ymax": 30.5483606793433 };

function WMSLayer(url, layerParams) {
    if (!layerParams)
        layerParams = standardParams;

    dojo.require("esri.map");

    dojo.declare("ogc.WMSLayer", esri.layers.DynamicMapServiceLayer, {
        constructor: function () {
            this.spatialReference = new esri.SpatialReference(layerParams.spatialReference);
            this.initialExtent = new esri.geometry.Extent(initialPoint.xmin, initialPoint.ymin, initialPoint.xmax, initialPoint.ymax, this.spatialReference);
            this.fullExtent = new esri.geometry.Extent(fullPoint.xmin, fullPoint.ymin, fullPoint.xmax, fullPoint.ymax, this.spatialReference);
            this.loaded = true;
            this.onLoad(this);
        },

        getImageUrl: function (extent, width, height, callback) {

            var lParams = layerParams;
            lParams.bbox = extent.xmin + "," + extent.ymin + "," + extent.xmax + "," + extent.ymax;
            lParams.width = width;
            lParams.height = height;
            lParams.serviceName = "";
            callback(encodeURI(url) + "&" + dojo.objectToQuery(lParams));
        }
    });
};

var InfoParams = {
    version: "1.1.1",
    request: "GetFeatureInfo",
    srs: "EPSG:4326",
    bbox: "-180,-90,180,90",
    layers: 0,
    query_layers: 0,
    styles: "",
    format: "image/png",
    width: "400",
    height: "400",
    exceptions: "application/vnd.ogc.se_xml",
    name: "test",
    id: "test",
    x: 0,
    y: 0
};

function getFeaInfo(url, Params, callback) {
    var par = Params ? Params : InfoParams;
    callback(encodeURI(url) + dojo.objectToQuery(par));
}