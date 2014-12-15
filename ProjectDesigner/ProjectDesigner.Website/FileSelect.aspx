<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="FileSelect.aspx.cs" Inherits="ProjectDesigner.Website.FileSelect" %>

<%@ Register Src="ClientResources.ascx" TagName="ClientResources" TagPrefix="uc1" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>上传文件</title>
    <uc1:ClientResources ID="ClientResources1" runat="server" />
    <script type="text/javascript">
        $(function () {
            if ($.fn.win.getQuery('view') == 'simple') {
                window.resizeTo(667, 382);
            }
            if ($.fn.win.getQuery('showSenior') == 'true') {
                $('#btnSenior').show();
            }
            $('#btnSubmitFile').click(function () {
                if ($('form').validate()) {
                    var filescount = 0;
                    $('input[name="files"]').each(function () {
                        if ($(this).val() != '')
                            filescount++;
                    })
                    if (filescount == 0) {
                        alert('请选择文件！');
                        return false;
                    }
                    return validatefiletype();
                    return true;
                } else {
                    return false;
                }
            })
            function validatefiletype() {
                var onfiletype = $.fn.win.getQuery('filetype');
                if (onfiletype) {
                    var isOn = false;
                    var filetypename;
                    var filetypes = [];
                    $('input[name="files"]').each(function () {
                        var filename = $(this).val();
                        if (filename) {
                            isOn = false;
                            var filetype = filename.slice(filename.indexOf('.')).toLowerCase();
                            switch (onfiletype) {
                                case 'img':
                                    filetypename = '图片';
                                    filetypes = ['.jpg', '.png', '.gif', '.bmp'];
                                    for (var i in filetypes) {
                                        if (filetype == filetypes[i]) {
                                            isOn = true;
                                            break;
                                        }
                                    }
                                    break;
                                default: break;
                            }
                            if (!isOn)
                                return;
                        }
                    })
                    if (!isOn) {
                        alert('请选择' + filetypename + '类型附件！');
                        return false;
                    }
                }
                return true;
            }
            var count = 1;
            $('.addfile').live('click', function (e) {
                e.preventDefault();
                var max = $.fn.win.getQuery('max');
                if (max == null)
                    max = 1;
                if ($('.addfile').size() >= max) {
                    alert('只能同时上传' + max + '个文件！');
                }
                else {
                    $('tbody').append('<tr><th><a class="addfile">+</a> 上传附件</th><td colspan="3"><input type="file" style="width:481px;" class="button_out" id="file_' + count + '" name="files"></td></tr>');
                    count++;
                }
            })
            $('#btnSenior').click(function (e) {
                e.preventDefault();
                window.location.href = '../FileRun.aspx?max=' + $.fn.win.getQuery('max') + '&category=' + encodeURI($.fn.win.getQuery('category')) + '&type=' + $.fn.win.getQuery('type') + '&showSenior=' + $.fn.win.getQuery('showSenior') + '&view=advanced&_jscallback=' + $.fn.win.getQuery('_jscallback') + '&r=' + Math.random();
            })
        })
        function callback(s) {
            if (s === 'unsucceed') {
                alert("上传文件失败，请确认是否选择文件！");
            }
            else {
                if (s) {
                    $.fn.win.close(s);
                }
            }
        }
        function callbackFileLength(s) {
            if (s === 'unsucceed') {
                alert("上传文件失败，上传文件大小不能超过20M！");
            }
        }
    </script>
    <style>
        .addfile {
            cursor: pointer;
            color: Red;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <form id="form1" runat="server">
        <div class="edit_content">
            <table cellspacing="2" cellpadding="0" border="0">
                <tbody>
                    <tr style="display: none">
                        <th>工作组
                        </th>
                        <td>
                            <asp:DropDownList runat="server" ID="Workgroup_Code">
                            </asp:DropDownList>
                        </td>
                        <th>附件名称
                        </th>
                        <td>
                            <asp:TextBox runat="server" ID="OriginalName"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <th>上传时间
                        </th>
                        <td>
                            <asp:TextBox runat="server" ID="UploadTime" Enabled="false"></asp:TextBox>
                        </td>
<%--                        <th>上传用户
                        </th>
                        <td>
                            <asp:TextBox runat="server" ID="Uploader_ID" Enabled="false"></asp:TextBox>
                        </td>--%>
                    </tr>
                    <tr>
                        <th>附件简要说明
                        </th>
                        <td colspan="3">
                            <asp:TextBox runat="server" ID="Description" TextMode="MultiLine" Width="481" Height="50"
                                CssClass="long"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <th>备注
                        </th>
                        <td colspan="3">
                            <asp:TextBox runat="server" ID="Remark" TextMode="MultiLine" Width="481" Height="50"
                                CssClass="long"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <th>
                            <a class="addfile">+</a> 上传附件
                        </th>
                        <td colspan="3">
                            <input type="file" style="width: 481px;" id="file_0" class="button_out" name="files" />
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="4" class="height10">
                            <asp:FileUpload runat="server" ID="files" Width="481px" CssClass="button_out" Style="display: none;" />
                        </td>
                    </tr>
                    <tr>
                        <td colspan="4" class="line"></td>
                    </tr>
                    <tr>
                        <td colspan="4">
                            <div class="right">
                                <div class="tool_button">
                                    <asp:Button runat="server" CssClass="button_out" ID="btnSenior" Text="高级视图" Style="display: none;" />
                                </div>
                                <div class="tool_button">
                                    <asp:Button runat="server" CssClass="button_out" ID="btnSubmitFile" Text="上 传" OnClick="btnSubmitFile_Click" />
                                </div>
                                <div class="tool_button">
                                    <input type="button" class="button_out win-close-link" id="btnClose" value="关 闭" />
                                </div>
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
        <asp:HiddenField runat="server" ID="hidedir" />
    </form>
</body>
</html>
