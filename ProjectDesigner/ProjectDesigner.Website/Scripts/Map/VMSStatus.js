var featureLayer = null;

function init() {
    if (map.loaded)
        mapLoaded();
    else
        dojo.connect(map, "onLoad", mapLoaded);
}

function mapLoaded() {

    //消息框图层，初始化  
    var defaultSymbol = new esri.symbol.PictureMarkerSymbol();
    var renderer1 = new esri.renderer.UniqueValueRenderer(defaultSymbol, "RunStatusFlag");
    renderer1.addValue(" ", new esri.symbol.PictureMarkerSymbol('../images/DeviceState/情报板/0.png', 21, 18)); //不正常
    renderer1.addValue("0", new esri.symbol.PictureMarkerSymbol('../images/DeviceState/情报板/0.png', 21, 18)); //不正常
    renderer1.addValue("1", new esri.symbol.PictureMarkerSymbol('../images/DeviceState/情报板/1.png', 21, 18)); //正常
    var template = new esri.InfoTemplate();
    template.setTitle("<b>${sde.SDE.VMS.所在位置}</b>");
    template.setContent(getTextContent);

    featureLayer = new esri.layers.FeatureLayer(equiptmentMapURL + "/4", {
        mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
        infoTemplate: template,
        outFields: ["*"]
    });
    featureLayer.setRenderer(renderer1);

    createHint(featureLayer, "可变情报板：", "sde.SDE.VMS.所在位置");


    dojo.connect(featureLayer, "onClick", function (evt) {
        infowinFixscreen(evt, 300, 200);
    });

    map.addLayer(featureLayer);
}

dojo.addOnLoad(init);

function getTextContent(graphic) {
    $.fn.ajaxPost({ method: 'GetVMSText', params: { 'vmsid': graphic.attributes["sde.SDE.VMS.IDS"] }, callback: function (data) {
        if (data && data.length > 0) {
            $('#cmsviewer').stop(false, false);
            $('#ImageLeft').attr('src', data[0].LPicture_Url);
            $('#ImageRight').attr('src', data[0].RPicture_Url);
            $('#txtMessage').attr('value', data[0].TextContent);
            $('#txtMessage').css({
                "color": getColor(data[0].TextColor),
                "font-size": (parseInt(data[0].TextFont.slice(4))).toString() + "px",
                "background": getColor(data[0].TextBackgroudColor)
            });
            CMSAnimationList(data, -1);
        }
        else {
            $('#ImageLeft').attr('src', "../images/CMSItemsPicture/empt.bmp");
            $('#ImageRight').attr('src', "../images/CMSItemsPicture/empt.bmp");
            $('#txtMessage').attr('value', "情报板内容显示");
            $('#txtMessage').css({
                "color": "red",
                "font-size": "32px",
                "background": "black"
            });
            ClearAnimation();
        }
    }
    })

    map.infoWindow.resize(500, 90);
    return $('#cms').html();
}
function showSelected() {
    var grid = $.fn.grid.getInstance();
    var selected = grid.getSelectedDataItems();
    if (selected.length == 1) {
        for (i = 0; i < featureLayer.graphics.length; i++) {
            if (featureLayer.graphics[i].attributes["sde.SDE.VMS.IDS"] == selected[0].Code) {
                map.infoWindow.setContent(featureLayer.graphics[i].getContent());
                map.infoWindow.setTitle(featureLayer.graphics[i].getTitle());
                map.centerAt(featureLayer.graphics[i].geometry);
                map.infoWindow.show(featureLayer.graphics[i].geometry, esri.dijit.InfoWindow.ANCHOR_UPPERRIGHT);
                break;
            }
        }
    }
    if (selected.length > 1) {
        $(selected).each(function (i, s) {
            var markerSymbol = new esri.symbol.PictureMarkerSymbol('../images/Map/mark.png', 23, 25);
            for (i = 0; i < featureLayer.graphics.length; i++) {
                if (featureLayer.graphics[i].attributes["sde.SDE.VMS.IDS"] == s.Code) {
                    featureLayer.graphics[i].setSymbol(markerSymbol);
                    break;
                }
            }
        });
    }
}