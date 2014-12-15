var featureLayer = new esri.layers.GraphicsLayer();
var queryTask = null;
var query = null;
var points = new Array();
var pointLayer = null;
var routeLayer = null;
var openFlag = false, ce = false, fixPix = false;
var qt = null;
var method = "getPOIS";
var cXmin = 0, cYmin = 0, cXmax = 0, cYmax = 0;
var curXmin = 0, curYmin = 0, curXmax = 0, curYmax = 0;

function init() {
    if (map.loaded)
        mapLoaded();
    else
        dojo.connect(map, "onLoad", mapLoaded);
}

function mapLoaded() {
    $("#map").height($(document).height() - 32);

    $('#infoSwich').hover(function () {
        if (openFlag)
            $('#infoSwich').css('backgroundPosition', '34px 0');
        else
            $('#infoSwich').css('backgroundPosition', '0 0');
    }, function () {
        if (openFlag)
            $('#infoSwich').css('backgroundPosition', '17px 0');
        else
            $('#infoSwich').css('backgroundPosition', '51px 0');
    });

    $('#pnlSearch').find('a').bind("click", function () {
        $(this).toggleClass('selected');
    });


    dojo.connect(toolbar, "onDrawEnd", function (geometry) {
        switch (geometry.type) {
            case "polyline":
                lengthParams.polylines = [geometry];
                lengthParams.lengthUnit = esri.tasks.GeometryService.UNIT_METER;
                lengthParams.geodesic = true;
                geometryService.lengths(lengthParams);
                map.graphics.add(new esri.Graphic(geometry, new esri.symbol.SimpleLineSymbol()));
                break;
            case "extent":
                fixPix = true;
                extentSearch(geometry);
                break;
        }
        toolbar.deactivate();
    });

    //消息框图层，初始化  
    var template = new esri.InfoTemplate();
    template.setTitle("<b>${Name}</b>");
    template.setContent(getTextContent);

    var form = $('form');
    var action = form.attr('action');
    var htmlobj = $.ajax({ url: action, type: "POST", data: { "__Method": "GetErgWarehousePoint" }, async: false });
    var result = eval(htmlobj.responseText);

    for (var i = 0; i < result.length; i++) {
        var pt = new esri.geometry.Point(result[i].Longitude, result[i].Latitude, map.spatialReference);
        var symbol = new esri.symbol.PictureMarkerSymbol({
            "url": "../images/Map/wh" + (result[i].IsResources === false ? "1":"") + ".jpg",
            "height": 12,
            "width": 12,
            "type": "esriPMS"
        });
        var attr = {
            "ID": result[i].ID,
            "X": result[i].Longitude,
            "Y": result[i].Latitude,
            "Name": result[i].Cname
        };
        graphic = new esri.Graphic(pt, symbol, attr, template);
        featureLayer.add(graphic);
    }

    map.infoWindow.resize(360, 260);
    dojo.connect(featureLayer, "onClick", function (evt) {
        infowinFixscreen(evt);
    });
    createHint(featureLayer, "", "Name");
    map.addLayer(featureLayer);

    routeLayer = new esri.layers.GraphicsLayer();
    map.addLayer(routeLayer);

    pointLayer = new esri.layers.GraphicsLayer();
    map.addLayer(pointLayer);

    bufferLayer = new esri.layers.GraphicsLayer();
    map.addLayer(bufferLayer);

    queryTask = new esri.tasks.QueryTask(BaseDataMapURL + "/2");
    query = new esri.tasks.Query();
    query.spatialRelationship = esri.tasks.Query.SPATIAL_REL_INTERSECTS;
    query.returnGeometry = true;
    query.outFields = ["*"];

    dojo.connect(map.infoWindow._hide, "onclick", function () {
        map.graphics.clear();
    });
}

dojo.addOnLoad(init);

//物资库存内容
function getTextContent(graphic) {
    map.infoWindow.resize(360, 260);
    var form = $('form');
    var action = form.attr('action');
    var htmlobj = $.ajax({ url: action, type: "POST", data: { "__Method": "GetEmergencyMaterials", "whid": graphic.attributes.ID }, async: false });

    var result = jQuery.parseJSON(htmlobj.responseText);
    var strHtml = "<table cellpadding='0' cellspacing='0' id='hongzhi'><tr><th width='100px'>物资代码</th><th width='160px'>物资名称</th><th width='100px'>库存数量</th></tr>";
    for (var i in result) {
        strHtml += "<tr><td><a href='#' onclick='selectMaterials(\"" + result[i].ID.toString() + "\");'>" + result[i].Code + "</a></td><td>" + result[i].Name + "</td><td style='text-align:right;padding-right: 5px;'>" + result[i].Quantity + "</td>";
    }

    strHtml += "</table>";

    return strHtml;
}

function selectMaterials(id) {
    openwindow('../Emergency/ErgMaterialEdit.aspx?id=' + id, "应急物资明细", 700, 500);
}

function openwindow(url, name, iWidth, iHeight) {
    var url; //转向网页的地址;
    var name; //网页名称，可为空;
    var iWidth; //弹出窗口的宽度;
    var iHeight; //弹出窗口的高度;
    var iTop = (window.screen.availHeight - 30 - iHeight) / 2; //获得窗口的垂直位置;
    var iLeft = (window.screen.availWidth - 10 - iWidth) / 2; //获得窗口的水平位置;
    window.open(url, name, 'height=' + iHeight + ',,innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',toolbar=no,menubar=no,scrollbars=auto,resizeable=no,location=no,status=no,scrollbars=yes');
}

function showSelected() {
    var grid = $.fn.grid.getInstance();
    var selected = grid.getSelected();
    if (selected.size() != 0 && selected.length > 1) {
        selected.each(function () {
            var id = $(this).attr('data-itemid');
            var markerSymbol = new esri.symbol.PictureMarkerSymbol('../images/Map/mark.png', 23, 25);
            for (i = 0; i < featureLayer.graphics.length; i++) {
                if (featureLayer.graphics[i].attributes.pointid == id) {
                    featureLayer.graphics[i].setSymbol(markerSymbol);
                    break;
                }
            }
        });
    }
    else {
        if (selected.size() != 0) {
            var id = selected.attr('data-itemid').split("|")[1];

            for (i = 0; i < featureLayer.graphics.length; i++) {

                if (featureLayer.graphics[i].attributes.IDCode == id) {
                    map.infoWindow.setContent(featureLayer.graphics[i].getContent());
                    map.infoWindow.setTitle(featureLayer.graphics[i].getTitle());
                    map.centerAt(featureLayer.graphics[i].geometry);
                    map.infoWindow.show(featureLayer.graphics[i].geometry, esri.dijit.InfoWindow.ANCHOR_UPPERRIGHT);
                    break;
                }
            }
        }
    }
    if ($('#hidErgWarehouse').val() != "") {
        for (i = 0; i < featureLayer.graphics.length; i++) {
            if (featureLayer.graphics[i].attributes.IDCode == $('#hidErgWarehouse').val()) {
                map.infoWindow.setContent(featureLayer.graphics[i].getContent());
                map.infoWindow.setTitle(featureLayer.graphics[i].getTitle());
                map.centerAt(featureLayer.graphics[i].geometry);
                map.infoWindow.show(featureLayer.graphics[i].geometry, esri.dijit.InfoWindow.ANCHOR_UPPERRIGHT);
                break;
            }
        }
    }
}

function mapResize() {
    openFlag = !openFlag;
    if (openFlag)
        $("#infoSwich").attr("title", "关闭");
    else
        $("#infoSwich").attr("title", "打开");
    if (map != null) {
        map.resize();
        map.reposition();
    };
}

function extentSearch(geo) {
    ce = true;

    curXmin = geo.xmin;
    curYmin = geo.ymin;
    curXmax = geo.xmax;
    curYmax = geo.ymax;

    $('#pnlSearch').find('a').removeClass('selected');

    var form = $('form');
    var action = form.attr('action');
    var htmlobj = $.ajax({ url: action, type: "POST", data: { "__Method": "getPOI_CategoryByExtent", "s": $("#POI").val(), "p": $("#txtPageIndex").val(), "xmin": curXmin, "ymin": curYmin, "xmax": curXmax, "ymax": curYmax }, async: false });
    var result = eval(htmlobj.responseText);

    if (!(!result)) {
        $(".tab").html('');
        for (var i in result) {
            var v = $('#pnlSearch').find('a[data-type = "' + result[i].Category_Code + '"]').get(0);
            if (!!(v)) {
                $(v).addClass('selected');
                appendTab(v);

            }
        }
    }
}

function doSearch() {
    $("#divPageinfo").hide();
    if (!fixPix) {
        curXmin = map.extent.xmin;
        curYmin = map.extent.ymin;
        curXmax = map.extent.xmax;
        curYmax = map.extent.ymax;
    }

    points = [];
    var charArr = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    map.infoWindow.hide();
    routeLayer.clear();
    pointLayer.clear();
    $("#pnlSearchResult").find("ul").html("");
    if ($('#pnlSearch').find('a.selected').length > 0 || $("#POI").val() != "") {
        $('#mapInfoCon').show(mapResize());

        var form = $('form');
        var action = form.attr('action');
        var htmlobj = $.ajax({ url: action, type: "POST", data: { "__Method": method, "s": $("#POI").val(), "p": $("#txtPageIndex").val(), "xmin": curXmin, "ymin": curYmin, "xmax": curXmax, "ymax": curYmax }, async: false });
        var result = JSON.parse(htmlobj.responseText);
        var items = result.Items;
        var total = result.TotalHits;
        $("#spanTotal").text(total);
        $("#spanP1").text($("#txtPageIndex").val() == 1 ? 1 : ($("#txtPageIndex").val() - 1) * 5 + 1);
        $("#spanP2").text($("#txtPageIndex").val() * 5 > total ? total : $("#txtPageIndex").val() * 5);
        $("#spanTotal").text(total);
        $("#txtTotalPage").val(Math.ceil(total / 5));

        if (total > 0)
            $("#divPageinfo").show();

        if (!(!items)) {
            for (var i in items) {
                var attr = {
                    "X": items[i].PoiX,
                    "Y": items[i].PoiY,
                    "Address": items[i].Address,
                    "Place": items[i].Place,
                    "Alias": items[i].Alias,
                    "Route_Code": items[i].Route_Code,
                    "RoadCode": items[i].RoadCode,
                    "Category_Code": items[i].Category_Code,
                    "ManageUnit": items[i].ManageUnit,
                    "ManageUnitName": items[i].ManageUnitName,
                    "StartStake": items[i].StartStake == null ? null : items[i].StartStake + "K",
                    "EndStake": items[i].EndStake == null ? "" : items[i].EndStake + "K",
                    "Tel": items[i].Tel,
                    "Ref_Code": items[i].Ref_Code,
                    "Ref_Name": items[i].Ref_Name,
                    "Quantity": items[i].Quantity
                };

                var pt = new esri.geometry.Point(items[i].PoiX, items[i].PoiY, map.spatialReference);
                var markUrl = "../images/Map/mark1.png";
                var symbol = new esri.symbol.PictureMarkerSymbol(markUrl, 11, 15);
                var pindex = $("#txtPageIndex").val();

                if (parseInt($("#spanP1").text() - 1) <= i && i <= parseInt($("#spanP2").text() - 1)) {
                    markUrl = "../images/Map/mark_blue_" + (parseInt(i) % 5 + 1) + ".png";
                    symbol = new esri.symbol.PictureMarkerSymbol(markUrl, 20, 24);

                    if (items[i].PoiX < cXmin || cXmin == 0)
                        cXmin = items[i].PoiX;
                    if (items[i].PoiX > cXmax || cXmax == 0)
                        cXmax = items[i].PoiX;

                    if (items[i].PoiY < cYmin || cYmin == 0)
                        cYmin = items[i].PoiY;
                    if (items[i].PoiY > cYmax || cYmax == 0)
                        cYmax = items[i].PoiY;

                    createSearchResult(charArr[parseInt(i) % 5], attr);
                }

                var infoTemplate1 = new esri.InfoTemplate(getInfowinTitle, getInfowinContent);
                var graphic = new esri.Graphic(pt, symbol, attr, infoTemplate1);

                points[i] = graphic;

                pointLayer.add(graphic);

                // if (ce)
                //     map.setExtent(new esri.geometry.Extent(cXmin - 0.05, cYmin - 0.05, cXmax + 0.05, cYmax + 0.05));
            }
        }

        $("#pnlSearchResult").find("li").each(function (index) {
            var g = points[index + 5 * ($("#txtPageIndex").val() - 1)];
            var oldsymbol = g.symbol;
            var newsymbol = new esri.symbol.PictureMarkerSymbol("../images/Map/mark_red_" + (parseInt(index) + 1) + ".png", 20, 24);

            $(this).hover(function () {
                g.setSymbol(newsymbol);
            },
            function () {
                g.setSymbol(oldsymbol);
            });

            $(this).click(function () {
                //zoomTo(g);
                map.infoWindow.setContent(g.getContent());
                map.infoWindow.setTitle(g.getTitle());
                map.infoWindow.show(g.geometry, map.getInfoWindowAnchor(g.geometry));
                //singleClick(g.attributes.Route_Code);
            });
        });

        $("#pnlSearchResult").show();
    }
    ce = false;
}

function createSearchResult(label, attr) {
    var ul = $("#pnlSearchResult").find("ul");
    var li = $("<li></li>");
    var liHtml = "";

    liHtml = "<div class='icon'>" + label + "</div>" +
                    "<div class='content'>" +
                    "<span><b>" + attr.Place + "</b></span>" +
                    (!attr.Ref_Name ? "" : "<label>" + attr.Ref_Name + "</label><br />") +
                    (attr.Quantity == null ? "" : "<label>数量：" + attr.Quantity + "</label><br />") +
                    "</div>";

    li.html(liHtml);
    li.appendTo($("#pnlSearchResult").find("ul"));
}

function doQueryResult(fset) {
    var s = new esri.symbol.SimpleLineSymbol(
          esri.symbol.SimpleLineSymbol.STYLE_SOLID,
          new dojo.Color([255, 0, 0, 0.65]), 5
        );

    var resultFeatures = fset.features;
    for (var i = 0, il = resultFeatures.length; i < il; i++) {
        var graphic = resultFeatures[i];
        graphic.setSymbol(s);
        graphic.setInfoTemplate(null);
        routeLayer.add(graphic);
    }
}

function singleClick(routecode) {
    map.graphics.clear();
    var queryTask1 = new esri.tasks.QueryTask(BaseDataMapURL + "/2");
    var query1 = new esri.tasks.Query();
    query1.spatialRelationship = esri.tasks.Query.SPATIAL_REL_INTERSECTS;
    query1.returnGeometry = true;
    query1.outFields = ["*"];
    dojo.connect(queryTask1, "onComplete", singleQuery);
    query1.where = "Code = '" + routecode + "'";
    queryTask1.execute(query1);
}

function singleQuery(fset) {
    var s1 = new esri.symbol.SimpleLineSymbol(
          esri.symbol.SimpleLineSymbol.STYLE_SOLID,
          new dojo.Color([0, 0, 255, 0.65]), 5
        );

    var resultFeatures = fset.features;
    for (var i = 0, il = resultFeatures.length; i < il; i++) {
        var graphic = resultFeatures[i];
        graphic.setSymbol(s1);
        graphic.setInfoTemplate(null);
        map.graphics.add(graphic);
    }
}

function mapResize() {
    openFlag = !openFlag;
    if (openFlag)
        $("#infoSwich").attr("title", "关闭");
    else
        $("#infoSwich").attr("title", "打开");
    if (map != null) {
        map.resize();
        map.reposition();
    };
}

function prePage() {
    if (parseInt($("#txtPageIndex").val()) <= 1) {
        $("#txtPageIndex").val(1);
        // alert("当前是第一页！")
    }
    else {
        $("#txtPageIndex").val(parseInt($("#txtPageIndex").val()) - 1);
        doSearch();
    }
}

function nextPage() {
    if ($("#txtPageIndex").val() == $("#txtTotalPage").val()) {
        // alert("已经是最后一页了！")
    }
    else {

        $("#txtPageIndex").val(parseInt($("#txtPageIndex").val()) + 1);
        doSearch();
    }
}

function getInfowinTitle(g) {
    return g.attributes["Place"];
}

function getInfowinContent(g) {
    var liHtml = "";

    map.infoWindow.resize(220, 100);
    liHtml = "<label>物资名称: " + (!g.attributes["Ref_Name"] ? "" : g.attributes["Ref_Name"]) +
                    "</label><br /><label>数量: " + (g.attributes["Quantity"] == null ? "" : g.attributes["Quantity"]) +
                    "</label><br />";
    return liHtml;
}