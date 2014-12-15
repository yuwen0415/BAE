window.QZONE=window.QZONE||{};QZONE.FP=QZONE.FP||{};QZONE.AP=QZONE.AP||{};QZONE.PY=QZONE.PY||{};(function(){var _fp=window,found=0,appid='',where;try{do{_fp=_fp.parent;if(_fp.QZONE&&_fp.QZONE.FrontPage&&_fp.g_iUin){found=5;break;}}while(_fp!=top);appid=_fp.QZONE.space.getCurrApp();appid=appid[0]=='myhome'||appid[0]=='main'?appid[1]:(appid[0]||'');}catch(ex){found=0;}
QZONE.FP._t=_fp;if(found<5){return false;}
window.g_version=QZONE.FP._t.g_version;window.g_isBrandQzone=QZONE.FP._t.g_isBrandQzone;function extend(source,target){for(var k in source){if(k.charAt(0)!='_'&&typeof(source[k])=='function'){target[k]=source[k];}}}
extend(_fp.QZONE.OFP||{},QZONE.FP);extend(_fp.QZONE.FrontPage,QZONE.FP);extend({activateOFPIframe:function(){if(frameElement){if(typeof(frameElement.activate)=="function"){frameElement.activate();}}}},QZONE.FP);extend(_fp.QZONE.appPlatform||{},QZONE.AP);(location.href.indexOf('qq.com')==-1)&&extend(_fp.QZONE.PengYou||{},QZONE.PY);setTimeout(function(){if(window.QZFL&&QZFL.config&&QZFL.config.FSHelperPage){QZFL.config.FSHelperPage="http://"+_fp.imgcacheDomain+"/qzone/v5/toolpages/fp_gbk.html";}},(location.href.indexOf('qq.com')==-1?200:2000));function checkAllow(appid){try{if(frameElement&&frameElement.id==='frameFeedList'){where=1;return true;}}catch(err){};if(typeof(g_version)!="undefined"&&g_version=="6"){return true;}
if(typeof(g_version)!="undefined"&&g_version==5&&window==top){return true;}
if(!appid){return false;}
if(appid==2||appid=="blog"||appid=="bloglist"){appid=2;where=2;return true;}
if(appid==334||appid==7||appid=="msg"||appid=="msgboard"){return true;}}
if(!checkAllow(appid)){return;}
var ignoreTags=makeMap("ADDRESS,APPLET,BLOCKQUOTE,BODY,BUTTON,CENTER,DD,DEL,DIR,DIV,DL,DT,FIELDSET,FORM,FRAMESET,HR,IFRAME,INS,ISINDEX,LI,MAP,MENU,NOFRAMES,NOSCRIPT,OBJECT,OL,P,PRE,SCRIPT,TABLE,TBODY,TD,TFOOT,TH,THEAD,TR,UL");var rCDN=/(?:^|\.)(?:qq\.com|qzonestyle\.gtimg\.cn)$/i;var CGI='http://www.urlshare.cn/cgi-bin/qzshare/cgi_qzshare_urlcheck';var goUser=/(?:^|\.)(?:user\.qzone\.qq\.com\/\d+)$/i;if(document.addEventListener){document.addEventListener('click',firewall,false);}else if(document.attachEvent){document.attachEvent("onclick",firewall);}
if(document.domain=='pengyou.com'){window.QZFL=window.QZONE=window.QZFL||window.QZONE||{};QZFL.config=QZFL.config||{};QZFL.config.domain="qzs.pengyou.com";QZFL.config.FSHelperPage="http://"+QZFL.config.domain+"/qzone/v5/toolpages/fp_gbk.html";}
function firewall(evt){evt=evt||window.event;var elem=evt.target||evt.srcElement,deepCounter=99,tagName,href,target,meteor,mj;while(elem&&deepCounter>-1){deepCounter--;tagName=elem.nodeName;if(tagName=='BODY'){break;}
if(tagName=='HTML'){continue;}
if(!elem.getAttribute){break;}
if(ignoreTags[tagName]){elem=elem.parentNode;continue;}
href=elem.getAttribute('href')||'';if(isGoUser(href)){elem.hrefbak=href;elem.href=href+"/profile";setTimeout((function(el){return function(){el.href=el.hrefbak;};})(elem),50);}else if(tagName=='A'&&!elem.onclick){href=elem.getAttribute('href')||'';if(href.slice(0,4)=='http'&&!isCDNDomain(href)&&href.slice(0,34)!=CGI){elem.hrefbak=href;if((g_isBrandQzone!="1")&&((typeof(g_version)!="undefined"&&g_version==6&&((typeof(g_isOFP)!="undefined")&&g_isOFP=="0"&&(typeof(QZ)!="undefined")&&QZ.G&&!QZ.G.inApp))||(typeof(g_version)!="undefined"&&g_version==5))){mj="&mj=1";}else{mj="";}
if(window.ActiveXObject&&elem.innerHTML.indexOf('<')==-1){meteor=document.createComment('');elem.appendChild(meteor);}
var currApp=QZONE.FP.getCurrApp();elem.href=CGI+'?appid='+currApp+'&rappid='+appid+mj+'&url='+encodeURIComponent(href)+(where?'&where='+where:'');setTimeout((function(el){return function(){el.href=el.hrefbak;};})(elem),50);}
break;}
elem=elem.parentNode;}}
function isCDNDomain(href){var h=href.split('://');if(h[1]){h=h[1].split('/')[0];return rCDN.test(h);}}
function isGoUser(href){return false;if(!href){return false;}
var h=href.split('://');if(h[1]){return goUser.test(h[1]);}}
function makeMap(str){var obj={},items=str.split(","),i=0,l=items.length;for(;i<l;i++){obj[items[i]]=true;}
return obj;}})();/*  |xGv00|05cc961f4e5ab40f03ca4f5ec432bf1f */