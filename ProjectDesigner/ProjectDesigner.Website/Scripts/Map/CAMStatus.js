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
    renderer1.addValue(" ", new esri.symbol.PictureMarkerSymbol('../images/DeviceState/视频设备/0.png', 21, 18)); //不正常
    renderer1.addValue("0", new esri.symbol.PictureMarkerSymbol('../images/DeviceState/视频设备/0.png', 21, 18)); //不正常
    renderer1.addValue("1", new esri.symbol.PictureMarkerSymbol('../images/DeviceState/视频设备/1.png', 21, 18)); //正常  
    var template = new esri.InfoTemplate();
    template.setTitle(getTextTitle);
    template.setContent(getTextContent);

    featureLayer = new esri.layers.FeatureLayer(equiptmentMapURL + "/2", {
        mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
        infoTemplate: template,
        outFields: ["*"]
    });
    featureLayer.setRenderer(renderer1);
    map.addLayer(featureLayer);
    createHint(featureLayer, "视频监控设备: ", "CName");

    dojo.connect(featureLayer, "onClick", function (evt) {
        infowinFixscreen(evt);
    });
}

dojo.addOnLoad(init);

//视频
function getTextTitle(graphic) {
    var form = $('form');
    var action = form.attr('action');
    var htmlobj = $.ajax({ url: action, type: "POST", data: { "__Method": "GetCamTitle", "camid": graphic.attributes["sde.SDE.CCTV.ID"] }, async: false });
    var result = eval(htmlobj.responseText);
    return "<b>" + result + "</b>";
}

function getTextContent(graphic) {
    var form = $('form');
    var action = form.attr('action');
    var htmlobj = $.ajax({ url: action, type: "POST", data: { "__Method": "GetCamAddress", "camid": graphic.attributes["sde.SDE.CCTV.ID"] }, async: false });
    var result = jQuery.parseJSON(htmlobj.responseText);
    var strHtml = "";
    if (result.length > 1) {
        $(".list").show();
        for (var i in result) {
            strHtml += "<li onclick='showVideoSelected(this);'><a href='#' onclick=\"$('.mwp')[1].SourceAddr = addrFormat('" + result[i].IP + "'); $(this).parent().parent().parent().parent().parent().find('.title').text('" + result[i].Cname + "');\" >" + result[i].Cname + "</a></li>";
        }
        $(".list").html(strHtml);
        map.infoWindow.resize(440, 230);
        //map.infoWindow.resize(440, 25 * (result.length + 2) < 230 ? 230 : 25 * (result.length + 2));
    }
    else {
        $(".list").hide();
        map.infoWindow.resize(280, 230);
    }
    $(".list").find('li').eq(0).addClass('selected');
    video_start_realtime(addrFormat(result[0].IP));


    return $(".video_box").html();
}

function showSelected() {
    var grid = $.fn.grid.getInstance();
    var selected = grid.getSelectedDataItems();
    if (selected.length == 1) {
        for (i = 0; i < featureLayer.graphics.length; i++) {
            if (featureLayer.graphics[i].attributes["sde.SDE.CCTV.ID"] == selected[0].Code) {
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
                if (featureLayer.graphics[i].attribute["sde.SDE.CCTV.ID"] == s.Code) {
                    featureLayer.graphics[i].setSymbol(markerSymbol);
                    break;
                }
            }
        });
    }
}

function showVideoSelected(obj) {
    $(obj).parent().find('li').removeClass('selected');
    $(obj).addClass('selected');
}