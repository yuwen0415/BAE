var BrowserDetect = {
    init: function () {
        this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
        this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
        this.OS = this.searchString(this.dataOS) || "an unknown OS";
    },
    searchString: function (data) {
        for (var i = 0; i < data.length; i++) {
            var dataString = data[i].string;
            var dataProp = data[i].prop;
            this.versionSearchString = data[i].versionSearch || data[i].identity;
            if (dataString) {
                if (dataString.indexOf(data[i].subString) != -1)
                    return data[i].identity;
            }
            else if (dataProp)
                return data[i].identity;
        }
    },
    searchVersion: function (dataString) {
        var index = dataString.indexOf(this.versionSearchString);
        if (index == -1) return;
        return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
    },
    dataBrowser: [
		{
		    string: navigator.userAgent,
		    subString: "Chrome",
		    identity: "Chrome"
		},
		{ string: navigator.userAgent,
		    subString: "OmniWeb",
		    versionSearch: "OmniWeb/",
		    identity: "OmniWeb"
		},
		{
		    string: navigator.vendor,
		    subString: "Apple",
		    identity: "Safari",
		    versionSearch: "Version"
		},
		{
		    prop: window.opera,
		    identity: "Opera",
		    versionSearch: "Version"
		},
		{
		    string: navigator.vendor,
		    subString: "iCab",
		    identity: "iCab"
		},
		{
		    string: navigator.vendor,
		    subString: "KDE",
		    identity: "Konqueror"
		},
		{
		    string: navigator.userAgent,
		    subString: "Firefox",
		    identity: "Firefox"
		},
		{
		    string: navigator.vendor,
		    subString: "Camino",
		    identity: "Camino"
		},
		{		// for newer Netscapes (6+)
		    string: navigator.userAgent,
		    subString: "Netscape",
		    identity: "Netscape"
		},
		{
		    string: navigator.userAgent,
		    subString: "MSIE",
		    identity: "Explorer",
		    versionSearch: "MSIE"
		},
		{
		    string: navigator.userAgent,
		    subString: "Gecko",
		    identity: "Mozilla",
		    versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
		    string: navigator.userAgent,
		    subString: "Mozilla",
		    identity: "Netscape",
		    versionSearch: "Mozilla"
		}
	],
    dataOS: [
		{
		    string: navigator.platform,
		    subString: "Win",
		    identity: "Windows"
		},
		{
		    string: navigator.platform,
		    subString: "Mac",
		    identity: "Mac"
		},
		{
		    string: navigator.userAgent,
		    subString: "iPhone",
		    identity: "iPhone/iPod"
		},
		{
		    string: navigator.platform,
		    subString: "Linux",
		    identity: "Linux"
		}
	]

};
$(function () {
    if ($.fn.win.getQuery('action')=='logout') {
        $.cookie('hnempInitExtent', '')
    }
    if ($('.select_board').length == 0) {
        engine = null;
        if (window.navigator.appName == "Microsoft Internet Explorer") {
            // This is an IE browser. What mode is the engine in?
            if (document.documentMode) // IE8 or later
                engine = document.documentMode;
            else // IE 5-7
            {
                engine = 5; // Assume quirks mode unless proven otherwise
                if (document.compatMode) {
                    if (document.compatMode == "CSS1Compat")
                        engine = 7; // standards mode
                }
                // There is no test for IE6 standards mode because that mode  
                // was replaced by IE7 standards mode; there is no emulation.
            }
            // the engine variable now contains the document compatibility mode.
            if (engine < 8) {
                if (confirm('您的IE浏览器版本过低，为了获取更好的浏览效果及安全性是否安装IE8？')) {
                    $('#ie8_download').show();
                }
            }
        } 
//        BrowserDetect.init();
//        if (BrowserDetect.OS == 'Windows' && BrowserDetect.browser == 'Explorer') {
//            if (document.documentMode < 8) { //BrowserDetect.version
//                if (confirm('您的IE浏览器版本过低，为了获取更好的浏览效果及安全性是否安装IE8？')) {
//                    $('#ie8_download').show();
//                }
//            }
//        }
    }
})