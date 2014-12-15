



(function ($) {

    /*win*/
    $.fn.datetimepicker = function (options) {

        var opts = $.extend({}, $.fn.datetimepicker.defaults, options);


        return this.each(function () {
            $(this).attr('data-format', opts.format);


            $(this).click(function (e) {
                e.preventDefault();

                showPicker($(this));

            }).focus(function (e) {
                e.preventDefault();
                showPicker($(this));

            }).keydown(function (e) {
                e.preventDefault();
                return false;
            }).keyup(function (e) {
                e.preventDefault();
                return false;
            });




            function showPicker(sender) {
                var format = sender.attr('data-format');
                var container = $('#datetimepicker');

                if (container.size() == 0) {

                    container = $('<div id="datetimepicker">' +
                                  '	 <div class="left"></div>' +
                                  '    <div class="center">' +
                                  '     <div class="close"><a href="#"></a></div>' +
                                  '    	<ul>                   ' +
                                  '        <li data-item="year">                                      ' +
                                  '            <div><a class="increase" href="#"></a></div>        ' +
                                  '            <div class="num"><input name="" type="text"></div>  ' +
                                  '            <div><a class="reduce" href="#"></a></div>          ' +
                                  '        </li>                                                   ' +
                                  '        <li data-item="month">                                      ' +
                                  '            <div><a class="increase" href="#"></a></div>        ' +
                                  '            <div class="num"><input name="" type="text"></div>  ' +
                                  '            <div><a class="reduce" href="#"></a></div>          ' +
                                  '        </li>                                                   ' +
                                  '        <li data-item="day">                                      ' +
                                  '            <div><a class="increase" href="#"></a></div>        ' +
                                  '            <div class="num"><input name="" type="text"></div>  ' +
                                  '            <div><a class="reduce" href="#"></a></div>          ' +
                                  '        </li>                                                   ' +
                                  '        <li data-item="hours">                                      ' +
                                  '            <div><a class="increase" href="#"></a></div>        ' +
                                  '            <div class="num"><input name="" type="text"></div>  ' +
                                  '            <div><a class="reduce" href="#"></a></div>          ' +
                                  '        </li>                                                   ' +
                                  '        <li data-item="minutes">                                      ' +
                                  '            <div><a class="increase" href="#"></a></div>        ' +
                                  '            <div class="num"><input name="" type="text"></div>  ' +
                                  '            <div><a class="reduce" href="#"></a></div>          ' +
                                  '        </li>' +
                                  '     </ul>                 ' +
                                  '     <div>                 ' +
                                  '         <a class="yes" href="#"></a>' +
                                  '         <a class="no" href="#"></a>' +
                                  '     </div>                ' +
                                  '    </div>                    ' +
                                  '    <div class="right"></div> ' +
                                  '</div>');

                    container.appendTo($('body'));

                    function hideMe() {
                        container.removeAttr('style').hide().find('li[data-item="hours"]').removeAttr('style'); ;

                    }

                    container.find('.close').click(function (e) {
                        e.preventDefault();


                        hideMe();

                    }).end().find('.yes').click(function (e) {
                        e.preventDefault();

                        var sender = $(this).parent().parent().parent().data('target');
                        var format = sender.attr('data-format');

                        var year = container.find('ul li[data-item="year"] input').val();
                        var month = container.find('ul li[data-item="month"] input').val();
                        var day = container.find('ul li[data-item="day"] input').val();
                        var hours = container.find('ul li[data-item="hours"] input').val();
                        var minutes = container.find('ul li[data-item="minutes"] input').val();

                        switch (format) {

                            case 'yyyy-MM-dd HH:mm':
                                sender.val(year + '-' + month + '-' + day + ' ' + hours + ':' + minutes);
                                break;
                            case 'HH:mm':
                                sender.val(hours + ':' + minutes);
                                break;
                            case 'yyyy':
                                sender.val(year);
                                break;

                            default: //yyyy-MM-dd
                                sender.val(year + '-' + month + '-' + day);
                                break;
                        }

                        var callback_method = $(sender).attr("data-callback");
                        if (callback_method) {
                            var callback = window[callback_method];
                            callback();
                        }

                        hideMe();

                    }).end().find('.no').click(function (e) {
                        e.preventDefault();
                        var sender = $(this).parent().parent().parent().data('target');
                        sender.val('');
                        hideMe();
                    }).end().find('li[data-item="year"] a:first').click(function (e) {
                        e.preventDefault();
                        var input = $(this).parent().next().find('input');
                        var v = parseInt(input.val(), 10) + 1;
                        input.val(v).data('val', v);
                    }).end().find('li[data-item="year"] a:last').click(function (e) {
                        e.preventDefault();
                        var input = $(this).parent().prev().find('input');
                        var v = parseInt(input.val(), 10) - 1;
                        input.val(v).data('val', v);
                    }).end().find('li[data-item="month"] a:first').click(function (e) {
                        e.preventDefault();
                        var input = $(this).parent().next().find('input');
                        var v = parseInt(input.val(), 10) + 1;

                        if (v > 12) {
                            v = 1;
                        } else if (v < 1) {
                            v = 12;
                        }
                        input.val(toPadLeft(v, 2, '0'));
                        updateDate();

                    }).end().find('li[data-item="month"] a:last').click(function (e) {
                        e.preventDefault();
                        var input = $(this).parent().prev().find('input');
                        var v = parseInt(input.val(), 10) - 1;
                        if (v > 12) {
                            v = 1;
                        } else if (v < 1) {
                            v = 12;
                        }

                        input.val(toPadLeft(v, 2, '0'));
                        updateDate(true);

                    }).end().find('li[data-item="day"] a:first').click(function (e) {
                        e.preventDefault();
                        var input = $(this).parent().next().find('input');
                        var v = parseInt(input.val(), 10) + 1;

                        if (v > 31) {
                            v = 1;
                        } else if (v < 0) {
                            v = 30;
                        }

                        input.val(toPadLeft(v, 2, '0'));
                        updateDate();

                    }).end().find('li[data-item="day"] a:last').click(function (e) {
                        e.preventDefault();
                        var input = $(this).parent().prev().find('input');
                        var v = parseInt(input.val(), 10) - 1;
                        if (v > 31) {
                            v = 1;
                        } else if (v < 1) {
                            v = 31;
                        }

                        input.val(toPadLeft(v, 2, '0'));
                        updateDate(true);

                    }).end().find('li[data-item="hours"] a:first').click(function (e) {
                        e.preventDefault();
                        var input = $(this).parent().next().find('input');
                        var v = parseInt(input.val(), 10) + 1;
                        if (v > 23) {
                            v = 0;
                        } else if (v < 0) {
                            v = 23;
                        }

                        input.val(toPadLeft(v, 2, '0')).data('val', toPadLeft(v, 2, '0'));

                    }).end().find('li[data-item="hours"] a:last').click(function (e) {
                        e.preventDefault();
                        var input = $(this).parent().prev().find('input');
                        var v = parseInt(input.val(), 10) - 1;
                        if (v > 23) {
                            v = 0;
                        } else if (v < 0) {
                            v = 23;
                        }
                        input.val(toPadLeft(v, 2, '0')).data('val', toPadLeft(v, 2, '0'));

                    }).end().find('li[data-item="minutes"] a:first').click(function (e) {
                        e.preventDefault();
                        var input = $(this).parent().next().find('input');
                        var v = parseInt(input.val(), 10) + 1;
                        if (v > 59) {
                            v = 0;
                        } else if (v < 0) {
                            v = 59;
                        }

                        input.val(toPadLeft(v, 2, '0')).data('val', toPadLeft(v, 2, '0'));

                    }).end().find('li[data-item="minutes"] a:last').click(function (e) {
                        e.preventDefault();
                        var input = $(this).parent().prev().find('input');
                        var v = parseInt(input.val(), 10) - 1;
                        if (v > 59) {
                            v = 0;
                        } else if (v < 0) {
                            v = 59;
                        }
                        input.val(toPadLeft(v, 2, '0')).data('val', toPadLeft(v, 2, '0'));

                    }).end().find('.num input').change(function (e) {
                        e.preventDefault();
                        var val = $.trim($(this).val());
                        if (val != '' && /^[0-9]\d*$/.test(val)) {
                            switch ($(this).parent().parent().data('item')) {
                                case 'year':
                                    if (val.length != 4) {
                                        $(this).val($(this).data('val'));
                                    }
                                    break;
                                case 'month':
                                    if (val > 12 || val < 1) {
                                        $(this).val($(this).data('val'));
                                    } else {
                                        $(this).val(toPadLeft(val, 2, '0'));
                                    }
                                    updateDate();
                                    break;
                                case 'day':
                                    if (val > 31 || val < 1) {
                                        $(this).val($(this).data('val'));
                                    } else {
                                        $(this).val(toPadLeft(val, 2, '0'));
                                    }
                                    updateDate();
                                    break;
                                case 'hours':
                                    if (val > 23) {
                                        $(this).val($(this).data('val'));
                                    } else {
                                        $(this).val(toPadLeft(val, 2, '0'));
                                    }
                                    break;
                                case 'minutes':
                                    if (val > 59) {
                                        $(this).val($(this).data('val'));
                                    } else {
                                        $(this).val(toPadLeft(val, 2, '0'));
                                    }
                                    break;
                                default:
                                    break;
                            }
                            $(this).data('val', $(this).val());
                        }
                        else {
                            $(this).val($(this).data('val'));
                        }
                    });
                }
                function updateDate(isReduce) {
                    var _date;
                    var _year;
                    var _month;
                    var _day;
                    _year = container.find('li[data-item=year] .num input').val();
                    _month = container.find('li[data-item=month] .num input').val();
                    _day = container.find('li[data-item=day] .num input').val();
                    _date = new Date(_year + '/' + _month + '/' + _day);
                    if (isReduce) {
                        if (_date.getMonth() + 1 > _month) {
                            _date = new Date(_year + '/' + _month + '/' + (_day - 1));
                        }
                    }
                    container.find('li[data-item=year] .num input').val(toPadLeft(_date.getFullYear(), 2, '0'))
                    .data('val', toPadLeft(_date.getFullYear(), 2, '0'));
                    container.find('li[data-item=month] .num input').val(toPadLeft(_date.getMonth() + 1, 2, '0'))
                    .data('val', toPadLeft(_date.getMonth() + 1, 2, '0'));
                    container.find('li[data-item=day] .num input').val(toPadLeft(_date.getDate(), 2, '0'))
                    .data('val', toPadLeft(_date.getDate(), 2, '0'));
                }
                container.data('target', sender);
                container.find('ul li').hide();
                var val = new Date();




                if ($.trim(sender.val()) != "") {
                    val = parseDate(sender.val(), format);
                }
                if (val) {
                    //TODO:完善各种格式支持
                    switch (format) {

                        case 'yyyy-MM-dd HH:mm':
                            showYear();
                            showMonth();
                            showDay();
                            showHours();
                            showMinutes();
                            break;
                        case 'HH:mm':
                            container.find('li[data-item="hours"]').css('padding-left', '20px');

                            showHours();
                            showMinutes();
                            break;
                        case 'yyyy':
                            container.find('li[data-item="year"]').css('padding-left', '47px');
                            showYear();
                            break;

                        default: //yyyy-MM-dd 
                            showYear();
                            showMonth();
                            showDay();

                    }
                }
                function parseDate(sender, format) {
                    var date;
                    var time;
                    switch (format) {
                        case 'yyyy-MM-dd HH:mm':
                            if (/^\d{4}-[0-1]{1}\d{1}-[0-3]{1}\d{1} [0-2]{1}\d{1}:[0-5]{1}\d{1}?$/.test(sender) == false) {
                                return new Date();
                            }
                            else {
                                date = sender.split(' ')[0].split('-');
                                time = sender.split(' ')[1].split(':');
                                return new Date(date[0] + '/' + date[1] + '/' + date[2] + ' ' + time[0] + ':' + time[1]);
                            }
                        case 'HH:mm':
                            if (/^(0\d{1}|1\d{1}|2[0-3]):([0-5]\d{1})$/.test(sender) == false) {
                                return new Date();
                            }
                            else {
                                time = sender.split(':');
                                return new Date('2012/03/27 ' + time[0] + ':' + time[1]);
                            }
                        case 'yyyy':
                            if (/^\d{4}$/.test(sender) == false) {
                                return new Date();
                            }
                            else {
                                date = sender;
                                return new Date(date+'/03/27 00:00');
                            }
                        default:
                            if (/^\d{4}-[0-1]{1}\d{1}-[0-3]{1}\d{1}?$/.test(sender) == false) {
                                return new Date();
                            }
                            else {
                                date = sender.split('-');
                                return new Date(date[0] + '/' + date[1] + '/' + date[2]);
                            }
                    }
                }

                function showYear() {
                    container.find('ul li[data-item="year"]').find('input').val(val.getFullYear()).data('val', val.getFullYear()).end().show();
                }

                function showMonth() {
                    container.find('ul li[data-item="month"]').find('input').val(toPadLeft(val.getMonth() + 1, 2, '0')).data('val', toPadLeft(val.getMonth() + 1, 2, '0')).end().show();
                }

                function showDay() {
                    container.find('ul li[data-item="day"]').find('input').val(toPadLeft(val.getDate(), 2, '0')).data('val', toPadLeft(val.getDate(), 2, '0')).end().show();
                }

                function showHours() {
                    container.find('ul li[data-item="hours"]').find('input').val(toPadLeft(val.getHours(), 2, '0')).data('val', toPadLeft(val.getHours(), 2, '0')).end().show();
                }

                function showMinutes() {
                    container.find('ul li[data-item="minutes"]').find('input').val(toPadLeft(val.getMinutes(), 2, '0')).data('val', toPadLeft(val.getMinutes(), 2, '0')).end().show();
                }


                var offset = sender.offset();

                var newOffset = { left: offset.left, top: offset.top + sender.height() + 1 };

                if ((offset.left + container.width()) > $(window).width()) {
                    newOffset.left = $(window).width() - container.width();
                }

                container.offset(newOffset).fadeIn('slow');

            };

        });
    };



    $.fn.datetimepicker.defaults = { format: 'yyyy-DD-mm HH:mm' };

})(jQuery);
