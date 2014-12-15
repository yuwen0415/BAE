/// <reference path="sparrow.ajax.js" />
$(function () {


    var html = '<div id="message_inbox" class="message_box">' +
          '	<div class="title">' +
          '    	<div class="txt">消息窗</div>' +
          '        <a href="#"><div class="close"></div></a>' +
          '    </div>' +
          '    <div class="content">' +
          '    	<ul>' +
          '    	    <li><label>[发布者]</label></li>' +
          '         <li><a href="#">内容</a><span>发布时间</span></li>' +
          '      </ul>' +
          '    </div>' +
          '    <div class="line">&nbsp;</div>' +
          '    <div class="tool">' +
          '    	<div class="total"><a href="#">上一条</a> <a href="#">下一条</a> <span>/共5条</span></div>' +
          '        <div class="more"><a href="#">更多&gt;&gt;</a></div>' +
          '    </div>' +
          '</div>';


    var inbox = $('#message_inbox');
    if (inbox.size() == 0) {
        inbox = $(html).hide().appendTo($('body'));

        inbox.find('.total a:first').click(function (e) {
            e.preventDefault();
            prevMessage();
        });

        inbox.find('.total a:last').click(function (e) {
            e.preventDefault();
            nextMessage();
        });

        inbox.find('.more a').click(function (e) {
            e.preventDefault();
            $.fn.win({ url: sparrow.settings.baseUrl + 'SysOptions/SysMsgCenter.aspx', height: 480, width: 640 }).show();
            inbox.hide();
        });

        //        inbox.find('ul li:last a').click(function (e) {
        //            e.preventDefault();
        //            $(this).ajaxPost({ action: 'InboxHttpHandler.ashx', params: { id: $(this).attr('href') }, callback: function (data) {
        //                //
        //            }
        //            });

        //        });

        inbox.find('.close').click(function (e) {
            e.preventDefault();
            inbox.hide();
        });
    }

    function check() {
        $(this).ajaxPost({ action: 'InboxHttpHandler.ashx', params: { PageIndex: index }, callback: function (data) {
            showMessage(data);
        }
        });
    };


    function nextMessage() {
        if (index < total) {
            index = index + 1;
            check();
        }
    }

    function prevMessage() {
        if (index > 1) {
            index = index - 1;
            check();
        }
    }

    var total = 0;
    var index = 1;
    function showMessage(data) {
        if (data && data.TotalHits == 0) {
            inbox.hide();
        } else {
            total = data.TotalHits;
            inbox.find('span:last').text('/共' + data.TotalHits + '条');
            var item = data.Items[0];
            // inbox.find('.title .txt').html(item.Title)
            inbox.find('ul li:first label').html('[' + item.Publisher + ']');
            // inbox.find('ul li:last a').html(item.Content).attr('href', item.ID);
            inbox.find('ul li:last a').html(item.Title).attr('href', item.ID);
            inbox.find('ul li:last span').html(item.SendTime);
            inbox.show();

            if (total > 1) {
                if (index > 1) {
                    inbox.find('.total a:first').show();
                } else {
                    inbox.find('.total a:first').hide();
                }

                if (index < total) {
                    inbox.find('.total a:last').show();
                } else {
                    inbox.find('.total a:last').hide();
                }
            } else {
                inbox.find('.total a').hide();
            }
        }
    }

    check();

    window.setInterval(function () {
        check();
    }, 1000 * 60);

});