/// <reference path="jquery-1.7.min.js" />

(function ($) {
    $.fn.menus = function (options) {

        var opts = $.extend({}, $.fn.menus.defaults, options);

        return this.each(function () {
            var $this = $(this);

            $(this).find('li').each(function () {
                var list = $(this).find('>ul');
                if (list.size() > 0) {
                    $(this).find('span:first').addClass('on');
                    list.hide();
                }
                else {
                    $(this).hover(function () {
                        $(this).addClass("hover");
                    },
                      function () {
                          $(this).removeClass("hover");
                      }
                    );
                }

                $(this).find('>a:first').click(function (e) {
                    e.preventDefault();
                    toggle($(this));
                });

                //                $(this).click(function (e) {
                //                    e.preventDefault();
                //                    var icon_link = $(this).find('a:first');
                //                    toggle(icon_link);
                //                    
                //                    showTab($(this).find('>a:last'));

                //                    return false;
                //                });

                $(this).find('>a:last').click(function (e) {
                    e.preventDefault();
                    toggle($(this).prev());

                    showTab($(this));

                    return false;
                })

                function showTab(el) {
                    var url = el.attr('href');
                    if (url != '#' && url != '') {
                        if (url.substring(0, 3) == 'win') {
                            var arry = url.split(",");
                            $(this).win({ url: arry[1], width: arry[2], height: arry[3]
                            }).show();
                        }
                        else {
                            $('.building').hide();
                            var target_tabs = $(el.attr('target'));
                            if (target_tabs.size() == 0) {
                                target_tabs = $('.tabs');
                            }
                            var link = url + (url.indexOf('?') > -1 ? '&' : '?') + 'r=' + Math.random();

                            target_tabs.tabs().showTab(el.attr('href'), el.text(), { url: url, link: link });
                        }

                    }
                    else {
                        if (url == '#') {
                            //TODO:电信演示版-菜单权限
                            //alert('您无此权限，请与管理员联系！');
                            $('.building').show();
                        }

                    }
                }
            });

            //remove icon on first level items
            $(this).find('>li').each(function () {
                $(this).find('a:first').hide();
            });



            function toggle(link) {
                var icon = link.find('span:first');

                if (link.next().next().is('ul')) {
                    if (icon.is('.off')) {
                        icon.removeClass('off').addClass('on');
                        link.next().next().hide();
                    } else {
                        icon.removeClass('on').addClass('off');
                        link.next().next().show();
                    }
                }
            }

        });
    }
    $.fn.menus.defaults = {};
})(jQuery);
$(function () {
    $('.menu').menus();

    $(document).click(function () {
        $('.building').hide();
    });
})  
