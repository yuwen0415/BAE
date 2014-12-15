using System;
using System.Collections.Generic;
using System.IO;
using System.Drawing;
using System.Web.UI.HtmlControls;
using System.Web;
using ProjectDesigner.Website;
using EBA.Modules.Storages;
using EBA.Helpers;
using System.Configuration;
using ProjectDesigner.Domain.Storages;

namespace ProjectDesigner.Website
{
    public partial class FileSelect : TPageBase
    {
        protected void Page_Load(object sender, EventArgs e)
        {
        }

        protected override void BindControls()
        {
            //hidedir.Value = Request["basedir"].HasValue() ? Request["basedir"] : "UploadFile";
            //hidedir.Value = ;
            this.UploadTime.Text = DateTime.Now.ToString("yyyy-MM-dd HH:mm");
            //this.Uploader_ID.Text = this.LoginedUser.NickName;

            //TODO:工作组下拉列表绑定
            //var query = this.Manager.Provider.GetSysSetWorkgroupByBind(this.LoggedInUser.ID, this.LoggedInUser.Org_Code);
            //var list = query.ToList();
            //if (list.Count > 0)
            //{
            //    list.BindTo(this.Workgroup_Code, null, "Workgroup_Code", "Workgroup_Name");
            //    var defaultItem = query.Where(i => i.DefaultFalg).FirstOrDefault();
            //    if (defaultItem != null)
            //    {
            //        this.Workgroup_Code.Bind(defaultItem.Workgroup_Code);
            //    }
            //}
        }

        protected override void InitControls()
        {
            this.OriginalName.AddValidator<StringLengthValidator>("附件名称长度在50位内！", new StringLengthValidator { MaxLength = 50 });
            this.Description.AddValidator<StringLengthValidator>("附件简要说明长度在200位内！", new StringLengthValidator { MaxLength = 200 });

            this.Remark.AddValidator<StringLengthValidator>("备注长度在256位内！", new StringLengthValidator { MaxLength = 256 });
        }

        void FillData()
        {
            if (Request.Files.Count > 0)
            {
                if (!validateFileLength())
                {
                    ClientScript.RegisterStartupScript(this.GetType(), "unsucceed", "<script>callbackFileLength('unsucceed');</script>");
                }
                else
                {
                    var list = new List<FileNode>();
                    var category = Server.UrlDecode(Request["category"]).HasValue() ? Server.UrlDecode(Request["category"]) : "其它";
                    for (var i = 0; i < Request.Files.Count; i++)
                    {
                        var file = Request.Files[i];
                        var fileName = Path.GetFileName(file.FileName);
                        if (fileName.HasValue())
                        {
                            var item = new FileNode();
                            item.fkey = "unsucceed";

                            byte[] buffer = new byte[file.InputStream.Length];
                            file.InputStream.Read(buffer, 0, buffer.Length);

                            var Id = this.EntityContext.Value.Upload(file.FileName, buffer, category);

                            item.fid = Id;
                            item.fguid = Id;
                            item.fname = fileName;
                            item.ftime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                            item.ftype = fileName.Substring(fileName.LastIndexOf('.') + 1);
                            item.furl = this.ResolveUrl("~/FileOutput.ashx?id=" + Id + "&thumbnail=true&file=" + fileName);
                            item.flength = file.ContentLength;
                            list.Add(item);
                        }
                    }
                    ClientScript.RegisterStartupScript(this.GetType(), "succeed", "<script>callback(" + JsonSerializer.Serialize(list) + ");</script>");
                }
            }
            else
            {
                ClientScript.RegisterStartupScript(this.GetType(), "unsucceed", "<script>callback('unsucceed');</script>");
            }
        }
        bool validateFileLength()
        {
            bool issucceed = true;
            for (var i = 0; i < Request.Files.Count; i++)
            {
                var file = Request.Files[i];
                if (file.ContentLength > ConfigurationManager.AppSettings.Get("AttachmentMaxLength").ConvertTo<Int64>())
                {
                    issucceed = false;
                    break;
                }
            }
            return issucceed;
        }

        protected void btnSubmitFile_Click(object sender, EventArgs e)
        {
            FillData();
        }

    }
}