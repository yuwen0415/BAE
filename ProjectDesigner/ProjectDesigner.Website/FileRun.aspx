<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="FileRun.aspx.cs" Inherits="ProjectDesigner.Website.FileRun" %>

<%@ Register Src="ClientResources.ascx" TagName="ClientResources" TagPrefix="uc1" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>文件管理</title>
    <style type="text/css">
        .fileList {
            margin: 5px 0 0 5px;
        }

            .fileList input, .fileList img, .fileList label {
                vertical-align: middle;
            }

            .fileList img {
                margin-left: 5px;
            }
    </style>
    <uc1:ClientResources ID="ClientResources1" runat="server" />
</head>
<body>
    <form id="form1" runat="server">
        <div class="tabs">
            <ul class="tabs_items">
                <li class="selected"><a href="#">空间资源</a></li>
                <li class=""><a href="#">服务器文件</a></li>
                <li class=""><a href="#">网络地址</a></li>
            </ul>
            <div>
                <div class="splitter" data-exclude-height="71">
                    <div class="left-panel" data-minwidth="100">
                        <ul id="folderList" data-getnodes="GetFolders" class="treeview" data-static="true" data-name="tags">
                        </ul>
                        <input type="hidden" id="hdnCategory" runat="server" clientidmode="Static" />
                    </div>
                    <div class="splitter-bar">
                    </div>
                    <div class="right-panel fileRun">
                        <div class="main-content">
                            <div class="clearThis">
                            </div>
                            <div>
                                <table border="0" cellpadding="0" cellspacing="0" class="search_panel">
                                    <tr>
                                        <td class="top_left"></td>
                                        <td class="top_txt">查询条件
                                        </td>
                                        <td class="top_center"></td>
                                        <td class="top_right"></td>
                                    </tr>
                                    <tr>
                                        <td class="middle_left"></td>
                                        <td colspan="2" class="content">
                                            <ul>
                                                <li>
                                                    <label for="txtOriginalName">
                                                        名称</label>
                                                    <asp:TextBox ID="txtOriginalName" runat="server" ClientIDMode="Static"></asp:TextBox>
                                                </li>
                                            </ul>
                                            <span>
                                                <asp:Button runat="server" ID="btnSearch" CssClass="button_out search-link" ClientIDMode="Static" Text="查询" /></span>
                                        </td>
                                        <td class="middle_right"></td>
                                    </tr>
                                    <tr>
                                        <td class="bottom_left"></td>
                                        <td class="bottom_center" colspan="2"></td>
                                        <td class="bottom_right"></td>
                                    </tr>
                                </table>
                            </div>
                            <div class="tool">
                                <div class="left">
                                    <input name="" type="button" class="button_out" value="简单视图" onclick="selectView();" />
                                    <input name="" type="button" class="button_out" value="上传新文件" onclick="uploadFile();" />
                                    <%--<input name="" type="button" class="button_out" value="删除文件" onclick="delFile();" />--%>
                                </div>
                                <div class="right">
                                    <ul>
                                        <li>排序方式：</li>
                                        <li>
                                            <select id="sort" name="sort">
                                                <option value="i.fname">按名称</option>
                                                <option value="i.ftype">按类型</option>
                                                <option value="i.ftime">按日期</option>
                                            </select>
                                            <select id="sorttype" name="sorttype">
                                                <option value="">升序</option>
                                                <option value=" desc">降序</option>
                                            </select></li>
                                        <li>排列方式：</li>
                                        <li><a class="selected stype" href="#" title="图标" data-div="thumbnail">
                                            <img src="images/FileRun/thumbnail.gif" /></a></li>
                                        <li><a class="stype" href="#" title="列表" data-div="detailed">
                                            <img src="images/FileRun/detailed.gif" /></a></li>
                                    </ul>
                                </div>
                            </div>
                            <div class="thumbnail">
                            </div>
                            <div class="detailed">
                                <script id="event_row_tmpl" type="text/x-jquery-tmpl">
                                    <tr data-itemid="${ftime}">
                                        <th>
                                            <input name="" type="checkbox" value="${fkey}" />
                                        </th>
                                        <td>
                                            <span class="file ${ftype}">${fname}</span>
                                        </td>
                                        <td>${ftype}
                                        </td>
                                        <td>${ftime}
                                        </td>
                                        <td>${fuser}
                                        </td>
                                    </tr>
                                </script>
                                <table border="0" cellpadding="0" cellspacing="1" class="gridview" data-multiselect="true"
                                    data-key="ftime" data-row-tmpl="#event_row_tmpl">
                                    <thead>
                                        <tr>
                                            <th class="word-2">
                                                <input name="" type="checkbox" value="" />
                                            </th>
                                            <th class="word-auto" data-field="fname">名称
                                            </th>
                                            <th class="word-2" data-field="ftype">类型
                                            </th>
                                            <th class="word-8" data-field="ftime">上传时间
                                            </th>
                                            <th class="word-4" data-field="fuser">上传用户
                                            </th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style="display: none">
                <div class="splitter splitterFile" data-exclude-height="71">
                    <div class="left-panel" data-minwidth="200">
                        <ul id="CodeCategoryTree" class="treeview" data-getnodes="GetCodeCategoryTree" data-name="file" data-autoexpandfirst="true" runat="server">
                        </ul>
                        <input type="hidden" id="hdnType" runat="server" clientidmode="Static" />
                    </div>
                    <div class="splitter-bar">
                    </div>
                    <div class="right-panel fileRun">
                        <div class="fileList">
                            <ul class="ulFileList">
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div style="display: none">
                <div class="edit_new" style="width: 800px; height: 100%;">
                    <div>
                        <div class="row">
                            <div>
                                <label style="width: 200px">
                                    请输入网络地址</label><asp:TextBox ID="txtUrl" runat="server" Width="500"></asp:TextBox>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <table border="0" cellpadding="0" cellspacing="0" class="statusbar">
            <tfoot>
                <tr>
                    <td class="line"></td>
                </tr>
                <tr>
                    <td>
                        <div class="right">
                            <div class="tool_button">
                                <input name="" type="button" class="button_out" value="确 定" onclick="getResults();" />
                                <input name="" id="btnClose" type="button" class="button_out win-close-link" value="关 闭" />
                            </div>
                        </div>
                    </td>
                </tr>
            </tfoot>
        </table>
    </form>
</body>
<script type="text/javascript">
    $(document).ready(function () {
        if ($.fn.win.getQuery('view') == 'advanced') {
            window.resizeTo(852, 682);
            window.location = window.location.href.replace('view=advanced', 'view=');
        }
        $('#hdnCategory').val(decodeURI($.fn.win.getQuery('category')));

        TreeLoad();
        FileLoad();

        $('.tabs_items li').each(function (index) {
            $(this).click(function () {
                if (!$(this).is('.selected')) {
                    $('.selected').removeClass('selected');
                    $(this).addClass('selected');
                    $('.tabs>div').hide().eq(index).show();
                    if (index < 2) {
                        $('#txtUrl_field_validation_summary_errors').click();
                    }
                }
            })
        });

        $('.stype').click(function () {
            if (!$(this).is('.selected')) {
                $('.' + $('.stype.selected').data('div')).hide();
                $('.stype.selected').removeClass('selected');
                $(this).addClass('selected');
                $('.' + $(this).data('div')).show();
            }
        })
        $('#sort,#sorttype').change(function () {
            FileLoad();
        })
        $('#btnSearch').click(function () {
            FileLoad();
        })
        $('.gridview thead :checkbox').click(function () {
            if ($(this).is(':checked')) {
                $('.gridview tbody input:checkbox').not(':checked').attr('checked', true);
            } else {
                $('.gridview tbody input:checked').removeAttr('checked');
            }
        })
        splitterresize();
        $(window).resize(function () {
            splitterresize();
        });

        var t = $.fn.treeview.getInstance('file');

        t.select(function (data) {
            getFolderFiles(data.id);
        });

        function getFolderFiles(path) {
            $.fn.ajaxPost({
                method: 'GetFiles', params: { 'path': path }, callback: function (data) {
                    if (data != null) {
                        $(".ulFileList").html("");
                        for (var f in data) {
                            var li = $("<li></li>");
                            var input = $("<input value = '" + data[f].fname + "' type='checkbox' />");
                            var ima = $(" <img src='../Images/FileRun/file_small.gif' />");
                            var label = $("<label></label>");
                            label.text(data[f].fname);
                            li.append(input);
                            li.append(ima);
                            li.append(label);
                            $(".ulFileList").append(li);
                        }
                    }
                    //var checkbox = $(".ulFileList :checkbox");
                    //checkbox.each(function () {
                    //    $(this).live("click", function () {
                    //        checkbox.each(function () {
                    //            $(this).attr("checked", false);
                    //        });
                    //        $(this).attr("checked", true);
                    //    });
                    //});
                }
            });
        }
    });

    function TreeLoad() {
        var t = $.fn.treeview.getInstance('tags');
        t.select(function (data) {
            $('#hdnCategory').val(data.id);
            FileLoad();
        });
        t.loaded(function () {
            $('#folderList').find('span').each(function () {
                if ($(this).attr('id') == $('#hdnCategory').val()) {
                    $('.treeview[data-name=tags] span.selected').removeClass('selected');
                    $(this).addClass('selected');
                }
            })
        })
    }

    function splitterresize() {
        //$('.splitter').css('width', '100%');
        //$('.splitter').height($('.splitter').height() - $('.statusbar').height());
        //$('.left-panel').height($('.left-panel').height() - $('.statusbar').height());
        //$('.right-panel').height($('.right-panel').height() - $('.statusbar').height());
    }
    var files = new Array;

    function getFiles(category) {
        $.fn.ajaxPost({
            method: 'GetFileList', params: { '__category': category }, callback: function (data) {
                if (data != null) {
                    files = data.Items;
                    $(".thumbnail").html("");
                    for (var f in files) {
                        var div = $("<div></div>");
                        var a = $("<a href='#'></a>");
                        var input = $("<input value = '" + files[f].fkey + "' type='checkbox'/>");
                        var span = $("<span></span>");
                        var label = $("<label></label>");
                        var type = files[f].ftype.toLowerCase();

                        span.addClass(type).addClass('file').click(function () {
                            $(this).prev().click();
                        });
                        span.attr('title', '类型:' + files[f].ftype +' ' + files[f].fuser + '在' + files[f].ftime + '上传');
                        if (type == 'jpg' || type == 'png' || type == 'gif' || type == 'bmp') {
                            autoScaling(span, files[f].furl);
                        }
                        a.append(input).append(span);
                        label.text(files[f].fname);
                        a.append(label);
                        div.append(a);

                        $(".thumbnail").append(div);
                    }
                }
            }
        });
    }
    function autoScaling(s, url) {
        s.removeClass('file');
        var img = $('<img />')
        img.attr('src', url);
        var i = new Image();
        i.src = url;
        var s_width = 90;
        var s_height = 80;
        var img_width = i.width;
        var img_height = i.height;
        if (img_width > 0 && img_height > 0) {
            if (img_width > s_width)
                var rate = (s_width / img_width < s_height / img_height) ? s_width / img_width : s_height / img_height;
            if (rate < 1) {
                img_width = img_width * rate;
                img_height = img_height * rate;
                img.width(img_width);
                img.height(img_height);
            }
            var left = ((s_width - img_width) * 0.5);
            var top = ((s_height - img_height) * 0.5);
            img.css({ "margin-left": left, "margin-top": top });
        }
        else {
            img.width(s_width);
            img.height(s_height);
        }
        s.append(img);
    }
    var selectedfiles = function () {
        var list = [];
        switch ($('.tabs_items li').index($('.selected'))) {
            case 0:
                $('.' + $('.stype.selected').data('div')).find('input:checked').each(function () {
                    if ($(this).val() != '') {
                        var obj = eval('(' + $(this).val() + ')');
                        list.push(obj);
                    }
                })
                break;
            case 1:
                var t = $.fn.treeview.getInstance('file');
                var selected = t.getSelectedData()[0];
                $('.ulFileList :checked').each(function () {
                    if ($(this).val() != '') {
                        var f = $(this).val();
                        var fname = f.substring(0, f.lastIndexOf('.'));
                        var ftype = f.substring(f.lastIndexOf('.')+1);
                        var id = '/' + selected.id.replace('//', '/') + '/' + $(this).val();
                        var item = { fid: id, fguid: id, fkey: '', fname: fname, ftype: ftype, flength: 0, fuser: '', ftime: '', furl:encodeURIComponent(id) };
                        list.push(item);
                    }
                })
                break;
            default:
                var id = $('#txtUrl').val();
                var fname = id.substring(0, id.lastIndexOf('.'));
                fname = fname.substring(fname.lastIndexOf('/') + 1);
                var ftype = id.substring(id.lastIndexOf('.') + 1);
                var item = { fid: id, fguid: id, fkey: '', fname: fname, ftype: ftype, flength: 0, fuser: '', ftime: '', furl: encodeURIComponent(id) };
                list.push(item);
                break;
        }
        return list;
    }

    function getResults() {
        if (!$('form').validate()) {
            return false;
        }
        var max = $.fn.win.getQuery('max');
        var type = $.fn.win.getQuery('type');
        var list = selectedfiles();
        max = max == null ? 1 : max;
        if (list.length > max) {
            alert('最多允许选择' + max + '个文件！');
        }
        else {
            var ontype = true;
            if (type) {
                for (var i in list) {
                    if (ontype) {
                        var file = list[i];
                        var intype = false;
                        for (var t in $.fn.fileselector.defaults.type[type]) {
                            if ($.fn.fileselector.defaults.type[type][t] == file.ftype.toLowerCase()) {
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
                alert('请选择' + type + '类型的文件！');
            } else {
                $.fn.win.close(list);
            }
        }
    }

    function uploadFile() {
        $(document).win({
            url: 'FileSelect.aspx', width: 655, height: 300, data: { category: decodeURI($.fn.win.getQuery('category')) }, callback: function (succeed) {
                if (succeed) {
                    FileLoad();
                    $.fn.treeview.list = {};
                    $('.treeview').empty().treeview();
                    TreeLoad();
                }
            }
        }).show();
    }

    function delFile() {
        var list = selectedfiles();
        if (list.length > 0) {
            if (confirm('删除的文件将不能还原，同时会删除对应的关联数据！是否确定删除' + list.length + '个文件？')) {
                $.fn.ajaxPost({
                    method: 'DelFileList', params: { '__files': JSON.stringify(list) }, callback: function () {
                        FileLoad();
                    }
                })
            }
        }
        else {
            alert('请选择删除的文件！');
        }
    }
    function FileLoad() {
        getFiles($('#hdnCategory').val());
        $.fn.grid.getInstance().changePageIndex(1);
    }
    function selectView() {
        window.location.href = '../FileSelect.aspx?max=' + $.fn.win.getQuery('max') + '&category=' + decodeURI($.fn.win.getQuery('category')) + '&type=' + $.fn.win.getQuery('type') + '&showSenior=' + $.fn.win.getQuery('showSenior') + '&view=simple&_jscallback=' + $.fn.win.getQuery('_jscallback') + '&r=' + Math.random();
    }
</script>
</html>
