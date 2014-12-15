(function ($) {
    $.fn.photo = function (options) {
        var opts = $.extend({}, $.fn.photo.defaults, options);


        $(window).resize(function () {
            resize($(this));
        });

        function resize() {
            var iframe = $('#fullscreen_dialog_frame');
            iframe.width($(window).width())
                .height($(window).height());
        }



        return this.each(function () {

            var $this = $(this);


            var iframe = $('#fullscreen_dialog_frame');
            if (iframe.size() == 0) {
                iframe = $('<iframe frameborder="no" id="fullscreen_dialog_frame" allowtransparency="yes" style="display:none;position:fixed;left:0;top:0;"></iframe>').appendTo($('body'));
            }

            var url = $this.attr('src');

            resize();


            iframe.attr('src', photoUrl() + '?url=' + url).fadeIn('show');


            function photoUrl() {
                var pathname = window.location.pathname;
                var paths = pathname.split('/');

                if (paths[1] === 'scripts') {
                    return opts.photoUrl;
                }
                else {
                    return 'http://' + window.location.host + '/scripts/' + opts.photoUrl;
                }
            }
        });
    }
    $.fn.photo.defaults = { photoUrl: 'photo/photo.htm' };
})(jQuery);


var closeFullScreenDialog = function () {
    $('#fullscreen_dialog_frame').fadeOut('show');
} 