<%@ Page Language="C#" Title="立杆" AutoEventWireup="true" CodeBehind="PillarMnt.aspx.cs" Inherits="ProjectDesigner.Website.Equipment.PillarMnt"
    MasterPageFile="~/Main.Master" %>


<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="main-content">
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
                                <asp:TextBox Width="152px" ID="txtName" DataTextField="Name" DataValueField="Code"
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
            <asp:Button CssClass="button_out add-link" runat="server" ID="btnAdd" URL="PillarEdit.aspx"
                data-dialog-width="974" data-dialog-height="663" Text="新 增" />
        </div>
        <div class="tool_button">
            <asp:Button CssClass="button_out edit-link" runat="server" ID="btnUpdate" URL="PillarEdit.aspx"
                data-dialog-width="974" data-dialog-height="663" Text="修 改" />
        </div>
        <div class="tool_button">
            <asp:Button CssClass="button_out view-link" runat="server" ID="btnView" URL="PillarEdit.aspx"
                data-dialog-width="974" data-dialog-height="663" Text="详 情" />
        </div>
        <div class="tool_button">
            <asp:Button CssClass="button_out delete-link" runat="server" ID="btnDelete" Text="删 除" />
        </div>
        <div class="tool_button">
            <asp:Button CssClass="button_out" runat="server" ID="btnExport" Text="导出设备档案" />
        </div>
        <table border="0" cellpadding="0" cellspacing="1" class="gridview" data-name="" data-multiselect="true"
            data-key="Id" data-autoload="true">
            <thead>
                <tr>
                    <th class="word-2">
                        <a href="#">序号</a>
                    </th>
                    <th class="word-auto" data-field="Name" data-sorting="fixed">
                        <a href="#">设备名称</a>
                    </th>
                    <th class="word-4" data-field="Brand" data-sorting="fixed">
                        <a href="#">品牌</a>
                    </th>
                    <th class="word-4" data-field="Diameter" data-sorting="fixed">
                        <a href="#">杆体直径</a>
                    </th>
                    <th class="word-4" data-field="Length" data-sorting="fixed">
                        <a href="#">横杆长度</a>
                    </th>
                    <th class="word-4" data-field="Height" data-sorting="fixed">
                        <a href="#">立杆高度</a>
                    </th>
                    <th class="word-4" data-field="Price" data-sorting="fixed">
                        <a href="#">价格</a>
                    </th>
                    <th class="word-auto" data-field="Type" data-sorting="fixed">
                        <a href="#">立杆类型</a>
                    </th>
                </tr>
            </thead>
        </table>
    </div>
</asp:Content>
