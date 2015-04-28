using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using ProjectDesigner.Domain.Equipment;
using EBA.Helpers;
using ProjectDesigner;

namespace ProjectDesigner.Website.Equipment
{
    public partial class AccessorialMaterialEdit : TPageBase
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        IEquipment EditModel
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
                this.EditModel = this.EntityContext.Value.AccessorialMaterials.NewEntity();
            }
        }

        protected override void OnEdit()
        {
            if (!IsPostBack)
            {
                this.EditModel = this.EntityContext.Value.SearchAccessorialMaterial(this.SelectedId);
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
                this.EditModel = this.EntityContext.Value.SearchAccessorialMaterial(this.SelectedId);
                this.txtName.Text = this.EditModel.Name;
                this.txtBrand.Text = this.EditModel.Brand;
                this.txtPrice.Text = this.EditModel.Price.ToString();
                this.txtProductType.Text = this.EditModel.ProductType;
                this.txtTechnicalParameters.Text = this.EditModel.TechnicalParameters;
                this.txtUnit.Text = this.EditModel.Unit;
            }
        }

        protected override void FillData()
        {
            if (this.IsEditMode)
            {
                this.EditModel = this.EntityContext.Value.SearchAccessorialMaterial(this.SelectedId);
            }
            else
            {
                this.EditModel = this.EntityContext.Value.AccessorialMaterials.NewEntity();
                this.EditModel.Id = Guid.NewGuid().ToString("N");
            }
            this.EditModel.Name = this.txtName.Text;
            this.EditModel.Brand = this.txtBrand.Text;
            this.EditModel.Price = string.IsNullOrEmpty(this.txtPrice.Text) ? decimal.Zero : decimal.Parse(this.txtPrice.Text);



            this.EditModel.ProductType = this.txtProductType.Text;

            this.EditModel.TechnicalParameters = this.txtTechnicalParameters.Text;

            this.EditModel.Unit = this.txtUnit.Text;
        }


        protected override object UpdateObject()
        {
            this.EntityContext.Value.UpdateAccessorialMaterial(this.EditModel);
            return this.EditModel;
        }

        protected override object AddObject()
        {
            this.EntityContext.Value.AddAccessorialMaterial(this.EditModel);
            return this.EditModel;
        }

        public object Save()
        {
            try
            {
                this.EntityContext.Value.BeginTransaction();
                this.FillData();
                this.SaveObject<IEquipment>();
                this.EntityContext.Value.CommitTransaction();
                return new
                {
                    Id = this.EditModel.Id,
                    Name = this.EditModel.Name,
                    Price = this.EditModel.Price,
                    Brand = this.EditModel.Brand,
                    ProductType = this.EditModel.ProductType,
                    TechnicalParameters = this.EditModel.TechnicalParameters,
                    Unit = this.EditModel.Unit
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