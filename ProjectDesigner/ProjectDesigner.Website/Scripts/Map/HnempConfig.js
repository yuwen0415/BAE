var connWeb = false;

var Img = new Image();
Img.onload = function () {
    connWeb = true;
}
Img.onerror = function () {
    connWeb = false;
}
connWeb = false;
//Img.src = "http://218.85.65.28:8820/WebClient/extjs32/resources/images/default/s.gif";


//if (location.hostname.substring(0, 2) == "59") {
//    var JSHost = "59.57.240.50:8085";
//    var MapHost = "59.57.240.50:8086";
//}
//else {
//    var JSHost = "192.168.102.241:8085";
//    var MapHost = "192.168.102.240";
//}

    var JSHost = "59.57.240.50:8085";
    var MapHost = "59.57.240.50:8086";

var HOSTNAME_AND_PATH_TO_JSAPI = JSHost + '/Scripts/arcgis_js_api/library/2.6/jsapi/';

document.write("<script type='text/javascript'> var djConfig = { parseOnLoad: true };</script><link rel='stylesheet' type='text/css' href='http://" + JSHost + "/Scripts/arcgis_js_api/library/2.6/jsapi/js/dojo/dijit/themes/claro/claro.css' /><script type='text/javascript' src='http://" + JSHost + "/Scripts/arcgis_js_api/library/2.6/jsapi/Default.ashx'></script>");
//bussiness api
document.write("<script src='../Scripts/Map/DCIFJ.js' type='text/javascript'></script>");

FjMapURL = "http://" + MapHost + "/ArcGIS/rest/services/FJMap/MapServer";
FjAreaURL = "http://" + MapHost + "/ArcGIS/rest/services/FJArea/MapServer";
markMapURL = "http://" + MapHost + "/ArcGIS/rest/services/RoadMapQuery/MapServer";
vectorBasemapURL = "http://" + MapHost + "/ArcGIS/rest/services/1219/MapServer";
imageBasemapURL = "http://" + MapHost + "/ArcGIS/rest/services/xmallyx/MapServer";
equiptmentMapURL = "http://" + MapHost + "/ArcGIS/rest/services/RoadMap/MapServer";
EmergencyMapURL = "http://" + MapHost + "/ArcGIS/rest/services/Emergency/MapServer";
BaseDataMapURL = "http://" + MapHost + "/ArcGIS/rest/services/RoadBaseData/MapServer";
AreaURL = "http://" + MapHost + "/ArcGIS/rest/services/AreaPoint/MapServer";
x401ImageURL = "http://" + MapHost + "/ArcGIS/rest/services/xmhdl/MapServer";
yhbdURL = "http://" + MapHost + "/ArcGIS/rest/services/yhbd/MapServer";
//几何服务
GeometryServiceURL = "http://" + MapHost + "/ArcGIS/rest/services/Geometry/GeometryServer";

//扩展服务
DSURL = "http://" + MapHost + "/ArcGIS/rest/services/fj_ds/MapServer";
DSPointLocationURL = "http://" + MapHost + "/ArcGIS/rest/services/fj_ds/MapServer/exts/DSUtility/RouteLayers/0/PointLocation";
DSLineLocationURL = "http://" + MapHost + "/ArcGIS/rest/services/fj_ds/MapServer/exts/DSUtility/RouteLayers/0/LineLocation";
DSIdentifyRouteURL = "http://" + MapHost + "/ArcGIS/rest/services/fj_ds/MapServer/exts/DSUtility/RouteLayers/0/IdentifyRoute";