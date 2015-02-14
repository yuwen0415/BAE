using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;

namespace HALMS.WebClient
{
    /// <summary>
    /// TempFileDownHanlder 的摘要说明
    /// </summary>
    public class TempFileDownHanlder : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            var fileName = context.Request.QueryString["f"];
            var Path = context.Request.QueryString["p"];
            string filePath = "";
            if (string.IsNullOrEmpty(Path))
            {
                filePath = context.Server.MapPath("") + "\\report_cached\\" + fileName;
            }
            else
            {
                filePath = context.Server.MapPath("") + "\\" + Path + "\\" + fileName;
            }

            //输出文件到response
            context.Response.Charset = "utf-8";
            context.Response.Buffer = true;
            context.Response.ContentEncoding = System.Text.Encoding.UTF8;

            context.Response.AppendHeader("Content-Disposition", "attachment;filename=" + HttpUtility.UrlEncode(fileName));
            context.Response.ContentType = "application/x-excel";
            context.Response.WriteFile(filePath);
            context.Response.Flush();
            //删除临时文件
            if (string.IsNullOrEmpty(context.Request.QueryString["nd"]))//nd为是否删除的标识
            {
                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                }
            }
            context.Response.End();
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}