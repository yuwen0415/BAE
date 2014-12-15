var completeFlag = true;

$(function () {
    var grid = $.fn.grid.getInstance();
    grid.select(function () {
        var data = grid.getSelectedDataItems();
        SetCase(data);
    });
})

function SetCase(data) { 
    
}

function init() {
    $("#hidPageIndex").val(1);
    completeFlag = true;

    dojo.connect(map.graphics, "onClick", function (evt) {
        infowinFixscreen(evt);
    });

    GetCases();
}

function GetCases() {
    $.fn.ajaxPost({ method: 'GetCasesForMap',
        params: {
            "ID": $("#txtCaseID").val(), 
            "PI": $("#hidPageIndex").val(),
            "PS": $("#hidPageSize").val()
        },
        callback: function (data) {
            if (data.TotalHits > 0)
                CreateCases(data.Items);
        }
    });
}

function CreateCases(castlist) {
    if (completeFlag)
        map.graphics.clear();

    for (var i in castlist) {
        if (castlist[i].X > 0) {
            var pt = new esri.geometry.Point(castlist[i].X, castlist[i].Y, map.spatialReference);
            var symbol = symbol = new esri.symbol.PictureMarkerSymbol({
                "url": "../images/Map/应急.png", //应急.png
                "height": 15,
                "width": 15,
                "type": "esriPMS"
            });

            var attr = {
                "Assistants": castlist[i].Assistants,
                "CaseAddress": castlist[i].CaseAddress,
                "CaseCause_Name": castlist[i].CaseCause_Name,
                "CaseTime": castlist[i].CaseTime,
                "Charger_Name": castlist[i].Charger_Name,
                "Cname": castlist[i].Cname,
                "ID": castlist[i].ID,
                "IllegalCategory_Name": castlist[i].IllegalCategory_Name,
                "LicenseNO": castlist[i].LicenseNO,
                "StatusFlag": castlist[i].StatusFlag
            };

            var infoTemplate = new esri.InfoTemplate(getCaseTitle, getCaseContent);

            var graphic = new esri.Graphic(pt, symbol, attr, infoTemplate);
            map.graphics.add(graphic);
        }
    }
    if (castlist.length < $("#hidPageSize").val()) {
        $("#hidPageIndex").val(1);
        completeFlag = true;
    }
    else {
        completeFlag = false;
        $("#hidPageIndex").val(parseInt($("#hidPageIndex").val()) + 1);
        GetCases();
    }
    
}

function getCaseTitle(g) {
    return "案件编号: " + g.attributes["ID"];
}

function getCaseContent(g) {
    map.infoWindow.resize(280, 280);
    var Ass = "";
    if (nullEmpty(g.attributes["Assistants"]) != "")
        Ass = nullEmpty(g.attributes["Assistants"]).split(';').length > 0 ? nullEmpty(g.attributes["Assistants"]).split(':')[1] : "";
    return "发案时间：" + nullEmpty(g.attributes["CaseTime"]) +
            "<br />发案地点：" + nullEmpty(g.attributes["CaseAddress"]) +
            "<br />违法案由：" + nullEmpty(g.attributes["CaseCause_Name"]) +
            "<br />违法类型：" + nullEmpty(g.attributes["IllegalCategory_Name"]) +
            "<br />姓名：" + nullEmpty(g.attributes["Cname"]) +
            "<br />车牌号：" + nullEmpty(g.attributes["LicenseNO"]) +
            "<br />主办人：" + nullEmpty(g.attributes["Charger_Name"]) +
            "<br />协办人：" + nullEmpty(Ass) +
            "<br />";
}