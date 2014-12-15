using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web.Script.Serialization;
using ProjectDesigner.Website;
using EBA.Modules.Storages;
using EBA.Helpers;
using EBA.Linq;

namespace ProjectDesigner.Website
{
    public partial class FileRun : TPageBase
    {
        bool flag = false;

        protected override void InitControls()
        {
            this.txtUrl.AddValidator<RequiredValidator>("网络地址必须输入！")
                .AddValidator<URLValidator>("请输入正确的网络地址！");
        }

        /// <summary> 
        /// 获取附件类型 
        /// </summary>  
        public object GetFolders()
        {
            var list = this.EntityContext.Value.Files.AsQuerybale;
            return list.ToList().Select(i => new
            {
                id = i.Tags,
                text = i.Tags,
                pid = "",
            }).Distinct();
        }
        public object GetFileList()
        {
            this.PageSize = 9999;
            return FetchData("");
        }
        public void DelFileList()
        {
            var files = Request["__files"];
            var serializer = new JavaScriptSerializer();
            var list = serializer.Deserialize<List<FileNode>>(files);
        }

        #region FetchData
        protected override System.Collections.IEnumerable FetchData(string tableName, string[] orderby = null)
        {
            var sort = Request["sort"];
            var sorttype = Request["sorttype"];
            var order = sort.Replace("fname", "Name").Replace("ftype", "Extension").Replace("ftime", "UploadedTime");
            order += sorttype.HasValue() ? " " + sorttype : "";
            orderby = new string[] { order };

            var query = this.EntityContext.Value.Files.AsQuerybale.Select(i=>
                        new
                        {
                            i.Id,
                            i.Name,
                            i.Extension,
                            i.UploadedTime,
                            i.Tags
                        });
            var hitable = query.AsHitable();

            if (hdnCategory.Value.HasValue())
            {
                query = query.Where(i => i.Tags == hdnCategory.Value);
            }
            if (txtOriginalName.Text.HasValue())
            {
                hitable = hitable.Where(i => i.Name.Contains(txtOriginalName.Text));
            }
            hitable.OrderBy(i => i.UploadedTime);
            return hitable.OrderBy(orderby)
                 .Fetch(this.PageIndex, this.PageSize)
                 .Select(i => new
             {

                 fkey = JsonSerializer.Serialize(new FileNode
                 {
                     fid = i.Id,
                     fguid = i.Id,
                     fname = i.Name,
                     ftype = i.Extension.Replace(".",""),
                     flength = 0,
                     ftime = i.UploadedTime.ToString("yyyy-MM-dd HH:mm:ss"),
                     furl = Server.UrlEncode(this.ResolveUrl("~/FileOutput.ashx?id=" + i.Id + "&file=" + i.Name))
                 }),
                 fid = i.Id,
                 fguid = i.Id,
                 fname = i.Name,
                 ftype = i.Extension.Replace(".", ""),
                 flength = 0,
                 ftime = i.UploadedTime.ToString("yyyy-MM-dd HH:mm:ss"),
                 furl = Server.UrlEncode(this.ResolveUrl("~/FileOutput.ashx?id=" + i.Id + "&file=" + i.Name))
             });
        }
        #endregion

        private string urlconvertor(string url)
        {
            string tmpRootDir = Server.MapPath(System.Web.HttpContext.Current.Request.ApplicationPath.ToString());//获取程序根目录
            string returnurl = url.Replace(tmpRootDir, ""); //转换成相对路径
            returnurl = returnurl.Replace(@"\", @"/");
            return returnurl;
        }

        public object GetCodeCategoryTree()
        {
            if (Request["__nodeId"].ToStringOrEmpty() == "")
            {
                return new[] {
                      new { id = "__", text = "目录" }
                };
            }
            else
            {
                if (Request["__nodeId"].ToStringOrEmpty() == "__")
                {
                    flag = false;
                    string path = Server.MapPath("~\\");
                    //this.EntityContext.Value.BizPackats.AsQuerybale.Where(i => i.Parent.Id == parentId).Select(i => new { id = i.Id, text = i.Name, pid = i.Parent.Id, itemId = i.Code }).OrderBy(i => i.text);
                    return GetTreeNodes(path);
                }
                else if (Request["__nodeId"].ToStringOrEmpty() != "__")
                {
                    flag = false;
                    var parentId = Server.MapPath("~\\") + Request["__nodeId"];
                    if (Directory.Exists(parentId))
                    {
                        return GetTreeNodes(parentId);
                    }
                    else
                    {
                        return null;
                    }
                }
                else
                {
                    return null;
                }
            }
        }

        /// <summary>
        /// 根据路径加载文件夹节点
        /// </summary>
        /// <param name="path"></param>
        /// <returns></returns>
        protected List<FolderNode> GetTreeNodes(string path)
        {
            List<FolderNode> folderNodes = new List<FolderNode>();
            DirectoryInfo rootDir = new DirectoryInfo(path);
            foreach (var item in rootDir.GetDirectories())
            {
                FolderNode folderNode = new FolderNode();
                folderNode.text = item.Name;
                folderNode.id = item.Parent.Name + "//" + item.Name;
                folderNode.pid = item.Parent.Name;
                if (Request["__nodeId"].ToStringOrEmpty() == "__")
                {
                    subStringHref(folderNode);
                }
                if (ShowNode(path + "//" + item.Name))
                {
                    folderNodes.Add(folderNode);
                    flag = false;
                }
            }
            return folderNodes;
        }

        /// <summary>
        /// 一级几点url修正
        /// </summary>
        /// <param name="folderNode"></param>
        /// <returns></returns>
        protected FolderNode subStringHref(FolderNode folderNode)
        {
            folderNode.id = folderNode.id.Substring(folderNode.id.IndexOf("//") + 2);
            folderNode.pid = folderNode.pid.Substring(folderNode.pid.IndexOf("//") + 2);
            return folderNode;
        }

        protected bool ShowNode(string path)
        {

            if (Directory.Exists(path))
            {
                DirectoryInfo directoryInfo = new DirectoryInfo(path);

                for (int i = 0; i < directoryInfo.GetFiles().Count(); i++)
                {
                    //if (directoryInfo.GetFiles()[i].Extension.ToLower() == ".aspx")
                    //{
                    flag = true;
                    break;
                    //}
                }

                foreach (var item in directoryInfo.GetDirectories())
                {
                    return ShowNode(path + "//" + item.Name);
                }
            }

            return flag;
        }

        public List<FileNode> GetFiles()
        {
            List<FileNode> fileNodeList = new List<FileNode>();
            string path = "";
            if (this.Request["path"] != null)
            {
                path = Server.MapPath("~\\") + this.Request["path"];
            }
            if (Directory.Exists(path))
            {
                DirectoryInfo directoryInfo = new DirectoryInfo(path);

                foreach (var item in directoryInfo.GetFiles())
                {
                    //if (item.Extension.ToLower() == ".aspx")
                    //{
                    FileNode fileNode = new FileNode();
                    fileNode.fname = item.Name;
                    fileNodeList.Add(fileNode);
                    //}
                }
            }
            return fileNodeList;
        }
    }

    public class FolderNode
    {
        public string id { get; set; }
        public string text { get; set; }
        public string pid { get; set; }
        public string isOrg { get { return "1"; } }
    }

    public class FileNode
    {
        public string fid { get; set; }
        public string fguid { get; set; }
        public string fkey { get; set; }
        public string fname { get; set; }
        public string ftype { get; set; }
        public long flength { get; set; }
        public string fuser { get; set; }
        public string ftime { get; set; }
        public string furl { get; set; }
    }
}