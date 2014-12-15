/// <reference path="jquery-1.7.min.js" />
/// <reference path="sparrow.js" />


(function ($) {
    $.fn.validate = function (options) {
        var opts = $.extend({}, $.fn.validate.defaults, options);
        var isValid = true;
        for (var i = 0; i < $.fn.validate.validators.length; i++) {
            var validator = $.fn.validate.validators[i];


            var form = $(this);

            var validate = function (item) {
                var error = item.attr('data-val-' + validator.name);
                if (validator.validate(item)) {
                    opts.onSuccess(form, item, error);
                    return true;
                } else {
                    opts.onError(form, item, error);
                    return false;
                }
            }

            form.find(validator.selector).not(':hidden').each(function () {
                if (validate($(this)) === false) {
                    isValid = false;
                }

                if ($(this).attr('data-val-' + validator.name + '-watched') != 'yes') {
                    $(this).blur(function () {
                        validate($(this));
                    }).focus(function () {
                        opts.getBox(form, $(this)).hide();
                    });

                    $(this).attr('data-val-' + validator.name + '-watched', 'yes');
                }

            });


        }

        return isValid;
    }

    $.fn.validate.defaults = { onError: function (form, el, error) {
        //  el.focus();
        el.addClass('field-validation-error');

        var box = this.getBox(form, el);
        var offset = el.offset();


        var isShown = false;
        box.find('span').each(function () {
            if (isShown == false) {
                if ($.trim($(this).text()) == $.trim(error)) {
                    isShown = true;
                }
            }
        });

        if (isShown == false) {
            var item = $('<li><span></span></li>');
            item.find('span').text(error);
            box.find('ul').append(item);
        }


        var l = offset.left;
        if (el.width() > box.width()) {
            l += el.width() - box.width();
        }

        var t = (offset.top - box.height() - 10);

        if (t < 0) {
            t = 0;
        }

        if (l > $(document).width()) {
            l = $(document).width() - el.width();
        }

        box.removeAttr('style');
        box.css({ position: 'absolute', cursor: 'pointer' });
        box.offset({ 'left': l, 'top': t });
        //box.offset({ lef: 0, top: 0 });
        //box.offset({ left: l, top: t });

        box.show();


    }, onSuccess: function (form, el, error) {

        var box = this.getBox(form, el);
        box.find('span').each(function () {

            if ($.trim($(this).text()) == $.trim(error)) {
                $(this).parent().remove();
            }

        });

        if (box.find('li').size() == 0) {
            el.removeClass('field-validation-error');
            box.hide();
        }

    }, getBox: function (form, el) {
        var id = el.attr('id');
        if (!id) {
            id = el.attr('name');
        }
        var boxId = id + '_field_validation_summary_errors';
        var box = $('#' + boxId);
        if (box.size() == 0) {
            box = $('<div class="field-validation-summary-errors"><div class="content"><ul></ul><div class="triangle"></div></div></div>').attr('id', boxId);
            box.css({ position: 'absolute', cursor: 'pointer' }); //absolute
            box.click(function () {
                $(this).hide();
            })
            //$(form).append(box);
            //box.insertAfter(el);
            box.insertAfter($('body'))
        }

        return box;
    }
    };

    $.fn.validate.validators = [];


    $(function () {
        $('form').each(function (index, item) {
            $(item)[0].onsubmit = function () {
                var enableValidate = $(this).data('enable-validate');
                if (enableValidate === true) {
                return $(this).validate();
                } else {
                    return true;
                }
            }

            $(item).submit(function (e) {
                var enableValidate = $(this).data('enable-validate');
                if (enableValidate === true) {
                if ($(this).validate() === false) {
                    e.preventDefault();
                    return false;
                }
                }
                return true;
            });
        });
    });


    //必填项
    var val_required = {
        name: 'required',
        selector: '[data-val-required]',
        validate: function (item) {
            var error = item.attr('data-val-required');
            if ($.trim(item.val()).length == 0) {
                return false;
            } else {
                return true;
            }
        }
    }

    $.fn.validate.validators.push(val_required);

    //邮件
    var val_email = {
        name: 'email',
        selector: '[data-val-email]',
        validate: function (item) {
            var val = $.trim(item.val());
            if (val.length == 0 || /^[\w-]+(\.[\w-]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/.test(val)) {
                return true;
            } else {
                return false;
            }
        }
    }

    $.fn.validate.validators.push(val_email);

    //日期
    var val_date = {
        name: 'date',
        selector: '[data-val-date]',
        validate: function (item) {
            var val = $.trim(item.val());
            if (val.length == 0 || /^\d{4}-[0-1]{1}\d{1}-[0-3]{1}\d{1}?$/.test(val)) {
                return true;
            } else {
                return false;
            }
        }
    }

    $.fn.validate.validators.push(val_date);


    //日期+时间
    var val_datetime = {
        name: 'datetime',
        selector: '[data-val-datetime]',
        validate: function (item) {
            var val = $.trim(item.val());
            if (val.length == 0 || /^\d{4}-[0-1]{1}\d{1}-[0-3]{1}\d{1} [0-2]{1}\d{1}:[0-5]{1}\d{1}?$/.test(val)) {
                return true;
            } else {
                return false;
            }
        }
    }

    $.fn.validate.validators.push(val_datetime);

    //身份证验证
    var val_card = {
        name: 'card',
        selector: '[data-val-card]',
        validate: function (item) {
            var val = $.trim(item.val());
            if (val.length == 0 || /^\d{17}(?:\d|x|X)$/.test(val)) {
                return true;
            } else {
                return false;
            }
        }
    }

    $.fn.validate.validators.push(val_card);

    //汉字
    var val_chinese = {
        name: 'chinese',
        selector: '[data-val-chinese]',
        validate: function (item) {
            var val = $.trim(item.val());
            if (val.length == 0 || /^[\u4e00-\u9fa5]+$/.test(val)) {
                return true;
            } else {
                return false;
            }
        }
    }

    $.fn.validate.validators.push(val_chinese);

    //英文和数字
    var val_englishandnumber = {
        name: 'englishandnumber',
        selector: '[data-val-englishandnumber]',
        validate: function (item) {
            var val = $.trim(item.val());
            if (val.length == 0 || /^[A-Za-z0-9]+$/.test(val)) {
                return true;
            } else {
                return false;
            }
        }
    }
    $.fn.validate.validators.push(val_englishandnumber);

    //整数
    var val_integer = {
        name: 'integer',
        selector: '[data-val-integer]',
        validate: function (item) {
            var val = $.trim(item.val());
            if (val.length == 0 || /^-?[0-9]\d*$/.test(val)) {
                return true;
            } else {
                return false;
            }
        }
    }

    $.fn.validate.validators.push(val_integer);

    //正整数
    var val_positiveinteger = {
        name: 'positiveinteger',
        selector: '[data-val-positiveinteger]',
        validate: function (item) {
            var val = $.trim(item.val());
            if (val.length == 0 || /^\d+$/.test(val)) {
                return true;
            } else {
                return false;
            }
        }
    }

    $.fn.validate.validators.push(val_positiveinteger);

    //电话
    var val_phone = {
        name: 'phone',
        selector: '[data-val-phone]',
        validate: function (item) {
            var val = $.trim(item.val());
            if (val.length == 0 || /((\d{11,12})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/.test(val)) {
                return true;
            } else {
                return false;
            }
        }
    }

    $.fn.validate.validators.push(val_phone);

    //手机
    var val_moblie = {
        name: 'moblie',
        selector: '[data-val-moblie]',
        validate: function (item) {
            var val = $.trim(item.val());
            if (val.length == 0 || /^\d{11}/.test(val)) {
                return true;
            } else {
                return false;
            }
        }
    }

    $.fn.validate.validators.push(val_moblie);

    //URL
    var val_url = {
        name: 'url',
        selector: '[data-val-url]',
        validate: function (item) {

            var val = $.trim(item.val());
            var reg = /http:\/\/([\w-]+\.)+[\w-]+(\/[-\w \.\/\?%&=]*)?/i;
            if (val.length == 0 || reg.test(val)) {
                return true;
            } else {
                return false;
            }
        }
    }
    $.fn.validate.validators.push(val_url);

    //邮编
    var val_zip = {
        name: 'zip',
        selector: '[data-val-zip]',
        validate: function (item) {
            var val = $.trim(item.val());
            if (val.length == 0 || /^\d{6}/.test(val)) {
                return true;
            } else {
                return false;
            }
        }
    }
    $.fn.validate.validators.push(val_zip);

    //数值大小比较
    var val_numberrangevalidator = {
        name: 'numberrangevalidator',
        selector: '[data-val-numberrangevalidator]',
        validate: function (item) {

            var max = parseInt(item.attr('data-number-max'));
            var min = parseInt(item.data('data-number-min'));
            var val = $.trim(item.val());

            max = isNaN(max) ? 65555555555555 : max;
            min = isNaN(min) ? -65555555555555 : min;

            if (val.length == 0 || val <= max && val >= val) {
                return true;
            } else {
                return false;
            }
        }
    }
    $.fn.validate.validators.push(val_numberrangevalidator);

    //数字验证
    var val_number = {
        name: 'number',
        selector: '[data-val-number]',
        validate: function (item) {
            var number = item.attr('data-decimal-number');
            var reg = new RegExp('^[0-9]+(\\.[0-9]{1,' + number + '}){0,1}$');
            var val = $.trim(item.val());
            if (val.length == 0 || reg.test(val)) {
                return true;
            } else {
                return false;
            }
        }
    }
    $.fn.validate.validators.push(val_number);

    //正数验证
    var val_positivenumber = {
        name: 'positivenumber',
        selector: '[data-val-positivenumber]',
        validate: function (item) {
            var val = $.trim(item.val());
            if (val.length == 0 || /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/.test(val)) {
                return true;
            } else {
                return false;
            }
        }
    }
    $.fn.validate.validators.push(val_positivenumber);

    //远程验证

    //正则验证
    var val_custom = {
        name: 'custom',
        selector: '[data-val-custom]',
        validate: function (item) {
            var customregular = item.attr('data-custom-regular');
            var reg = new RegExp(customregular);
            var val = $.trim(item.val());
            if (val.length == 0 || reg.test(val)) {
                return true;
            } else {
                return false;
            }
        }
    }

    $.fn.validate.validators.push(val_custom);

    //比较
    var val_compare = {
        name: 'compare',
        selector: '[data-val-compare]',
        validate: function (item) {
            var compare = item.val();
            var compareto = $($item.attr('data-compare-to')).val();

            if (compare == compareto) {
                return true;
            } else {
                return false;
            }
        }
    }

    $.fn.validate.validators.push(val_compare);

    //文本长度
    var val_stringlength = {
        name: 'stringlenght',
        selector: '[data-val-stringlenght]',
        validate: function (item) {
            var max = parseInt(item.attr('data-max-length'));
            var min = parseInt(item.attr('data-min-length'));

            max = isNaN(max) ? 655555555555 : max;
            min = isNaN(min) ? 0 : min;

            var len = $.trim(item.val()).length;

            if (len <= max && len >= min) {
                return true;
            } else {
                return false;
            }
        }
    }

    $.fn.validate.validators.push(val_stringlength);



})(jQuery);





