<%@ Page Language="C#" Title="诱导屏" AutoEventWireup="true" CodeBehind="ProjectMnt.aspx.cs" Inherits="ProjectDesigner.Website.Project.ProjectMnt"
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
                                    项目名称</label>
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
            <asp:Button CssClass="button_out add-link" runat="server" ID="btnAdd" URL="ProjectEdit.aspx"
                data-dialog-width="974" data-dialog-height="663" Text="新 增" />
        </div>
        <div class="tool_button">
            <asp:Button CssClass="button_out edit-link" runat="server" ID="btnUpdate" URL="ProjectEdit.aspx"
                data-dialog-width="974" data-dialog-height="663" Text="修 改" />
        </div>
        <div class="tool_button">
            <asp:Button CssClass="button_out view-link" runat="server" ID="btnView" URL="ProjectEdit.aspx"
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
                        <a href="#">项目名称</a>
                    </th>
                    <th class="word-4" data-field="Price" data-sorting="fixed">
                        <a href="#">项目造价</a>
                    </th>
                    <th class="word-auto" data-field="Equipments " data-sorting="fixed">
                        <a href="#">所属设备</a>
                    </th>
                </tr>
            </thead>
        </table>
    </div>
</asp:Content>
