/// <reference path="jquery-1.7.min.js" />
/// <reference path="jquery.tmpl.js" />

(function ($) {
    $.fn.tabs = function (options) {
        var opts = $.extend({}, $.fn.tabs.defaults, options);
        var $this = $(this);
        var settings = opts.getSettings($this);
        var $items = $this.find('.tabs_items');

        function showTab(id, name, data) {
            var tab = $items.find('li[data-tab-id="' + id + '"]');
            var content = $this.find('.tabs_content[data-tab-id="' + id + '"]');

            $('.building').hide();
            if (tab.size() == 0) {
                tab = $('<li><a href="#"></a><a class="close" href="#"></a></li>');
                tab.appendTo($items);
                tab.attr('data-tab-id', id);

                tab.find('a:first').text(name).click(function (e) {
                    e.preventDefault();
                    if (settings.isRefresh) {
                        refreshTab(id, name, data);
                    } else {
                        showTab(id, name, data);
                    }
                });

                tab.find('a:last').click(function (e) {
                    e.preventDefault();
                    hideTab(id);
                });
                $.fn.tabs.updateScroll($this);
            }

            if (content.size() == 0) {
                var template = $($this.attr('data-content-template'));
                if (template.size() == 0) {
                    template = $('<div class="tabs_content"></div>');
                }
                content = template.tmpl(data);
                content.appendTo($this);
                content.attr('data-tab-id', id);

            }

            if (settings.isRefresh) {
                refreshTab(id, name, data);
            } else {
                if (tab.is('.selected') == false) {

                    $items.find('li').removeClass('selected').find('a:last').removeClass('close_selected').addClass('close');
                    $this.find('.tabs_content').not(content).hide();

                    tab.addClass('selected').find('a:last').removeClass('close').addClass('close_selected');
                    content.show();
                }
            }

            if (content.data('autosize') != false) {
                content.height($this.height() - $items.height());
            }

            if (settings.closeIcon == false) {
                tab.parent().find('.close,.close_selected').hide();
            }
            $.fn.tabs.updateSelected($this);
            //tab数量最多6个
            if (Number($items.find('li').length) == 7) {
                var selected = $items.find('li:eq(0)');
                hideTab(selected.data('tab-id'));
            }
        }

        function refreshTab(id, name, data) {

            var tab = $items.find('li[data-tab-id="' + id + '"]');
            var content = $this.find('.tabs_content[data-tab-id="' + id + '"]');

            if (tab.is('.selected') == false) {

                $items.find('li').removeClass('selected').find('a:last').removeClass('close_selected').addClass('close');
                $this.find('.tabs_content').not(content).hide();

                tab.addClass('selected').find('a:last').removeClass('close').addClass('close_selected');

                content.show();
            }

            //content.find('iframe').attr('src', data.url + '?r=' + Math.random());

            content.empty();

            var template = $($this.attr('data-content-template'));
            if (template.size() == 0) {
                template = $('<div class="tabs_content"></div>');
            }
            if (!data) {
                data = { link: id + '?r=' + Math.random(), url: id };
            }
            content.html(template.tmpl(data).html());
        }

        function hideTab(id, notupdate) {
            var tab = $items.find('li[data-tab-id="' + id + '"]');
            var content = $this.find('.tabs_content[data-tab-id="' + id + '"]');

            if (tab.size() > 0) {
                var prev = tab.prev();
                var next = tab.next();
                var twidth = tab.width() + 24;
                tab.hide();
                content.hide();

                if (tab.is('.selected')) {
                    if (prev.size() > 0) {
                        showTab(prev.data('tab-id'));
                    } else {
                        if (next.size() > 0) {
                            showTab(next.data('tab-id'));
                        }
                    }
                }

                tab.remove();
                content.find('iframe').each(function () {
                    $(this).attr('src', 'about:blank'); //free resource
                });
                content.remove();
                if (typeof (notupdate) == 'undefined') {
                    $items.width($items.width() - twidth);
                    if ($items.width() > $this.width()) {
                        if (($items.width() + $items.position().left) < $this.width()) {
                            var moveleft = -$items.position().left - twidth < 0 ? -$items.position().left - twidth : twidth;
                            $items.animate({ left: $items.position().left + moveleft }, 500);
                        }
                    }
                    $.fn.tabs.updateItems();
                }
            }
        }


        return {
            showTab: showTab,
            hideTab: hideTab
        }
    }
    $.fn.tabs.updateScroll = function ($this) {
        var $items = $this.find('.tabs_items');
        var move_pre = $this.find('.pre_item');
        var move_next = $this.find('.next_item');

        var tabsWidth = 0;
        var twidth;
        var leftwidth;
        var moveleft;
        var ileft = $items.position().left;

        $items.children('li').each(function () {
            tabsWidth += $(this).width() + 24;
        })
        if (tabsWidth > $this.width() - 12) {
            twidth = tabsWidth - $items.width() + 20;
            $items.width($items.width() + twidth); //.animate({ left: ileft + -twidth }, 500)
            if ($this.find('.pre_item').size() == 0) {
                move_pre = $('<a class="pre_item" href="#"></a>');
                move_next = $('<a class="next_item" href="#"></a>');
                move_pre.click(function () {
                    itemsleft = $items.position().left;
                    if (itemsleft < 0) {
                        moveleft = itemsleft < -70 ? -70 : itemsleft;
                        $items.animate({ left: itemsleft - moveleft }, 500);
                    }
                })
                addMore();
                move_next.click(function () {
                    itemsleft = $items.position().left;
                    leftwidth = -itemsleft + $this.width();
                    if (leftwidth < $items.width()) {
                        moveleft = leftwidth + 70 < $items.width() ? 70 : $items.width() - leftwidth;
                        $items.animate({ left: itemsleft - moveleft }, 500);
                    }
                })
                $items.before(move_pre).after(move_next);
            }
            $items.css('padding-left', '13px');
            move_pre.show();
            move_next.show();
        }
        else {
            if (move_pre.size() > 0) {
                $items.css('padding-left', '0');
                move_pre.hide();
                move_next.hide();
            }
        }
        function addMore() {
            if ($this.data('item-more')) {
                var more_advanced = $this.next();
                var more_items = $this.next().next();
                var timer;
                var hover = false;

                if (more_advanced.size() == 0) {
                    more_advanced = $('<div class="tabs-more-advanced tabs-more"><ul><li>展开所有</li><li>关闭其他</li></ul></div>');
                    more_items = $('<div class="tabs-more-items tabs-more"><a>x</a><ul></ul></div>');

                    move_pre.hover(function () {
                        hover = true;
                        more_advanced.show();
                    }, function () {
                        timer = setTimeout(function () {
                            if (!hover) {
                                more_advanced.hide();
                            }
                        }, 200)
                        hover = false;
                    })

                    more_advanced.hover(function () {
                        hover = true;
                    }, function () {
                        timer = setTimeout(function () {
                            if (!hover) {
                                more_advanced.hide();
                            }
                        }, 200)
                        hover = false;
                    })
                    .find('li:first').click(function () {
                        updateTabs(more_items);
                        more_items.show();
                        more_advanced.hide();
                    }).end()
                    .find('li:last').click(function () {
                        $items.find('li').not('.selected').each(function () {
                            $('.tabs').tabs().hideTab($(this).attr('data-tab-id'), true);
                        })
                        $.fn.tabs.updateItems();
                        more_advanced.hide();
                    }).end();
                    ;
                    more_items.find('>a').click(function () {
                        more_items.hide();
                    }).end()

                    $this.parent().append(more_advanced).append(more_items);
                }
            }
        }

        function updateTabs(more_items) {
            more_items.find('ul').empty();
            $items.find('li').each(function () {
                more_items.find('ul').append('<li><a data-tab-id="' + $(this).attr('data-tab-id') + '">' + $(this).find('a:first').text() + '</a></li>');
            })
            more_items.find('li a').click(function () {
                var url = $(this).attr('data-tab-id');
                $('.tabs').tabs().showTab(url, $(this).text(), { url: url, link: url + (url.indexOf('?') > 0 ? '&' : '?') + 'r=' + Math.random(0) });
                more_items.hide();
            })
            if (more_items.find('li').size() > 8) {
                more_items.find('>a').css('right', '20px');
            } else {
                more_items.find('>a').css('right', '5px');
            }
        }
    }
    $.fn.tabs.updateItems = function () {
        $('.tabs[data-item-move=true]').each(function () {
            var $this = $(this);
            var $items = $this.find('.tabs_items');
            var tabsWidth = 0;

            setTimeout(function () {
                if ($this.width() >= $items.width()) {
                    $items.css('left', '0px');
                    $items.width($this.width());
                }
                else {
                    $items.children('li').each(function () {
                        tabsWidth += $(this).width() + 24;
                    })
                    $items.width(tabsWidth + 20);
                    if ($this.width() >= $items.width()) {
                        $items.width($this.width());
                    }
                }
                $.fn.tabs.updateScroll($this);
                $.fn.tabs.updateSelected($this);
            }, 100)
        })
    }
    $.fn.tabs.updateSelected = function ($this) {
        if ($this.is('[data-item-move=true]')) {
            var $items = $this.find('.tabs_items');
            var leftWidth = 0;
            var rightWidth = 0;
            var selectWidth = 0;
            var moveleft;
            var moveright;
            var itemsleft = $items.position().left;

            $items.children('li').each(function () {
                if (rightWidth > 0) {
                    rightWidth += $(this).width() + 24;
                }
                else {
                    if ($(this).is('.selected')) {
                        rightWidth += $(this).width() + 24;
                        selectWidth = $(this).width() + 24;
                    }
                    leftWidth += $(this).width() + 24;
                }
            });
            if ((leftWidth - selectWidth) < -itemsleft) {
                moveleft = -(leftWidth - selectWidth)
                $items.animate({ left: moveleft }, 500);
            }
            else
                if ($items.width() - (rightWidth - selectWidth) + itemsleft > $this.width()) {
                    moveright = -(leftWidth - $this.width() + 24);
                    $items.animate({ left: moveright }, 500);
                }
        }

    }
    $.fn.tabs.defaults = {
        getSettings: function (el) {
            var settings = {
                closeIcon: el.data('close-icon') !== false,
                isRefresh: el.data('isrefresh') === true
            };
            return settings;
        }
    };

})(jQuery);
