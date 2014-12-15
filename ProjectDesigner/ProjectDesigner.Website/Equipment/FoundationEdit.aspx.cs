using ProjectDesigner.VMS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using ProjectDesigner.Domain.Equipment;
using ProjectDesigner.Pillar;
using ProjectDesigner.Foundation;

namespace ProjectDesigner.Website.Equipment
{
    public partial class FoundationEdit : TPageBase
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        IFoundation EditModel
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
                this.EditModel = this.EntityContext.Value.Foundations.NewEntity();
            }
        }

        protected override void OnEdit()
        {
            if (!IsPostBack)
            {
                this.EditModel = this.EntityContext.Value.SearchFoundation(this.SelectedId);
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
                this.EditModel = this.EntityContext.Value.SearchFoundation(this.SelectedId);
                this.txtName.Text = this.EditModel.Name;
                this.txtPrice.Text = this.EditModel.Price.ToString();
                this.txtSize_X.Text = this.EditModel.Size == null ? "" : this.EditModel.Size.X.ToString();
                this.txtSize_Y.Text = this.EditModel.Size == null ? "" : this.EditModel.Size.Y.ToString();
                this.txtSize_Z.Text = this.EditModel.Size == null ? "" : this.EditModel.Size.Z.ToString();
            }
        }

        protected override void FillData()
        {
            if (this.IsEditMode)
            {
                this.EditModel = this.EntityContext.Value.SearchFoundation(this.SelectedId);
            }
            else
            {
                this.EditModel = this.EntityContext.Value.Foundations.NewEntity();
                this.EditModel.Id = Guid.NewGuid().ToString("N");
            }
            this.EditModel.Name = this.txtName.Text;
            this.EditModel.Price = string.IsNullOrEmpty(this.txtPrice.Text) ? decimal.Zero : decimal.Parse(this.txtPrice.Text);
            if (!string.IsNullOrEmpty(this.txtSize_X.Text) && !string.IsNullOrEmpty(this.txtSize_Y.Text) && !string.IsNullOrEmpty(txtSize_Z.Text))
            {
                this.EditModel.Size = new Size
                {
                    X = float.Parse(this.txtSize_X.Text),
                    Y = float.Parse(this.txtSize_Y.Text),
                    Z = float.Parse(this.txtSize_Z.Text)
                };
            }
        }


        protected override object UpdateObject()
        {
            this.EntityContext.Value.UpdateFoundation(this.EditModel);
            return this.EditModel;
        }

        protected override object AddObject()
        {
            this.EntityContext.Value.AddFoundation(this.EditModel);
            return this.EditModel;
        }

        public object Save()
        {
            try
            {
                this.EntityContext.Value.BeginTransaction();
                this.FillData();
                this.SaveObject<IFoundation>();
                this.EntityContext.Value.CommitTransaction();
                return new
                {
                    Id = this.EditModel.Id,
                    Name = this.EditModel.Name,
                    Price = this.EditModel.Price,
                    Size = this.EditModel.Size == null ? "" : this.EditModel.Size.X + "x" + this.EditModel.Size.Y + "x" + this.EditModel.Size.Z
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