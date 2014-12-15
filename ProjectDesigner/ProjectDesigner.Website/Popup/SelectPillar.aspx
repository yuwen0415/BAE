<%@ Page Title="合作单位" Language="C#" MasterPageFile="~/Main.Master" AutoEventWireup="true"
    CodeBehind="SelectPillar.aspx.cs" Inherits="TCMS.Website.Popup.SelectPillar" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
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
                            <asp:TextBox ID="txtName" runat="server" CssClass='input20 '></asp:TextBox>
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
    <table border="0" cellpadding="0" cellspacing="1" class="gridview" data-autoload="true"
        data-key="ID">
        <thead>
            <tr>
                <th class="word-2">
                    <a href="#">序号</a>
                </th>
                <th class="word-auto" data-field="Name" data-sorting="fixed">
                    <a href="#">设备名称</a>
                </th>
                <th class="word-4" data-field="Size" data-sorting="fixed">
                    <a href="#">尺寸</a>
                </th>
                <th class="word-4" data-field="Price" data-sorting="fixed">
                    <a href="#">价格</a>
                </th>
                <th class="word-auto" data-field="Brand" data-sorting="fixed">
                    <a href="#">品牌</a>
                </th>
                <th class="word-4" data-field="Standard" data-sorting="fixed">
                    <a href="#">显示模组类型</a>
                </th>
            </tr>
        </thead>
    </table>
    <div class="buttons">
        <div class="float_r">
            <div class="tool_button">
                <asp:Button class="button_out win-select-link" runat="server" ID="btnSave" Text="确定" />
            </div>
            <div class="tool_button">
                <input type="button" class="button_out win-close-link" id="btnClose" value="关 闭" />
            </div>
        </div>
    </div>
</asp:Content>
