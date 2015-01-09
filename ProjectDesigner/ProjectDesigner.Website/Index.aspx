<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Index.aspx.cs" Inherits="ProjectDesigner.Website.Index" %>

<%@ Register Src="ClientResources.ascx" TagName="ClientResources" TagPrefix="uc1" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="zh-CN" lang="zh-CN">
<uc1:ClientResources ID="ClientResources1" runat="server" />
<head runat="server">
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <style type="text/css">
        html, body {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
        }

        .iw_poi_title {
            color: #CC5522;
            font-size: 14px;
            font-weight: bold;
            overflow: hidden;
            padding-right: 13px;
            white-space: nowrap;
        }

        .iw_poi_content {
            font: 12px arial,sans-serif;
            overflow: visible;
            padding-top: 4px;
            white-space: -moz-pre-wrap;
            word-wrap: break-word;
        }
    </style>
    <%--<script type="text/javascript" src="http://api.map.baidu.com/api?key=&v=1.4&services=true"></script>--%>

    <title></title>
</head>
<body onload="initMap();">
    <!--地图容器-->
    <div id="dituContent" style="border: #ccc solid 1px;"></div>
</body>
<script src="http://172.5.1.61:8080/EzServerClient/js/EzMapAPI.js" type="text/javascript" charset="GB2312"></script>
<script type="text/javascript">
    //$(document).ready(function () {
    //    initMap();//创建和初始化地图
    //});

    $(window).resize(function () {
        //initMapContainer();
    });


    function initMapContainer() {
        $('#dituContent').width(document.documentElement.clientWidth - 5);
        $("#dituContent").height(document.documentElement.clientHeight - 2);
    }

    //创建和初始化地图函数：
    function initMap() {
        //百度地图
        //initMapContainer();
        //createMap();//创建地图
        //setMapEvent();//设置地图事件
        //addMapControl();//向地图添加控件

        //1） ********构造地图控件对象，用于装载地图
        var uEzMap = new EzMap(document.getElementById("dituContent"));
        //2）********初始化地图，并显示地图
        uEzMap.initialize();
        //3）********以下为其它一些附属功能
        // 显示左侧导航工具条
        uEzMap.showMapControl();
        // 显示地图坐标
        //uEzMap.addMapEventListener(EzEvent.MAP_MOUSEMOVE, function (e) {
        //    document.getElementById("coordiate").innerHTML = "X:"
        //        + e.mapPoint.x + "  Y:" + e.mapPoint.y;
        //});
    }

    //创建地图函数：
    function createMap() {
        var map = new BMap.Map("dituContent");//在百度地图容器中创建一个地图
        var point = new BMap.Point(118.155893, 24.551112);//定义一个中心点坐标
        map.centerAndZoom(point, 12);//设定地图的中心点和坐标并将地图显示在地图容器中
        window.map = map;//将map变量存储在全局
    }

    //地图事件设置函数：
    function setMapEvent() {
        map.enableDragging();//启用地图拖拽事件，默认启用(可不写)
        map.enableScrollWheelZoom();//启用地图滚轮放大缩小
        map.enableDoubleClickZoom();//启用鼠标双击放大，默认启用(可不写)
        map.enableKeyboard();//启用键盘上下左右键移动地图
    }

    //地图控件添加函数：
    function addMapControl() {
        //向地图中添加缩放控件
        var ctrl_nav = new BMap.NavigationControl({ anchor: BMAP_ANCHOR_TOP_LEFT, type: BMAP_NAVIGATION_CONTROL_LARGE });
        map.addControl(ctrl_nav);
        //向地图中添加缩略图控件
        var ctrl_ove = new BMap.OverviewMapControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT, isOpen: 1 });
        map.addControl(ctrl_ove);
        //向地图中添加比例尺控件
        var ctrl_sca = new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT });
        map.addControl(ctrl_sca);
    }

</script>
</html>
