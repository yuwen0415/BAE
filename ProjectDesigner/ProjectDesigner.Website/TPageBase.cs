using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Web;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using EBA.Helpers;
using EBA.IoC;
using EBA.Modules.Authorizations;
using EBA.Modules.Web.UI;
using ProjectDesigner.Data;
using EBA.Json.NewtonsoftJson;

namespace ProjectDesigner.Website
{
    public class TPageBase : AjaxWebPage //, INavigationHandler
    {
        //TCMSDataContext _DataContext;
        //public TCMSDataContext DataContext
        //{
        //    get
        //    {
        //        if (this._DataContext == null)
        //        {
        //            this._DataContext = new TCMSDataContext(SettingManager.GetConnection());
        //        }

        //        return this._DataContext;
        //    }
        //}

        public Lazy<IDataContext> EntityContext = new Lazy<IDataContext>(() => new DataContext());

        #region 属性
        /// <summary>
        /// 数据行数
        /// </summary>
        protected int Total
        {
            get
            {
                if (ViewState["Total"] == null)
                {
                    return 0;
                }

                return ViewState["Total"].ToStringOrEmpty().ConvertTo<int>(0);
            }

            set
            {
                ViewState["Total"] = value;
            }
        }
        /// <summary>
        /// 页码
        /// </summary>
        protected virtual int PageSize
        {
            get
            {
                var pageSize = this.GetFieldValue("__PageSize");

                if (pageSize == null)
                {
                    if (ViewState["PageSize"] == null)
                    {
                        ViewState["PageSize"] = 15;
                        return 15;
                    }

                    return ViewState["PageSize"].ToStringOrEmpty().ConvertTo<int>(15);
                }
                else
                {
                    ViewState["PageSize"] = pageSize;

                    return pageSize.ConvertTo<int>(15);
                }


            }
            set
            {
                ViewState["PageSize"] = value;
            }
        }
        /// <summary>
        /// 当前页
        /// </summary>
        protected virtual int PageIndex
        {
            get
            {
                var pageIndex = this.GetFieldValue("__PageIndex");

                if (pageIndex == null)
                {
                    if (ViewState["PageIndex"] == null)
                    {
                        ViewState["PageIndex"] = 1;
                        return 1;
                    }

                    return ViewState["PageIndex"].ToStringOrEmpty().ConvertTo<int>(1);
                }
                else
                {
                    ViewState["PageIndex"] = pageIndex;

                    return pageIndex.ConvertTo<int>(1);
                }
            }
            set
            {
                ViewState["PageIndex"] = value;
            }
        }
        #endregion

        public void SetVariable<T>(string name, T value)
        {
            this.ViewState[name] = value;
        }

        public T GetVarable<T>(string name)
        {
            var value = this.ViewState[name];
            if (value == null)
            {
                return default(T);
            }
            else
            {
                return (T)value;
            }
        }

        protected override void OnPreLoad(EventArgs e)
        {
            base.OnPreLoad(e);

            if (this.IsPostBack == false)
            {
                this.InitControls();
            }

            if (this.IsViewMode)
            {
                if (this.IsPostBack == false)
                {
                    this.BeforeView();
                }
                this.OnView();
            }
            else if (this.IsEditMode)
            {
                if (this.IsPostBack == false)
                {
                    this.BeforeEdit();
                }
                this.OnEdit();
            }
            else
            {
                if (this.IsPostBack == false)
                {
                    this.BeforeAdd();
                }
                this.OnAdd();
            }

            if (this.IsPostBack == false)
            {
                this.BindControls();
            }

        }

        protected override void OnInit(EventArgs e)
        {
            base.OnInit(e);
        }

        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            var script = this.Request.Path + ".js";

            var fileName = this.Server.MapPath(script);

            var fi = new FileInfo(fileName);

            if (fi.Exists)
            {
                this.ClientScript.RegisterClientScriptInclude(this.GetType(), this.UniqueID, script + "?r=" + fi.LastWriteTime.Ticks.ToString());
            }
        }

        protected bool IsEditMode
        {
            get
            {
                return string.Compare(this.GetFieldValue("type"), "edit", true) == 0;
            }
        }

        protected bool IsViewMode
        {
            get
            {
                return string.Compare(this.GetFieldValue("type"), "view", true) == 0;
            }
        }

        protected bool IsSelectMode
        {
            get
            {
                return string.Compare(this.GetFieldValue("type"), "select", true) == 0;
            }
        }

        string _SelectedId;
        protected string SelectedId
        {
            get
            {
                if (this._SelectedId == null)
                {
                    this._SelectedId = this.GetFieldValue("id");
                }

                return this._SelectedId;
            }
        }

        string _OrderId;
        protected string OrderId
        {
            get
            {
                if (this._OrderId == null)
                {
                    this._OrderId = this.GetFieldValue("orderId");
                }

                return this._OrderId;
            }
        }

        string[] _OrderIds;
        protected string[] OrderIds
        {
            get
            {
                if (this._OrderIds == null)
                {
                    if (this.OrderId == null)
                    {
                        this._OrderIds = this.GetSelectedItems().ToArray();
                    }
                    else
                    {
                        this._OrderIds = new string[] { this.OrderId };
                    }
                }

                return this._OrderIds;
            }
        }

        protected override string GetAjaxMethodName()
        {
            var EventTarget = this.GetFieldValue("__EVENTTARGET");
            var tableName = this.GetFieldValue("__TableName");

            if (tableName.HasValue())
            {

                return "FetchData";

            }
            else
            {
                var methodName = this.GetFieldValue("__Method");

                return methodName;
            }
        }

        protected override object[] GetAjaxMethodParameters(MethodInfo method)
        {
            if (method.Name == "FetchData")
            {
                var parameters = new List<object>();
                parameters.Add(this.GetFieldValue("__TableName"));
                parameters.Add(this.GetFieldValue("__OrderBy").Split(','));
                return parameters.ToArray();
            }
            else
            {
                return base.GetAjaxMethodParameters(method);
            }

        }



        /// <summary>
        /// 进入新增页面前
        /// </summary>
        protected virtual void BeforeAdd()
        {
        }

        /// <summary>
        /// 进入新增页面时
        /// </summary>
        protected virtual void OnAdd()
        {
        }

        /// <summary>
        /// 进入编辑页面前
        /// </summary>
        protected virtual void BeforeEdit()
        {
        }

        /// <summary>
        /// 进入编辑页面时
        /// </summary>
        protected virtual void OnEdit()
        {
        }

        /// <summary>
        /// 进入查看界面前
        /// </summary>
        protected virtual void BeforeView()
        {
        }

        /// <summary>
        /// 进入界面时
        /// </summary>
        protected virtual void OnView()
        {
        }

        /// <summary>
        /// 更新数据
        /// </summary>
        /// <returns></returns>
        protected virtual object UpdateObject()
        {
            return null;
        }


        /// <summary>
        /// 新增数据
        /// </summary>
        /// <returns></returns>
        protected virtual object AddObject()
        {
            return null;
        }

        /// <summary>
        /// 保存数据前
        /// </summary>
        protected virtual void BeforeSave()
        {
        }

        /// <summary>
        /// 保存数据
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        protected virtual T SaveObject<T>()
        {
            if (this.IsEditMode)
            {
                return (T)this.UpdateObject();
            }
            else
            {
                return (T)this.AddObject();
            }
        }

        protected virtual void FillData()
        {
        }

        /// <summary>
        /// 初始化控件
        /// </summary>
        protected virtual void InitControls()
        {
        }

        /// <summary>
        /// 绑定数据到控件
        /// </summary>
        protected virtual void BindControls()
        {
        }

        /// <summary>
        /// 获取表格选中项
        /// </summary>
        /// <returns></returns>
        protected List<string> GetSelectedItems()
        {

            var val = this.Request.Form["__SelectedItems"];

            if (val.HasValue() == false)
            {
                val = "";
            }

            return val.Split(',').ToList();
        }

        /// <summary>
        /// 删除数据行
        /// </summary>
        /// <returns></returns>
        public virtual bool DeleteRows()
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// 是不是Ajax请求
        /// </summary>
        /// <returns></returns>
        protected bool IsAjaxRequest()
        {
            var request = this.Page.Request;
            return this.GetFieldValue("X-Requested-With") == "XMLHttpRequest" || (request.Headers != null && request.Headers["X-Requested-With"] == "XMLHttpRequest");
        }

        /// <summary>
        /// 导出数据到Excel
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected virtual void btnExport_Click(object sender, EventArgs e)
        {
            //this.PageIndex = 1;
            //this.PageSize = int.MaxValue;
            //this.FetchData(this.GetFieldValue("export_tablename"), this.GetFieldValue("export_orders").Split(','))
            //    .ToExcel(this.GetFieldValue("export_columns").Split(','))
            //    .Build(this.GetFieldValue("export_fields").Split(','));
            throw new NotImplementedException("等待重构");
        }

        /// <summary>
        /// 表格数据刷新函数
        /// </summary>
        /// <param name="tableName"></param>
        /// <param name="orderby"></param>
        /// <returns></returns>
        protected virtual System.Collections.IEnumerable FetchData(string tableName, string[] orderby = null)
        {
            throw new NotImplementedException();
        }



        /// <summary>
        /// 关闭页面
        /// </summary>
        protected static string CloseCommand = "$.fn.win.close();";


        protected virtual string GetFieldValue(string name)
        {
            return Request[name];
        }




        public IBizModule BizModule
        {
            get;
            set;
        }
    }

    public static class Binder
    {
        private static Lazy<IDataContext> EntityContext = new Lazy<IDataContext>(() => new DataContext());

        public static void BindTo<T>(this IEnumerable<T> collection, ListControl dropdownlist, string firstItem = "全部", string dataValueField = "Code", string dataTextField = "Name")
        {
            dropdownlist.DataSource = collection;
            dropdownlist.DataTextField = dataTextField;
            dropdownlist.DataValueField = dataValueField;
            dropdownlist.DataBind();

            if (firstItem != null)
            {
                dropdownlist.Items.Insert(0, new ListItem { Text = firstItem, Value = "" });
            }

        }

        public static void FilesBind(this HtmlGenericControl control, string fileIds)
        {
            control.ClientIDMode = System.Web.UI.ClientIDMode.Static;
            control.Attributes.Add("class", "fileselector");
            var id = control.ID;
            var dataContext = EntityContext.Value;
            var fileList = dataContext.Files.AsQuerybale.ToList();
            var files = new List<IFile>();

            foreach (var fileId in fileIds.Split(','))
            {
                if (fileId.HasValue() && fileId.Length > 7)
                {
                    if (fileId[0] == '/' || fileId.Substring(0, 7) == "http://")
                    {
                        var file = dataContext.Files.NewEntity();
                        file.Id = fileId;
                        file.Name = fileId.Substring(fileId.LastIndexOf("/") + 1);
                        file.Extension = file.Name.Substring(file.Name.LastIndexOf(".") + 1);
                        files.Add(file);
                    }
                    else
                    {
                        var file = fileList.Where(i => i.Id == fileId).FirstOrDefault();
                        if (file != null)
                        {
                            files.Add(file);
                        }
                    }
                }
            }

            var list = new StringBuilder();
            list.Append("<ul>");
            foreach (var file in files)
            {
                list.Append("<li><input type=\"hidden\" value=\"" + file.Id + "\" name=\"" + id + "\" filename=\"" + file.Name + "\" attachmentid =\"" +
                    file.Id + "\" filetype=\"" + file.Extension.Replace(".", "") + "\" /></li>");
            }

            control.InnerHtml = list.ToString();
        }


        public static string[] GetFiles(this HtmlGenericControl control)
        {
            var files = HttpContext.Current.Request.Form[control.ID];

            if (files == null)
            {
                return new string[0];
            }
            else
            {
                return files.Split(new string[] { "," }, StringSplitOptions.RemoveEmptyEntries);
            }
        }

        public static string[] GetAttachmentID(this HtmlGenericControl control)
        {
            var files = HttpContext.Current.Request.Form[control.ID + "_id"];

            if (files == null)
            {
                return new string[0];
            }
            else
            {
                return files.Split(new string[] { "," }, StringSplitOptions.RemoveEmptyEntries);
            }
        }

        public static string[] GetFileUrls(this HtmlGenericControl control)
        {
            var files = HttpContext.Current.Request.Form[control.ID + "_url"];

            if (files == null)
            {
                return new string[0];
            }
            else
            {
                return files.Split(new string[] { "," }, StringSplitOptions.RemoveEmptyEntries);
            }
        }
    }

    #region 验证类
    public static class ValidatorHelper
    {
        public static WebControl AddValidator<TValidator>(this WebControl control, string message) where TValidator : IValidator
        {
            AddValidator<TValidator>(control, message, Container.Default.GetExport<TValidator>());

            return control;
        }

        public static WebControl AddValidator<TValidator>(this WebControl control, string message, TValidator validator) where TValidator : IValidator
        {
            control.Attributes.Add("data-val-" + validator.Name.ToLowerInvariant(), message);

            validator.Bind(control);

            return control;
        }
    }

    public interface IValidator
    {
        string Name { get; }

        void Bind(WebControl control);
    }

    public class URLValidator : IValidator
    {
        public string Name
        {
            get { return "URL"; }
        }
        public void Bind(System.Web.UI.WebControls.WebControl control)
        {

        }
    }

    public class RequiredValidator : IValidator
    {
        public string Name
        {
            get
            {
                return "required";
            }
        }

        public void Bind(System.Web.UI.WebControls.WebControl control)
        {
            control.Attributes.Add("data-required", this.Name);
        }
    }

    public class StringLengthValidator : IValidator
    {
        #region 文本长度验证
        public string Name
        {
            get { return "StringLenght"; }
        }

        /// <summary>
        /// 最大长度
        /// </summary>
        public int? MaxLength
        {
            get;
            set;
        }

        /// <summary>
        /// 最小长度
        /// </summary>
        public int? MinLength
        {
            get;
            set;
        }

        public void Bind(System.Web.UI.WebControls.WebControl control)
        {
            if (this.MinLength.HasValue)
                control.Attributes.Add("data-min-length", this.MinLength.ToString());
            if (this.MaxLength.HasValue)
            {
                control.Attributes.Add("data-max-length", this.MaxLength.ToString());
                if (control is TextBox)
                    ((TextBox)control).MaxLength = (int)this.MaxLength;
            }
        }
        #endregion
    }

    public class DateValidator : IValidator
    {
        #region 时间验证

        public string Name
        {
            get { return "Date"; }
        }
        /// <summary>
        /// 时间类型
        /// </summary>
        public string DateType
        {
            get;
            set;
        }
        public void Bind(System.Web.UI.WebControls.WebControl control)
        {
            if (this.DateType.HasValue())
            {
                control.Attributes.Add("data-date-type", this.DateType);
            }
        }

        #endregion
    }

    public class CardValidator : IValidator
    {
        #region 身份证验证

        public string Name
        {
            get { return "Card"; }
        }
        public void Bind(System.Web.UI.WebControls.WebControl control)
        {

        }

        #endregion
    }

    public class EmailValidator : IValidator
    {
        #region 邮箱验证

        public string Name
        {
            get { return "Email"; }
        }
        public void Bind(System.Web.UI.WebControls.WebControl control)
        {

        }

        #endregion
    }

    public class PhoneValidator : IValidator
    {
        #region 电话验证

        public string Name
        {
            get { return "Phone"; }
        }
        public void Bind(System.Web.UI.WebControls.WebControl control)
        {
            control.Attributes.Add("data-phone", this.Name);
        }

        #endregion
    }

    public class MobileValidator : IValidator
    {
        #region 手机号码验证

        public string Name
        {
            get { return "Moblie"; }
        }
        public void Bind(System.Web.UI.WebControls.WebControl control)
        {

        }

        #endregion
    }

    public class NumberValidator : IValidator
    {
        #region 数字验证

        public string Name
        {
            get { return "Number"; }
        }

        /// <summary>
        /// 小数位
        /// </summary>
        public int Decimal
        {
            get;
            set;
        }
        public void Bind(System.Web.UI.WebControls.WebControl control)
        {
            control.Attributes.Add("data-decimal-number", this.Decimal.ToString());
        }

        #endregion
    }

    public class NumberRangeValidator : IValidator
    {
        #region 数值大小比较

        public string Name
        {
            get
            {
                return "NumberRangeValidator";
            }
        }
        /// <summary>
        /// 最大值
        /// </summary>
        public int? MaxValue
        {
            get;
            set;
        }
        /// <summary>
        /// 最小值
        /// </summary>
        public int? MinValue
        {
            get;
            set;
        }
        public void Bind(System.Web.UI.WebControls.WebControl control)
        {
            if (this.MaxValue.HasValue)
                control.Attributes.Add("data-number-max", this.MaxValue.ToString());
            if (this.MinValue.HasValue)
                control.Attributes.Add("data-number-min", this.MinValue.ToString());
        }

        #endregion
    }
    #endregion

    public class CodeName
    {
        public string Code
        {
            get;
            set;
        }

        public string Name
        {
            get;
            set;
        }

        public override bool Equals(object obj)
        {
            if (obj == null)
            {
                return false;
            }
            else
            {
                if (obj is CodeName)
                {
                    return this.Code == ((CodeName)obj).Code;
                }
                else
                {
                    return false;
                }
            }
        }
    }

}

