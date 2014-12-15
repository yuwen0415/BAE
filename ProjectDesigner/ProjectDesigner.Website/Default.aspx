<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="ProjectDesigner.Website.Default" %>

<%@ Register Src="ClientResources.ascx" TagName="ClientResources" TagPrefix="uc1" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="zh-CN" lang="zh-CN">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>工程设计系统</title>
    <uc1:ClientResources ID="ClientResources1" runat="server" />
    <style type="text/css">
        .window {
            width: 250px;
            background-color: #d0def0;
            position: absolute;
            padding: 2px;
            margin: 5px;
            display: none;
            z-index: 999;
        }

        .content {
            height: 150px;
            background-color: #FFF;
            font-size: 14px;
            overflow: auto;
        }

        .title {
            padding: 2px;
            color: #0CF;
            font-size: 14px;
        }

            .title img {
                float: right;
            }
    </style>
    <script src="Scripts/sparrow.ui.index.js" type="text/javascript"></script>
    <script type="text/javascript">
        $(function () {
            $('#PasswordEdit').click(function (e) {
                e.preventDefault();
                $(this).showWin({
                    url: 'SysOptions/UserPasswordEdit.aspx',
                    width: 320,
                    height: 190,
                    callback: function (data) {

                    }
                });
            });
            $('#UserAuthorization').click(function (e) {
                e.preventDefault();
                $(this).showWin({
                    url: 'SysOptions/UserAuthorizationEdit.aspx?&type=edit',
                    width: 320,
                    height: 190,
                    callback: function (data) {

                    }
                });
            });

        });

        //关闭窗口的方法 
        function closeWindow() {
            $(".close").click(function () {
                $('.message_box').hide("slow");
            });
        }
        function popRightWindow() {
            $(".message_box").slideToggle("slow");
            $(".content").append("<bgsound  src='message.wav' loop=2 />");
            closeWindow();
        }

        function isHaveTodos() {
            $(this).ajaxPost({
                method: 'isHaveToDo', 'callback': function (data) {
                    if (data == "Y") {
                        popRightWindow();
                    }
                    else {
                        return false;
                    }

                    setTimeout(isHaveTodos, 1800000);
                }
            });
        }
    </script>
</head>
<body>
    <div id="header">
        <div class="banner">
            <div class="banner_left">
            </div>
            <div class="banner_right">
              
                <div class="right_bottom">
                    <div class="right_bottom_menu">
                        <a href="Index.aspx" class="tab-link" target="_parent">首&nbsp;&nbsp;&nbsp;&nbsp;页</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="main">
        <div id="col1">
            <%= BuildLeftMenu() %>
        </div>
        <div id="col2">
            <div class="left_switch">
                <img src="images/LeftMenu/left_switch_on.gif" />
            </div>
        </div>
        <div id="col3">
            <div class="divMain">
                <div class="tabs" data-content-template="#tab_content" data-item-move="true" data-item-more="true" data-isrefresh="true">
                    <script id="tabTmpl" type="text/x-jquery-tmpl">
                        <li class="selected"><a href="${url}">${text}</a><a href="${url}" class="close_selected"></a></li>
                    </script>
                    <script id="tab_content" type="text/x-jquery-tmpl">
                        <div class="tabs_content">
                            <iframe frameborder="0" class="ifr_main" scrolling="auto" data-src="${url}"
                                src="${link}"></iframe>
                        </div>
                    </script>
                    <ul class="tabs_items">
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <div id="footer">
        <div class="foot">
            <div class="foot_left">
<%--                【<%= OrgName%>】
                <%= UserName%>，--%>
                <%= Convert.ToInt32(DateTime.Now.ToString("HH"))>=12?"下午":"上午" %>好！
                今天是：<%= DateTime.Now.ToString("yyyy年MM月dd日") %>
                <%= System.Globalization.CultureInfo.CurrentCulture.DateTimeFormat.GetDayName(DateTime.Now.DayOfWeek)%>
            </div>
            <div class="foot_right">
            </div>
        </div>

    </div>
    <div class="building">
        <div class="bg">
        </div>
        <div class="img">
            <a href="#">
                <img src="images/Others/close.gif" /></a>
        </div>
    </div>
    <div class="message_box">
        <div class="title">
            <div class="txt">消息框</div>
            <a href="#">
                <div class="close"></div>
            </a>
        </div>
        <div class="content">
            <ul>
                <%--                <li>
                    <a href="Index.aspx" class="tab-link" target="_parent">您当前有待办事项处理！</a>

                </li>--%>
            </ul>
        </div>
    </div>
</body>
</html>
