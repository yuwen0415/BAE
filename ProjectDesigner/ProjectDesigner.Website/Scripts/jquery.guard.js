/// <reference path="jquery-1.7.min.js" />
/// <reference path="jquery.tmpl.js" />


(function ($) {
    $.fn.guard = function (options) {

        if ($.fn.guard.checkAgent() === true) {
            var opts = $.extend({}, $.fn.guard.defaults, options);
            $.fn.guard.ucagent = $('#oOCX')[0];
            //init
            var iReturn = null;       //在本方法的各段代码中公用。
            iReturn = $.fn.guard.ucagent.IMRIOpenImr();
            if (iReturn == 3) window.alert("IMR版本未更新");
            if (iReturn == 4) window.alert("IMR_I.ocx版本未更新");
            if (iReturn != 0) {
                window.alert("连接IMR失败！" + iReturn);
            }

            $(opts.status).click(function (e) {
                e.preventDefault();
                var state = $(this).data('state');

                if (state == '2') {
                    state = 1; //示闲
                    $(this).find('img').attr('src', '../images/duty/idle.gif');
                } else {
                    state = 2; //示忙
                    $(this).find('img').attr('src', '../images/duty/busy.gif');
                }

                $.fn.guard.ucagent.IMRISetLocalState(1, state);


                $(this).data('state', state);
            });
            $.fn.guard.getServiceNumber();
            return {
                call: function (number) {
                    try {
                        //设置主叫，呼出时必须设置对应的主叫号码，否则呼出会使用我们平台默认主叫
                        $.fn.guard.ucagent.IMRISetValue(1, "CALLOUT_NBR", $.fn.guard.defaultsServiceNumber());
                        var status = $.fn.guard.ucagent.IMRIDialout(1, -1, number, "");
                        //0 is success

                    } catch (ex) {
                        alert('呼出失败。');
                    }
                },
                forward: function (number) {
                    try {
                        $.fn.guard.state.forward = true;
                        $.fn.guard.ucagent.IMRISetValue(1, 'ANSWER_INTERVAL', 45);
                        var status = $.fn.guard.ucagent.IMRIConsultCall(1, $.fn.guard.defaultsServiceNumber(), number, -1, 0, 0, '');
                        //0 is success
                    } catch (ex) {
                        alert('转移失败。');
                    }

                },
                meeting: function () {

                    try {
                        $.fn.guard.ucagent.IMRISetValue(1, 'ANSWER_INTERVAL', 45);

                        for (var number in arguments) {
                            if ($.fn.guard.ucagent.IMRIConfDo(1, $.fn.guard.defaultsServiceNumber(), number, 1, 4256, 1, '') != 0) {
                                alert('未能拨通' + number);
                            }
                        }
                        //0 is success
                    } catch (ex) {
                        alert('通话异常:' + ex);
                    }
                },
                handup: function () {
                    try {
                        $.fn.guard.ucagent.IMRIClearCall($.fn.guard.nObjectId, 0);

                    } catch (ex) {
                        alert('挂断失败！请查看是否已经挂机。');
                    }
                }
            };

        } else {
            alert("客服客户端还未安装，或者使用非IE浏览器，电话功能将不能使用。请联系系统管理员进行系统配置。");
        }
    }

    $.fn.guard.defaults = { answer: '#answer', transfer: '#transfer', status: '#status' };
    $.fn.guard.state = { forward: false };
    //TODO:正式上线，修改客服号码
    $.fn.guard.serviceNumber = [];
    //TODO:获取客服号码
    $.fn.guard.getServiceNumber = function () {
        $.fn.ajaxPost({ method: 'getServiceNumber', callback: function (tel) {
            if (tel) {
                var hotline = tel.split(',');
                for (var i in hotline) {
                    $.fn.guard.serviceNumber.push(hotline[i]);
                }
            }
        }
        })
    }
    //判断是否客服号码
    $.fn.guard.anyServiceNumber = function (tel) {
        for (var i in $.fn.guard.serviceNumber) {
            if ($.fn.guard.serviceNumber[i] == tel) {
                return true;
            }
        }
        return false;
    }
    //获取默认客服号码
    $.fn.guard.defaultsServiceNumber = function () {
        if ($.fn.guard.serviceNumber.length > 0) {
            return $.fn.guard.serviceNumber[0];
        }
        return "";
    }
    $.fn.guard.checkAgent = function (xo) {
        var xObject;
        var defaultObject = "AgentInsTallXControl.AgentInsTall";
        xObject = typeof (xo) == "undefined" || xo == "" ? defaultObject : xo;
        try {
            var a = new ActiveXObject(xObject);
        } catch (e) {
            return false;
        }
        return true;
    }
    $.fn.guard.on_showInfoBox = [];
    $.fn.guard.add_showInfoBox = function (fn, cleanAll) {
        if (cleanAll) {
            $.fn.guard.on_showInfoBox = [];
        }
        if (fn instanceof Function) {
            $.fn.guard.on_showInfoBox.push(fn);
        }
    };
    $.fn.guard.ucagent;
    $.fn.guard.from = '';
    $.fn.guard.to = '';
    $.fn.guard.start = '';
    $.fn.guard.end = '';
    $.fn.guard.onCallIn = function (nObjectId, psSessionNo, nSubSessionNo, nCallerTerminalId, nCalleeTerminalId, psANIS, psDNIS1, psDNIS2, nCallerUserType, nCallType, nAnswerMode, psShortData) {

        $.cookie('calltype', 'default', { path: '/' });
        var btnAnswer = $($.fn.guard.defaults.answer);

        btnAnswer.find('img').attr('src', '../images/Duty/answer.gif');

        var command = 'from ' + psANIS + ' to ' + psDNIS2;
        $.fn.guard.nObjectId = nObjectId;
        $.fn.guard.start = new Date();
        $.fn.guard.from = psANIS;
        $.fn.guard.to = psDNIS2;
        $.fn.guard.SessionNo = psSessionNo;
        $.fn.guard.nSubSessionNo = nSubSessionNo;

    };

    $.fn.guard.onHandUp = function (nObjectId, psSessionNo, nSubSessionNo, nCallerTerminalId, nCalleeTerminalId, psANI, psDNIS1, psDNIS2, nCallType, nAnswerMode, psTime, nOnHookType, nMuteTime) {

        var btnAnswer = $($.fn.guard.defaults.answer);
        btnAnswer.find('img').attr('src', '../images/Duty/answer.gif');

        $.fn.guard.end = new Date();

        $.fn.guard.log();
    };

    $.fn.guard.log = function () {

        var log = '[' + $.fn.guard.SessionNo + '] ' + $.fn.guard.from + '->' + $.fn.guard.to + ' 从 ' + $.fn.guard.start + ' 到 ' + $.fn.guard.end;

        if ($.fn.guard.SessionNo != '' && $.fn.guard.start != '' && $.fn.guard.end != '') {
            var format = function (d, s) {
                try {
                    if (s) {
                        return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes()
                    } else {
                        return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds(); ;
                    }
                } catch (ex) {
                    return '';
                }
            }
            var data = { nsubsessionno: $.fn.guard.nSubSessionNo, sessionno: $.fn.guard.SessionNo, from: $.fn.guard.from, to: $.fn.guard.to, start: format($.fn.guard.start), end: format($.fn.guard.end) };
            $.post('../Guard/calllogger.ashx', data);

            var duration = ($.fn.guard.end.getMinutes() * 60 + $.fn.guard.end.getSeconds()) - ($.fn.guard.start.getMinutes() * 60 + $.fn.guard.start.getSeconds());
            //window.addCallList(data.sessionno, data.from, data.to, duration, format($.fn.guard.start, true));
        }

        $.fn.guard.from = '';
        $.fn.guard.to = '';
        $.fn.guard.start = '';
        $.fn.guard.end = '';
        $.fn.guard.SessionNo = '';
        $.fn.guard.nSubSessionNo = '';
        $.fn.guard.nObjectId = '';


    }

    $.fn.guard.defaults.waiting = 10000;
    $.fn.guard.alarm = function () {
        //  alert('警报');

        var form = $('form');
        var action = form.attr('action');

        var data = form.serialize();

        data += "&__Method=SendAlarm";

        //$.post(action, data, function (data) { });

    }

    $.fn.guard.defaults.showInfoBox = function () {
        if (!$.fn.guard.state.forward) {
            window.setTimeout(function () {
                var calltype = $.cookie('calltype');
                var id = $.cookie('incidentid');
                var name = $.trim($('#wait_name').text());
                name = name == '未知' ? '群众' : name;
                if (calltype == 'edit') {
                    var grid = $.fn.grid.getInstance('Tel');
                    $(this).win({ url: '../Guard/TelExhaledInfoAdd.aspx', width: 705, height: 320, data: 'callsessionno=' + $.fn.guard.SessionNo + '&from=' + $.fn.guard.from + '&to=' + $.fn.guard.to + '&Incident_ID=' + id + '&name=' + name + '&calltype=2',
                        callback: function (result) {
                            grid.changePageIndex(1);
                        }
                    }).show();
                }
                else {
                    var grid = $.fn.grid.getInstance('Incident');
                    var url = $.fn.guard.anyServiceNumber($.fn.guard.from) ? 'TelExhaledInfoAdd.aspx' : 'TelInfoAdd.aspx'; //客户电话判断是否呼出呼入
                    $(this).win({ url: '../Guard/' + url, width: 705, height: 320, data: 'callsessionno=' + $.fn.guard.SessionNo + '&from=' + $.fn.guard.from + '&to=' + $.fn.guard.to + '&name=' + name + '&calltype=1',
                        callback: function (result) {
                            grid.changePageIndex(1);
                        }
                    }).show('calltype1');
                }
            }, 800);
        }
    }

    $.fn.guard.onCallOut = function (nObjectId, psSessionNo, nSubSessionNo, nCallerTerminalId, nCalleeTerminalId, psANIS, psDNIS1, psDNIS2, nCallerUserType, nCallType, nAnswerMode, psDialTime, psAnswerTime, psShortData) {

        var btnAnswer = $($.fn.guard.defaults.answer);

        btnAnswer.find('img').attr('src', '../images/Duty/answering.gif');

        $.fn.guard.nObjectId = nObjectId;
        $.fn.guard.start = new Date();
        $.fn.guard.from = psANIS;
        $.fn.guard.to = psDNIS2;
        $.fn.guard.SessionNo = psSessionNo;
        $.fn.guard.nSubSessionNo = nSubSessionNo;
    };

    $.fn.guard.onStateChanged = function (nObjectId, nOldState, nNewState) {

        if (nNewState == 4) {//空闲
            $('.wait_box').hide();
        }
        if (nNewState == 16) {//用户呼入
            //alert('接听');

        }

        if (nNewState == 17) {//振铃
            // alert('准备呼出');
        }

        if (nNewState == 18) {//通话中
            $('.wait_box').hide();

            clearTimeout($.fn.guard.timeout);
            $.fn.guard.start = new Date();
            $.fn.guard.defaults.showInfoBox();
            if (nOldState == 20) {
                //  alert('对方已经接通。');
            } else {
                //  alert('客户已经接通');
            }
        }
        if (nNewState == 19) {//呼出
            //showWaiting($('#dialout_waiting'));
            $.fn.guard.wait();
        }

        if (nNewState == 20) {//呼出回铃，但对方还未摘机	20 
            //showWaiting($('#dialout_waiting'));
            $.fn.guard.wait();
        }

        if (nNewState == 21) {//对方挂机，但本方未挂机

        }


        if (nNewState == 32) {//预占状态
            $.fn.guard.wait();
        }


    };
    $.fn.guard.wait = function () {

        var showWaiting = function (d) {
            var screenHeight = document.documentElement.clientHeight;
            var divHeight = d.outerHeight();
            var top = parseInt((screenHeight - divHeight) / 2);
            d.css("top", top + document.documentElement.scrollTop);
            d.show();
        }

        var sCallerNbr = $.fn.guard.ucagent.IMRIGetValue(1, "CALLING_NBR"); //获取主叫
        var sCalleeNbr = $.fn.guard.ucagent.IMRIGetValue(1, "CALLED_NBR"); //获取被叫

        var tel = $.fn.guard.anyServiceNumber(sCallerNbr) ? sCalleeNbr : sCallerNbr;

        $.getJSON('../Guard/TelArea.ashx?tel=' + tel + '&type=tel', querycallback);

        $('#dialin_waiting #wait_number').text(tel);

        showWaiting($('#dialin_waiting'));
        $.fn.guard.timeout = window.setTimeout(function () {
            $.fn.guard.alarm();
        }, $.fn.guard.defaults.waiting);
        var btnAnswer = $($.fn.guard.defaults.answer);

        btnAnswer.find('img').attr('src', '../images/Duty/answer.gif');
    }

})(jQuery);



$(function () {
    window.guard = $(document).guard();
    $('.callall').live('click', function (e) {
        e.preventDefault();
        var callnow = $.cookie('callnow');
        if (callnow == null) {
            alert('请打开值守管理首页界面监听电话信息！');
        }
        else {
            $.cookie('calltype', 'default', { path: '/' });
            var number = $(this).parent().parent().find('input[type=text]').val();
            //  console.log(number);
            guard.call(number);
        }
    });

    $('#callme').click(function (e) {
        e.preventDefault();
        var callnow = $.cookie('callnow');
        if (callnow == null) {
            alert('请打开值守管理首页界面监听电话信息！');
        }
        else {
            var cookie = $(this).data('cookie');
            $.cookie('calltype', cookie, { path: '/' });
            if (cookie == 'edit') {
                $.cookie('incidentid', $.fn.win.getQuery('id'), { path: '/' });
            }
            var number = $('#tel_number').val(); //$(this).prev().find('input[type=text]').text();
            // console.log(number);
            if (number != "")
                guard.call(number);
        }
    });

    $('.call-contact').live('click', function (e) {
        e.preventDefault();
        var callnow = $.cookie('callnow');
        if (callnow == null) {
            alert('请打开值守管理首页界面监听电话信息！');
        }
        else {
            $.cookie('calltype', 'default', { path: '/' });
            var number = $.trim($(this).parent().prev().prev().text());
            //console.log(number);
            if (number != "")
                guard.call(number);
        }
    });
});

function querycallback(data) {
    var area = '';
    var name = '';
    if (data) {
        name = data.Name;
        if (data.Province == '未知' && typeof (data.QueryResult) === 'undefined') {
            $.getScript('http://api.showji.com/Locating/20120413.aspx?m=' + data.Mobile + '&output=json&callback=mobilecallback');
        }
        else {
            area = data.Province + ' ' + data.City;
        }
    }
    else {
        area = '未知';
        name = '未知';
    }
    $('#dialin_waiting #wait_name').text(name);
    $('#dialin_waiting #wait_area').text(area);
}
function mobilecallback(data) {
    var area = '';
    if (data.QueryResult === 'True') {
        area = data.Province + ' ' + data.City;
    }
    else {
        area = '未知';
    }
    $('#dialin_waiting #wait_area').text(area);
}