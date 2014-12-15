/// <reference path="jquery-1.7.min.js" />

$(function () {
    function getRandom() {
        return 'CaptchaHttpHandler.ashx?r=' + Math.random();
    }

    $('img.captcha').click(function () {
        $(this).attr('src', getRandom());
    }).css('cursor', 'pointer').height(20).width(45).attr('src', getRandom());

});