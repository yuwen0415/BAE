(function ($) {
    $.fn.uploadImg = function (options) {
        var opts = $.extend({}, $.fn.uploadImg.defaults, options);
        $this = $(this);
        var o = $.meta ? $.extend({}, opts, $this.data()) : opts;
        $this.css({ width: o.width, height: o.height, overflow: 'hidden', position: 'relative', border: '1px solid #ccc' });
        var isShow = false;
        getLevel = function () {
            var LevelHtml = '';
            for (var i = 1; i <= o.Level; i++) {
                LevelHtml += '../';
            }
            return LevelHtml;
        }
        var src = $(o.dataid).val();
        var img = $('<img />');
        var div = $('<div></div>')
        div.css({ position: 'absolute', cursor: 'pointer', display: 'none', width: 15, height: 15, right: 0, bottom: 0 });
        div.css('background-image', 'url("' + getLevel() + 'images/EditPage/img_del.gif")');
        $this.append(div);
        var body = $(window.parent.parent.document).find('body');
        if (body.find('#' + o.imgupload).length == 0) {
            var imgupload = $('<div id="' + o.imgupload + '"></div>');
            body.append(imgupload);
        }
        autoScaling = function () {
            var img = $this.find('img:first-child');
            var img_width = img.width();
            var img_height = img.height();
            if (img_width > 0 && img_width > 0) {
                var rate = (o.width / img_width < o.height / img_height) ? o.width / img_width : o.height / img_height;
                if (rate < 1) {
                    img.width(img_width * rate);
                    img.height(img_height * rate);
                }
                var left = (o.width - img.width()) * 0.5;
                var top = (o.height - img.height()) * 0.5;
                img.css({ "margin-left": left, "margin-top": top });
            }
            else {
                img.width(o.width);
                img.height(o.height);
            }
            div.show();
        }

        if (typeof (src) === 'undefined' || src == '') {
            img.attr('src', getLevel() + o.imgurl);
            img.css({ width: o.width, height: o.height });
            $this.prepend(img);
            $this.css('cursor', 'pointer');
            isShow = true;
        }
        else {
            var image = new Image();
            image.src = getLevel() + src;

            img.attr('src', image.src);
            $this.prepend(img);
            setTimeout('autoScaling()', 10);
        }
        div.click(function () {
            $(o.dataid).val("");
            img.attr('src', getLevel() + o.imgurl);
            img.removeAttr('style')
            img.css({ width: o.width, height: o.height });
            $this.css('cursor', 'pointer');
            isShow = true;
            div.hide();
        })

        img.click(function () {
            if (isShow) {
                $(this).win({ url: '../Popup/UploadImg.aspx', width: 420, height: 130, data: 'imgSort=' + o.imgSort + '&from=&to=', callback: function (data) {
                    //更新列表
                    if (data != null) {
                        img.attr('src', getLevel() + data);
                        img.removeAttr('style');
                        $this.prepend(img);
                        $(o.dataid).val(data);
                        isShow = false;
                        setTimeout('autoScaling()', 10);
                    }
                    //console.log(data);
                }
                }).show(); 
            }
        })

    }
    $.fn.uploadImg.defaults = {
        width: 80,
        height: 80,
        imgupload: 'imgupload',
        imgSort: 'icon',
        imgurl: 'images/EditPage/img_add.gif',
        dataid: '#IconFile',
        ifr_main: '.main_box',
        ifr_body: 'iframeEdit',
        Level: 1,
        imgType: ["gif", "jpeg", "jpg", "bmp", "png"]
    };
})(jQuery);