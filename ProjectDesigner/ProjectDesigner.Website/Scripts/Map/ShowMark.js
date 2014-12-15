dojo.require("esri.map");
dojo.require("esri.tasks.find");
dojo.require("esri.tasks.geometry");
dojo.require("esri.layers.FeatureLayer");
dojo.require("esri.toolbars.draw");
dojo.require("esri.toolbars.navigation");
dojo.require("dijit.Toolbar");

var map=null;
var toolbar, navToolbar;
var loading;
var resizeTimer;
var baseMap, findTask, findParams;

var params = new esri.layers.TileInfo({
    "dpi": "96",
    "format": "image/png",
    "compressionQuality": 0,
    "spatialReference": {
        "wkid": "4326"
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
	            { "level": 11, "resolution": 5.3704434901589409e-006, "scale": 2257 }
            ]
});

function getInitExtent() {
    var e = $.cookie("hnempInitExtent").split('&');
    var xmin = 114.211057, ymin = 24.014221, xmax = 121.195207, ymax = 27.374313;
    for (var i = 0, len = e.length; i < len; i++) {
        var item = e[i].split("=");
        if (item[0] == "xmin") {
            xmin = item[1];
        }
        if (item[0] == "ymin") {
            ymin = item[1];
        }
        if (item[0] == "xmax") {
            xmax = item[1];
        }
        if (item[0] == "ymax") {
            ymax = item[1];
        }
    }

    initialPoint = { "xmin": parseFloat(xmin), "ymin": parseFloat(ymin), "xmax": parseFloat(xmax), "ymax": parseFloat(ymax) };
}

function init() {
    getInitExtent();
    FJLayer(params);
    map = new esri.Map("map", { logo: false, slider: false });

    toolbar = new esri.toolbars.Draw(map);
    navToolbar = new esri.toolbars.Navigation(map);

    dojo.connect(map, "onLoad", mapLoaded);

//    baseMap = new jtt.FJWmtsLayer();
//    map.addLayer(baseMap);

    if (connWeb) {
        baseMap = new jtt.FJWmtsLayer();
        map.addLayer(baseMap);
    }
    else {
        baseMap = new esri.layers.ArcGISTiledMapServiceLayer(FjMapURL);
        map.addLayer(baseMap);

        var spatialRef = new esri.SpatialReference({ wkid: 4326 });
        var startExtent = new esri.geometry.Extent();
        startExtent.xmin = initialPoint.xmin;
        startExtent.ymin = initialPoint.ymin;
        startExtent.xmax = initialPoint.xmax;
        startExtent.ymax = initialPoint.ymax;
        startExtent.spatialReference = spatialRef;
        map.setExtent(startExtent);
    }

    if (map.loaded) {
        showOldMark();
    }
    else {
        dojo.connect(map, "onLoad", showOldMark);
    }

    dojo.connect(window, "onresize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () { map.resize(); map.reposition(); }, 500);
    });
}

function mapLoaded() {
    dojo.connect(dijit.byId('map'), 'resize', map, map.resize);
}

function showLoading() {
    loading.show();
}

function hideLoading(error) {
    loading.hide();
}

dojo.addOnLoad(init);

//定位
function zoomTo(graphic) {
    switch (graphic.geometry.type) {
        case "point":
            var scrPoint = esri.geometry.toScreenPoint(map.extent, map.width, map.height, graphic.geometry);
            map.setExtent(new esri.geometry.Extent(graphic.geometry.x - 0.05, graphic.geometry.y - 0.05, graphic.geometry.x + 0.05, graphic.geometry.y + 0.05));
            break;
        case "polyline":
            map.setExtent(graphic.geometry.getExtent());
            break;
        case "polygon":
            map.setExtent(graphic.geometry.getExtent());
            break;
    }
}

function showOldMark() {
    if ($('#x').val() != "" && parseFloat($('#x').val()) != '0.000') {
        map.graphics.clear();
        var markerSymbol = new esri.symbol.PictureMarkerSymbol('../images/Map/mark.png', 23, 25);
        var point = new esri.Graphic(new esri.geometry.Point({ "x": $('#x').val(), "y": $('#y').val(), " spatialReference": { " wkid": map.spatialReference} }), markerSymbol, '', null);
        map.graphics.add(point);
        var Offset = 0.05;
        map.setExtent(new esri.geometry.Extent(parseFloat($('#x').val()) - Offset, parseFloat($('#y').val()) - Offset, parseFloat($('#x').val()) + Offset, parseFloat($('#y').val()) + Offset));
    }
}