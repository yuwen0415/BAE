/// <reference path="../sparrow.js" />
var IncidentLayer = null;

function init() {
    if (map.loaded)
        mapLoaded();
    else
        dojo.connect(map, "onLoad", mapLoaded);
}

function mapLoaded() {
    IncidentLayer = new esri.layers.GraphicsLayer();

    dojo.connect(IncidentLayer, "onClick", function (evt) {
        infowinFixscreen(evt);
    });
    map.infoWindow.resize(250, 220);
    CreateIncident();
}

dojo.addOnLoad(init);


function CreateIncident() {
    dojo.connect(IncidentLayer, "onMouseOver", function (evt) {
        map.setMapCursor("pointer");
    });

    dojo.connect(IncidentLayer, "onMouseOut", function (evt) {
        map.setMapCursor("default");
    });

    var form = $('form');
    var action = form.attr('action');
    var htmlobj = $.ajax({ url: action, type: "POST", data: { "__Method": "GetIncidentPoint" }, async: false });
    var result = eval(htmlobj.responseText);

    var symbol;


    for (var i = 0; i < result.length; i++) {
        var pt = new esri.geometry.Point(result[i].X, result[i].Y, map.spatialReference);
        var imgtext = result[i].StatusFlag == 2 ? "灰" : "";
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
  

        var attr = {
            "ID": result[i].ID,
            "X": result[i].X,
            "Y": result[i].Y,
            "FindTime": formatDate(result[i].FindTime),
            "Place": result[i].Place,
            "Category_Name": result[i].Category_Name,
            "BlockIncidentCategory_Name": result[i].BlockIncidentCategory_Name,
            "IncidentLevel_Name": result[i].IncidentLevel_Name,
            "StatusFlag": result[i].StatusFlag == "0" ? "未处理" : result[i].StatusFlag == "1" ? "处理中" : result[i].StatusFlag == "2" ? "已处理" : result[i].StatusFlag == "3" ? "已转移" : "已完结",
            "Road": result[i].RouteName + result[i].Route_Code,
            "EstResumeTime": formatDate(result[i].EstResumeTime),
            "ActResumeTime": formatDate(result[i].ActResumeTime),
            "FieldDescription": result[i].FieldDescription,
            "IsBlock":result[i].IsBlock
        };
        var infoTemplate1 = new esri.InfoTemplate("${BlockIncidentCategory_Name}(ID:<a href='#' onclick=\"WinTitleClick('${ID}')\">${ID}</a>)", "${Road} </br>发生时间: ${FindTime} <br/>预计恢复通车时间: ${EstResumeTime} <br/>实际恢复通车时间: ${ActResumeTime} <br/>现场情况描述: ${FieldDescription} <br/>状态: ${StatusFlag} <br/>");
        var infoTemplate2 = new esri.InfoTemplate("${Category_Name}(ID:<a href='#' onclick=\"WinTitleClick('${ID}')\">${ID}</a>)", "${Road} </br>发生时间: ${FindTime} <br/>现场情况描述: ${FieldDescription} <br/>状态: ${StatusFlag} <br/>");
        var infoTemplate3 = new esri.InfoTemplate("${Category_Name}(ID:<a href='#' onclick=\"WinTitleClick('${ID}')\">${ID}</a>)", "${Road} </br>发生时间: ${FindTime} <br/>现场情况描述: ${FieldDescription} <br/>状态: ${StatusFlag} <br/>");
        var graphic = null;
        if (result[i].IsBlock)
            graphic = new esri.Graphic(pt, symbol, attr, infoTemplate1);
        else
            graphic = new esri.Graphic(pt, symbol, attr, infoTemplate2);

        IncidentLayer.add(graphic);
    }
    map.addLayer(IncidentLayer);
}

function showSelected() {
    var grid = $.fn.grid.getInstance();
    var selected = grid.getSelected();
    if (selected != undefined && selected.length > 1) {
        selected.each(function () {
            var id = $(this).attr('data-itemid');
            var markerSymbol = new esri.symbol.PictureMarkerSymbol('../images/Map/mark.png', 23, 25);
            for (i = 0; i < IncidentLayer.graphics.length; i++) {
                if (IncidentLayer.graphics[i].attributes.ID == id) {
                    IncidentLayer.graphics[i].setSymbol(markerSymbol);
                    break;
                }
            }
        });
    }
    else {
        if (selected != undefined) {
            for (i = 0; i < IncidentLayer.graphics.length; i++) {
                if (IncidentLayer.graphics[i].attributes.ID == selected.attr('data-itemid')) {
                    map.infoWindow.setContent(IncidentLayer.graphics[i].getContent());
                    map.infoWindow.setTitle(IncidentLayer.graphics[i].getTitle());
                    map.centerAt(IncidentLayer.graphics[i].geometry);
                    map.infoWindow.show(IncidentLayer.graphics[i].geometry, esri.dijit.InfoWindow.ANCHOR_UPPERRIGHT);
                    break;
                }
            }
        }
    }
}

function WinTitleClick(id) {
    var data = {};
    data.id = id;
    data.type = 'edit';

    $(this).win({ url: "/Guard/IncidentEdit.aspx",
        data: data,
        height: 600,
        width: 1028
    }).show();
}