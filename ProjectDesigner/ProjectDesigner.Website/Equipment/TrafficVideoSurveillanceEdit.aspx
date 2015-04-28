<%@ Page Title="视频监控编辑" Language="C#" MasterPageFile="~/Main.Master" AutoEventWireup="true"
    CodeBehind="TrafficVideoSurveillanceEdit.aspx.cs" Inherits=" ProjectDesigner.Website.Equipment.TrafficVideoSurveillanceEdit" %>

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
                            <asp:ListItem Value="0">路面监控</asp:ListItem>
                            <asp:ListItem Value="1">高空监控</asp:ListItem>
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
                        价格</label><asp:TextBox ID="txtPrice" ClientIDMode="Static" runat="server" Width="275px"></asp:TextBox>
                    <input id="btnRefresh" name="" type="button" class="button_out" runat="server" style="width: 50px"
                        clientidmode="Static" value="刷新" />
                </div>
            </div>
            <div>
                <h3>设备辅材和工程辅材
                </h3>
                <table border="0" cellpadding="0" cellspacing="1" class="gridview" data-multiselect="true"
                    data-key="Id" data-autoload="true" data-name="equipmenttable">
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

                        </tr>
                    </thead>
                </table>
            </div>
            <div>
                <div class="tool_button">
                    <input id="btnAdd" name="" type="button" class="button_out" runat="server"
                        clientidmode="Static" value="添 加" />
                </div>
                <div class="tool_button">
                    <input id="btnUpdate" name="" type="button" class="button_out" runat="server"
                        clientidmode="Static" value="修 改" />
                </div>
                <div class="tool_button">
                    <asp:Button CssClass="button_out delete-link" data-grid-name="equipmenttable" runat="server" ID="btnDelete" Text="删 除" />
                </div>
                <label>
                    数量</label><asp:TextBox ID="txtNum" ClientIDMode="Static" runat="server" Width="60px"></asp:TextBox>个/米/台/套
                                <input id="btnConform" name="" type="button" class="button_out" runat="server"
                                    clientidmode="Static" value="确 定" />
            </div>
            <div>
                <h3>待选择的设备辅材和工程辅材
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
                                            名称</label>
                                        <asp:TextBox Width="152px" ID="txtEquipmentName" DataTextField="Name" DataValueField="Code"
                                            runat="server" ClientIDMode="Static">
                                        </asp:TextBox>
                                    </li>

                                    <li>
                                        <label>
                                            设备类型</label><asp:DropDownList runat="server" ID="DropEquipmentType" ClientIDMode="Static" Width="152px">
                                                <asp:ListItem Value="0">全部</asp:ListItem>
                                                <asp:ListItem Value="9">设备辅材</asp:ListItem>
                                                <asp:ListItem Value="10">工程建设辅材</asp:ListItem>
                                            </asp:DropDownList>
                                    </li>
                                </ul>
                                <span>
                                    <asp:Button runat="server" ID="btnSearch" data-grid-name="databasetable" CssClass="button_out search-link" Text="查询" /></span>
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
                <table border="0" cellpadding="0" cellspacing="1" class="gridview" data-multiselect="true"
                    data-key="Id" data-autoload="true" data-name="databasetable">
                    <thead>
                        <tr>
                            <th class="word-2">序号
                            </th>
                            <th class="word-auto" data-field="Name" data-sorting="fixed">
                                <a href="#">设备名称</a>
                            </th>
                            <th class="word-8" data-field="TechnicalParameters" data-sorting="fixed">
                                <a href="#">技术参数</a>
                            </th>
                            <th class="word-4" data-field="Brand" data-sorting="fixed">
                                <a href="#">设备品牌</a>
                            </th>
                            <th class="word-8" data-field="EquipmentType" data-sorting="fixed">
                                <a href="#">设备类型</a>
                            </th>
                            <th class="word-4" data-field="Price" data-sorting="fixed">
                                <a href="#">设备价格</a>
                            </th>

                        </tr>
                    </thead>
                </table>
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
    <script type="text/javascript">
        $(function () {
            var editType = "";
            var dataBaseTableIds = [];
            var equipmentTableIds = [];
            //$('#divNum').hide();
            $('#btnConform').attr("disabled", true);

            $('#btnAdd').click(function (e) {
                var grid = $.fn.grid.getInstance("databasetable");

                var selected = grid.getSelected();

                var ids = [];
                selected.each(function () {
                    var id = $(this).attr('data-itemid');
                    if (id) {
                        ids.push(id);
                    }
                });

                if (ids.length < 1) {
                    alert('请选择下表中的一笔记录，并填写数量！');
                }
                else {
                    $('#btnConform').attr("disabled", false);
                    editType = "add";
                    dataBaseTableIds = ids;
                }
            });

            $('#btnUpdate').click(function (e) {
                var grid = $.fn.grid.getInstance("equipmenttable");

                var selected = grid.getSelected();

                var ids = [];
                selected.each(function () {
                    var id = $(this).attr('data-itemid');
                    if (id) {
                        ids.push(id);
                    }
                });

                if (ids.length < 1) {
                    alert('请选择上表中的一笔记录！');
                }
                else {
                    $('#btnConform').attr("disabled", false);
                    editType = "update";
                    equipmentTableIds = ids;
                }
            });

            $('#btnConform').click(function (e) {
                var grid = $.fn.grid.getInstance("equipmenttable");
                var url = location.href;
                var url_params = url.substring(url.indexOf("?") + 1, url.length).split("&");
                var equipmentId = "";
                $.each(url_params, function (n, value) {
                    if (value.indexOf("id") > -1) {
                        equipmentId = value.substring(value.indexOf("id") + 3, value.length);
                    }
                });
                if (editType == "add") {
                    $(this).ajaxPost({
                        method: 'AddMaterials', params: { 'Id': equipmentId, 'dataBaseTableIds': dataBaseTableIds }, 'callback': function (data) {
                            if (data != null) {

                                for (var i = 0; i < data.length; i++) {
                                    grid.insertRow(data[i]);
                                }
                            }
                            else {
                                alert("您重复添加了材料，请选择需要修改的材料，点击修改按钮，谢谢！");
                            }
                        }
                    });
                }
                else {
                    var selected = grid.getSelected();
                    var ids = [];
                    selected.each(function () {
                        var id = $(this).attr('data-itemid');
                        if (id) {
                            ids.push(id);
                        }
                    });
                    $(this).ajaxPost({
                        method: 'UpdateMaterial', params: { 'equipmentTableId': ids[0] }, 'callback': function (data) {
                            if (data != null) {
                                grid.updateRow(ids[0], data);
                            }
                            else {
                                //alert("您重复添加了材料，请选择需要修改的材料，点击修改按钮，谢谢！");
                            }
                        }
                    });
                    //                  
                }


                $('#txtNum').val("");
                $('#btnConform').attr("disabled", true);
            });

            $('#btnRefresh').click(function (e) {
                var url = location.href;
                var url_params = url.substring(url.indexOf("?") + 1, url.length).split("&");
                var equipmentId = "";
                $.each(url_params, function (n, value) {
                    if (value.indexOf("id") > -1) {
                        equipmentId = value.substring(value.indexOf("id") + 3, value.length);
                    }
                });
                $(this).ajaxPost({
                    method: 'RefreshProjectPrice', params: { 'EquipmentId': equipmentId }, 'callback': function (data) {
                        if (data != null) {
                            $('#txtPrice').val(data);
                        }
                    }
                })
            });
        });

    </script>
</asp:Content>

