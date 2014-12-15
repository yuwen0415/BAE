/// <reference path="../jquery-1.7.min.js" />

var syb = new esri.symbol.PictureMarkerSymbol('../images/Map/zhd.gif', 16, 16);

$(function () {
    $('body').addClass('claro');
    esri.config.defaults.map.height = ($(document).height() - 135);
    esri.config.defaults.map.width = ($(document).width() - 20);

    $('#btnAutoMark').click(function (e) {
        searchPointLocation();
    });
    $('#btnMark').click(function (e) {
        map.graphics.clear();
        map.infoWindow.hide();
        dojo.disconnect(handleonDrawEnd);
        dojo.connect(toolbar, "onDrawEnd", function (g) {
            $('#hidX').val(g.x);
            $('#hidY').val(g.y);
            var graphic = new esri.Graphic(g, syb);
            map.graphics.add(graphic);
        });
        toolbar.activate(esri.toolbars.Draw.POINT);
    });
});

function initMap() {
    if (map.loaded) {
        showOldMark();
    }
    else
        dojo.connect(map, "onLoad", showOldMark);
}

function searchPointLocation() {
    var routeCode = getRouteCode();
    var measure = getStake();

    if (routeCode == "") {
        alert("路线不能为空。");
        return;
    }

    if (measure == 0) {
        alert("桩号不能为空。");
        return;
    }
    var params = { f: "json",
        routeIDFieldName: "Route_Code",
        routeID: routeCode.toUpperCase(),
        measure: measure
    }

    esri.request({
        url: DSPointLocationURL,
        content: params,
        callbackParamName: "callback",
        load: function (result) {
            if (result.hasError) {
                alert("无法定位相关地点，请检查桩号是否正确。");
            }
            else {
                map.graphics.clear();
                var pt = new esri.geometry.Point(result.geometries.points[0], new esri.SpatialReference({ wkid: 32650 }));
                projectToLL(4326, pt, showStakePoint);
            }
        },
        error: function (error) {
            alert("请输入正确的桩号或路线。");
        }
    });
}

function showStakePoint(g) {
    $('#hidX').val(g.x);
    $('#hidY').val(g.y);

    //var graphic = new esri.Graphic(g, syb, null, new esri.InfoTemplate(getStakeTitle, getStakeContent));
    var graphic = new esri.Graphic(g, syb, null, null);
    map.graphics.add(graphic);
    zoomTo(graphic);
//    map.infoWindow.resize(200, 60);
//    map.infoWindow.setContent(graphic.getContent());
//    map.infoWindow.setTitle(graphic.getTitle());
//    map.infoWindow.show(g);
}

//function getStakeTitle() {
//    return "路线: " + $('#txtRoute_Code').val().toUpperCase() + " <br />桩号: " + $('#txtStartStakeKM').val() + "K" + "+" + $('#txtStartStakeM').val() + "M";
//}

//function getStakeContent() {
//    map.infoWindow.resize(200, 60);
//    return null;
//}

function showOldMark() {
    map.graphics.clear();
    map.resize();
    if ($('#hidX').val() != "" && parseInt($('#hidX').val()) != '0') {
        var point = new esri.geometry.Point({ "x": $('#hidX').val(), "y": $('#hidY').val(), "spatialReference": { "wkid": map.spatialReference} });
        var graphic = new esri.Graphic(point, syb, '', null);
        map.graphics.add(graphic);
        //zoomTo(graphic);
//        map.infoWindow.resize(200, 60);
//        map.infoWindow.setContent(graphic.getContent());
//        map.infoWindow.setTitle(graphic.getTitle());
//        map.infoWindow.show(point);
    }
}
