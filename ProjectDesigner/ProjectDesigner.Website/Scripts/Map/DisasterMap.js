/// <reference path="../jquery-1.7.min.js" />
/// <reference path="PJMap.js" />


var data = [
    { "id": "01", "x": 119.050662, "y": 25.898615, "date": "2012-5-30 16:11:00", "manager": "福州市永泰县交通局", "road": "Y050", "stake": "10K + 300M", "content": "强降雨,修复待路面。" },
    { "id": "02", "x": 118.306340, "y": 25.522069, "date": "2012-6-12 18:01:00", "manager": "泉州市德化县交通局", "road": "Y039", "stake": "4K + 100M", "content": "强降雨,砌筑挡土墙。" },
    { "id": "03", "x": 116.800777, "y": 26.190320, "date": "2012-6-11 8:21:00", "manager": "三明市清流县交通局", "road": "Y008", "stake": "3K + 900M", "content": "强降雨,重建涵洞，重填路基，重铺水泥砼路面。" },
    { "id": "04", "x": 116.403467, "y": 25.062102, "date": "2012-6-11 8:08:00", "manager": "龙岩市上杭县公路分局", "road": "S309", "stake": "280K + 150M", "content": "强降雨,挡墙修复。" },
    { "id": "05", "x": 118.215945, "y": 25.584280, "date": "2012-5-29 9:27:00", "manager": "泉州市德化县交通局", "road": "Y013", "stake": "2K + 400M", "content": "强降雨,上边坡卸载。" }
];


function init() {
    if (map.loaded)
        mapLoaded();
    else
        dojo.connect(map, "onLoad", mapLoaded);
}

function mapLoaded() {
    CreateCases();
}

dojo.addOnLoad(init);

function CreateCases() {
    for (var i in data) {
        var pt = new esri.geometry.Point(data[i].x, data[i].y, map.spatialReference);
        var symbol = symbol = new esri.symbol.PictureMarkerSymbol({
            "url": "../images/Map/应急.png", //应急.png
            "height": 15,
            "width": 15,
            "type": "esriPMS"
        });

        var attr = {
            "date": data[i].date,
            "manager": data[i].manager,
            "road": data[i].road,
            "stake": data[i].stake,
            "content": data[i].content
        };

        var infoTemplate = new esri.InfoTemplate(getTitle, getContent);

        var graphic = new esri.Graphic(pt, symbol, attr, infoTemplate);
        map.graphics.add(graphic);
    }
}

function getTitle(g) {
    return "灾害时间: " + g.attributes["date"];
}

function getContent(g) {
    map.infoWindow.resize(280, 160);

    return "管理单位：" + g.attributes["manager"] +
            "<br />路线：" + g.attributes["road"] +
            "<br />桩号：" + g.attributes["stake"] +
            "<br />内容：" + g.attributes["content"] +
            "<br />";
}