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
                        项目税率</label><asp:TextBox runat="server" ID="txtTaxes" ClientIDMode="Static" Width="320px"></asp:TextBox>%
                </div>
            </div>
            <div class="row">
                <div>
                    <label>
                        项目总价</label><asp:TextBox runat="server" ID="txtPrice" ClientIDMode="Static" Width="325px"></asp:TextBox>元
                    <input id="btnRefresh" name="" type="button" class="button_out" runat="server" style="width: 50px"
                        clientidmode="Static" value="刷新" />

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
                                        <asp:TextBox Width="152px" ID="txtEquipmentName" DataTextField="Name" DataValueField="Code"
                                            runat="server" ClientIDMode="Static">
                                        </asp:TextBox>
                                    </li>

                                    <li>
                                        <label>
                                            设备类型</label><asp:DropDownList runat="server" ID="DropEquipmentType" ClientIDMode="Static" Width="152px">
                                                <asp:ListItem Value="0">全部</asp:ListItem>
                                                <asp:ListItem Value="1">交通诱导屏</asp:ListItem>
                                                <asp:ListItem Value="3">杆件</asp:ListItem>
                                                <asp:ListItem Value="4">基础</asp:ListItem>
                                                <asp:ListItem Value="5">交通视频监控</asp:ListItem>
                                                <asp:ListItem Value="6">电子警察</asp:ListItem>
                                                <asp:ListItem Value="7">交通流量事件采集</asp:ListItem>
                                                <asp:ListItem Value="9">设备辅材</asp:ListItem>
                                                <asp:ListItem Value="10">工程建设辅材</asp:ListItem>
                                            </asp:DropDownList>
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
                        ClientIDMode="Static" data-dialog-width="974" data-dialog-height="733" Text="添 加" />
                </div>
                <div class="tool_button">
                    <asp:Button CssClass="button_out  edit-link" runat="server" ID="btnUpdate" URL="ProjectEquipmentEdit.aspx"
                        ClientIDMode="Static" data-dialog-width="974" data-dialog-height="733" Text="修 改" />
                </div>
                <div class="tool_button">
                    <asp:Button CssClass="button_out delete-link" runat="server" ID="btnDelete" Text="删 除" />
                </div>
                <div class="tool_button">
                    <asp:Button CssClass="button_out  view-link" runat="server" ID="btnView" URL="ProjectEquipmentEdit.aspx" Text="详 情"
                        ClientIDMode="Static" data-dialog-width="974" data-dialog-height="733" />
                </div>
                <div class="tool_button">
                    <input id="btnUpdateByMap" name="" type="button" class="button_out" runat="server"
                        clientidmode="Static" value="地图编辑" />
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
                            <th class="word-4" data-field="Brand" data-sorting="fixed">
                                <a href="#">设备品牌</a>
                            </th>
                            <th class="word-2" data-field="Num" data-sorting="fixed">
                                <a href="#">数量</a>
                            </th>
                            <th class="word-8" data-field="EquipmentType" data-sorting="fixed">
                                <a href="#">设备类型</a>
                            </th>
                            <th class="word-4" data-field="Price" data-sorting="fixed">
                                <a href="#">设备价格</a>
                            </th>
                            <th class="word-8" data-field="Location" data-sorting="fixed">
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
        $(function () {
            //var test = Deserialize();

            var url = location.href;
            var url_params = url.substring(url.indexOf("?") + 1, url.length).split("&");
            var ProjectId = "";
            $.each(url_params, function (n, value) {
                if (value.indexOf("id") > -1) {
                    ProjectId = value.substring(value.indexOf("id") + 3, value.length);
                }
            });

            $('#btnUpdateByMap').click(function (e) {
                e.preventDefault();
                $(this).showWin({
                    url: 'ProjectEditByMap.aspx?&projectId=' + ProjectId,
                    width: 974,
                    height: 663,
                    callback: function (data) {
                        if (data) {
                            var grid = $.fn.grid.getInstance(name);
                            if (isArray(data)) {
                                for (var i = 0; i < data.length; i++) {
                                    grid.insertRow(data[i]);
                                }
                            }
                            else {
                                grid.insertRow(data);
                            }
                        }
                    }
                });

            });

            $('#btnRefresh').click(function (e) {
                $(this).ajaxPost({
                    method: 'RefreshProjectPrice', params: { 'ProjectId': ProjectId }, 'callback': function (data) {
                        if (data != null) {
                            $('#txtPrice').val(data);
                        }
                    }
                })
            });
        });

        //function Deserialize() {
        //    var existedEquipments = [];
        //    var test1 = "{6||118.1144,24.58276};{6||118.126,24.5747};{6||118.1462,24.55126}";
        //    //var equipments = $(window.parent.document).getElementById("txtDesignedEquipments").value.split(";");
        //    var equipments = test1.split(";");
        //    // $.each(equipments, function () {
        //    for (var i = 0; i < equipments.length; i++) {
        //        var equipment = {};
        //        var equipmentParams = equipments[i].substring(1, equipments[i].length - 2).split("||");
        //        equipment.Type = equipmentParams[0];
        //        equipment.Location = equipmentParams[1];
        //        existedEquipments.push(equipment);
        //    }
        //    //});

        //    return existedEquipments;
        //}
    </script>
</asp:Content>


