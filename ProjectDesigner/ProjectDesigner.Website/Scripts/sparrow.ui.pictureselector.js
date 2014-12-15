/// <reference path="jquery-1.7.min.js" />
/// <reference path="jquery.tmpl.js" />
/// <reference path="sparrow.ui.win.js" />

(function ($) {
    $.fn.pictureselector = function (options) {
        var opts = $.extend({}, $.fn.pictureselector.defaults, options);

        return this.each(function () {

            var $this = $(this);

            if ($this.find('ul').size() == 0) {
                $this.append($('<ul>'));
            }

            $this.find('li').live('mouseenter', function () {
                if ($(this).is('.add-file-link')) {

                } else {
                    $(this).find('img').animate({ opacity: 0.2 }, 10);
                    $(this).find('.buttons').show();
                }
            }).live('mouseleave', function () {
                if ($(this).is('.add-file-link')) {

                } else {
                    $(this).find('img').animate({ opacity: 1 }, 10);
                    $(this).find('.buttons').hide();
                }

                $(this).find('img').removeAttr('style');
            }).each(function () {

                $('<div class="buttons"><a href="#" title="取消"></a></div>').appendTo($(this)).find('a').click(function (e) {
                    e.preventDefault();
                    var selecotr = $(this).parent().parent().parent().parent();
                    $(this).parent().parent().remove();
                    checkMax(selecotr);
                    $(this).ajaxPost({ method: 'DeletePicture', params: { 'PictureName': escape(file) }, callback: function (data) { } });
                });

                var name = $(this).parent().parent().attr('id');

                var file = $(this).find('input').attr('name', name).val();
                var ftype = file.substr(file.lastIndexOf('.') + 1, 3);
                //var fileName = file.substr(file.lastIndexOf('/') + 1, 8);
                var fileName = file;
                var PictureName = $(this).find('input').attr('name', name).data('name');
                //var pictureName = file.substr(8);

                //var icon = opts.icons[ftype];
                $(this).append($('<img>').attr('src', fileName).attr('title', PictureName));

                //                if (icon) {
                //                    $(this).append($('<img>').attr('src', sparrow.settings.baseUrl + 'images/icons/' + icon).attr('title', fileName));
                //                } else {
                //                    $(this).append($('<img>').attr('src', sparrow.settings.baseUrl + 'UploadFile/CMSItemsPicture/' + fileName).attr('title', pictureName));
                //                }
            });




            $('<li class="add-file-link"><a href="#" title="选择文件"></a></li>').appendTo($this.find('ul')).find('a').click(function (e) {
                e.preventDefault();
                $(this).win({ url: 'CMSPictureEdit.aspx', width: 642, height: 235, callback: function (items) {
                    callback(items);
                }
                }).show();
            });

            var callback = function (sender) {
                return function (items) {
                    var list = sender.find('ul');

                    var max = sender.data('max');
                    if (isNaN(max)) {
                        max = 1000;
                    }

                    if ((items.length + sender.find('li:not(.add-file-link)').size()) > max) {
                        alert('最多只允许选择' + max + '个文件');
                    } else {
                        var file = items;
                        var item = $('<li>');

                        $('<div class="buttons"><a href="#" title="取消"></a></div>').appendTo(item).find('a').click(function (e) {
                            e.preventDefault();
                            var selecotr = $(this).parent().parent().parent().parent();
                            $(this).parent().parent().remove();
                            checkMax(selecotr);

                        });
                        item.append($('<img>').attr('src', file.FileName).attr('title', file.FileName));


                        var input = $('<input type="hidden" />').val(file.FileName).attr('name', sender.attr('id'));
                        item.append(input);

                        item.insertBefore(list.find('.add-file-link'));


                        checkMax(sender);
                    }
                }
            } ($this);

            checkMax($this);

            function checkMax(sender) {

                var max = sender.data('max');
                if (isNaN(max)) {
                    max = 1000;
                }
                if ($this.find('li:not(.add-file-link)').size() < max) {
                    $this.find('.add-file-link').show();
                } else {
                    $this.find('.add-file-link').hide();
                }
            }
        });

    }


    $.fn.pictureselector.defaults = { icons: {
        'ppt': 'icons_ppt.png',
        'doc': 'icons_doc.png',
        'docx': 'icons_doc.png',
        'xls': 'icons_xls.png'
    }
    };

})(jQuery);

$(function () {
    $('.pictureselector').pictureselector();
})
