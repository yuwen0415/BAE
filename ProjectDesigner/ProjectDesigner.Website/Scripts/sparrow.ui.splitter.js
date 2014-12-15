/// <reference path="jquery-1.7.min.js" />

(function ($) {
    $.fn.splitter = function (options) {

        var opts = $.extend({}, $.fn.splitter.defaults, options);



        function resize(sender) {
            var $sender = $(sender);
            var exclude_height = 1;
            var exclude_width = 0;

            var data_exclude_height = $sender.data('exclude-height');
            var data_exclude_width = $sender.data('exclude-width');
            var data_internal_exclude_height = $sender.data('internal-exclude-height');

            if (typeof (data_exclude_height) != 'undefined') {
                if (isNaN(data_exclude_height)) {
                    var h_items = data_exclude_height.split(',');
                    for (var i in h_items) {
                        exclude_height += allheight($(h_items[i]));
                    }
                } else {
                    exclude_height = data_exclude_height;
                }
            }

            if (typeof (data_exclude_width) != 'undefined') {
                if (isNaN(data_exclude_width)) {
                    var w_items = data_exclude_width.split(',');
                    for (var i in w_items) {
                        exclude_width += allwidth($(w_items[i]));
                    }
                } else {
                    exclude_width = data_exclude_width;
                }
            }

            var bodyh = $(window).height() - exclude_height;
            var bodyw = $(window).width() - exclude_width;

            sender.height(bodyh);
            sender.width(bodyw);


            exclude_height = 0;
            if (typeof (data_internal_exclude_height) != 'undefined') {
                if (isNaN(data_internal_exclude_height)) {
                    var h_items = data_internal_exclude_height.split(',');
                    for (var i in w_items) {
                        exclude_height += allheight($(h_items[i]));
                    }
                } else {
                    exclude_height = data_internal_exclude_height;
                }
            }
            bodyh = bodyh - exclude_height;
            var left = sender.find('.left-panel');
            var minWidth = left.data('minwidth');
            if (minWidth) {
            }
            else {
                minWidth = 200;
            }
            left.width(minWidth);
            //console.log(bodyh);
            left.height(bodyh);

            //console.log(left.height());

            var right = sender.find('.right-panel');

            // right.width(bodyw - minWidth - sender.find('.splitter-bar').width());
            right.height(bodyh);

        }

        $(window).resize(function () {
            $('.splitter').each(function () {
                resize($(this));
            });
        });

        return this.each(function () {
            resize($(this));
        });

        function allheight(e) {
            if (e.length != 0) {
                var margin_t = e.css('margin-top').replace('px', '');
                var margin_b = e.css('margin-bottom').replace('px', '');
                var padding_t = e.css('padding-top').replace('px', '');
                var padding_b = e.css('padding-bottom').replace('px', '');

                margin_t = isNaN(Number(margin_t)) ? 0 : Number(margin_t);
                margin_b = isNaN(Number(margin_b)) ? 0 : Number(margin_b);
                padding_t = isNaN(Number(padding_t)) ? 0 : Number(padding_t);
                padding_b = isNaN(Number(padding_b)) ? 0 : Number(padding_b);

                return e.height() + margin_t + margin_b + padding_t + padding_b;
            } else {
                return 0;
            }
        }
        function allwidth(e) {
            if (e.length!=0) {
                var margin_l = e.css('margin-left').replace('px', '');
                var margin_r = e.css('margin-right').replace('px', '');
                var padding_l = e.css('padding-left').replace('px', '');
                var padding_r = e.css('padding-right').replace('px', '');

                margin_l = isNaN(Number(margin_l)) ? 0 : Number(margin_l);
                margin_r = isNaN(Number(margin_r)) ? 0 : Number(margin_r);
                padding_l = isNaN(Number(padding_l)) ? 0 : Number(padding_l);
                padding_r = isNaN(Number(padding_r)) ? 0 : Number(padding_r);

                return e.width() + margin_l + margin_r + padding_l + padding_r;
            } else {
                return 0;
            }
        }
    }

    $.fn.splitter.defaults = {};

})(jQuery);


$(function () {
    $('.splitter').splitter();


})  
