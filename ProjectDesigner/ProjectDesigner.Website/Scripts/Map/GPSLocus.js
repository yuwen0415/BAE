/// <reference path="../jquery-1.7.min.js" />
/// <reference path="PJMap.js" />

var ptGraphics = new esri.layers.GraphicsLayer();
var ptdataGraphics = new esri.layers.GraphicsLayer();
var lineGraphics = new esri.layers.GraphicsLayer();
var simpleMarkerSymbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 11, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 0, 255]), 1), new dojo.Color([255, 0, 0, 0.75]));
var dataSymbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 11, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 0, 255]), 1), new dojo.Color([0, 0, 255, 0.75]));
var polylineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0, 0.5]), 3);

var pl = null, gpsPoint = null;
var i = -1;
var arrTrace = new Array();
var playFlag = false, pauseFlag = false;
var completeFlag = true;

function init() {
    if (map.loaded)
        mapLoaded();
    else
        dojo.connect(map, "onLoad", mapLoaded);

    $.fn.grid.getInstance().select(function () {
        ptdataGraphics.clear();
        var d = $.fn.grid.getInstance().getSelectedDataItems();
        var pt = new esri.geometry.Point(d[0].X, d[0].Y, map.spatialReference);
        var gpt = new esri.Graphic(pt, dataSymbol);
        ptdataGraphics.add(gpt);
    });
}

function mapLoaded() {
    scalebar.hide();
    overviewMapDijit.destroy();

    pl = new esri.geometry.Polyline(map.spatialReference);

    dojo.connect(window, "onresize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () { $("#map").height($(document).height() - 160); map.resize(); map.reposition(); }, 500);
    });

    map.addLayer(lineGraphics);
    map.addLayer(ptGraphics);
    map.addLayer(ptdataGraphics);
}
dojo.addOnLoad(init);

function searchGpsData() {
    if (completeFlag) {
        completeFlag = false;
        traceClear();
        arrTrace.length = 0;
        $("#hidPageIndex").val(1);
        $("#btnPlay").val("播放");
        getGpsData();
    }
    else
        alert("数据未加载完成，请稍后再试。");
}

function getGpsData() {
    $.fn.ajaxPost({
        method: 'GetGPSData',
        params: {
            'dcode': $("#txtDeviceCode").val(),
            "st": $("#txtStartTime").val(),
            "et": $("#txtEndTime").val(),
            "PI": $("#hidPageIndex").val(),
            "PS": $("#hidPageSize").val()
        },
        callback: function (data) {
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    var pt = new esri.geometry.Point(data[i].Longitude, data[i].Latitude, map.spatialReference);
                    arrTrace.push(pt);
                }

                if ($("#hidPageIndex").val() == 1) {
                    gpsPoint = new esri.Graphic(arrTrace[0], simpleMarkerSymbol);
                    ptGraphics.add(gpsPoint);
                    showLoading();
                }

                if (data.length < $("#hidPageSize").val()) {
                    $("#hidPageIndex").val(1);
                    hideLoading();
                    zoomTo(gpsPoint);
                    completeFlag = true;
                }
                else {
                    $("#hidPageIndex").val(parseInt($("#hidPageIndex").val()) + 1);
                    getGpsData();
                }
            }
            else {
                completeFlag = true;
                alert("查无数据。");
            }
        }
    });
}


function viewTrace() {
    if (playFlag && pauseFlag) {
        i = i + 1
        if (i == arrTrace.length) {
            i = -1;
            playFlag = false;
            pauseFlag = false;
            $("#btnPlay").val("重播");
            return;
        }

        if (i >= 0) {
            ptGraphics.remove(gpsPoint);
        }

        lineGraphics.clear();
        pl.addPath([arrTrace[i <= 0 ? 0 : i - 1], arrTrace[i]]);
        lineGraphics.add(new esri.Graphic(pl, polylineSymbol));

        gpsPoint = new esri.Graphic(arrTrace[i], simpleMarkerSymbol);
        ptGraphics.add(gpsPoint);
        setTimeout("viewTrace()", 300)
    } else {
        return;
    }
}

function playTrace() {
    if (pauseFlag) {
        $("#btnPlay").val("播放");
        playFlag = true;
        pauseFlag = false;
    }
    else {
        if (!playFlag) {
            traceClear();
        }

        $("#btnPlay").val("暂停");
        pauseFlag = true;
        playFlag = true;
        viewTrace();
    }
}

function stopTrace() {
    $("#btnPlay").val("播放");
    traceClear();
}

function traceClear() {
    i = -1;
    playFlag = false;
    pauseFlag = false;
    ptGraphics.clear();
    lineGraphics.clear();
    ptdataGraphics.clear();
    pl = new esri.geometry.Polyline(map.spatialReference);
}