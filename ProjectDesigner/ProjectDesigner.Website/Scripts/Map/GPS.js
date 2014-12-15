function init() {
    if (map.loaded)
        mapLoaded();
    else
        dojo.connect(map, "onLoad", mapLoaded);
}

function mapLoaded() {
    map.infoWindow.resize(250, 140);
    $("#layerList").hide();
    CreateGPSPoints();
}
dojo.addOnLoad(init);

function CreateGPSPoints() {
    dojo.connect(map.graphics, "onMouseOver", function (evt) {
        map.setMapCursor("pointer");
    });

    dojo.connect(map.graphics, "onMouseOut", function (evt) {
        map.setMapCursor("default");
    });

    if (map.graphics.graphics.length > 0)
        map.graphics.clear();

    var symbol;

    var form = $('form');
    var action = form.attr('action');
    var htmlobj = $.ajax({ url: action, type: "POST", data: { "__Method": "GetGPSPoint" }, async: false });
    var result = eval(htmlobj.responseText);

    for (var i = 0; i < result.length; i++) {
        symbol = new esri.symbol.PictureMarkerSymbol({
            "url": "../images/GPS/car_s.png",
            "height": 8,
            "width": 14,
            "type": "esriPMS",
            "angle": parseInt(result[i].Direction)
        });

        var pt = new esri.geometry.Point(result[i].Longitude, result[i].Latitude, map.spatialReference);

        var attr = {
            "ID": result[i].ID,
            "X": result[i].Longitude,
            "Y": result[i].Latitude,
            "Device_Code": result[i].Code,
            "ReceiveTime": formatDate(result[i].ReceiveTime),
            "Remark": result[i].Remark,
            "Speed": result[i].Speed
        };

        var infoTemplate = new esri.InfoTemplate("${Device_Code}", "数据时间：${ReceiveTime}<br/>车速：${Speed} km/h<br/><a href='#' onclick='showGPSLocus(\"${Device_Code}\");'>轨迹查看</a>");
        var graphic = null;

        graphic = new esri.Graphic(pt, symbol, attr, infoTemplate);

        map.graphics.add(graphic);
    }
}

function showGPSLocus(devicecode) {
    $(document).win({ url: 'GPSLocus.aspx', width: 1020, height: 550, data: { dc: devicecode} }).show();
}

function showSelected() {
    var grid = $.fn.grid.getInstance();
    var selected = grid.getSelected();
    if (selected != undefined && selected.length > 1) {
        selected.each(function () {
            var id = $(this).attr('data-itemid');
            var markerSymbol = new esri.symbol.PictureMarkerSymbol('../images/GPS/car_s.png', 8, 14);
            for (i = 0; i < map.graphics.graphics.length; i++) {
                if (map.graphics.graphics[i].attributes["ID"] == id) {
                    map.graphics.graphics[i].setSymbol(markerSymbol);
                    break;
                }
            }
        });
    }
    else {
        if (selected != undefined) {
            for (i = 0; i < map.graphics.graphics.length; i++) {
                if (map.graphics.graphics[i].attributes["ID"] == selected.attr('data-itemid')) {
                    map.infoWindow.setContent(map.graphics.graphics[i].getContent());
                    map.infoWindow.setTitle(map.graphics.graphics[i].getTitle());
                    map.centerAt(map.graphics.graphics[i].geometry);
                    map.infoWindow.show(map.graphics.graphics[i].geometry, esri.dijit.InfoWindow.ANCHOR_UPPERRIGHT);
                    break;
                }
            }
        }
    }
}