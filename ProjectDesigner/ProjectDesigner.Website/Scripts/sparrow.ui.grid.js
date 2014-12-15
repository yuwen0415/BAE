/// <reference path="jquery-1.7.min.js" />
/// <reference path="jquery.tmpl.js" />
/// <reference path="sparrow.js" />
/// <reference path="sparrow.ui.win.js" />
/// <reference path="sparrow.ui.tips.js" />

(function ($) {
    $.fn.grid = function (options) {
        var opts = $.extend({}, $.fn.grid.defaults, options);



        return this.each(function () {
            var $this = $(this);

            var settings = opts.getSettings($this);
            if ($.fn.grid.list[settings.name]) {
                return $this;
            }

            /*sorting*/
            var thead = $this.find('thead');
            var orderIndex = 0;

            function orderBy(field) {
                var col = thead.find('th[data-field=' + field + ']');
                var link = col.find('a');
                if (settings.multisort) {
                    link.removeClass('desc').addClass('asc');
                } else {
                    link.removeClass('desc').addClass('asc');
                    thead.find('th').not(col).find('a').removeClass('desc').removeClass('asc').parent().removeAttr('data-order-index');
                }

                col.attr('data-order-index', orderIndex);
                orderIndex = orderIndex + 1;
                reload();
            }

            function orderByDesc(field) {
                var col = thead.find('th[data-field="' + field + '"]');
                var link = col.find('a');
                if (settings.multisort) {
                    link.removeClass('asc').addClass('desc');
                } else {
                    link.removeClass('asc').addClass('desc');
                    thead.find('th').not(col).find('a').removeClass('desc').removeClass('asc').parent().removeAttr('data-order-index');
                }

                col.attr('data-order-index', orderIndex);
                orderIndex = orderIndex + 1;
                reload();
            }

            function getOrders() {
                var list = [];
                thead.find('[data-order-index]').each(function () {

                    list.push({ seq: $(this).data('order-index'), field: $(this).data('order-field') ? $(this).data('order-field') : $(this).data('field'), sorting: $(this).find('a').hasClass('asc') ? 'asc' : 'desc' });
                })

                list.sort(function (x, y) {
                    return x.seq - y.seq;
                });

                return list;
            }

            //events
            thead.on('click', 'a', function (e) {
                e.preventDefault();

                if (!settings.automore) {
                    var field = $(this).parent().data('field');

                    if ($(this).hasClass('asc')) {
                        orderByDesc(field);
                    } else {
                        orderBy(field);
                    }
                }
            });
            /*sorting*/

            /*paging*/

            var tfoot = $this.find('tfoot');

            if (tfoot.size() == 0) {
                tfoot = $('<tfoot></tfoot>').appendTo($(this));
            }

            tfoot.empty();
            var tfoot_content;
            var cols = 0;
            if (settings.automore) {
                tfoot_content = '<tr>' +
                                '   <td colspan="5">' +
      	                        '       <div class="first-child"></div>' +
                                '       <div class="last-child" style="white-space: nowrap;width:auto;display:inline-block;">' +
                                '            <a href="" class="more" >显示更多...</a>' +
                                '       </div>' +
                                '       <div style="width:auto;">' +
                                '            <label>共120条&nbsp;</label>' +
                                '       </div>' +
                                '   </td>' +
                                '</tr>';

            } else {
                if (settings.footer) {
                    tfoot_content = '<tr>' +
                                '   <td colspan="5">' +
      	                        '       <div class="first-child">可选列</div>' +
                                '       <div>' +
                                '            <label>每页显示</label>' +
                                '            <input style="height:13px;" name="" type="text">' +
                                '            <label>/共120条&nbsp;</label>' +
                                '       </div>' +
                                '       <div class="last-child" style="white-space: nowrap;">' +
                                '            <a href="1" class="first">首页</a>' +
                                '            <a href="" class="prev">上一页</a>' +
                                '            <select style="width:40px">' +
                                '            </select>' +
                                '            <label>共5页</label>' +
                                '            <a href="" class="next">下一页</a>' +
                                '            <a href="" class="last">末页</a>' +
                                '       </div>' +
                                '   </td>' +
                                '</tr>';
                }
                //            else {
                //                tfoot_content = '<tr>' +
                //                                '   <td colspan="5">' +
                //                                '   </td>' +
                //                                '</tr>';
                //            }


                //events
                tfoot.on('change', 'select', function () {
                    changePageIndex($(this).val());
                });

                tfoot.on('focus', 'input', function () {
                    $(this).data('origin', $(this).val())
                }).on('keypress', 'input', function (e) {
                    if (e.keyCode == 13) {
                        e.preventDefault();
                        if (isNaN($(this).val()) || $(this).val() < 1) {
                            $(this).val($(this).data('origin'));
                        } else {
                            changePageSize($(this).val());
                            $(this).data('origin', $(this).val());
                        }

                        return false;
                    }
                });
            }

            tfoot.on('click', 'a', function (e) {
                e.preventDefault();
                changePageIndex($(this).attr('href'));
                return false;
            });

            updateFoot();

            function updateFoot() {
                cols = 0;
                thead.find('tr:first').children().each(function () {
                    if ($(this).attr('colspan')) {
                        cols += Number($(this).attr('colspan'));
                    } else {
                        cols++;
                    }
                })

                //var cols = thead.find('tr:first').children().size();
                tfoot.empty();
                tfoot.append($(tfoot_content).find('td').attr('colspan', cols).end());

                if (!settings.autopage) {
                    tfoot.find('.last-child').hide().end()
                .find('div').eq(1).find('label:eq(0),input').hide().end();
                }
            }

            /*rowmerge*/
            var on_rowspan = [];
            var rowmerge = function (i, el) {
                var lastContent = null;
                var lastPrevContent = null;
                var lastRow = null;
                var rowspan = 1;
                var prevRowspan;
                var isRowspan = false;
                el.find('tbody tr').each(function () {

                    var tdsize = el.find('tbody tr:eq(0) td').size() - $(this).find('td').size();
                    var j = i - tdsize;
                    var td = $(this).find('td:eq(' + j + ')');

                    var content = td.text();
                    var prevContent = td.prev().text();
                    if (lastContent == null) {
                        lastContent = content;
                        lastPrevContent = prevContent;
                        lastRow = td;
                    } else {
                        if (lastContent == content) {
                            rowspan += 1;
                            prevRowspan = isNaN(td.prev().attr('rowspan')) ? 0 : Number(td.prev().attr('rowspan'));
                            isRowspan = false;
                            for (var r in on_rowspan) {
                                if (on_rowspan[r] == j - 1) {
                                    isRowspan = true;
                                    break;
                                }
                            }
                            if (settings.autorowspan && isRowspan && prevRowspan <= rowspan) {
                                lastContent = content;
                                lastPrevContent = prevContent;
                                lastRow = td;
                                rowspan = 1;
                            } else {
                                if (!settings.autorowspan || (lastPrevContent === prevContent || j == 0)) {
                                    lastRow.attr('rowspan', rowspan);
                                    if (i == 0)
                                        lastRow.css({ 'white-space': 'normal' });

                                    td.remove();
                                }
                                else {
                                    lastContent = content;
                                    lastPrevContent = prevContent;
                                    lastRow = td;
                                    rowspan = 1;
                                }
                            }
                        } else {
                            lastContent = content;
                            lastPrevContent = prevContent;
                            lastRow = td;
                            rowspan = 1;
                        }
                    }
                });
            }

            var rowReduction = function (i, el) {
                var rowspan = null;
                var row = null;
                el.find('tbody tr').each(function () {

                    //                    var tdsize = el.find('tbody tr:eq(0) td').size() - $(this).find('td').size();
                    //                    var j = i - tdsize;
                    //                    j = j < 0 ? 0 : j;
                    var td = $(this).find('td:eq(' + i + ')');

                    if (rowspan) {
                        td.before(row.clone());
                        if (rowspan - 1 < 2) {
                            rowspan = null;
                            row = null;
                        } else {
                            rowspan--;
                        }
                    }
                    else {
                        rowspan = td.attr('rowspan');

                        if (rowspan && rowspan > 1) {
                            rowspan = Number(rowspan);
                            td.attr('rowspan', '');
                            row = $(td);
                        } else { rowspan = null;}
                    }
                })
            }

            function updateRowSpan(isRowSpan) {
                if (settings.rowspan) {
                    on_rowspan = [];
                    if (typeof (settings.rowspan) == 'object') {
                        for (var i = 0; i < settings.rowspan.length; i++) {
                            if (Number(settings.rowspan[i]) != 'NaN') {
                                on_rowspan.push(Number(settings.rowspan[i]) - 1);
                                if (isRowSpan) {
                                    rowmerge(Number(settings.rowspan[i]) - 1, $this);
                                } else {
                                    rowReduction(Number(settings.rowspan[i]) - 1, $this);
                                }
                            }
                        }
                    } else {
                        var rows = settings.rowspan.split(',');
                        for (var i = 0; i < rows.length; i++) {
                            thead.find('th').each(function (index) {
                                if ($(this).data('field') == rows[i]) {
                                    on_rowspan.push(index - 1);
                                    if (isRowSpan) {
                                        rowmerge(index - 1, $this);
                                    } else {
                                        rowReduction(index - 1, $this);
                                    }
                                }
                            })
                        }
                    }
                }
            }
            /*rowmerge*/

            function updatePager() {

                var selector = tfoot.find('select');
                selector.empty();



                for (var i = 0; i < settings.pages; i++) {
                    selector.append($('<option></option>').val(i + 1).text(i + 1));
                }

                selector.find('option[value="' + settings.index + '"]').attr('selected', true);

                if (settings.index > 1) {
                    tfoot.find('.prev').attr('href', (settings.index - 1));
                } else {
                    tfoot.find('.prev').attr('href', 1);
                }


                if (settings.index < settings.pages) {
                    tfoot.find('.next,.more').attr('href', (settings.index + 1));
                } else {
                    tfoot.find('.next,.more').attr('href', settings.pages);
                }

                tfoot.find('.last').attr('href', settings.pages).prev().prev().text('共' + settings.pages + '页');



                tfoot.find('div:eq(' + (settings.automore ? '2' : '1') + ')').find('input').val(settings.size).end().find('label:last').html((!settings.autopage || settings.automore ? '' : '/') + '共' + settings.total + '条&nbsp;');
                if (settings.pages == 1) {
                    tfoot.find('.last-child').hide();
                }
                else {
                    if (settings.autopage) {
                        if (settings.automore && tbody.find('tr').size() == settings.total) {
                            tfoot.find('.last-child').hide();
                        } else {
                            tfoot.find('.last-child').show();
                        }
                    }
                }
                if (settings.footer === false) {
                    tfoot.find('tr td div').hide();
                }

                updateRowSpan(true);

            }
            function changePageIndex(pageIndex) {

                if (isNaN(pageIndex)) {
                    alert('页码非法。');
                } else {

                    if (pageIndex < 1 || pageIndex > settings.pages) {

                        alert('页面必须在1到' + settings.pages + '之间。')
                    } else {
                        $this.data('pageindex', pageIndex);
                        settings.index = parseInt(pageIndex);
                        reload();
                    }
                }
            }



            function changePageSize(size) {
                if (isNaN(size)) {
                    alert('记录数非法。')
                } else {
                    settings.size = parseInt(size);
                    $this.data('pagesize', size);
                    $this.data('pageindex', 1);
                    settings.index = 1;
                    reload();
                }
            }

            updatePager();


            /*paging*/

            var tbody = $this.find('tbody');
            if (tbody.size() == 0) {
                tbody = $('<tbody></tbody>').appendTo($this);
            }
            /*select*/

            var isCtrl = false;
            var isShift = false;
            var prev = null;
            $(document).keydown(function (e) {
                isCtrl = e.which == 17;
                isShift = e.which == 16;
            }).keyup(function (e) {
                if (e.which == 17) {
                    isCtrl = false;
                }
                if (e.which == 16) {
                    isShift = false;
                }
            });


            function getSelected() {
                return tbody.find('tr.selected');
            }

            function changeSelect(row) {
                if (settings.multiselect && isCtrl) {
                    $(row).toggleClass('selected');
                } else
                    if (settings.multiselect && isShift) {
                        if (prev && prev != $(row)) {
                            var prevSet = prev.find('.first-child').text();
                            var rowSet = $(row).find('.first-child').text();
                            prevSet = isNaN(Number(prevSet)) ? 0 : Number(prevSet);
                            rowSet = isNaN(Number(rowSet)) ? 0 : Number(rowSet);
                            if (prevSet > rowSet) {
                                tbody.find('tr').each(function () {
                                    var set = Number($(this).find('.first-child').text());
                                    if (set >= rowSet && set < prevSet) {
                                        $(this).addClass('selected');
                                    }
                                })
                            } else {
                                tbody.find('tr').each(function () {
                                    var set = Number($(this).find('.first-child').text());
                                    if (set <= rowSet && set > prevSet) {
                                        $(this).addClass('selected');
                                    }
                                })
                            }
                        }

                        //$(row).toggleClass('selected');


                    } else {
                        tbody.find('tr').not($(row)).removeClass('selected');
                        $(row).toggleClass('selected');
                    }
                if ($(row).is('.selected')) {
                    prev = $(row);
                }
                else {
                    prev = null;
                }

                // console.log(prev);

                for (var i in on_select) {
                    var action = on_select[i];
                    action($(row));
                }
            }

            function getSelectedDataItems() {
                var arr = [];
                tbody.find('tr.selected').each(function () {
                    arr.push(getDataItem($(this).index()));
                });
                return arr;
            }

            /*select*/

            /*row*/
            var row_tmpl = $($this.data('row-tmpl'));

            if (row_tmpl.size() == 0) {
                updateTemplate(null, false);
            }

            function buildRow(data) {
                //reviseJson(data);
                //                var formarted = {};
                //                for (var i in data) {
                //                    var val = data[i];

                //                    //                data_field = $(item).data('field');
                //                    //                if (data_field.split('.').length > 1)
                //                    //                    val = items[seq][data_field.split('.')[0]][data_field.split('.')[1]];
                //                    //                else
                //                    //                    val = items[seq][data_field];
                //                    //                if (val == null)
                //                    //                    val = "";
                //                    if (String(val).indexOf('Date(') > -1) {
                //                        val = formatDate(eval('new ' + val.replace(new RegExp('/', "gm"), '')));
                //                    }
                //                    formarted[i] = val;
                //                }


                var item = row_tmpl.tmpl(data);

                var row;
                if (item.is('tr')) {
                    row = item;
                } else {
                    row = $('<tr></tr>').append(item);
                }
                $.each(thead.find('th'), function (index, th) {
                    if ($(th).data('sorting')) {
                        row.find('td').eq(index - 1).addClass($(th).data('sorting'));
                    }
                });
                row.attr('data-itemid', data[$this.data('key')]);
                bindRow(row);


                return row;
            }




            function insertRow(data) {
                //data.insertBefore(items);
                data.seq = 1;
                var row = buildRow(data);

                updateRowSpan(false);

                if (tbody.find('tr').size() == 0) {
                    tbody.append(row);
                } else {
                    row.insertBefore(tbody.find('tr:first'));
                    updateSeq();
                }

                if (items.length == 0) {
                    items.push(data);
                } else {
                    items.splice(0, 0, data);
                }
                settings.total += 1;
                updatePager();
            }

            function appendRow(data) {
                if (typeof (data.seq) == 'undefined') {
                    data.seq = tbody.find('tr').size() + 1;
                }
                var row = buildRow(data);
                updateRowSpan(false);
                tbody.append(row)
                updateSeq();
                items.push(data);
                settings.total += 1;
                updatePager();
            }

            function deleteRow(id) {
                var row = tbody.find('tr[data-itemid="' + id + '"]');

                if (row.size() > 0) {
                    updateRowSpan(false);
                    items.splice(row.index(), 1);
                    row.remove();
                    updateSeq();
                    settings.total -= 1;
                    updatePager();
                }
            }

            function updateRow(id, data) {
                var row = tbody.find('tr[data-itemid="' + id + '"]');
                if (row.size() > 0) {
                    updateRowSpan(false);
                    items[row.index()] = data;
                    newRow = buildRow(data);
                    newRow.insertBefore(row);
                    row.remove();
                    updateSeq();
                    updateRowSpan(true);
                }
            }

            function updateTemplate(tmpl, autoload) {
                if (tmpl) {
                    row_tmpl = $(tmpl);
                } else {
                    row_tmpl = $('<tr></tr>');
                    thead.find('tr:first').find('th').each(function (index, item) {
                        if (index === 0) {
                            row_tmpl.append('<th>${seq}</th>');
                        } else {
                            row_tmpl.append('<td>${' + $(item).data('field') + '}</td>')
                        }
                    });
                }
                if (autoload !== false)
                    reload();
            }

            function updateHead(head, tmpl, autoload) {
                $this.find('thead').html(head);
                thead = $this.find('thead');
                updateFoot();
                updateTemplate(tmpl, autoload);
            }

            var on_select = [];
            var on_dblclick = [];

            function bindRow(row) {
                row.hover(function () {
                    $(this).find('td').addClass('hover');
                }, function () {
                    $(this).find('td').removeClass('hover');
                }).click(function () {
                    changeSelect($(this));
                }).dblclick(function () {
                    if ($(this).is('.selected') == false) {
                        changeSelect($(this));
                    }

                    for (var i in on_dblclick) {
                        var action = on_dblclick[i];
                        action($(this));
                    }
                }).find('td:last').mouseleave(function (e) {
                    $(this).hideTips();
                });
            }




            //            thead.find('tr').mousemove(function (e) {
            //                $(this).hideTips();
            //            });

            //            tbody.find('tr').find('td:last').live('mouseleave',function (e) {
            //                $(this).hideTips();
            //            });

            //            tfoot.find('tr').mouseenter(function (e) {
            //                $(this).hideTips();
            //            });

            function updateSeq() {
                tbody.find('tr th').each(function (index, item) {
                    if ($(this).children().size() == 0) {
                        $(this).text((index + 1) + ((settings.index - 1) * settings.size));
                    }

                    $(this).addClass('first-child');
                });

                if (tbody.find('tr:not(.notdata)').size() > 0) {
                    tbody.find('.notdata').remove();
                } else {
                    if (tbody.find('.notdata').size() == 0) {
                        tbody.append($('<tr class="notdata"><td colspan="' + thead.find('tr:first').children().size() + '">没有匹配的记录</td></tr>'));
                    }
                }

            }

            function getRows() {
                return tbody.find('tr:not(".notdata")');
            }
            /*row*/

            /*content*/
            var items = [];
            function getDataItems() {
                return items;
            }

            function getDataItem(index) {
                return items[index];
            }

            function updateContent(data) {

                if (data) {
                    if (typeof (data.TotalHits) != 'undefined') {
                        settings.total = data.TotalHits;
                        $this.data('total', data.TotalHits);
                    }
                    if (!settings.automore || settings.index == 1) {
                        tbody.empty();
                        tfoot.find('.last-child').show();
                    }
                    else
                        tbody.find('.notdata').remove();

                    items = data.Items ? data.Items : data;

                    for (var seq = 0; seq < items.length; seq++) {
                        var item = items[seq];
                        // debugger;
                        item.seq = seq + 1 + ((settings.index - 1) * settings.size);
                        var row = buildRow(item);
                        tbody.append(row);
                    }
                    settings.pages = Math.ceil(settings.total / settings.size);
                    if (settings.pages == 0) {
                        settings.pages = 1;
                    }

                } else {
                    $this.find('tbody tr').not('tbody tr.notdata').each(function () {
                        bindRow($(this));
                    });
                }

                if (tbody.find('tr').size() == 0) {
                    tbody.append($('<tr class="notdata"><td colspan="' + cols + '">没有匹配的记录</td></tr>'));
                }


                tbody.find('tr th').addClass('first-child');

                tbody.find('tr').each(function (index, item) {
                    if ((index % 2) == 1) {
                        $(item).find('td').addClass('odd');
                    } else {
                        $(item).find('td').removeClass('odd');
                    }
                });



                updatePager();

                for (var i in on_loaded) {
                    var action = on_loaded[i];
                    action($this);
                }
            }

            updateContent();

            /*content*/

            /*autoSizeColumn*/
            var autoSizeColumn = function () {
                thead.find('th.word-auto').each(function () {
                    var autoSize = $(this).data('min-width');
                    var size = 120;
                    if (autoSize) {
                        size = autoSize;
                    }
                    if ($(this).width() < size && $(this).width() != 0) {
                        $(this).width(size);
                    }
                    else {
                        $(this).css('width', 'auto');
                    }
                })
            }
            /*autoSizeColumn*/

            /*reload*/
            var on_loaded = [];
            var reload = function () {
                var data = $('form').serialize();
                data = data + '&__TableName=' + settings.name;
                data = data + '&__PageIndex=' + settings.index;
                data = data + '&__PageSize=' + settings.size;
                // data = data +'__EVENTTARGET='+"TableName__"+name;

                var fields = [];
                var orders = getOrders();
                for (var i = 0; i < orders.length; i++) {
                    var item = orders[i];
                    if (item.sorting === 'asc') {
                        fields.push('i.' + item.field);
                    } else {
                        if (item.sorting === 'desc') {
                            fields.push('i.' + item.field + ' desc');
                        }
                    }
                }
                data = data + '&__OrderBy=' + fields.toString();

                var action = $('form').attr('action');

                $.post(action, data, function (data, textStatus, jqXHR) {

                    if (data != null && data.error != undefined) {
                        alert(data.error);
                        return;
                    }
                    reviseJson(data);
                    callback(data);
                    $.fn.hideTips();
                    prev = null;

                }, 'json');
                autoSizeColumn();
            }
            if (settings.autoload) {
                reload();
            }

            var callback = function (options) {
                return function (data) {
                    var $this = $.fn.grid.getInstance(options.name);
                    $this.updateContent(data);
                };
            }(settings);

            /*reload*/


            var instance = {
                orderBy: orderBy,
                orderByDesc: orderByDesc,
                changePageIndex: changePageIndex,
                changePageSize: changePageSize,
                getSelected: getSelected,
                getOrders: getOrders,
                reload: reload,
                updateContent: updateContent,
                appendRow: appendRow,
                insertRow: insertRow,
                deleteRow: deleteRow,
                updateRow: updateRow,
                updateTemplate: updateTemplate,
                updateHead: updateHead,
                getRows: getRows,
                getDataItems: getDataItems,
                getDataItem: getDataItem,
                getSelectedDataItems: getSelectedDataItems,
                autoSizeColumn: autoSizeColumn,
                select: function (fn, cleanAll) {
                    if (cleanAll) {
                        on_select = [];
                    }
                    if (fn instanceof Function) {
                        on_select.push(fn);
                    }
                },
                dbclick: function (fn, cleanAll) {
                    if (cleanAll) {
                        on_dblclick = [];
                    }
                    if (fn instanceof Function) {
                        on_dblclick.push(fn);
                    }
                },
                loaded: function (fn, cleanAll) {
                    if (cleanAll) {
                        on_loaded = [];
                    }
                    if (fn instanceof Function) {
                        on_loaded.push(fn);
                    }
                }
            };

            $.fn.grid.list[settings.name] = instance;

            return $this;

        });

    }

    $.fn.grid.list = {};

    $.fn.grid.getInstance = function (name) {
        if (!name) {
            name = 'default';
        }

        return $.fn.grid.list[name];
    }

    $.fn.grid.defaults = {
        getSettings: function (el) {
            function getInt(el, name, defaultValue) {
                var val = el.data(name);
                if (isNaN(val)) {
                    return defaultValue;
                } else {
                    return val;
                }
            }
            var settings = {
                total: getInt(el, 'total', 0),
                index: getInt(el, 'pageindex', 1),
                size: getInt(el, 'pagesize', 15),
                multiselect: el.data('multiselect') === true,
                multisort: el.data('multisort') === true,
                name: el.data('name'),
                footer: el.data('footer') !== false,
                autoload: el.data('autoload') === true,
                autopage: el.data('autopage') !== false,
                rowspan: el.data('rowspan-fields'),
                autorowspan: el.data('autorowspan') !== false,
                automore: el.data('automore') === true
            };
            settings.pages = Math.ceil(settings.total / settings.size);
            if (settings.pages == 0) {
                settings.pages = 1;
            }

            if (typeof (settings.name) == 'undefined' || settings.name == '') {
                settings.name = 'default';
            }
            return settings;
        }
    };

})(jQuery);



$(function () {
    $('.gridview').grid();
    $('.gridview').find('tbody td').live('mousemove', function (e) {
        var $this = $(this);
        if (!$this.parent().is('.notdata') && $this.parents('[data-tips="false"]').length == 0) {
            /**
             * @change log 
             *  17/05/2013 Jianbo Hou 
             *      change $(this).text() ->$(this).html()
             *      add a judgement to fix a bug : tips may show input:checkbox
             */
            if ($this.find('input').size() == 0) {
                $this.showTips($this.html(), { mouse: e, target: $this });
            }

        }
    }).live('mouseout', function () {
        if (!$(this).parent().is('.notdata') && $(this).parents('[data-tips="false"]').length == 0) {
            $(this).hideTips();
        }
    })
    //        .end().find('th').live('mouseenter', function (e) {
    //            $(this).hideTips();
    //        }).end().find('tfoot tr').live('mouseenter', function (e) {
    //            $(this).hideTips();
    //        });
});