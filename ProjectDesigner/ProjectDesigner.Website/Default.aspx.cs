using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using EBA.Helpers;
using ProjectDesigner.Data;
using ProjectDesigner.Domain;

namespace ProjectDesigner.Website
{
    public partial class Default : TPageBase
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected string BuildLeftMenu()
        {
            var result = this.EntityContext.Value.ResolveNavigatorNodes();
            //var result = new List<NavigatorNode>();

            var html = "<ul class=\"menu\">";
            foreach (var r in result)
            {
                html += BuildMenuItem(r);
            }

            html += "</ul>";

            return html;
        }

        string BuildMenuItem(NavigatorNode item)
        {
            //<li><a href="#"><span></span></a><a href="#">信息接报</a></li>
            var html = "<li>";

            html += "<a href=\"#\"><span></span></a>";

            if (item.IconFile.HasValue())
            {
                html += @"<img src=\FileOutput.ashx?id=" + item.IconFile + "&thumbnail=true\" />";
            }

            html += "<a href=\"" + item.WebLink + "\" ";

            html += ">" + System.Web.HttpUtility.HtmlEncode(item.Name) + "</a>";


            if (item.ChildNodes.Count > 0)
            {
                html += "<ul>";

                foreach (var child in item.ChildNodes)
                {
                    html += BuildMenuItem(child);
                }

                html += "</ul>";
            }

            html += "</li>";

            return html;

        }
    }
}