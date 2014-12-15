/// <reference path="jquery-1.7.min.js" />
/// <reference path="sparrow.js" />
/// <reference path="sparrow.validate.js" />


$(function () {

    var loading;
    var timer = null;
    $.ajaxSetup({
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

            if (!loading) {
                loading = $('<div class="loading"><div class="bg"></div><div class="icon"><div class="icon1"></div><div class="icon2"></div></div></div>').appendTo($('body')).hide();
            }

            if (timer != null) {
                try {
                    window.clearTimeout(timer);
                } catch (e) {
                }
                timer = null;
                loading.hide();

            }

            timer = window.setTimeout(function () {
                loading.height($(document).height()).width($(document).width()).css('position', 'fixed').show();
            }, 1500);

            return xhr;
        },
        complete: function (jqXHR, textStatus) {
            //console.log('complete');
            $.each($('[data-ajax-lock=true]'), function () {
                $.fn.enableAjaxElement($(this));
            })
            window.clearTimeout(timer);
            loading.hide();
            timer = null;

            var message = jqXHR.getResponseHeader('X-EBA-Message');
            var command = jqXHR.getResponseHeader('X-EBA-Command');

            if (message) {
                alert(decodeURI(message));
            }

            if (command) {
                eval(decodeURI(command));
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            //            if (typeof (console) != undefined) {
            //                console.log(textStatus);
            //                console.log(jqXHR.responseText);
            //            }

            if (jqXHR.status == 568) {
                window.location = jqXHR.getResponseHeader('Location');
            } else {
                if (typeof (jqXHR.responseText) != 'undefined') {
                    try {
                        var json = jQuery.parseJSON(jqXHR.responseText);
                        if (json.error) {
                            alert(json.error);
                        }
                    } catch (err) {
                        if (jqXHR.responseText) {
                            alert(jqXHR.responseText);
                        }
                    }
                }
            }
        },
        statusCode: {
            568: function (data) {
                // debugger;
            }
        },
        dataType: 'json'
    });

    $('[data-ajax-method]').click(function (e) {
        e.preventDefault();

        var form = $(this).data('ajax-form');
        var action = null;

        if (form == undefined) {
            form = $(this).parents('form:first');
            action = form.attr('action');
        } else {
            action = form.data('ajax-action');
        }
        if ($(form).validate() === true) {
            form.find('input[name=__EVENTTARGET]').val($(this).attr('id'));
            form.find('input[name=__EVENTARGUMEN]').val('');

            var data = form.serialize();

            var method = $(this).data('ajax-method');


            if (data.length > 0) {
                data += '&__Method=' + method;
            } else {
                data += '__Method=' + method;
            }


            var params = $(this).data('ajax-params');

            if (params != undefined) {
                data += '&' + params;
            }



            var callback = $(this).data('ajax-callback');
            $.post(action, data, function (data) {

                if (callback) {
                    reviseJson(data);
                    window[callback](data);
                }
            });
        }

        return false;
    });

    $.fn.ajaxPost = function (options) {
        var opts = $.extend({}, { form: $('form:first'), validate: null, enableValidate: true }, options);

        var validate;
        if (opts.validate) {
            validate = opts.validate;
        } else {
            validate = function () {
                var name = opts.form.attr('data-ajax-validate');
                var fn = window[name];
                if (name && fn) {
                    return fn();
                } else {
                    return true;
                }
            };
        }

        if (opts.enableValidate) {
            if ($(opts.form).validate() === false || validate() === false) {
                $.each($('[data-ajax-lock=true]'), function () {
                    $.fn.enableAjaxElement($(this));
                })
                return;
            }
        }

        var action = opts.action || opts.form.attr('action');

        var data = opts.form.serialize();

        var method = opts.method;
        if (data.length > 0) {
            data += '&__Method=' + method;
        } else {
            data += '__Method=' + method;
        }

        if (opts.params != null) {
            if (typeof (opts.params) == 'string') {
                data = data + '&' + encodeURIComponent(opts.params);
            }

            if (typeof (opts.params) == 'object') {
                for (var i in opts.params) {
                    data = data + '&' + i + '=' + encodeURIComponent(opts.params[i]);
                }
            }
        }

        $.post(action, data, function (result) {
            if (opts.callback) {
                reviseJson(result);
                opts.callback(result);
            }
        });

    };

    $.fn.enableAjaxElement = function (e) {
        if (e.data('disabled')) {
            if (e.is('a')) {
                e.removeAttr('onclick');
            } else {
                e.removeAttr('disabled', true);
            }
        }
    }
});