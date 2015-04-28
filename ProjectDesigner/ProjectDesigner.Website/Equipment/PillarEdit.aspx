<%@ Page Title="工程检测" Language="C#" MasterPageFile="~/Main.Master" AutoEventWireup="true"
    CodeBehind="PillarEdit.aspx.cs" Inherits=" ProjectDesigner.Website.Equipment.PillarEdit" %>

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
            <h2>立杆信息</h2>
            <div class="row">
                <div>
                    <label>
                        名称</label><asp:TextBox runat="server" ID="txtName" ClientIDMode="Static" Width="325px"></asp:TextBox>
                </div>
                <div>
                    <label>
                        类型</label><asp:DropDownList runat="server" ID="DropDownListType" ClientIDMode="Static" Width="325px">
                            <asp:ListItem Value="0">L型杆</asp:ListItem>
                            <asp:ListItem Value="1">T型杆</asp:ListItem>
                            <asp:ListItem Value="2">龙门架</asp:ListItem>
                            <asp:ListItem Value="3">支架</asp:ListItem>
                        </asp:DropDownList>
                </div>
            </div>
            <div class="row">
                <div>
                    <label>
                        价格</label><asp:TextBox runat="server" ID="txtPrice" ClientIDMode="Static" Width="325px"></asp:TextBox>
                </div>
                <div>
                    <label>
                        横杆长度</label><asp:TextBox runat="server" ID="txtLength" ClientIDMode="Static" Width="310px"></asp:TextBox>米
                </div>
            </div>
            <div class="row">
                <div>
                    <label>
                        直径</label><asp:TextBox runat="server" ID="txtDiameter" ClientIDMode="Static" Width="300px"></asp:TextBox>毫米
                </div>
                <div>
                    <label>
                        立杆高度</label><asp:TextBox runat="server" ID="txtHeight" ClientIDMode="Static" Width="310px"></asp:TextBox>米
                </div>
            </div>
            <div class="row">
                <div>
                    <label>
                        品牌</label><asp:TextBox runat="server" ID="txtBrand" ClientIDMode="Static" Width="325px"></asp:TextBox>
                </div>
                <div>
                    <label>
                        型号</label><asp:TextBox ID="txtProductType" ClientIDMode="Static" runat="server" Width="325px"></asp:TextBox>
                </div>
            </div>
            <div class="row span-2">
                <div>
                    <label class="span-2">
                        主要技术参数</label><asp:TextBox ID="txtTechnicalParameters" TextMode="MultiLine" Rows="2" Columns="50"
                            runat="server" Style="margin-right: 0px" Width="770px" Height="45px"></asp:TextBox>
                </div>
            </div>
        </div>
        <div class="buttons">
            <input id="btnSave" name="" type="button" class="button_out win-save-link" runat="server"
                clientidmode="Static" value="保 存" />
            <input name="" type="button" onmouseout="this.className='button_out'" class="button_out win-close-link"
                value="关 闭" />
        </div>
    </div>
</asp:Content>
