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
                            <asp:ListItem Value="2">模组</asp:ListItem>
                            <asp:ListItem Value="3">杆件</asp:ListItem>
                            <asp:ListItem Value="4">基础</asp:ListItem>
                        </asp:DropDownList>
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
                                        <asp:ListItem Value="1">交通诱导屏</asp:ListItem>
                                        <asp:ListItem Value="2">模组</asp:ListItem>
                                        <asp:ListItem Value="3">杆件</asp:ListItem>
                                        <asp:ListItem Value="4">基础</asp:ListItem>
                                    </asp:DropDownList>
                                </span>
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
                    <input id="btnSelected" name="" type="button" class="button_out" runat="server"
                        clientidmode="Static" value="选 择" />
                </div>


                <table border="0" cellpadding="0" cellspacing="1" class="gridview" data-multiselect="true"
                    data-key="Id" data-autoload="true">
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


    </div>
<%--    <div class="map">
        <div id="dituContent" style="border: #ccc solid 1px; width: 800px; height: 300px"></div>
    </div>--%>
    <body>
    <!--地图容器-->
    <div id="dituContent" style="border: #ccc solid 1px;"></div>
</body>
    <script src="http://172.5.1.61:8080/EzServerClient/js/EzMapAPI.js" type="text/javascript" charset="GB2312"></script>
    <script type="text/javascript">
        $(function () {
            initMap();
        });

        $('#btnSelected').click(function () {
            var ids = $.fn.grid.getInstance().getSelected().attr('data-itemid');
            if (ids) {
                $(this).ajaxPost({
                    method: 'EuipmentSelected', params: { 'EquipmentId': ids }, 'callback': function (data) {
                        if (data != null) {
                            $('#txtName').val(data.Name);
                            $('#txtPrice').val(data.Price);
                            $('#DropEquipmentType').val(data.EquipmentType);
                        }
                    }
                })
            }
            else {
                alert("请选择一条记录!");
            }
        });

        function initMap() {
            //百度地图
            //initMapContainer();
            //createMap();//创建地图
            //setMapEvent();//设置地图事件
            //addMapControl();//向地图添加控件

            //1） ********构造地图控件对象，用于装载地图
            var uEzMap = new EzMap(document.getElementById("dituContent"));
            //2）********初始化地图，并显示地图
            uEzMap.initialize();
            //3）********以下为其它一些附属功能
            // 显示左侧导航工具条
            uEzMap.showMapControl();
        }
    </script>
</asp:Content>


