(function ($) {
    var effectTimer;
    $.fn.cmsviewer = {};
    //模块运动
    CMSAnimationList = function (item, time) {
        time++;
        if (time >= item.length) {
            time = 0;
        }
        CMSAnimationImg(item[time]);
        CMSAnimation(item[time].TextBackgroudColor, item[time].TextFont, item[time].TextContent, item[time].TextColor, item[time].TextSize, item[time].TextSpace, item[time].TextBackgroudColor, item[time].DisplayMode_Code, item[time].Speed, item[time].Delay, item[time].Flash, item, time);
    }
    CMSAnimationImg = function (item) {
        $('#ImageLeft').attr('src', item.LPicture_Url);
        $('#ImageRight').attr('src', item.RPicture_Url);
    }

    CMSAnimationItem = function (item, go) {
        if (go) {
            CMSAnimation(item.TextBackgroudColor, item.TextFont, item.TextContent, item.TextColor, item.TextSize, item.TextSpace, item.TextBackgroudColor, item.DisplayMode_Code, item.Speed, item.Delay, item.Flash);

        }
        else {
            return;
        }
    }

    CMSAnimation = function (textColor, textFont, text, color, fontSize, letterSpacing, background, mode, speed, delay, pulsateNumber, list, time) {
        var cms = $('#cmsviewer');
        var category = cms.attr('category');
        if (category == 'big') {
            fontSize = parseInt(fontSize) * 2;
        }
        //    if (mode == 0) {
        //        $('#ImageLeft').attr('src', "../images/CMSItemsPicture/empt.bmp");
        //        $('#ImageRight').attr('src', "../images/CMSItemsPicture/empt.bmp");
        //        $('#txtMessage').attr('value', null);
        //        cms.animate({ marginLeft: "0px" }, 0, CMSAnimationList(list, time));
        //    }
        var on_callback = [];
        if (list) {
            on_callback.push(function () { CMSAnimationList(list, time) });
        }
        else {
            on_callback.push(function () { callback(textColor, textFont, text, color, fontSize, letterSpacing, background, mode, speed, delay, pulsateNumber) });
        }

        cms.css("background", getColor(textColor));
        $('#txtMessage').attr('value', text);
        $('#txtMessage').css({
            "font-family": textFont,
            "color": getColor(color),
            "font-size": fontSize + 'px',
            "letter-spacing": letterSpacing + 'px',
            "background": getColor(background)
        });
        speed = parseInt(speed) * 200;
        delay = parseInt(delay) * 1000;
        var modeEffect = getEffect(mode, pulsateNumber);
        ClearAnimation();
        switch (mode) {
            //        case "0":                 
            //            $('#ImageLeft').attr('src', "../images/CMSItemsPicture/empt.bmp");                 
            //            $('#ImageRight').attr('src', "../images/CMSItemsPicture/empt.bmp");                 
            //            $('#txtMessage').attr('value', null);                 
            //            cms.animate({ marginLeft: "0px" }, 0, CMSAnimationList(list, time));                 
            //            break;                 
            case "1":
                cms.animate({ marginLeft: "0px" }, 0);
                $('body').everyTime(delay, 'B', function () {
                    cms.animate({ opacity: 0 }, speed);
                    cms.animate({ opacity: 1 }, 0, action(on_callback));
                });
                break;
            case "2":
                $('body').stopTime('B');
                cms.stop(false, false);
                cms.animate({ marginTop: "0px" }, 0);
                $('body').everyTime(delay, 'B', function () {
                    cms.animate({ marginTop: "-80px" }, speed);
                    cms.animate({ marginTop: "0px" }, 0, action(on_callback));
                });
                break;
            case "3":
                $('body').stopTime('B');
                cms.stop(false, false);
                cms.animate({ marginTop: "0px" }, 0);
                $('body').everyTime(delay, 'B', function () {
                    cms.animate({ marginTop: "80px" }, speed);
                    cms.animate({ marginTop: "0px" }, 0, action(on_callback));
                });
                break;
            case "4":
                $('body').stopTime('B');
                cms.stop(false, false);
                cms.animate({ marginLeft: "0px" }, 0);
                $('body').everyTime(delay, 'B', function () {
                    cms.animate({ marginLeft: "-960px" }, speed);
                    cms.animate({ marginLeft: "0px" }, 0, action(on_callback));
                });
                break;
            case "5":
                $('body').stopTime('B');
                cms.stop(false, false);
                cms.animate({ marginLeft: "0px" }, 0);
                $('body').everyTime(delay, 'B', function () {
                    cms.animate({ marginLeft: "960px" }, speed);
                    cms.animate({ marginLeft: "0px" }, 0, action(on_callback));
                });
                break;
            case "6":
            case "7":
            case "8":
            case "10":
            case "13":
            case "17":
            case "18":
            case "19":
                cms.effect(modeEffect.mode, modeEffect.options, speed, action(on_callback));
                break;
            case "9":
                cms.hide();
                cms.slideDown(speed, action(on_callback));
                break;
            case "16":
                ClearAnimation();
                cms.hide();
                cms.fadeIn(speed, action(on_callback));
                break;
            default:
                break;
        }
    }
    function action(on_callback) {
        for (var i in on_callback) {
            var action = on_callback[i];
            action();
        }
    }
    function callback(textColor, textFont, text, color, fontSize, letterSpacing, background, mode, speed, delay, pulsateNumber) {
        var cms = $('#cmsviewer');
        clearTimeout(effectTimer);
        cms.show();
        effectTimer = setTimeout(function () {
            if (mode == '16') {
                cms.hide();
                cms.fadeIn(speed, function () {
                    callback(textColor, textFont, text, color, fontSize, letterSpacing, background, mode, speed, delay, pulsateNumber);
                }
                    );
            } else
                if (mode == '9') {
                    cms.hide();
                    cms.slideDown(speed, function () {
                        callback(textColor, textFont, text, color, fontSize, letterSpacing, background, mode, speed, delay, pulsateNumber);
                    });
                }
                else {
                    var modeEffect = getEffect(mode, pulsateNumber);
                    cms.effect(modeEffect.mode, modeEffect.options, speed, callback(textColor, textFont, text, color, fontSize, letterSpacing, background, mode, speed, delay, pulsateNumber));
                }
        }, delay);
    }
    //转换颜色，根据协议定义将颜色进行转换
    getColor = function (color) {
        var txtColor = "";
        switch (color) {
            case "t":
                txtColor = "black";
                break;
            case "000000000000":
                txtColor = "black";
                break;
            case "255000000000":
                txtColor = "red";
                break;
            case "000255000000":
                txtColor = "green";
                break;
            case "000000255000":
                txtColor = "blue";
                break;
            case "255255255000":
                txtColor = "whrite";
                break;
            case "255255000000":
                txtColor = "yellow";
                break;
        }
        return txtColor;
    }


    getEffect = function (mode, pulsateNumber) {
        switch (mode) {
            case '6': return { mode: 'blind', options: {} };
            case '7': return { mode: 'blind', options: { direction: 'horizontal'} };
            case '8': return { mode: 'clip', options: {} };
            case '10': return { mode: 'clip', options: { direction: 'horizontal'} };
            case '13': return { mode: 'explode', options: { pieces: 9} };
            case '17': return { mode: 'fade', options: {} };
            case '18': return { mode: 'pulsate', options: { mode: 'hide', times: pulsateNumber != '' ? pulsateNumber : '5'} };
            case '19': return { mode: 'pulsate', options: { mode: 'show', times: pulsateNumber != '' ? pulsateNumber : '5'} };
            default: return ''
        }
    }
    //重置CMSViewer，将其归位
    ClearAnimation = function () {
        var cms = $('#cmsviewer');
        $('body').stopTime();
        cms.stop(false, false).removeAttr("style");
        cms.animate({ marginLeft: "0px" }, 0);
        cms.animate({ marginTop: "0px" }, 0);
        cms.animate({ opacity: 1 }, 0);
        clearTimeout(effectTimer);
    }

    CMSResize = function (cms) {
        if (cms.size() > 0) {
            var cmsWidth = cms.width();
            var leftWidth = cms.find('>div').eq(1).width();
            var rightWidth = cms.find('>div').eq(0).width();
            var textDiv = cms.find('>div').eq(2);
            var textWidth = cmsWidth - leftWidth - rightWidth;
            if (textWidth < cmsWidth * 0.8) {
                textDiv.width(textWidth);
            } else {
                textDiv.width(cmsWidth * 0.8);
            }
        }
    }

    $(function () {
        CMSResize($('#cmsviewer'));
        $(window).resize(function () {
            CMSResize($('#cmsviewer'));
        });
    })

    OpenNewPage = function (url, title) {
        var link = url; //$(this).attr('href');
        var text = title;
        var data = {};
        data.link = link + (link.indexOf('?') > 0 ? '&' : '?') + 'r=' + Math.random(0);
        data.url = link;
        window.parent.showTab(link, text, data);
    }


    $.fn.cmsviewer.ViewbySelected = function () {
        var time = -1;
        var ids = $.fn.grid.getInstance().getSelected().attr('data-itemid');
        $('body').stopTime();
        $('#cmsviewer').stop(false, false);
        ClearAnimation();
        if (ids) {
            $(this).ajaxPost({ method: 'UpdataView', params: { 'deviceID': ids }, callback: function (data) {
                if (data) {
                    if (data instanceof Array) {
                        SetCMSView(data[0]);
                        CMSAnimationList(data, time);
                    }
                    else {
                        SetCMSView(data);
                        CMSAnimation(data.TextBackgroudColor, data.TextFont, data.TextContent, data.TextColor, data.TextSize, data.TextSpace, data.TextBackgroudColor, data.DisplayMode_Code, data.Speed, data.Delay, data.Flash);
                    }
                }
                else {
                    alert("无播放列表数据，请到发送历史中查看详情!");
                }
            }
            });
        }
        else {
            SetCMSView(null);
            ClearAnimation();
            $('#cmsviewer').stop(false, false);
        }
    }

    SetCMSView = function (data) {
        var category = $('#cms').attr('category');
        if (data) {
            $('#ImageLeft').attr('src', data.LPicture_Url);
            $('#ImageRight').attr('src', data.RPicture_Url);
            $('#txtMessage').attr('value', data.TextContent);
            $('#txtMessage').css({
                "color": getColor(data.TextColor),
                "font-size": (parseInt(data.TextFont.slice(4))).toString() + "px",
                "background": getColor(data.TextBackgroudColor)
            });
            if (category == 'big') {
                $('#txtMessage').css({
                    "color": getColor(data.TextColor),
                    "font-size": (parseInt(data.TextFont.slice(4)) * 2).toString() + "px",
                    "background": getColor(data.TextBackgroudColor)
                });
            }
        }
        else {
            $('#ImageLeft').attr('src', "../images/CMSItemsPicture/empt.bmp");
            $('#ImageRight').attr('src', "../images/CMSItemsPicture/empt.bmp");
            $('#txtMessage').attr('value', "情报板内容显示");
            $('#txtMessage').css({
                "color": "red",
                "font-size": "64px",
                "background": "black"
            });
            if (category == 'small') {
                $('#txtMessage').css({
                    "color": "red",
                    "font-size": "32px",
                    "background": "black"
                });
            }
        }
    }
})(jQuery);
