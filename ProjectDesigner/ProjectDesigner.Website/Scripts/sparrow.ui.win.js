(function ($) {

    /*win*/
    $.fn.win = function (options) {

        var opts = $.extend({}, $.fn.win.defaults, options);

        var url = opts.url;

        if (url == null) {
            // debugger;
            alert('地址没指定');
            return;
        }
        if (url.indexOf('?') > -1) {
            url = url + '&';
        } else {
            url = url + '?'
        }

        url = url + 'r=' + Math.random();

        if (opts.callback != null) {
            var m = 'm' + Math.random().toString().substr(2);

            window[m] = function (json) {
                if (json !== null) {
                    opts.callback(JSON.parse(json));
                } else {
                    opts.callback(null);
                }
            }

            url = url + '&_jscallback=' + m;
        }

        if (opts.data != null) {
            if (typeof (opts.data) == 'string') {
                url = url + '&' + opts.data;
            }

            if (typeof (opts.data) == 'object') {
                for (var i in opts.data) {
                    url = url + '&' + i + '=' + encodeURI(opts.data[i]);
                }
            }

        }
        if (typeof (opts.getData) == 'function') {
            var m2 = 'm' + Math.random().toString().substr(2);
            window[m2] = function () {
                return opts.getData();
            }

            url = url + '&_jsgetdata=' + m2;
        }
        return {
            show: function (name) {
                var t, l, h, w;
                if (opts.fullsize) {
                    t = 0;
                    l = 0;
                    h = window.screen.height - 100;
                    w = window.screen.width;

                } else {
                    t = (window.screen.height - opts.height) / 2;
                    l = (window.screen.width - opts.width) / 2;
                    h = opts.height;
                    w = opts.width;
                }

                return window.open(url, name ? name : '_blank', 'height=' + h + ', width=' + w + ', top=' + t + ',left=' + l + ', toolbar=no, menubar=no, scrollbars=yes, resizable=yes, location=no, status=no');
            }
        }

    }

    $.fn.win.close = function (data, nocallback) {

        if (nocallback !== true) {
            $.fn.win.callback(data);
        }
        window.close();
    }

    $.fn.win.callback = function (data) {
        var callback = $.fn.win.getQuery('_jscallback');

        if (callback != null && window.opener != null) {

            try {
                var method = window.opener.window[callback];
                if (method) {
                    if (data != undefined) {
                        method(JSON.stringify(data));
                    } else {
                        method(null);
                    }
                } else {
                    alert('无法在父页面找到回调方法，可能父页面已经被刷新过！');
                }
            } catch (err) {
            }
        }
    }


    $.fn.win.getData = function () {
        var data = $.fn.win.getQuery('_jsgetdata');

        if (data != null) {
            return window.opener.window[data]();
        } else {
            return null;
        }
    }

    $.fn.win.getQuery = function (name) {
        var query = null;
        var search = window.location.search.substring(1); //remove ?

        var args = search.split('&');
        for (var i = 0; i < args.length; i++) {
            var items = args[i].split('=');
            if (items[0] == name) {
                if (query == null) {
                    query = decodeURI(items[1]);
                } else {
                    query = ',' + decodeURI(items[1]);
                }
            }
        }

        return query;
    }

    $.fn.win.defaults = { url: null, width: 600, height: 400, callback: null, data: null };
    /*win*/


    $.fn.showWin = function (options) {
        var url = "";
        if ($(this).is('a')) {
            url = $(this).attr('href');
        } else {
            url = $(this).attr('url');
        }


        var data = $(this).data('params');


        var callback_method = $(this).attr('data-callback');

        var callback = null;
        if (callback_method) {
            callback = window[callback_method];
        }

        var defaults = {
            url: url,
            data: data,
            callback: callback,
            height: $(this).data('dialog-height'),
            width: $(this).data('dialog-width')
        };

        var win_name = $(this).data('dialog-name');

        win_name = win_name ? win_name : '';

        var opts = $.extend({}, defaults, options);

        $(this).win(opts).show(win_name);

    }

})(jQuery);
