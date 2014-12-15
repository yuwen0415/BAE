using ProjectDesigner.VMS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using ProjectDesigner.Domain.Equipment;

namespace ProjectDesigner.Website.Equipment
{
    public partial class LEDModuleEdit : TPageBase
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        ILEDModule EditModel
        {
            get;
            set;
        }

        protected override void InitControls()
        {
            base.InitControls();
            //this.txtCode.AddValidator<RequiredValidator>("代码必须填写！");
            this.txtName.AddValidator<RequiredValidator>("名称必须填写！");
            //this.ShowOrder.AddValidator<RequiredValidator>("显示顺序必须填写！");
        }
        protected override void OnAdd()
        {
            if (!IsPostBack)
            {
                this.EditModel = this.EntityContext.Value.LEDModules.NewEntity();
            }
        }

        protected override void OnEdit()
        {
            if (!IsPostBack)
            {
                this.EditModel = this.EntityContext.Value.SearchLEDModule(this.SelectedId);
            }
        }

        protected override void OnView()
        {
            if (!IsPostBack)
            {
                base.OnView();
                this.DisableUI();
                this.btnSave.Visible = false;
            }
        }

        protected override void BindControls()
        {
            if (IsEditMode || IsViewMode)
            {
                this.EditModel = this.EntityContext.Value.SearchLEDModule(this.SelectedId);
                this.txtName.Text = this.EditModel.Name;
                this.txtBrand.Text = this.EditModel.Brand;
                this.txtPrice.Text = this.EditModel.Price.ToString();
                this.txtSizeHeight.Text = this.EditModel.Size == null ? "" : this.EditModel.Size.Length.ToString();
                this.txtSizeWidth.Text = this.EditModel.Size == null ? "" : this.EditModel.Size.Width.ToString();

                this.DropDownListStandard.SelectedValue = this.EditModel.Standard.ToString();

            }
        }

        protected override void FillData()
        {
            if (this.IsEditMode)
            {
                this.EditModel = this.EntityContext.Value.SearchLEDModule(this.SelectedId);
            }
            else
            {
                this.EditModel = this.EntityContext.Value.LEDModules.NewEntity();
                this.EditModel.Id = Guid.NewGuid().ToString("N");
            }
            this.EditModel.Name = this.txtName.Text;
            this.EditModel.Brand = this.txtBrand.Text;
            this.EditModel.Price = string.IsNullOrEmpty(this.txtPrice.Text) ? decimal.Zero : decimal.Parse(this.txtPrice.Text);

            if (!string.IsNullOrEmpty(this.txtSizeHeight.Text) && !string.IsNullOrEmpty(this.txtSizeWidth.Text))
            {
                this.EditModel.Size = new ModuleSize
                {
                    Length = float.Parse(this.txtSizeHeight.Text),
                    Width = float.Parse(this.txtSizeWidth.Text)
                };
            }
            this.EditModel.Standard = (LedStandard)this.DropDownListStandard.SelectedIndex;
        }


        protected override object UpdateObject()
        {
            this.EntityContext.Value.UpdateLEDModule(this.EditModel);
            return this.EditModel;
        }

        protected override object AddObject()
        {
            this.EntityContext.Value.AddLEDModule(this.EditModel);
            return this.EditModel;
        }

        public object Save()
        {
            try
            {
                this.EntityContext.Value.BeginTransaction();
                this.FillData();
                this.SaveObject<ILEDModule>();
                this.EntityContext.Value.CommitTransaction();
                return new
                {
                    Id = this.EditModel.Id,
                    Name = this.EditModel.Name,
                    Size = this.EditModel.Size == null ? "" : this.EditModel.Size.Length + "," + this.EditModel.Size.Width,
                    Price = this.EditModel.Price,
                    Brand = this.EditModel.Brand,
                    LedStandard = this.EditModel.Standard.ToString()
                };
            }
            catch
            {
                this.EntityContext.Value.RollbackTransaction();
                throw;
            }
            finally
            {
                this.EntityContext.Value.EndTransaction();
            }
        }
    }
}