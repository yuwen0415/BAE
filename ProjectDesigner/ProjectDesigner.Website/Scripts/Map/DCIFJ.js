var params = new esri.layers.TileInfo({
    "dpi": 96,
    "format": "image/png",
    "compressionQuality": 0,
    "spatialReference": {
        "wkid": 4326
    },
    "rows": 256,
    "cols": 256,
    "origin": {
        "x": -180,
        "y": 90
    },

    // Scales in DPI 96
    "lods": [
                { "level": 0, "resolution": 0.010998662747495976, "scale": 4622333.6799999997 },
                { "level": 1, "resolution": 0.005499331373747988, "scale": 2311166.8399999999 },
                { "level": 2, "resolution": 0.002749665686873994, "scale": 1155583.4199999999 },
                { "level": 3, "resolution": 0.001374832843436997, "scale": 577791.70999999996 },
                { "level": 4, "resolution": 0.00068741640982119352, "scale": 288895.84999999998 },
                { "level": 5, "resolution": 0.00034370821680790179, "scale": 144447.92999999999 },
                { "level": 6, "resolution": 0.00017185409650664589, "scale": 72223.960000000006 },
                { "level": 7, "resolution": 8.5927048253322947e-005, "scale": 36111.980000000003 },
                { "level": 8, "resolution": 4.2963524126661473e-005, "scale": 18055.990000000002 },
                { "level": 9, "resolution": 2.1481773960635764e-005, "scale": 9028 },
                { "level": 10, "resolution": 1.0740886980317882e-005, "scale": 4514 },
	            { "level": 11, "resolution": 5.3704434901589409e-006, "scale": 2257 },
                { "level": 12, "resolution": 2.6852217450794705e-006, "scale": 1128.5 },
                { "level": 13, "resolution": 1.3426108725397352e-006, "scale": 564.25 }
            ]
});

var initialPoint = { "xmin": 114.211057, "ymin": 24.014221, "xmax": 121.195207, "ymax": 27.374313 };
var fullPoint = { "xmin": 110.609196135023, "ymin": 21.3320494007504, "xmax": 126.941286336858, "ymax": 30.5483606793433 };

function FJLayer() {
    var par;
    if (arguments.length > 0) {
        par = arguments[0];
    }
    else {
        par = params;
    }

    //福建 全 110.609196135023, 21.3320494007504, 126.941286336858, 30.5483606793433
    //福建 114.211057, 24.014221, 121.195207, 27.374313
    //福州 118.80299827893742, 25.83106286710106, 119.67258003736123, 26.271696785796443
    //厦门 117.77702924560307, 24.383707587276408,118.4386675654091, 24.93054735293662
    //莆田 118.55277871342439, 25.269099947920072,119.42648497030713, 25.713170948664562
    //三明 117.38863900560573, 26.159647922750125,117.82549214916855, 26.382027139024835
    //泉州 118.07846138819693, 24.672422497128284,118.95491731071895, 25.11374383223349
    //漳州 117.4432885948033, 24.421859199556227,117.8784231972821, 24.64045762544605
    //南平 117.75039188981674, 26.386495327688053,118.6247855631093, 26.82300474792451
    //龙岩 116.46732915387797, 24.880022245018257,117.34275395179716, 25.32065616371364
    //宁德 119.11302309252073, 26.46348597788985,119.99016643145258, 26.903432480175415

    dojo.declare("jtt.FJWmtsLayer", esri.layers.TiledMapServiceLayer, {
        constructor: function () {
            this.spatialReference = new esri.SpatialReference(par.spatialReference);
            this.initialExtent = new esri.geometry.Extent(initialPoint.xmin, initialPoint.ymin, initialPoint.xmax, initialPoint.ymax, this.spatialReference);
            this.fullExtent = new esri.geometry.Extent(fullPoint.xmin, fullPoint.ymin, fullPoint.xmax, fullPoint.ymax, this.spatialReference);
            this.tileInfo = par;
            this.loaded = true;
            this.onLoad(this);
        },

        getTileUrl: function (level, row, col) {
            return encodeURI("http://218.85.65.28:8820/serviceaccess/wmts/FJMap?service=WMTS&request=GetTile&layer=0&style=_null&tileMatrixSet=sss" +
                "&tileMatrix=" + level +
                "&tileRow=" + row +
                "&tileCol=" + col +
                "&format=image/png&userName=test&password=test");
        }
    });
}