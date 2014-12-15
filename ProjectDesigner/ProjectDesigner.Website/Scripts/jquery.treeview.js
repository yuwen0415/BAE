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
        var opts = $.extend({}, $.fn.treeview.defaults, options);
        var method;
        var Node;
        var NodeList = new Array;
        var SelectNodeList = new Array;
        var Static = false;
        return this.each(function () {

            if ($.fn.treeview.list[opts.treeId]) {
                return $(this);
            }

            if (!$(this).is('ul'))
                $(this).append($("<ul class='treeview'></ul>"));
            else
                $(this).addClass("treeview");
            getNodes($(this));

            function getNodes(obj) {
                if (!$(obj).data("getnodes")) { Static = true; applyClasses($(obj).find('li')); }
                else {
                    method = $(obj).data("getnodes");
                    var id = $(obj).find(">span:eq(0)").attr("id");

                    if (typeof (id) == 'undefined')
                        id = "";
                    $.fn.ajaxPost({ method: method, params: { "__nodeId": id }, callback: function (nodes) {
                        if (nodes != null) {
                            if (!$(obj).is('ul'))
                                var ul = $(obj).append($("<ul class=''></ul>")).find("ul:eq(0)");
                            else
                                var ul = $(obj)
                            for (var node in nodes) {
                                var nodemethod = (!nodes[node].method) ? method : nodes[node].method;
                                var li = $("<li data-getnodes='" + nodemethod + "'></li>").addClass(CLASSES.expandable);
                                if (node == nodes.length - 1)
                                    li = $(li).addClass(CLASSES.lastExpandable);

                                var span = $("<span></span>");
                                $(span).append(nodes[node].text).attr("id", nodes[node].id);
                                //根据定义配置样式 none/folder/file/custom
                                switch (opts.iconType) {
                                    case "folder":
                                        $(span).addClass("folder");
                                        break;
                                    case "file":
                                        $(span).addClass("file");
                                        break;
                                    default:
                                        break;
                                }

                                switch (opts.treeType) {
                                    case "CheckBox":
                                        var checkbox = $("<input type='checkbox'></input>"); 
                                        (function (n) {
                                            $(checkbox).click(function (e) { 
                                                if (this.checked) {
                                                    $(this).parent().find(':checkbox').attr('checked', 'true');
                                                    changeSelectNodeList("Add", n);
                                                }
                                                else
                                                    changeSelectNodeList("Del", n);
                                            });
                                        })(nodes[node]);
                                        $(li).append($(checkbox));
                                        break;
                                    default:
                                        break;
                                };

                                $(li).append($(span));
                                $(ul).append($(li));

                                NodeList.splice(NodeList.length - 1, 0, nodes[node]);
                            }
                            applyClasses($(obj).find('li'));
                        }
                    }
                    });
                }
            }

            function collapseOrexpand(obj) {
                if ($(obj).parent().find(">ul").length == 0) {
                    getNodes($(obj).parent());
                }
                else {
                    $(obj).parent().find(">ul").toggle();
                }
            }

            function toggler() {
                $(this)
					.parent()
					.find(">.hitarea")
						.swapClass(CLASSES.collapsableHitarea, CLASSES.expandableHitarea)
						.swapClass(CLASSES.lastCollapsableHitarea, CLASSES.lastExpandableHitarea)
					.end()
					.swapClass(CLASSES.collapsable, CLASSES.expandable)
					.swapClass(CLASSES.lastCollapsable, CLASSES.lastExpandable);

                switch ($(this).get(0).tagName) {
                    case "INPUT":
                        break;
                    case "DIV":
                        collapseOrexpand(this);
                        break;
                    default:
                        collapseOrexpand(this);
                        Select(selectNodeFromNodeList($(this).attr("id")));
                        break;
                }
            }

            $(this).data("toggler", toggler);

            function applyClasses(obj) {
                obj.filter(":not(:has(>a))").find(">span").add($("a", obj)).hoverClass();

                //静态树需要
                if (Static) {
                    obj.filter(":has(>ul:hidden)")
                						.addClass(CLASSES.expandable)
                						.replaceClass(CLASSES.last, CLASSES.lastExpandable);

                    obj.not(":has(>ul:hidden)")
                						.addClass(CLASSES.collapsable)
                						.replaceClass(CLASSES.last, CLASSES.lastCollapsable);
                }

//                var hitarea = obj.find("div." + CLASSES.hitarea);
//                if (!hitarea.length)
//                    hitarea = obj.prepend("<div class=\"" + CLASSES.hitarea + "\"/>").find("div." + CLASSES.hitarea);
//                hitarea.removeClass().addClass(CLASSES.hitarea).each(function () {
//                    var classes = "";
//                    $.each($(this).parent().attr("class").split(" "), function () {
//                        classes += this + "-hitarea ";
//                    });
//                    $(this).addClass(classes);
//                })

                obj.find("div." + CLASSES.hitarea).click(toggler);
                obj.find("span").click(toggler);
                obj.find("input").click(toggler);
            }

            function changeSelectNodeList(op, data) {
                switch (op) {
                    case "Add":
                        SelectNodeList.splice(SelectNodeList.length - 1, 0, data);
                        break;
                    case "Del":
                        for (var i = 0; i < SelectNodeList.length; i++) {
                            if (SelectNodeList[i].id == data.id) {
                                SelectNodeList.splice(i, 1);
                            }
                        }
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

                return SelectNodeList;
            }

            function Select(node) {
                Node = node;
                for (var i in on_select) {
                    var action = on_select[i];
                    action(node);
                }
            }

            var on_select = [];

            var instance = {
                getSelectedData: getSelectedData,
                select: function (fn, cleanAll) {
                    if (cleanAll) {
                        on_select = [];
                    }
                    if (fn instanceof Function) {
                        on_select.push(fn);
                    }
                }
            };

            $.fn.treeview.list[opts.treeId] = instance;

            return $(this);
        });
    };
    $.treeview = {};
    $.fn.treeview.list = {};
    $.fn.treeview.defaults = { treeId: "tree0", iconType: "none", treeType: "simple" };
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
        hitarea: "hitarea"
    });

})(jQuery);


$(function () {
    $('.treeview').treeview();
});