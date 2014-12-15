using ProjectDesigner.VMS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using ProjectDesigner.Domain.Equipment;
using ProjectDesigner.Pillar;

namespace ProjectDesigner.Website.Equipment
{
    public partial class PillarEdit : TPageBase
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        IPillar EditModel
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
                this.EditModel = this.EntityContext.Value.Pillars.NewEntity();
            }
        }

        protected override void OnEdit()
        {
            if (!IsPostBack)
            {
                this.EditModel = this.EntityContext.Value.SearchPillar(this.SelectedId);
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
                this.EditModel = this.EntityContext.Value.SearchPillar(this.SelectedId);
                this.txtName.Text = this.EditModel.Name;
                this.txtPrice.Text = this.EditModel.Price.ToString();
                this.txtDiameter.Text = this.EditModel.Diameter == null ? "" : this.EditModel.Diameter.ToString();
                this.txtHeight.Text = this.EditModel.Height == null ? "" : this.EditModel.Height.ToString();
                this.txtLength.Text = this.EditModel.Length == null ? "" : this.EditModel.Length.ToString();
                this.DropDownListType.SelectedValue = this.EditModel.Type.ToString();
            }
        }

        protected override void FillData()
        {
            if (this.IsEditMode)
            {
                this.EditModel = this.EntityContext.Value.SearchPillar(this.SelectedId);
            }
            else
            {
                this.EditModel = this.EntityContext.Value.Pillars.NewEntity();
                this.EditModel.Id = Guid.NewGuid().ToString("N");
            }
            this.EditModel.Name = this.txtName.Text;
            this.EditModel.Price = string.IsNullOrEmpty(this.txtPrice.Text) ? decimal.Zero : decimal.Parse(this.txtPrice.Text);


            this.EditModel.Diameter = string.IsNullOrEmpty(this.txtDiameter.Text) ? 0 : float.Parse(this.txtDiameter.Text);

            this.EditModel.Height = string.IsNullOrEmpty(this.txtHeight.Text) ? 0 : double.Parse(this.txtHeight.Text);
            this.EditModel.Length = string.IsNullOrEmpty(this.txtLength.Text) ? 0 : double.Parse(this.txtLength.Text);

            if (this.DropDownListType.SelectedIndex == null)
                this.EditModel.Type = null;
            else
                this.EditModel.Type = (PillarType)this.DropDownListType.SelectedIndex;
        }


        protected override object UpdateObject()
        {
            this.EntityContext.Value.UpdatePillar(this.EditModel);
            return this.EditModel;
        }

        protected override object AddObject()
        {
            this.EntityContext.Value.AddPillar(this.EditModel);
            return this.EditModel;
        }

        public object Save()
        {
            try
            {
                this.EntityContext.Value.BeginTransaction();
                this.FillData();
                this.SaveObject<IPillar>();
                this.EntityContext.Value.CommitTransaction();
                return new
                {
                    Id = this.EditModel.Id,
                    Name = this.EditModel.Name,
                    Price = this.EditModel.Price,
                    Type = this.EditModel.Type == null ? "" : this.EditModel.Type.ToString(),
                    Diameter = this.EditModel.Diameter,
                    Height = this.EditModel.Height,
                    Length = this.EditModel.Length
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