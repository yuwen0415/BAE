<%@ Page Title="电子警察编辑" Language="C#" MasterPageFile="~/Main.Master" AutoEventWireup="true"
    CodeBehind="TrafficAndEventCollectionEdit.aspx.cs" Inherits=" ProjectDesigner.Website.Equipment.TrafficAndEventCollectionEdit" %>

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
            <h2>视频监控信息</h2>
            <div class="row">
                <div>
                    <label>
                        名称</label><asp:TextBox runat="server" ID="txtName" ClientIDMode="Static" Width="325px"></asp:TextBox>
                </div>
                <div>
                    <label>
                        品牌</label><asp:TextBox runat="server" ID="txtBrand" ClientIDMode="Static" Width="325px"></asp:TextBox>
                </div>
            </div>
            <div class="row">
                <div>
                    <label>
                        类型</label><asp:DropDownList runat="server" ID="DropDownListType" ClientIDMode="Static" Width="325px">
                            <asp:ListItem Value="0">卡口</asp:ListItem>
                            <asp:ListItem Value="1">流量</asp:ListItem>
                        </asp:DropDownList>
                </div>
                <div>
                    <label>
                        连接方式</label><asp:DropDownList runat="server" ID="DropDownListConnection" ClientIDMode="Static" Width="325px">
                            <asp:ListItem Value="0">无线</asp:ListItem>
                            <asp:ListItem Value="1">光纤</asp:ListItem>
                        </asp:DropDownList>
                </div>
            </div>
            <div class="row">
                <div>
                    <label>
                        立杆</label><asp:TextBox ID="txtPillar" CssClass="combobox" data-dialog-url="../Popup/SelectPillar.aspx"
                            data-callback-fields='{"Name":"#txtPillar"}' data-search-method="FindPillar"
                            data-dialog-height='550' data-dialog-width='680' ClientIDMode="Static" data-columns='{"Name": "名称" }'
                            runat="server" Width="325px"></asp:TextBox>
                </div>
                <div>
                    <label>
                        基础</label><asp:TextBox ID="txtFoundation" CssClass="combobox" data-dialog-url="../Popup/SelectFoundation.aspx"
                            data-callback-fields='{"Name":"#txtFoundation"}' data-search-method="FindFoundation"
                            data-dialog-height='550' data-dialog-width='680' ClientIDMode="Static" data-columns='{"Name": "名称" }'
                            runat="server" Width="325px"></asp:TextBox>
                </div>
            </div>
            <div class="row">
                <div>
                    <label>
                        视频监控</label><asp:TextBox ID="txtVideoSurveillance" CssClass="combobox" data-dialog-url="../Popup/SelectVideoSurveillance.aspx"
                            data-callback-fields='{"Name":"#txtVideoSurveillance"}' data-search-method="FindVideoSurveillance"
                            data-dialog-height='550' data-dialog-width='680' ClientIDMode="Static" data-columns='{"Name": "名称" }'
                            runat="server" Width="325px"></asp:TextBox>
                </div>
                <div>
                    <label>
                        视频监控个数</label><asp:DropDownList runat="server" ID="DropDownListTrafficAndEventCollectionEquipmentNum" ClientIDMode="Static" Width="325px">
                            <asp:ListItem Value="0">0</asp:ListItem>
                            <asp:ListItem Value="1">1</asp:ListItem>
                            <asp:ListItem Value="2">2</asp:ListItem>
                            <asp:ListItem Value="3">3</asp:ListItem>
                            <asp:ListItem Value="4">4</asp:ListItem>
                            <asp:ListItem Value="5">5</asp:ListItem>
                        </asp:DropDownList>
                </div>
            </div>
            <div class="row">
                <div>
                    <label>
                        价格</label><asp:TextBox ID="txtPrice" ClientIDMode="Static" runat="server" Width="325px"></asp:TextBox>
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
            <div class="row span-2">
                <div style="width: 100px">
                    <label class="span-2">
                        显示图标</label>
                </div>
                <div class="fileselector" id="listAttachments" runat="server" clientidmode="Static"
                    data-max="10">
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
