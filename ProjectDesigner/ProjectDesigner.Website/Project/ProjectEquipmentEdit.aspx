<%@ Page Title="工程检测" Language="C#" MasterPageFile="~/Main.Master" AutoEventWireup="true"
    CodeBehind="ProjectEquipmentEdit.aspx.cs" Inherits=" ProjectDesigner.Website.Project.ProjectEquipmentEdit" %>

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
            <h2>项目设备信息</h2>
            <div class="row">
                <div>
                    <label>
                        设备名称</label><asp:TextBox runat="server" ID="txtName" ClientIDMode="Static" Width="325px"></asp:TextBox>
                </div>
                <div>
                    <label>
                        设备类型</label><asp:DropDownList runat="server" ID="DropEquipmentType" ClientIDMode="Static" Width="325px">
                            <asp:ListItem Value="0">未知</asp:ListItem>
                            <asp:ListItem Value="1">交通诱导屏</asp:ListItem>
                            <asp:ListItem Value="2">模组</asp:ListItem>
                            <asp:ListItem Value="3">杆件</asp:ListItem>
                            <asp:ListItem Value="4">基础</asp:ListItem>
                        </asp:DropDownList>
                </div>
            </div>
            <div class="row">
                <div>
                    <label>
                        设备位置</label><asp:TextBox runat="server" ID="txtLocation" ClientIDMode="Static" Width="325px"></asp:TextBox>
                </div>

                <div>
                    <label>
                        设备价格</label><asp:TextBox runat="server" ID="txtPrice" ClientIDMode="Static" Width="325px"></asp:TextBox>
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


    <script type="text/javascript">

    </script>
</asp:Content>


