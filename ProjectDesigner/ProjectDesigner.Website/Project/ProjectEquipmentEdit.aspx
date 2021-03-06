﻿<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ProjectEquipmentEdit.aspx.cs" Inherits=" ProjectDesigner.Website.Project.ProjectEquipmentEdit" %>

<%@ Register Src="../ClientResources.ascx" TagName="ClientResources" TagPrefix="uc1" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<uc1:ClientResources ID="ClientResources1" runat="server" />

<head id="Head1" runat="server">
    <%--<script src="http://172.5.1.61:8080/EzServerClient/js/EzMapAPI.js" type="text/javascript" charset="GB2312"></script>--%>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <style type="text/css">
        input[type="text"] {
            width: 160px;
        }

        .edit_new {
            width: 900px;
        }

            .edit_new .row div {
                width: 450px;
            }

                .edit_new .row div input /* 文本框：TextBox */ {
                    width: 180px;
                }

                .edit_new .row div select /* 下拉框：TextBox */ {
                    width: 185px;
                }

                .edit_new .row div textarea /* 文本区域：TextBox TextMode="MultiLine" */ {
                    width: 482px;
                }

                .edit_new .row div label /* label */ {
                    width: 100px;
                }
    </style>
    <title>工程设计</title>
</head>
<body>
    <%--onload="initMap();"--%>
    <form id="form1" runat="server">

        <div class="edit_new">
            <div>
                <h2>项目设备信息</h2>
                <div class="row">
                    <div>
                        <label>
                            设备名称</label><asp:TextBox runat="server" ID="txtName" ClientIDMode="Static" Width="325px">请输入设备名称</asp:TextBox>
                        <%--                    <label>
                        设备名称</label><asp:TextBox ID="txtName" CssClass="combobox" data-dialog-url="../Popup/SelectLEDModule.aspx"
                            data-callback-fields='{"Name":"#txtName"}' data-search-method="FindLEDModule"
                            data-dialog-height='550' data-dialog-width='680' ClientIDMode="Static" data-columns='{"Name": "名称" }' data-getData="getEquipmentData"
                            runat="server" Width="325px"></asp:TextBox>--%>
                    </div>
                    <div>
                        <label>
                            设备类型</label><asp:DropDownList runat="server" ID="DropEquipmentType" ClientIDMode="Static" Width="325px">
                                <asp:ListItem Value="0">未知</asp:ListItem>
                                <asp:ListItem Value="1">交通诱导屏</asp:ListItem>
                                <asp:ListItem Value="3">杆件</asp:ListItem>
                                <asp:ListItem Value="4">基础</asp:ListItem>
                                <asp:ListItem Value="5">交通视频监控</asp:ListItem>
                                <asp:ListItem Value="6">电子警察</asp:ListItem>
                                <asp:ListItem Value="7">交通流量事件采集</asp:ListItem>
                                <asp:ListItem Value="9">设备辅材</asp:ListItem>
                                <asp:ListItem Value="10">工程建设辅材</asp:ListItem>
                                <asp:ListItem Value="11">中心设备</asp:ListItem>
                            </asp:DropDownList>
                    </div>
                </div>
                <div class="row">
                    <div>
                        <label>
                            品牌</label><asp:TextBox runat="server" ID="txtBrand" ClientIDMode="Static" Width="325px"></asp:TextBox>
                    </div>

                    <div>
                        <label>
                            数量</label><asp:TextBox runat="server" ID="txtNum" ClientIDMode="Static" Width="325px"></asp:TextBox>
                    </div>
                </div>
                <div class="row">
                    <div>
                        <label>
                            设备价格</label><asp:TextBox runat="server" ID="txtPrice" ClientIDMode="Static" Width="325px"></asp:TextBox>
                    </div>

                    <div>
                        <label>
                            设备位置</label><asp:TextBox runat="server" ID="txtLocation" ClientIDMode="Static" Width="325px"></asp:TextBox>
                        <%--<input id="btnSelectPoint" name="" type="button" class="button_out" style="width: 40px;" runat="server" clientidmode="Static" value="获 取" />--%>
                    </div>
                </div>
                <div>
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
                                            <label for="txtCName">
                                                名称</label>
                                            <asp:TextBox ID="txtSName" runat="server" CssClass='input20 '></asp:TextBox>
                                        </li>
                                    </ul>
                                    <span>
                                        <label for="txtCType">
                                            设备类型</label>
                                        <asp:DropDownList runat="server" ID="DropSEquipmentType" ClientIDMode="Static" Width="152px">
                                            <asp:ListItem Value="0">未知</asp:ListItem>
                                            <asp:ListItem Value="1">交通诱导屏</asp:ListItem>
                                            <asp:ListItem Value="3">杆件</asp:ListItem>
                                            <asp:ListItem Value="4">基础</asp:ListItem>
                                            <asp:ListItem Value="5">交通视频监控</asp:ListItem>
                                            <asp:ListItem Value="6">电子警察</asp:ListItem>
                                            <asp:ListItem Value="7">交通流量事件采集</asp:ListItem>
                                            <asp:ListItem Value="9">设备辅材</asp:ListItem>
                                            <asp:ListItem Value="10">工程建设辅材</asp:ListItem>
                                            <asp:ListItem Value="11">中心设备</asp:ListItem>
                                        </asp:DropDownList>
                                    </span>
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

                    <div class="tool_button">
                        <input id="btnSelected" name="" type="button" class="button_out" runat="server"
                            clientidmode="Static" value="选 择" />
                    </div>


                    <table border="0" cellpadding="0" cellspacing="1" class="gridview" data-multiselect="true"
                        data-key="Id" data-autoload="true" data-pagesize="3">
                        <thead>
                            <tr>
                                <th class="word-2">
                                    <a href="#">序号</a>
                                </th>
                                <th class="word-auto" data-field="Name" data-sorting="fixed">
                                    <a href="#">设备名称</a>
                                </th>
                                <th class="word-4" data-field="Price" data-sorting="fixed">
                                    <a href="#">价格</a>
                                </th>
                                <th class="word-auto" data-field="Brand" data-sorting="fixed">
                                    <a href="#">品牌</a>
                                </th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>

            <div class="buttons">
                <input id="btnSave" name="" type="button" class="button_out win-save-link" runat="server"
                    clientidmode="Static" value="保 存" />
                <input name="" type="button" onmouseout="this.className='button_out'" class="button_out win-close-link"
                    value="关 闭" />
            </div>

            <div id="dituContent">
                <iframe id="ifrPage" name="ifrPage" src="map.html" style="border: #ccc solid 1px; width: 900px; height: 330px"></iframe>
            </div>
        </div>

    </form>
    <%--    <div class="map">
        <div id="dituContent" style="border: #ccc solid 1px; width: 800px; height: 300px"></div>
    </div>--%>
    <!--地图容器-->

</body>
<script type="text/javascript">

    $('#btnSelected').click(function () {
        var ids = $.fn.grid.getInstance().getSelected().attr('data-itemid');
        if (ids) {
            $(this).ajaxPost({
                method: 'EuipmentSelected', params: { 'EquipmentId': ids }, 'callback': function (data) {
                    if (data != null) {
                        $('#txtName').val(data.Name);
                        $('#txtPrice').val(data.Price);
                        $('#txtBrand').val(data.Brand);
                        $('#DropEquipmentType').val(data.EquipmentType);
                        if (data.EquipmentType == "9" || data.EquipmentType == "10" || data.EquipmentType == "11") {
                            $('#ifrPage').hide();
                        }
                        else {
                            $('#ifrPage').show();
                        }
                    }
                }
            })
        }
        else {
            alert("请选择一条记录!");
        }
    });

</script>
</html>










