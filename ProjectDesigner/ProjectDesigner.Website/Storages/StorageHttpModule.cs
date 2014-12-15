using EBA.Helpers;
using EBA.Modules.Storages;
using System;
using System.Linq;
using System.Web;
using System.Web.SessionState;
using ProjectDesigner.Domain.Storages;
using ProjectDesigner.Data;


namespace ProjectDesigner.Website.Storages
{
    public class StorageHttpModule : IHttpModule, IRequiresSessionState
    {
        public void Dispose() { }
        public void Init(HttpApplication context)
        {
            context.AuthorizeRequest += context_AuthorizeRequest;
        }



        void context_AuthorizeRequest(object sender, EventArgs e)
        {
            var context = HttpContext.Current;

            if (context != null)
            {
                var url = context.Request.Url.AbsolutePath;
                if (url == "/FileHandler.ashx")
                {
                    DownloadFile(context);
                }
                else
                {
                    if (url == "/FileOutput.ashx")
                    {
                        PreviewImage(context);
                    }
                }
            }
        }

        /// <summary>
        /// 输出文件
        /// </summary>
        /// <param name="context"></param>
        public void DownloadFile(HttpContext context)
        {
            IStorageProvider storageProvider = new DataContext();
            if (storageProvider != null)
            {
                var response = context.Response;
                var id = context.Request["fileName"];
                var type = context.Request["type"];

                string fileWriteName = "";
                byte[] fileBtye = null;

                if (type.HasValue())
                {
                    if (type == "attachment")
                    {

                        var file = storageProvider.Files.AsQuerybale.Where(i => i.Id == id).FirstOrDefault();

                        if (file != null)
                        {
                            fileBtye = storageProvider.GetFileBytes(id);

                            fileWriteName = file.FileName;
                        }
                    }
                }




                response.Clear();
                response.Charset = "utf-8";
                response.Buffer = true;

                response.ContentEncoding = System.Text.Encoding.UTF8;

                response.AppendHeader("Content-Disposition", "attachment;filename=" + HttpUtility.UrlEncode(fileWriteName));

                response.ContentType = "application/unknown";
                response.BinaryWrite(fileBtye);
                response.Flush();
                response.End();
            }
        }

        /// <summary>
        /// 输出图片
        /// </summary>
        /// <param name="context"></param>
        public void PreviewImage(HttpContext context)
        {
            IStorageProvider storageProvider = new DataContext();
            if (storageProvider !=null)
            {

                var response = context.Response;
                var id = context.Request["id"];
                var fileName = context.Request["file"];
                var filetype = context.Request["type"];
                byte[] fileBtye = null;


                fileBtye = storageProvider.GetFileBytes(id);

                if (!fileName.HasValue())
                {
                    var file = storageProvider.Files.AsQuerybale.Where(i => i.Id == id).FirstOrDefault();

                    if (file != null)
                    {
                        fileName = file.FileName;
                    }
                }

                if (!filetype.HasValue())
                {
                    filetype = "image/pjpeg";
                }

                response.ContentType = filetype;
                response.BinaryWrite(fileBtye);
                response.Flush();
                response.End();
            }

        }
    }
}
