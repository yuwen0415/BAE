<%@ Page Title="方案查看" Language="C#" MasterPageFile="~/Main.Master" AutoEventWireup="true"
    CodeBehind="ProjectEdit.aspx.cs" Inherits=" ProjectDesigner.Website.Project.ProjectEdit" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
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
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="edit_new">
        <div>
            <h2>项目信息</h2>
            <div class="row">
                <div>
                    <label>
                        项目名称</label><asp:TextBox runat="server" ID="txtName" ClientIDMode="Static" Width="325px"></asp:TextBox>
                </div>
                <div>
                    <label>
                        项目总价</label><asp:TextBox runat="server" ID="txtPrice" ClientIDMode="Static" Width="325px"></asp:TextBox>
                </div>
            </div>

            <div>
                <h3>项目设施设备列表
                </h3>

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
                                        <label>
                                            设备名称</label>
                                        <asp:TextBox Width="152px" ID="EquipmentName" DataTextField="Name" DataValueField="Code"
                                            runat="server" ClientIDMode="Static">
                                        </asp:TextBox>
                                    </li>

                                    <li>
                                        <label>
                                            设备类型</label>
                                        <asp:TextBox Width="152px" ID="EquipmentType" DataTextField="Name" DataValueField="Code"
                                            runat="server" ClientIDMode="Static">
                                        </asp:TextBox>
                                    </li>
                                </ul>
                                <span>
                                    <asp:Button runat="server" ID="btnSearch" CssClass="button_out search-link" Text="查询" /></span>
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
                    <asp:Button CssClass="button_out  add-link" runat="server" ID="btnAdd" URL="ProjectEquipmentEdit.aspx"
                        ClientIDMode="Static" data-dialog-width="974" data-dialog-height="663" Text="添 加" />
                </div>
                <div class="tool_button" id="Edit">
                    <asp:Button CssClass="button_out  edit-link" runat="server" ID="btnEditor" URL="ProjectEquipmentEdit.aspx" ClientIDMode="Static" data-dialog-width="974" data-dialog-height="663"
                        Text="修 改" />
                </div>
                <div class="tool_button" id="delete">
                    <asp:Button CssClass="button_out delete-link" runat="server" ID="btnDelete" Text="删 除" />
                </div>
                <div class="tool_button" id="View">
                    <asp:Button CssClass="button_out  view-link" runat="server" ID="btnView" URL="ProjectEquipmentEdit.aspx" Text="详 情" ClientIDMode="Static" data-dialog-width="974" data-dialog-height="663" />
                </div>
                <table border="0" cellpadding="0" cellspacing="1" class="gridview" data-multiselect="true"
                    data-key="Id" data-autoload="true">
                    <thead>
                        <tr>
                            <th class="word-2">序号
                            </th>
                            <th class="word-auto" data-field="Name" data-sorting="fixed">
                                <a href="#">设备名称</a>
                            </th>
                            <th class="word-auto" data-field="EquipmentType" data-sorting="fixed">
                                <a href="#">设备类型</a>
                            </th>
                            <th class="word-4" data-field="Price" data-sorting="fixed">
                                <a href="#">设备价格</a>
                            </th>
                            <th class="word-4" data-field="Location" data-sorting="fixed">
                                <a href="#">设备位置</a>
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
    </div>


    <script type="text/javascript">

    </script>
</asp:Content>


