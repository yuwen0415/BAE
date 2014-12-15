/// <reference path="jquery-1.7.min.js" />
/// <reference path="jquery.tmpl.js" />
/// <reference path="sparrow.ui.win.js" />
/// <reference path="fancybox/jquery.mousewheel-3.0.4.pack.js" />

/// <reference path="fancybox/jquery.fancybox-1.3.4.pack.js" />

/// <reference path="fancybox/jquery.easing-1.3.pack.js" />


(function ($) {
    $.fn.fileselector = function (options) {
        var opts = $.extend({}, $.fn.fileselector.defaults, options);
        return this.each(function () {

            var $this = $(this);

            var settings = opts.getSettings($this);
            /*helpers*/

            function buildThumbnail(ftype, furl, fname) {
                var img;
                ftype = ftype.toLowerCase();
                var icon = opts.icons[ftype];
                if (icon) {
                    img = $('<img>').attr('src', sparrow.settings.baseUrl + 'images/icons/' + icon).attr('alt', fname);
                    img.mousemove(function (e) {
                        img.showTips('[点击下载]' + $(this).attr('alt'), { mouse: e });
                    });
                    img.click(function (e) {

                        window.open(sparrow.settings.baseUrl + 'FileHandler.ashx?type=attachment&fileName=' + $(this).parent().find('input:first').val());
                    });
                } else {
                    var intype = false;
                    for (var i in opts.type['img']) {
                        if (ftype == opts.type['img'][i]) {
                            intype = true;
                            break;
                        }
                    }

                    img = $('<img>').attr('src', (intype ? furl : sparrow.settings.baseUrl + 'images/icons/' + opts.icons['file'])).attr('alt', fname);
                    //img.fancybox();
                    img.click(function () {
                        img.photo();
                    })
                    img.mousemove(function (e) {
                        img.showTips('[点击查看]' + $(this).attr('alt'), { mouse: e });
                    });
                    img.resize(function () {
                        scale(img);
                    })
                }

                img.mouseleave(function () {
                    $(this).hideTips();
                });

                return img;
            }

            /*helpers*/

            if ($this.find('ul').size() == 0) {
                $this.append($('<ul>'));
            }

            $this.find('li').live('mouseenter', function () {
                if ($(this).is('.add-file-link')) {

                } else {
                    $(this).find('img').animate({ opacity: 0.2 }, 10);
                    if (settings.state != 'view') {
                        $(this).find('.buttons').show();
                    }
                }
            }).live('mouseleave', function () {
                if ($(this).is('.add-file-link')) {

                } else {
                    $(this).find('.buttons').hide();
                }

                $(this).find('img').removeAttr('style');
            }).each(function () {

                $('<div class="buttons"><a href="#" title="取消"></a></div>').appendTo($(this)).find('a').click(function (e) {
                    e.preventDefault();
                    var selecotr = $(this).parent().parent().parent().parent();
                    $(this).parent().parent().remove();
                    checkMax(selecotr);

                });

                var name = $(this).parent().parent().attr('id');
                var input = $(this).find('input');
                var file;
                var fileid;
                var ftype;
                var fileurl;
                var fileName;
                if (input.attr('filename')) {
                    fileid = input.attr('attachmentid');
                    fileurl = 'FileOutput.ashx?id=' + input.val();
                    if (input.val().substring(0, 1) == '/' || input.val().substring(0, 7) == 'http://') {
                        file = input.val();
                    } else {
                        file = sparrow.settings.baseUrl + 'FileOutput.ashx?id=' + input.val() + '&thumbnail=true';
                    }
                    ftype = input.attr('filetype');
                    fileName = input.attr('filename');
                }
                else {
                    fileurl = input.val();
                    file = input.val().substring(0, 1) == '/' ? input.val() : sparrow.settings.baseUrl + input.val();
                    ftype = file.substr(file.lastIndexOf('.') + 1);
                    fileName = file.indexOf('=') > 0 ? file.substr(file.lastIndexOf('=') + 1) : file.substr(file.lastIndexOf('/') + 1);
                }
                var fileid_input = $('<input type="hidden" />').val(fileid).attr('name', name + '_id');
                var fileurl_input = $('<input type="hidden" />').val(fileurl).attr('name', name + '_url');

                var img = buildThumbnail(ftype, file, fileName);
                $(this).append(img).append(fileid_input).append(fileurl_input);

                //scale(img);
            });


            function scale(img) {
                //                console.log(img.width());
                //                console.log(img.height());
            }


            $('<li class="add-file-link"><a href="#" title="选择文件"></a></li>').appendTo($this.find('ul')).find('a').click(function (e) {
                e.preventDefault();
                var url = '../FileSelect.aspx';
                var width = 655;
                var height = 300;
                if (settings.view == 'advanced') {
                    url = '../FileRun.aspx';
                    width = 840;
                    height = 600;
                }
                $(this).win({
                    url: url, width: width, height: height, callback: function (items) {
                        callback(items);
                    }, data: { 'max': settings.max, 'category': settings.category, 'type': settings.type, 'view': settings.view, 'showSenior': settings.showSenior }
                }).show();
            });



            var callback = function (sender) {
                return function (items) {
                    var list = sender.find('ul');

                    if ((items.length + sender.find('li:not(.add-file-link)').size()) > settings.max) {
                        alert('最多只允许选择' + settings.max + '个文件');
                    } else {
                        var ontype = true;
                        if (settings.type) {
                            for (var i in items) {
                                if (ontype) {
                                    var file = items[i];
                                    var intype = false;
                                    for (var t in opts.type[settings.type]) {
                                        if (opts.type[settings.type][t] == file.ftype.toLowerCase()) {
                                            intype = true;
                                            break;
                                        }
                                    }
                                    ontype = intype;
                                }
                                else {
                                    break;
                                }
                            }
                        }
                        if (!ontype) {
                            alert('请选择' + settings.type + '类型的文件！');
                        } else {
                            for (var i in items) {
                                var file = items[i];
                                var item = $('<li>');
                                $('<div class="buttons"><a href="#" title="取消"></a></div>').appendTo(item).find('a').click(function (e) {
                                    e.preventDefault();
                                    var selecotr = $(this).parent().parent().parent().parent();
                                    $(this).parent().parent().remove();
                                    checkMax(selecotr);

                                });

                                item.append(buildThumbnail(file.ftype, decodeURIComponent(file.furl), file.fname));

                                var input = $('<input type="hidden" />').val(file.fguid).attr('name', sender.attr('id'));
                                var fileid_input = $('<input type="hidden" />').val(file.fid).attr('name', sender.attr('id') + '_id');
                                var fileurl_input = $('<input type="hidden" />').val(decodeURIComponent(file.furl)).attr('name', sender.attr('id') + '_url');
                                item.append(input).append(fileid_input).append(fileurl_input);

                                item.insertBefore(list.find('.add-file-link'));
                            }
                            checkMax(sender);
                        }
                    }
                }
            }($this);

            checkMax($this);

            function checkMax(sender) {
                if ($this.find('li:not(.add-file-link)').size() < settings.max && settings.state != 'view') {
                    $this.find('.add-file-link').show();
                } else {
                    $this.find('.add-file-link').hide();
                }
            }
        });

    }

    $.fn.fileselector.filesbind = function (el, data) {
        var $this = el;
        var ul = $('<ul></ul>');

        $this.empty();

        for (var i in data) {
            var li = $('<li></li>');
            var input = $('<input type="hidden" />')
            input.val(data[i].GUID).attr('name', $this.attr('id')).attr('filename', data[i].Name).attr('attachmentid', data[i].AttachmentID).attr('filetype', data[i].Type);
            ul.append(li.append(input));
        }
        $this.append(ul).fileselector();
    }

    $.fn.fileselector.getAttachmentID = function (el) {
        var $this = el;
        var ids = [];

        $this.find('input[name=' + $this.attr('id') + '_id]').each(function () {
            ids.push($(this).val());
        });
        return ids;
    }

    $.fn.fileselector.defaults = {
        icons: {
            'ppt': 'icons_ppt.png',
            'pptx': 'icons_ppt.png',
            'doc': 'icons_doc.png',
            'docx': 'icons_doc.png',
            'xls': 'icons_xls.png',
            'xlsx': 'icons_xls.png',
            'pdf': 'icons_pdf.png',
            'txt': 'icons_file.png',
            'mp3': 'icons_audio.png',
            'wav': 'icons_audio.png',
            'vox': 'icons_audio.png',
            'swf': 'icons_vedio.png',
            'html': 'icons_html.png',
            'htm': 'icons_html.png',
            'exe': 'icons_file.png',
            'file': 'icons_file.png'
        },
        type: {
            'img': ['jpg', 'png', 'gif', 'bmp'],
            'flash': ['swf']
        },
        getSettings: function (el) {
            var settings = {
                max: el.data('max') ? el.data('max') : 1,
                category: el.data('category') ? encodeURI(el.data('category')) : encodeURI('其他'),
                type: el.data('type') ? el.data('type') : '',
                fileOutPut: 'fileOutPut.ashx',
                view: el.data('view') ? el.data('view') : 'simple',
                state: el.data('state') ? el.data('state') : 'edit',
                showSenior: el.data('showsenior') === true
            };
            return settings;
        }
    };

})(jQuery);

$(function () {
    $('.fileselector').fileselector();
})
