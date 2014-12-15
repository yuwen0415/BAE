/// <reference path="jquery-1.7.min.js" />
/// <reference path="jquery.tmpl.js" />
/// <reference path="sparrow.ui.win.js" />

(function ($) {
    $.fn.pictureselector_popup = function (options) {
        var opts = $.extend({}, $.fn.pictureselector_popup.defaults, options);

        return this.each(function () {

            var $this = $(this);

            if ($this.find('ul').size() == 0) {
                $this.append($('<ul>'));
            }

            $this.find('li').live('mouseenter', function () {
                $(this).find('img').animate({ opacity: 0.2 }, 10);
                $(this).find('.buttons').show();
            }).live('mouseleave', function () {
                $(this).find('.buttons').hide();
                $(this).find('img').animate({ opacity: 1 }, 10);
                $(this).find('img').removeAttr('style');
            }).each(function () {

                $('<div class="buttons"><a href="#" title="选择"></a></div>').appendTo($(this)).find('a').click(function (e) {
                    e.preventDefault();
                    var selecotr = $(this).parent().parent().parent().parent();
                    var pic = { 'id':id, 'file': file, 'fileName': fileName, 'ftype': ftype, 'pictureName': pictureName }
                    $.fn.win.close(pic);
                });

                var name = $(this).parent().parent().attr('id');

                var file = $(this).find('input').attr('name', name).val();
                var id = $(this).find('input').data('id');
                var ftype = file.substr(file.lastIndexOf('.') + 1, 3);
                //var fileName = file.substr(file.lastIndexOf('/') + 1, 8);
                var fileName = file;
                var pictureName = file.substr(8);

                //var icon = opts.icons[ftype];
                $(this).append($('<img>').attr('src', fileName).attr('title', fileName));
                //                if (icon) {
                //                    $(this).append($('<img>').attr('src', sparrow.settings.baseUrl + 'images/icons/' + icon).attr('title', fileName));
                //                } else {
                //                    $(this).append($('<img>').attr('src', sparrow.settings.baseUrl + 'UploadFile/CMSItemsPicture/' + fileName).attr('title', pictureName));
                //                }
            });
        });

    }


    $.fn.pictureselector_popup.defaults = { icons: {
        'ppt': 'icons_ppt.png',
        'doc': 'icons_doc.png',
        'docx': 'icons_doc.png',
        'xls': 'icons_xls.png'
    }
    };

})(jQuery);

$(function () {
    $('.pictureselector_popup').pictureselector_popup();
})
