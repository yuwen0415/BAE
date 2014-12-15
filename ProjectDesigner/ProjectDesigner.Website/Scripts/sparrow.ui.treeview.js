/// <reference path="jquery-1.7.min.js" />

(function ($) {

    //jquery对象拓展方法
    $.fn.extend({
        swapClass: function (c1, c2) {
            var c1Elements = this.filter('.' + c1);
            this.filter('.' + c2).removeClass(c2).addClass(c1);
            c1Elements.removeClass(c1).addClass(c2);
            return this;
        },
        replaceClass: function (c1, c2) {
            return this.filter('.' + c1).removeClass(c1).addClass(c2).end();
        },
        hoverClass: function (className) {
            className = className || "hover";
            return this.hover(function () {
                $(this).addClass(className);
            }, function () {
                $(this).removeClass(className);
            });
        }
    });

    $.fn.treeview = function (options) {

        return this.each(function () {

            var opts = $.extend({}, $.fn.treeview.defaults, options);
            var settings = opts.getSettings($(this));
            var method;
            var Node;
            var NodeList = new Array;
            var SelectNodeList = new Array;
            var Static = settings.static === true;
            var on_select = [];
            var on_loaded = [];

            if ($.fn.treeview.list[settings.treeId]) {
                return $(this);
            }
            $this = $(this);
            if (!$this.is('ul')) {
                $this.append($("<ul class='treeview'></ul>"));
            } else {
                $this.addClass("treeview");
            }

            on_loaded.push(Onloaded);

            getNodes($this);


            function getNodes(obj) {
                if (!obj.data("getnodes")) {
                    Static = true;
                    updateTree(obj);
                } else {
                    method = obj.data("getnodes");
                    var id = obj.find('>span:last').attr("id");

                    if (typeof (id) == 'undefined')
                        id = "";
                    $.fn.ajaxPost({ method: method, enableValidate: false, params: { "__nodeId": id }, callback: function (nodes) {
                        if (settings.static) {
                            forNodes(obj, nodes, '');
                        }
                        else {
                            forNodes(obj, nodes);
                        }
                        updateTree(obj);
                    }
                    });
                }
            }

            function runLoaded() {
                for (var i in on_loaded) {
                    var action = on_loaded[i];
                    action($this);
                }
            }

            function updateTree(obj) {
                applyClasses(obj.find('li'));
                expand(obj);
                //添加叶子节点
                if (settings.static) {
                    updateLastNote(obj);
                    obj.find('ul').each(function () {
                        expand($(this));
                    })
                }
                runLoaded();
            }

            function updateLastNote(obj) {
                $.each(obj.find('ul'), function (index, ul) {
                    if ($(this).find('>li').size() == 0) {
                        var div = $(this).parent().find('>div')
                        div.addClass('leaf');
                        if ($(this).parent().is('.lastExpandable'))
                            $(this).parent().removeClass('lastExpandable').removeClass('expandable').addClass('lastNote');
                        if ($(this).parent().is('.lastCollapsable'))
                            $(this).parent().removeClass('lastCollapsable').removeClass('collapsable').addClass('lastNote');
                    }
                })
            }

            function removeNodes(nodes, node) {
                $(nodes).each(function (index) {
                    if ($(this).id == node.id) {
                        //$(nodes).remove(index);
                        delete $(nodes)[index];
                        return false;
                    }
                })
                return $(nodes);
            }
            // expand
            function expand(ul) {
                ul = ul.is('ul') ? ul : ul.find('>ul');
                if (settings.autoexpandfirst || settings.autoexpandall) {
                    $.each(ul.find('>li>.expandable-hitarea'), function () {
                        $(this).click();
                    })
                    settings.autoexpandfirst = false;
                    //else { setTimeout( updateLastNote(ul),10000); }
                }
            }
            // 

            function forNodes(obj, nodes, pid, isfirst) {
                if (nodes != null) {
                    if (!$(obj).is('ul'))
                        var ul = $(obj).find('>ul').length > 0 ? $(obj).find('>ul') : $(obj).append($("<ul class=''></ul>")).find("ul:eq(0)");
                    else
                        var ul = $(obj)
                    var nodeitems = [];
                    $(nodes).each(function (index, node) {
                        if ((typeof (pid) != 'undefined' && node.pid == pid) || typeof (pid) == 'undefined') {
                            if (node.isOrg)
                                nodeitems.push(node);
                            var nodemethod = (!node.method) ? method : node.method;
                            var li = $('<li data-getnodes="' + nodemethod + '"></li>');
                            if (index == nodes.length - 1 && !isfirst)
                                li = $(li).addClass(CLASSES.lastExpandable).addClass(CLASSES.expandable);
                            else
                                li.addClass(CLASSES.expandable)

                            var span = $('<span></span>');
                            span.append(node.text).attr('id', node.id).attr('data-val', (JSON.stringify(node)));

                            //根据定义配置样式 none/folder/file/custom
                            switch (opts.iconType) {
                                case 'folder':
                                    $(span).addClass('folder');
                                    break;
                                case 'file':
                                    $(span).addClass('file');
                                    break;
                                default:
                                    break;
                            }

                            switch (settings.treeType) {
                                case 'CheckBox':
                                    var checkbox = $('<input type="checkbox" />');
                                    $(li).append($(checkbox));
                                    break;
                                default:
                                    break;
                            };
                            var nodeul = $('<ul class="treeview"></ul>');
                            nodeul.hide();
                            $(li).append($(span));
                            $(li).append(nodeul)
                            var divClass = settings.autoEmployee && (!node.isorg && node.isorg == 0) ? CLASSES.leaf + " " + CLASSES.expandableLeaf : CLASSES.hitarea + " " + CLASSES.collapsableHitarea;
                            $(li).prepend('<div class="' + divClass + '"/>').find('div.' + divClass);
                            if (isfirst) {
                                $(ul).prepend($(li));
                            }
                            else {
                                $(ul).append($(li));
                            }
                            NodeList.splice(NodeList.length - 1, 0, node);
                            nodes = removeNodes(nodes, node);
                        }
                    })
                    if (!Static)
                        ul.show();
                    if (typeof (pid) != 'undefined') {
                        $.each(nodeitems, function (index, node) {
                            forNodes(ul.find('>li>ul').eq(index), nodes, node.id);
                        })
                    }
                }
            }
            function collapseOrexpand(o) {
                var obj = $(o);
                if (obj.is('span')) {
                    var checkbox = $(obj).parent().find('>input[type="checkbox"]');
                    if (checkbox.size() > 0) {
                        if (checkbox.is(':checked'))
                            checkbox.removeAttr('checked').click().removeAttr('checked');
                        else
                            checkbox.attr('checked', true).click().attr('checked', true);
                    }
                }
                if (obj.parent().find(">ul>li").length == 0 && !Static) {
                    getNodes(obj.parent());
                }
                else {
                    obj.parent().find(">ul").toggle();
                }
            }

            function toggler() {

                switch ($(this).get(0).tagName) {
                    case "INPUT":
                        break;
                    case "DIV":
                        collapseOrexpand(this);
                        $(this).parent().find(">.hitarea")
						.swapClass(CLASSES.collapsableHitarea, CLASSES.expandableHitarea)
						.swapClass(CLASSES.lastCollapsableHitarea, CLASSES.lastExpandableHitarea)
					.end()
					.swapClass(CLASSES.collapsable, CLASSES.expandable)
					.swapClass(CLASSES.lastCollapsable, CLASSES.lastExpandable);
                        break;
                    case "SPAN":
                        $(this).parents('ul.treeview').find('.selected').removeClass('selected');
                        $(this).addClass('selected');
                        changeSelectNodeList("DelAll");
                        changeSelectNodeList("Add", $(this).data('val'));
                        Select(selectNodeFromNodeList($(this).attr("id")));
                        break;
                    default:
                        //点击文本展开树
                        //collapseOrexpand(this);

                        break;
                }
            }

            $(this).data("toggler", toggler);

            function applyClasses(obj) {
                obj.filter(":not(:has(>a))").find(">span").add($("a", obj)).hoverClass();


                //静态树需要
                if (Static) {
                    obj.parent().find('>li:last').addClass(CLASSES.lastExpandable);
                }

                var hitarea = obj.find("div." + CLASSES.hitarea);
                //hitarea.removeClass().addClass(CLASSES.hitarea);
                hitarea.removeClass().addClass(CLASSES.hitarea).each(function () {
                    var classes = "";
                    $.each($(this).parent().attr("class").split(" "), function () {
                        classes += this + "-hitarea ";
                    });
                    $(this).addClass(classes);
                })

                obj.find("div." + CLASSES.hitarea).unbind('click').click(toggler);
                obj.find("span").unbind('click').click(toggler);
                //input 不执行展开
                //obj.find("input").click(toggler);
            }

            function changeSelectNodeList(op, data) {
                switch (op) {
                    case "Add":
                        var iseq = false;
                        $.each(SelectNodeList, function (index, node) {
                            if (node.id == data.id) {
                                iseq = true;
                                return false;
                            }
                        })
                        if (!iseq)
                            SelectNodeList.splice(SelectNodeList.length - 1, 0, data);
                        break;
                    case "Del":
                        for (var i = 0; i < SelectNodeList.length; i++) {
                            if (SelectNodeList[i].id == data.id) {
                                SelectNodeList.splice(i, 1);
                            }
                        }
                        break;
                    case "DelAll":
                        SelectNodeList = [];
                        break;
                    default:
                        break;
                }
            }

            function selectNodeFromNodeList(k) {
                var r = "";
                for (var i = 0; i < NodeList.length; i++) {
                    if (NodeList[i].id == k) {
                        r = NodeList[i];
                        break;
                    }
                }

                return r;
            }

            function getSelectedData() {
                if (settings.treeType == 'CheckBox') {
                    var items = [];
                    $this.find('input:checked').each(function () {
                        var data = $(this).parent().next().data('val');
                        items.push(data);
                    })
                    return items;
                }
                else {
                    return SelectNodeList;
                }
            }

            function Select(node) {
                Node = node;
                for (var i in on_select) {
                    var action = on_select[i];
                    action(node);
                }
            }

            function Onloaded(obj) {
                $(obj).find(':checkbox').each(function () {
                    if (!$(this).parent().is('span')) {
                        var span = $('<span class="checkbox-none"></span>');
                        span.click(function () {
                            var checkbox = $(this).find('input:checkbox');
                            if (checkbox.is(':checked')) {
                                $(this).attr('class', 'checkbox-none');
                                checkbox.removeAttr('checked');
                                $(this).parent().find('input:checkbox').not(checkbox).removeAttr('checked');
                                $(this).parent().find('.checkbox-all,.checkbox-half').attr('class', 'checkbox-none');
                            } else {
                                $(this).attr('class', 'checkbox-all');
                                checkbox.attr('checked', true);
                                $(this).parent().find('input:checkbox').not(checkbox).attr('checked', true);
                                $(this).parent().find('.checkbox-none').removeClass('checkbox-none').addClass('checkbox-all');
                            }
                            if (settings.autocheckhalf) {
                                checkHalf(checkbox);
                            }
                        })
                        $(this).wrap(span);
                    }
                })
            }

            function checkHalf(c) {
                var li = c.parent().parent().parent().parent();
                if (li.is('li')) {
                    var checkbox = li.find('>span>input:checkbox');
                    if (li.find('input:checked').not(checkbox).size() == 0) {
                        checkbox.parent().attr('class', 'checkbox-none');
                        checkbox.removeAttr('checked');
                    } else
                        if (li.find('input:checked').size() != li.find('input:checkbox').size()) {
                            checkbox.parent().attr('class', 'checkbox-half');
                            checkbox.attr('checked', true);
                        }
                        else {
                            checkbox.parent().attr('class', 'checkbox-all');
                            checkbox.attr('checked', true);
                        }
                    checkHalf(checkbox);
                }
            }


            var insertNote = function (item) {
                if (item) {
                    var obj = item.pid ? $('#' + item.pid).parent() : null;
                    if (obj.find('>ul:hidden').length > 0) return;
                    forNodes(obj, [item], item.pid, true);
                    updateTree(obj);
                }
            }

            var updateNote = function (item) {
                if (item) {
                    var span = $('#' + item.id);
                    if (span) {
                        span.attr('data-val', JSON.stringify(item));
                        span.text(item.text);
                    }
                }
            }

            var deleteNote = function (id) {
                if (id) {
                    var span = $('#' + id);
                    if (span) {
                        var li = span.parent();
                        if (li.next().size() == 0) {
                            li.prev().addClass(li.prev().is('.expandable') ? 'lastExpandable' : 'lastCollapsable');
                            li.prev().find('>div').addClass(li.prev().is('.expandable') ? 'lastExpandable-hitarea' : 'lastCollapsable-hitarea')
                        }
                        li.remove();
                    }
                }
            }

            var instance = {
                getSelectedData: getSelectedData,
                insertNote: insertNote,
                updateNote: updateNote,
                deleteNote: deleteNote,
                select: function (fn, cleanAll) {
                    if (cleanAll) {
                        on_select = [];
                    }
                    if (fn instanceof Function) {
                        on_select.push(fn);
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

            $.fn.treeview.list[settings.treeId] = instance;

            return $(this);
        });
    };
    $.treeview = {};
    $.fn.treeview.list = {};
    $.fn.treeview.defaults = {
        getSettings: function (el) {
            var settings = {
                treeType: el.data('treetype') ? el.data('treetype') : 'simple',
                static: el.data('static') === true,
                autoEmployee: el.data('autoemployee') === true,
                autoexpandfirst: el.data('autoexpandfirst') === true,
                autoexpandall: el.data('autoexpandall') === true,
                autocheckhalf: el.data('autocheckhalf') !== false,
                treeId: el.data('name') ? el.data('name') : 'tree0'
            };
            return settings;
        }, iconType: "none"
    };
    $.fn.treeview.getInstance = function (name) {
        if (!name) {
            name = 'tree0';
        }

        return $.fn.treeview.list[name];
    }

    var CLASSES = ($.treeview.classes = {
        open: "open",
        closed: "closed",
        expandable: "expandable",
        expandableHitarea: "expandable-hitarea",
        lastExpandableHitarea: "lastExpandable-hitarea",
        collapsable: "collapsable",
        collapsableHitarea: "collapsable-hitarea",
        lastCollapsableHitarea: "lastCollapsable-hitarea",
        lastCollapsable: "lastCollapsable",
        lastExpandable: "lastExpandable",
        last: "last",
        hitarea: "hitarea",
        expandableLeaf: "expandable-leaf",
        leaf: "leaf"
    });

})(jQuery);


$(function () {
    $('.treeview').treeview();
});