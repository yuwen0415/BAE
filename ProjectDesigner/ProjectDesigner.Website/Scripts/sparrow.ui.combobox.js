/// <reference path="jquery-1.7.min.js" />
/// <reference path="jquery.tmpl.js" />
/// <reference path="sparrow.js" />
/// <reference path="sparrow.ui.grid.js" />
/// <reference path="sparrow.ui.win.js" />
/// <reference path="sparrow.ajax.js" />



(function ($) {
    $.fn.combobox = function (options) {
        var opts = $.extend({}, $.fn.combobox.defaults, options);

        return this.each(function () {


            var $this = $(this);

            var w = $this.width();
            var h = $this.height();

            var multiselect = $this.data('multiselect');



            var $wrapper = $this.wrap('<div class="combobox-wrapper"/>').parent();

            //$wrapper.width(w + 5).height(h + 5);

          

            $this.width(w);

            $this.attr('data-origin', $this.val());

            /*icon*/
            var icon = $('<a href="#" class="combobox-icon" title="查询"></a>');


            icon.insertAfter($(this));
            // icon.height(h);
            icon.css("left", (w - 18) + "px"); //.css("top","-"+h+"px");

            var iconDisable = $(this).attr('data-icon-disable');

            if (iconDisable) {
                icon.hide();
            }

            //处理IE10底下变形问题
            if ($.browser.msie && ($.browser.version == "10.0")) {
                icon.css("left", (w - 20) + "px");
                $this.height(18);
            }

            /*input_code*/
            var input_code = $('<input type="hidden"></input>');
            input_code.attr('name', $this.attr('id') + '_Code');
            input_code.insertAfter(icon);
            input_code.val($this.attr('data-code'));


            /*container*/
            var container = $('<table border="0" cellpadding="0" cellspacing="1" class="gridview" data-pagesize="15" data-name="" data-tips="false" data-builder="true" data-autosize="false" data-key="ID"><thead><tr></tr></thead><tbody></tbody></table>');

            //name
            var combobox_name = $(this).attr('data-name');

            if (!combobox_name) {
                combobox_name = 'default';
            }
            var grid_name = $(this).attr('name') + '_grid';
            container.data('name', grid_name);

            //method 
            var method = $(this).data('search-method');
            if (!method && (multiselect != true)) {
                alert('请为' + $this.attr('id') + '配置对应的data-search-method');
                return;
            }

            //box width
            var boxWidth = $(this).data('box-width');
            if (!boxWidth) {
                boxWidth = opts.boxWidth;
            }
            container.width(boxWidth);

            //key
            var key = $(this).data('key');
            if (!key) {
                key = opts.key;
            }
            container.data('key');

            //columns
            var columns = $(this).data('columns');
            if (!columns) {
                columns = opts.columns;
            }

            container.find('thead tr').append($('<th class="word-2"></th>').text('序号'));
            for (var i in columns) {
                container.find('thead tr').append($('<th></th>').data('field', i).text(columns[i]));
            }

            //box style
            var style = $(this).data('box-style');
            if (!style) {
                style = opts.boxStyle;
            }
            if (style == 'list') {
                container.find('thead').hide();

                var tmpl_id = $(this).attr('id') + '_tmpl';
                var jquery_tmpl = '<script id="' + tmpl_id + '" type="text/x-jquery-tmpl">';
                var tmpl_tbody = $('<tbody><tr></tr></tbody>');
                var tmpl_col = $('<td></td>');
                tmpl_col.attr('colspan', container.find('thead').find('tr:first').find('th').size());
                container.find('thead').find('tr:first').find('th').each(function (index, item) {
                    if (index > 0) {
                        tmpl_col.text(tmpl_col.text() + ' ${' + $(item).data('field') + '}');
                    }
                });
                tmpl_tbody.find('tr').append(tmpl_col);
                jquery_tmpl += tmpl_tbody.html() + '</script>';
                $(this).after(jquery_tmpl);
                container.attr('data-row-tmpl', '#' + tmpl_id);
            }

            //box thead
            var thead = $(this).data('box-thead');
            if (thead === false) {
                container.find('thead').hide();
            }

            //box tmpl
            var tmpl = $(this).data('box-tmpl');
            if (tmpl) {
                container.removeAttr('data-row-tmpl').attr('data-row-tmpl', '#' + tmpl);
            }


            //dialog height
            var dialogHeight = $(this).data('dialog-height');
            if (!dialogHeight) {
                dialogHeight = opts.dialogHeight;

            }

            //dialog width
            var dialogWidth = $(this).data('dialog-width');
            if (!dialogWidth) {
                dialogWidth = opts.dialogWidth;
            }


            container.hide();
            $('body').append(container);

            container.grid();
            container.find('tfoot').hide();

            var grid = $.fn.grid.getInstance(grid_name);



            var getInstance = function (input, grid, container, icon, input_code, columns) {
                return function () {
                    return {
                        input: input,
                        grid: grid,
                        container: container,
                        icon: icon,
                        input_code: input_code,
                        columns: columns
                    }
                }
            }($this, grid, container, icon, input_code, columns);



            grid.select(function (row) {
                var index = $(row).index();

                var instance = getInstance();

                setControls(instance.grid.getDataItem(index));

                keepAlive = false;
                keepFocus = false;
                instance.container.hide();
            });

            //callback
            function setControls(data) {
                var instance = getInstance();
                var fields = instance.input.data('callback-fields');
                if (instance.input.data('multiselect') == true) {

                    var codes = [];
                    var names = [];
                    var tips = [];
                    
                    if (fields) {
                        for (var j in fields) {
                            $(fields[j]).val('');
                        }
                    }
                    for (var i in data) {
                        var item = data[i];
                        var tip = [];

                        codes.push($.trim(item.Code));
                        names.push(item.Cname);

                        for (var m in instance.columns) {
                            tip.push(item[m]);
                        }

                        tips.push(tip.join('|'));

                        if (fields) {
                            for (var j in fields) {
                                for (var d in data[i]) {
                                    if (j === d) {
                                        $(fields[j]).val($(fields[j]).val() + data[i][d] + ',');
                                    }
                                }
                            }
                        }
                    }
                    instance.input_code.val(codes.join(','));

                    instance.input.val(names.join(','));

                    instance.input.attr('data-origin', names.join(','));

                    instance.input.attr('title', tips.join('\r'));

                } else {

                    instance.input_code.val(data.Code);

                    instance.input.val(data.Cname);
                    var tips = [];
                    for (var i in instance.columns) {
                        tips.push(data[i]);
                    }
                    instance.input.attr('title', tips.join('|'));

                    if (fields) {
                        for (var i in fields) {
                            if ($(fields[i]).is('img')) {
                                $(fields[i]).attr('src', data[i]);
                            } else {
                                $(fields[i]).val(data[i]);
                            }
                        }
                    }

                    instance.input.attr('data-origin', instance.input.val());
                }

                if (fields) {
                    for (var j in fields) { 
                        $(fields[j]).val($(fields[j]).val().length > 0 && $(fields[j]).val().substring($(fields[j]).val().length - 1) == ',' ? $(fields[j]).val().substring(0, $(fields[j]).val().length - 1) : $(fields[j]).val());
                    }
                }
                for (var i in on_select) {
                    var fn = on_select[i];
                    fn(data);
                }
            }

            //events
            icon.click(function (e) {
                e.preventDefault();
                var disable = icon.attr('disabled');
                if (disable) {
                    return;
                }
                var data = null;
                var params = $this.data('search-params');
                if (params != null) {
                    if (typeof (params) == 'string') {
                        data = params + "&keywords=" + encodeURI($this.val());
                    }

                    if (typeof (params) == 'object') {
                        data = params;
                        data.keywords = encodeURI($this.val());
                    }
                }

                var getData = $this.data('getData');


                $.fn.win({
                    url: $this.attr('data-dialog-url'), width: dialogWidth, height: dialogHeight, callback: function (result) {
                        setControls(result);
                    }, data: data, getData: function () {
                        if (typeof (getData) == 'function') {
                            return getData();
                        } else {
                            var input = getInstance().input;
                            if (input.data('multiselect') == true) {
                                var code = $('[name=' + input.attr('id') + '_Code]').val();
                                if (code) {
                                    var codes = code.split(',');

                                    if (codes.length > 0) {
                                        var names = input.val().split(',');

                                        var items = [];

                                        for (var i in codes) {
                                            var item = {
                                                Code: codes[i],
                                                Cname: names[i]
                                            };

                                            items.push(item);
                                        }

                                        return items;
                                    }

                                } else {
                                    //                                return [{
                                    //                                    Code: $(this).next().val(),
                                    //                                    Cname: input.val()
                                    //                                }]

                                    return null;
                                }

                            } else {
                                return null;
                            }
                        }
                    }
                }).show();

                keepAlive = false;
                container.hide();
            });





            /*events*/
            var on_select = [];

            function select(callback, clearAll) {
                if (clearAll === true) {
                    on_select = [];
                }

                if (callback instanceof Function) {
                    on_select.push(callback);
                }
            }






            var keepAlive = false;
            var keepFocus = false;
            container.mouseenter(function () {
                keepAlive = true;

            }).mouseleave(function () {
                if (keepFocus == false) {
                    var instance = getInstance();
                    instance.container.hide();
                    keepAlive = false;
                }
            });

            var delayQuery;

            $(this).keydown(function (e) {

                if ($(this).data('multiselect') == true || $(this).data('disable-box') == true) {
                    e.preventDefault();
                    return false;
                }

            }).keyup(function (e) {
                e.preventDefault();
                keepFocus = true;

                if ($(this).data('multiselect') == true || $(this).data('disable-box') == true) {
                    if (e.keyCode == 8) {
                        input_code.val('');
                        $(this).val('');
                        $(this).attr('title', '');
                    }
                    return false;
                } else {

                    if (delayQuery) {
                        clearTimeout(delayQuery);
                    }

                    if ($.trim($(this).val()).length > 0) {

                        delayQuery = window.setTimeout(function () {
                            var params = mergeParams({ "combobox_keywords": $this.val() }, $this.data('search-params'));
                            $.fn.ajaxPost({
                                method: method, enableValidate: false, params: params, callback: function (result) {
                                    var intance = getInstance();
                                    //console.log(result)
                                    var count = 0;
                                    if (result.TotalHits) {
                                        count = result.TotalHits;
                                    } else {
                                        count = result.length;
                                    }

                                    if (count > 0) {
                                        intance.container.show().css('z-index', 9999);
                                        intance.container.offset({ left: intance.input.offset().left, top: intance.input.offset().top + intance.input.height() + 4 });
                                        intance.grid.updateContent(result);
                                    } else { intance.container.hide(); }
                                }
                            })
                        }, 200);
                    } else {
                        var intance = getInstance();
                        intance.container.hide();
                    }
                }

            }).blur(function () {
                if (keepAlive == false) {
                    container.hide();
                }
                keepFocus = false;

                if ($.trim($(this).val()).length == 0) {
                    input_code.val('');
                    $(this).attr('title', '');
                }

                if ($(this).val() != $(this).attr('data-origin')) {
                    if ($this.data('forcedselect') != false) {
                        input_code.val('');
                        $(this).val('');
                        $(this).attr('title', '');
                    }
                    else {
                        input_code.val('');
                    }
                }
            });

            /*disable*/
            var isdisable = $(this).is(':disabled');

            if (isdisable) {
                disable();
            }

            function disable() {
                $this.attr('disabled', true);
                icon.attr('disabled', true);
            }

            /*enable*/
            function enable() {
                $this.removeAttr('disabled');
                icon.removeAttr('disabled');
            }


            /*instance*/
            var instance = {
                disable: disable,
                enable: enable,
                select: select,
                columns: columns
            };

            $.fn.combobox.list[combobox_name] = instance;
        });

    }

    $.fn.combobox.defaults = {
        columns: { Code: '代码', Cname: '名称' },
        key: "Code",
        boxWidth: 300,
        dialogHeight: 570,
        dialogWidth: 770,
        boxSytle: 'grid'
    }
    $.fn.combobox.list = {};
    $.fn.combobox.getInstance = function (name) {
        if (!name) {
            name = "default";
        }

        return $.fn.combobox.list[name];
    }
})(jQuery);

$(function () {
    try {
        var options = settings_combobox;
        if (options) {
            $('.combobox').combobox(options);
        } else {
            $('.combobox').combobox();
        }
    } catch (e) {
        $('.combobox').combobox();
    }
})
