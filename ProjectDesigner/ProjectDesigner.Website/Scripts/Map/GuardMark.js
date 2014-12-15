/// <reference path="../sparrow.js" />

$(function () {
    $('body').addClass('claro');
    var grid = $.fn.grid.getInstance('Incident');
    grid.select(function () {
        var data = [];
        $.each($('#Incident tbody tr.selected'), function (index, item) {
            data.push(eval('(' + $(item).find('input[type=hidden]').val() + ')'));
        });
        SetIncident(data);
    });
});

function init() {
    if (map.loaded)
        mapLoaded();
    else
        dojo.connect(map, "onLoad", mapLoaded);
}

function mapLoaded() {
    scalebar.hide();
    CreateIncident();
    map.infoWindow.resize(250, 180);
    dojo.connect(map.graphics, "onMouseOver", function (evt) {
        map.setMapCursor("pointer");
    });

    dojo.connect(map.graphics, "onMouseOut", function (evt) {
        map.setMapCursor("default");
    });
}
dojo.addOnLoad(init);


function CreateIncident(ID) {
    var form = $('form');
    var action = form.attr('action');
    var htmlobj = $.ajax({ url: action, type: "POST", data: { "__Method": "GetIncidentPoint", "ID": ID }, async: false });
    var result = eval(htmlobj.responseText);

    SetIncident(result);

}
function SetIncident(result) {
    if (map.graphics.graphics.length > 0)
        map.graphics.clear();

    var symbol;
    var categoryname;

    for (var i = 0; i < result.length; i++) {
        var pt = new esri.geometry.Point(result[i].X, result[i].Y, map.spatialReference);
        var imgtext = result[i].StatusFlag > 2 ? "灰" : "";
        if (result[i].IsEmergency == true) {
            symbol = new esri.symbol.PictureMarkerSymbol({
                "url": "../images/Map/应急" + imgtext + ".png", //应急.png
                "height": 15,
                "width": 15,
                "type": "esriPMS"
            });
        }
        else
            if (result[i].IsBlock == true) {
                symbol = new esri.symbol.PictureMarkerSymbol({
                    "url": "../images/Map/阻断" + imgtext + ".png", //阻断.png
                    "height": 15,
                    "width": 15,
                    "type": "esriPMS"
                });
            }
            else {

                if (result[i].IsDailyCuring == true) {
                    symbol = new esri.symbol.PictureMarkerSymbol({
                        "url": "../images/Map/日常养护" + imgtext + ".png", //日常养护事件.png
                        "height": 15,
                        "width": 15,
                        "type": "esriPMS"
                    });
                }
                else {
                    symbol = new esri.symbol.PictureMarkerSymbol({
                        "url": "../images/Map/日常事件" + imgtext + ".png", //日常事件.png
                        "height": 15,
                        "width": 15,
                        "type": "esriPMS"
                    });
                }
            }

        var attr = { "X": result[i].X, "Y": result[i].Y, "FindTime": formatDate(result[i].FindTime), "Place": result[i].Place, 'Category_Name': result[i].IncidentCategory, 'ResponseLevel_Name': result[i].ResponseLevel_Name, 'StatusFlag': result[i].StatusFlag == "0" ? "未处理" : result[i].StatusFlag == "1" ? "处理中" : result[i].StatusFlag == "2" ? "已处理" : result[i].StatusFlag == "3" ? "已转移" : "已完结" };
        var infoTemplate1 = new esri.InfoTemplate("事件", "事件类型：${Category_Name} </br>应急响应级别：${ResponseLevel_Name} </br>发现(报告)时间: ${FindTime} <br/>发生地点: ${Place} <br/>状态: ${StatusFlag} <br/>");

        var graphic = new esri.Graphic(pt, symbol, attr, infoTemplate1);

        map.graphics.add(graphic);
    }
}