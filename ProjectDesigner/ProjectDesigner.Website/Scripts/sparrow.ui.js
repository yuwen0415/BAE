/// <reference path="jquery-1.7.min.js" />
/// <reference path="jquery-1.7-vsdoc.js" />
/// <reference path="sparrow.js" />
/// <reference path="sparrow.ajax.js" />
/// <reference path="sparrow.ui.grid.js" />

/// <reference path="ui.spinner.js" />


$(function () {
    /*datepicker*/
    $('.datepicker').datetimepicker({ format: 'yyyy-MM-dd' });
    /*datetimepicker*/
    $('.datetimepicker').datetimepicker({ format: 'yyyy-MM-dd HH:mm' });
    /*dateyearpicker*/
    $('.dateyearpicker').datetimepicker({ format: 'yyyy' });
    /*timepicker*/
    $('.timepicker').datetimepicker({ format: 'HH:mm' });
    /*spinner*/
    $('.spinner').spinner({ min: 1, max: 100 });

    if ($('.tabs').size() > 0) {
        contentSize();
        $('.tabs .tabs_items li').click(function () {
            setTimeout(function () {
                contentSize();
            }, 100)
        })
        //if($('.main-content,.edit_content').width()>
    }
    /*view*/
    if ($.fn.win.getQuery('type') === 'view') {
        $('.fileselector').data('state', 'view');
    }

    /*advancedsearch*/
    $('.advanced_search').each(function () {
        var top_txt = $(this).find('.top_txt');
        var content_tr = $(this).find('tr:eq(1)').hide();
        var top_img = top_txt.find('img');
        if (top_img.size() == 0) {
            top_img = $('<img src="' + sparrow.settings.baseUrl + 'images/Module/up.gif" style="cursor: pointer;">').appendTo(top_txt);
        }
        top_img.click(function () {
            if ($(this).attr('src').indexOf('up') > -1) {
                $(this).attr('src', $(this).attr('src').replace('up.gif', 'down.gif'));
                content_tr.show();
            } else {
                $(this).attr('src', $(this).attr('src').replace('down.gif', 'up.gif'));
                content_tr.hide();
            }
        })
    })

    function contentSize() {
        var content = $('.main-content,.edit_content');
        //        content.css({ 'float': 'left' });
        //        content.css({ 'float': 'left' }).css({ 'width': '100%' });
        //        var width = content.width();
        //        var gridwidth = content.find('.gridview').not(':hidden').width();
        //        if (width < gridwidth) {
        //            content.width(gridwidth - 20);
        //        }
        //        else {
        //            content.width(width - 20);
        //        }
    }
    /*statusbar*/
    if ($('.statusbar').size() > 0) {
        $('.main-content,.edit_content').css({ 'margin-bottom': '39px', 'float': 'auto' });
    }

    /*ajaxLock*/
    $('.win-save-link,.tab-save-link').attr('data-ajax-lock', true);

    $('[data-ajax-lock=true]').click(function () {
        $(this).data('disabled', true);
        if ($(this).is('a')) {
            $(this).attr('onclick', 'return false;');
        } else {
            $(this).attr('disabled', true);
        }
    })

    /*add a text box * */
    $.each($('[data-required=required]'), function () {
        var required = $(this);
        var span = '<span title="*">*</span>';
        if (required.parents('div.row').size() > 0) {
            if (required.prev().is('label')) {
                if (required.prev().find('span[title="*"]').size() == 0) {
                    required.prev().prepend(span);
                }
            }
            else
                if (required.parent().prev().is('label')) {
                    if (required.parent().prev().find('span[title="*"]').size() == 0) {
                        required.parent().prev().prepend(span);
                    }
                }
        } else {
            if (required.parents('td').not('.content').prev().find('span[title="*"]').size() == 0) {
                required.parents('td').not('.content').prev().prepend(span);
            }
        }
    })

    /*button*/
    $('.button_out').hover(function () {
        $(this).removeClass('button_out').addClass('button_over');
    }, function () {
        $(this).removeClass('button_over').addClass('button_out');
    });
    $('.button_out2').hover(function () {
        $(this).removeClass('button_out2').addClass('button_over2');
    }, function () {
        $(this).removeClass('button_over2').addClass('button_out2');
    });

    $('.gridview').each(function () {
        var $this = $(this);
        var name = $(this).data('name');

        var edit_link;
        var delete_link;
        var view_link;
        if (name) {
            edit_link = $('.edit-link[data-grid-name="' + name + '"]');
            delete_link = $('.delete-link[data-grid-name="' + name + '"]');
            view_link = $('.view-link[data-grid-name="' + name + '"]');
        } else {
            edit_link = $('.edit-link');
            delete_link = $('.delete-link');
            view_link = $('.view-link');
        }

        grid = $.fn.grid.getInstance(name);
        //        grid.select(function (row) {
        //            if (grid.getSelected().size() == 0) {
        //                edit_link.attr('disabled', true);
        //                delete_link.attr('disabled', true);
        //            } else {
        //                edit_link.removeAttr('disabled');
        //                delete_link.removeAttr('disabled');
        //            }
        //        });

        grid.dbclick(function (row) {
            if (view_link.size() > 0) {
                view_link.trigger('click');
            }
            else {
                edit_link.trigger('click');
            }
        });
    });

    $('.add-link').click(function (e) {
        e.preventDefault();

        var name = $(this).data('grid-name');
        var grid = $.fn.grid.getInstance(name);

        var url = null;
        if ($(this).is('a')) {
            url = $(this).attr('href');
        } else {
            url = $(this).attr('url');
        }

        var data = null;
        var params = $(this).data('params');
        if (params != null) {
            data = toObject(params);
        }

        var customData;
        var before = $(this).data('before');
        if (before && typeof (before) == 'function') {
            customData = before();
        } else {
            customData = before;
        }

        data = $.extend(data, customData);

        var callback_method = $(this).attr('data-callback');
        var callback = function (data) {
            //debugger;
            if (data) {
                if (isArray(data)) {
                    for (var i = 0; i < data.length; i++) {
                        grid.insertRow(data[i]);
                    }
                }
                else {
                    grid.insertRow(data);
                }
            }
        }

        if (callback_method) {
            callback = window[callback_method];
        }

        var win_name = $(this).data('dialog-name');

        win_name = win_name ? win_name : '';


        $(this).win({ type: 'add', url: url, height: $(this).data('dialog-height'), width: $(this).data('dialog-width'), fullsize: $(this).data('fullsize'), callback: callback, data: data }).show(win_name);



    });

    $('.delete-link').click(function (e) {
        e.preventDefault();

        var name = $(this).data('grid-name');
        var grid = $.fn.grid.getInstance(name);
        var customData;

        var selected = grid.getSelected();

        var before = $(this).data('before');
        if (before && typeof (before) == 'function') {
            customData = before();
        } else {
            customData = before;
        }

        var ids = [];
        selected.each(function () {
            var id = $(this).attr('data-itemid');
            if (id) {
                ids.push(id);
            }
        });


        var callback_method = $(this).attr('data-callback');
        var callback = function (result) {
            if (result == true) {
                jQuery.each(ids, function (index, id) {
                    grid.deleteRow(id);
                });
            }
        }

        if (callback_method) {
            callback = window[callback_method];
        }


        var params = $.extend({ '__SelectedItems': ids }, customData);


        if (ids.length == 0) {
            alert('请至少选择一笔记录！');
        } else {
            if (confirm('确定要删除' + ids.length + '笔记录?')) {
                $(this).ajaxPost({
                    method: 'DeleteRows', params: params, callback: callback
                });
            }
        }
    });

    $('.edit-link').click(function (e) {
        e.preventDefault();

        var name = $(this).data('grid-name');
        var grid = $.fn.grid.getInstance(name);

        var selected = grid.getSelected();

        var ids = [];
        selected.each(function () {
            var id = $(this).attr('data-itemid');
            if (id) {
                ids.push(id);
            }
        });

        if (ids.length != 1) {
            alert('请选择一笔记录！');
        } else {
            var url = null;
            if ($(this).is('a')) {
                url = $(this).attr('href');
            } else {
                url = $(this).attr('url');
            }
            var data = null;
            var params = $(this).data('params');
            if (params != null) {
                if (typeof (params) == 'string') {
                    data = params + encodeURI("&id=" + ids[0] + "&type=edit");
                }

                if (typeof (params) == 'object') {
                    data = params;
                    data.id = ids[0];
                    data.type = 'edit';
                }
            }
            else {
                data = {};
                data.id = ids[0];
                data.type = 'edit';
            }

            var customData;
            var before = $(this).data('before');
            if (before && typeof (before) == 'function') {
                customData = before();
            } else {
                customData = before;
            }

            data = $.extend(data, customData);

            var callback_method = $(this).attr('data-callback');
            var callback = function (item) {
                if (item) {
                    grid.updateRow(ids[0], item);
                }
            }

            if (callback_method) {
                callback = window[callback_method];
            }

            var win_name = $(this).data('dialog-name');

            win_name = win_name ? win_name : '';

            $(this).win({
                url: url, data: data, height: $(this).data('dialog-height'), width: $(this).data('dialog-width'), fullsize: $(this).data('fullsize'), callback: callback
            }).show(win_name);
        }

    });

    $('.view-link').click(function (e) {
        e.preventDefault();

        var name = $(this).data('grid-name');
        var grid = $.fn.grid.getInstance(name);

        var selected = grid.getSelected();

        var ids = [];
        selected.each(function () {
            var id = $(this).attr('data-itemid');
            if (id) {
                ids.push(id);
            }
        });

        if (ids.length != 1) {
            alert('请选择一笔记录！');
        } else {
            var url = null;
            if ($(this).is('a')) {
                url = $(this).attr('href');
            } else {
                url = $(this).attr('url');
            }
            var data = null;
            var params = $(this).data('params');
            if (params != null) {
                if (typeof (params) == 'string') {
                    data = params + encodeURI("&id=" + ids[0] + "&type=view");
                }

                if (typeof (params) == 'object') {
                    data = params;
                    data.id = ids[0];
                    data.type = 'view';
                }
            }
            else {
                data = {};
                data.id = ids[0];
                data.type = 'view';
            }

            var customData;
            var before = $(this).data('before');
            if (before && typeof (before) == 'function') {
                customData = before();
            } else {
                customData = before;
            }

            data = $.extend(data, customData);

            var win_name = $(this).data('dialog-name');

            win_name = win_name ? win_name : ''

            $(this).win({
                url: url, data: data, height: $(this).data('dialog-height'), width: $(this).data('dialog-width'), fullsize: $(this).data('fullsize')
            }).show(win_name);
        }

    });

    $('.export-link').click(function () {
        //TODO:电信演示版-导出权限
        //alert('您无此权限，请与管理员联系！');
        //return false;

        var tablename, orders, columns, fields;
        if ($('input[name="export_tablename"]').size() > 0) {
            tablename = $('input[name=export_tablename]');
            orders = $('input[name=export_orders]');
            columns = $('input[name=export_columns]');
            fields = $('input[name=export_fields]');
        }
        else {
            tablename = $('<input type="hidden" name="export_tablename" />')
            orders = $('<input type="hidden" name="export_orders" />')
            columns = $('<input type="hidden" name="export_columns" />')
            fields = $('<input type="hidden" name="export_fields" />')
            $('form').append(tablename).append(orders).append(columns).append(fields);
        }
        var name = $(this).data('grid-name');

        var order_fields = [];
        var grid_orders = $.fn.grid.getInstance(name).getOrders();
        for (var i = 0; i < grid_orders.length; i++) {
            var item = grid_orders[i];
            if (item.sorting === 'asc') {
                order_fields.push('i.' + item.field);
            } else {
                if (item.sorting === 'desc') {
                    order_fields.push('i.' + item.field + ' desc');
                }
            }
        }

        var thead_columns = [];
        var thead_fields = [];

        var grid = $.trim(name) == '' ? '' : '[data-name=' + name + ']';

        $.each($('.gridview' + grid + ':not([data-builder]) thead th'), function (index, th) {
            if ($(this).data('field')) {
                if ($(this).data('auto-export') !== false) {
                    if ($(this).find('a').size() > 0) {
                        thead_columns.push($.trim($(this).find('a').text()));
                    } else {
                        thead_columns.push($.trim($(this).text()));
                    }

                    thead_fields.push($.trim($(this).data('field')));
                }
            }
        });

        tablename.val(name);
        orders.val(order_fields.toString());
        columns.val(thead_columns.toString());
        fields.val(thead_fields.toString());
    })

    $('.win-close-link').click(function (e) {
        e.preventDefault();
        $.fn.win.close(null, true);
    });


    $('.win-save-link').click(function (e) {
        e.preventDefault();
        $(this).ajaxPost({
            method: 'Save', callback: function (data) {
                $.fn.win.close(data);
            }
        });
    });
    $('.win-delete-link').click(function (e) {
        e.preventDefault();
        if (confirm("确定删除此记录？")) {
            $(this).ajaxPost({
                method: 'Delete', callback: function (data) {
                    $.fn.win.close(data);
                }
            });
        }
    });

    $('.win-print-link').click(function (e) {
        e.preventDefault();
        if (confirm("是否打印该报告？")) {
            $(this).ajaxPost({
                method: 'Print', callback: function (data) {
                    if (data) {
                        var i = 0;
                        $('body').everyTime(5000, 'B', function () {
                            $(this).ajaxPost({
                                method: 'GetProcess', 'params': { 'taskId': data }, callback: function (data1) {
                                    switch (data1) {
                                        case null:
                                            if (i == 3) {
                                                alert("打印未执行！");
                                                $('body').stopTime('B');
                                                window.close();
                                                break;
                                            }
                                            alert("正在打印中请等待！");
                                            i++;
                                            break;
                                        case false:
                                            alert("打印失败！");
                                            $('body').stopTime('B');
                                            window.close();
                                            break;
                                        case true:
                                            alert("打印成功!");
                                            $('body').stopTime('B');
                                            window.close();
                                            break;
                                        default:
                                            alert("程序内部错误！");
                                            $('body').stopTime('B');
                                            window.close();
                                            break;
                                    }

                                }
                            });
                        });

                    }
                    else {
                        alert("需打印文件的数据有误，请用户进行检查！");
                        //window.close();
                    }
                }
            });
        }
    });

    $('.print-link').click(function (e) {
        e.preventDefault();
        var data = {};
        data.OrderIds = $.fn.win.getQuery("OrderId");
        $(this).win({
            url: "../Printing.aspx", data: data, height: $(this).data('dialog-height'), width: $(this).data('dialog-width'), fullsize: $(this).data('fullsize'), callback: null
        }).show();
    });


    $('.tab-save-link').click(function (e) {
        e.preventDefault();
        $(this).ajaxPost({
            method: 'Save', callback: function (data) {
                if (window.parent) {
                    var fn = window.parent.window.hideCurentTab;

                    if (fn) {
                        fn();
                        return;
                    }
                }

                window.close();
            }
        });
    });


    $('.search-link').click(function (e) {
        e.preventDefault();

        var name = $(this).data('grid-name');
        $.fn.grid.getInstance(name).changePageIndex(1);
        var callback_method = $(this).attr('data-callback');
        if (callback_method) {
            var callback = window[callback_method];
            callback();
        }
    });


    $('.win-select-link').click(function (e) {
        e.preventDefault();
        var multiselect = $(this).attr('data-multiselect') == 'true';

        var grid = $.fn.grid.getInstance();
        var selected = grid.getSelected();

        if (selected.size() == 0) {
            alert('请单击数据行进行选择！');
            return;
        }

        if (multiselect == false) {
            if (selected.size() > 1) {
                alert('只能选择一笔记录！');
                return;
            }

            var data = grid.getDataItem(selected.index());
            $.fn.win.close(data);
        } else {
            var data = [];
            selected.each(function () {
                data.push(grid.getDataItem($(this).index()));
            });
            $.fn.win.close(data);
        }

    });


    $('.win-selecttree-link').click(function (e) {
        e.preventDefault();

        var treetype = $(this).data('treetype');

        var tree = $.fn.treeview.getInstance('');
        var selectdata = tree.getSelectedData();

        if (selectdata.length == 0) {
            alert('请单击数据行进行选择！');
            return;
        }
        var isemployee = $(this).data('isemployee');
        if (treetype == 'simple') {
            if (selectdata.length > 1) {
                alert('只能选择一笔记录！');
                return;
            }
            var data = selectdata[0];
            if (isemployee) {
                if (data.isOrg == 1) {
                    alert('请选择正确的记录！');
                    return;
                }
                else {
                    $.fn.win.close(data);
                }
            }
            else {
                $.fn.win.close(data);
            }
        }
        else {
            var data = [];
            $.each(selectdata, function (index, item) {
                var isEqual = false;
                $.each(data, function (index, da) {
                    if (da.text == item.text) {
                        isEqual = true;
                    }
                })
                if (!isEqual) {
                    if (isemployee === true) {
                        if (item.isOrg === 0) {
                            data.push(item);
                        }
                    }
                    else
                        data.push(item);
                }
            })
            $.fn.win.close(data);
        }
    });



    /*tab-link*/
    $('.tab-link').click(function (e) {
        e.preventDefault();

        var target_tabs = $($(this).attr('target'));
        if (target_tabs.size() == 0) {
            target_tabs = $('.tabs');
        }
        var url = $(this).attr('href');
        if (url.substring(0, 3) == 'win') {
            var arry = url.split(",");
            $(this).win({
                url: arry[1], width: arry[2], height: arry[3]
            }).show();
        }
        else {
            var link = url + (url.indexOf('?') > -1 ? '&' : '?') + 'r=' + Math.random();

            target_tabs.tabs().showTab($(this).attr('href'), $(this).text(), { url: url, link: link });
        }
    });



    $(document).resize(function () {
        $(window).trigger('resize');
    });

    $(window).resize(function () {

        //        $('.gridview th.word-auto').width(200);

        //        $('.gridview').each(function () {

        //  $(this).find('thead tr th.word-auto').width(200);

        //           // if ($(this).attr('data-autosize') != 'false') {
        //            if(false){
        //                $(this).css('width', '100%');

        //                var w = $(this).parent().width();

        //                var columns = $(this).find('thead tr th');

        //                var fixed_columns = columns.not('.word-auto');
        //                var auto_columns = columns.filter('.word-auto');


        //                var fixedWidth = 0;
        //                fixed_columns.each(function () {
        //                    fixedWidth += $(this).width()+10;
        //                });

        //                var minWidth = fixedWidth + (100 * auto_columns.size());


        //                if (minWidth > w) {
        //                    w = minWidth;
        //                    auto_columns.width(100);
        //                } else {
        //                    if (auto_columns.size() > 0) {

        //                        auto_columns.width((w - minWidth) / auto_columns.size());
        //                    }
        //                }

        //                $(this).width(w);
        //            }

        //        });
        contentSize();
        if ($.fn.tabs.updateItems) {
            $.fn.tabs.updateItems();
        }
        $('.gridview').each(function () {
            var grid = $.fn.grid.getInstance($(this).data('name'));
            grid.autoSizeColumn();
        })

        //        $('.search_panel').not(':hidden').each(function () {
        //            var w = $(this).parent().width();
        //            $(this).width(w);
        //        });

    });

});