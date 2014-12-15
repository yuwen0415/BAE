var formatDate = function (d, short) {

    if (typeof (d) == 'string') {
        if (d.indexOf('/Date(') == 0) {
            d = 'new ' + d.replace(/\//ig, '');
        } else {
            return d;
        }

        d = eval(d);
    }

    if (d && typeof (d.getFullYear) == 'function') {

        if (short != null) {
            return d.getFullYear() + '-' + toPadLeft((d.getMonth() + 1), 2, '0') + '-' + toPadLeft(d.getDate(), 2, '0');
        } else {

            return d.getFullYear() + '-' + toPadLeft((d.getMonth() + 1), 2, '0') + '-' + toPadLeft(d.getDate(), 2, '0') + ' ' + toPadLeft(d.getHours(), 2, '0') + ':' + toPadLeft(d.getMinutes(), 2, '0');
        }
    } else {
        return d;
    }
}

function reviseJson(obj) {
    if (obj != null) {
        if (typeof (obj) == 'object') {
            for (var i in obj) {
                var m = obj[i];
                if (typeof m == 'object') {
                    reviseJson(m);
                } else {
                    if (typeof (m) == 'string' && String(m).indexOf('Date(') > -1) {
                        obj[i] = formatDate(eval('new ' + m.replace(new RegExp('/', "gm"), '')));
                    }
                }
            }
        }
    }
}


function toPadLeft(source, len, character) {
    if (source == null || source == undefined) {
        source = "";
    } else {
        source = source.toString();
    }

    var m = len - source.length;
    if (m > 0) {
        for (var i = 0; i < m; i++) {
            source = character + source;
        }
    }

    return source;
}


var isArray = function (value) {
    return value && typeof value === 'object' && typeof value.length === 'number' && typeof value.splice === 'function' && !(value.propertyIsEnumerable('length'));
};


function mergeParams(params1, params2) {
    var obj1 = toObject(params1);
    var obj2 = toObject(params2);

    return $.extend({}, obj1, obj2);
}


function toObject(params) {
    var obj = {};
    if (params) {
        if (typeof (params) == 'object') {
            obj = params;
        } else {

            var items = params.split('&');
            for (var i in items) {
                var item = items[i].split('=');

                obj[item[0]] = item[1];
            }
        }
    }

    return obj;
}

function getRandomNumber(range) {
    return Math.floor(Math.random() * range);
}

function getRandomChar() {
    var chars = "0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ";
    return chars.substr(getRandomNumber(62), 1);
}

function randomID(size) {
    var len = size ? size : 10;
   

    var str = "";
    for (var i = 0; i < len; i++) {
        str += getRandomChar();
    }
    return str;
}

var sparrow = {};
sparrow.events = [];
sparrow.onload = function (callback) {
    if (callback instanceof Function) {
        sparrow.events.push(callback);
    }
}

if (sparrow.settings) {
    sparrow.settings.baseUrl = '/';
} else {
    sparrow.settings = {
        baseUrl: '/'
    };
}

$(function () {
    for (var i in sparrow.events) {
        sparrow.events[i]();
    }
});