
(function ($) {
    $.fn.spinner = function (options) {
        var opts = $.extend({}, $.fn.spinner.defaults, options);

        return this.each(function () {
            var $this = $(this);
             

            var widget = $('<span class="ui-spinner ui-widget"></span>');
            var btnContainer = $('<div class="ui-spinner-buttons">' +
					            '<div class="ui-spinner-up ui-spinner-button ui-state-default ui-corner-tr"><span class="ui-icon ' + opts.upIconClass + '">&nbsp;</span></div>' +
					            '<div class="ui-spinner-down ui-spinner-button ui-state-default ui-corner-br"><span class="ui-icon ' + opts.downIconClass + '">&nbsp;</span></div>' +
				            '</div>');

            //            var spinner_up = $('<div class="ui-spinner-up ui-spinner-button ui-state-default ui-corner-tr"></div>');
            //            var spinner_up_span = $('<span class="ui-icon ' + settings.pIconClass + '"></span>');
            //            var spinner_down = $('<div class="ui-spinner-down ui-spinner-button ui-state-default ui-corner-br"></div>');
            //            var spinner_down_span = $('<span class="ui-icon ' + settings.downIconClass + '"></span>');

            var rightMargin  = getPixels('margin-right');

            $this.css({
                width: ($this.width() - opts.width) + 'px',
                marginRight: rightMargin + opts.width,
                textAlign: 'right'
            })
            .after(widget);

            widget.append(btnContainer.css({
                height: getHeight(),
                left: -opts.width - rightMargin,
                top: ($this.offset().top - widget.offset().top) + 'px'
            }));


            function getPixels(style) {
                var pixel = $this.css(style);
                return pixel == 'auto' ? 0 : parseInt(pixel.replace('px'));
            }

            function getHeight() {
                return $this.height() + getPixels('padding-top') + getPixels('padding-bottom');
            }
        });
    }
    $.fn.spinner.defaults = {
        min: null,
        max: null,
        width: 16,
        pIconClass: "ui-icon-triangle-1-n",
        downIconClass: "ui-icon-triangle-1-s"
    };
})(jQuery);

$(function () {
    $('.spinner').spinner();
})