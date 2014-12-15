using ProjectDesigner.VMS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using ProjectDesigner.Domain.Equipment;
using EBA.Helpers;

namespace ProjectDesigner.Website.Equipment
{
    public partial class VMSEdit : TPageBase
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        IVMS EditModel
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
                this.EditModel = this.EntityContext.Value.VMSs.NewEntity();
            }
        }

        protected override void OnEdit()
        {
            if (!IsPostBack)
            {
                this.EditModel = this.EntityContext.Value.SearchVMS(this.SelectedId);
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
                this.EditModel = this.EntityContext.Value.SearchVMS(this.SelectedId);
                this.txtName.Text = this.EditModel.Name;
                this.txtBrand.Text = this.EditModel.Brand;
                this.txtPrice.Text = this.EditModel.Price.ToString();
                this.txtSizeHeight.Text = this.EditModel.Size == null ? "" : this.EditModel.Size.Length.ToString();
                this.txtSizeWidth.Text = this.EditModel.Size == null ? "" : this.EditModel.Size.Width.ToString();
                this.txtWeight.Text = this.EditModel.Weight.ToString();
                this.txtModule.Text = (this.EditModel.LEDModule == null) ? "" : this.EditModel.LEDModule.Name;
                this.txtModuleCount.Text = this.EditModel.ModuleCount.ToString();
                this.txtPillar.Text = this.EditModel.Pillar == null ? "" : this.EditModel.Pillar.Name;
                this.txtFoundation.Text = this.EditModel.Foundation == null ? "" : this.EditModel.Foundation.Name;
                this.DropDownListType.SelectedValue = this.EditModel.Type.ToString();
                this.DropDownListConnection.SelectedValue = this.EditModel.Connection.ToString();
                if (!string.IsNullOrEmpty(this.EditModel.IconPath))
                {
                    this.listAttachments.FilesBind(this.EditModel.IconPath);
                }
            }
        }

        protected override void FillData()
        {
            if (this.IsEditMode)
            {
                this.EditModel = this.EntityContext.Value.SearchVMS(this.SelectedId);
            }
            else
            {
                this.EditModel = this.EntityContext.Value.VMSs.NewEntity();
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
            this.EditModel.Weight = string.IsNullOrEmpty(this.txtWeight.Text) ? 0 : float.Parse(this.txtWeight.Text);
            this.EditModel.LEDModule = string.IsNullOrEmpty(this.txtModule.Text) ? null :
                                       this.EntityContext.Value.LEDModules.AsQuerybale
                                                                          .Where(i => i.Name == this.txtModule.Text)
                                                                          .FirstOrDefault();
            this.EditModel.ModuleCount = string.IsNullOrEmpty(this.txtModuleCount.Text) ? 0 : int.Parse(this.txtModuleCount.Text);
            this.EditModel.Pillar = string.IsNullOrEmpty(this.txtPillar.Text) ? null :
                                       this.EntityContext.Value.Pillars.AsQuerybale
                                                                       .Where(i => i.Name == this.txtPillar.Text)
                                                                       .FirstOrDefault();
            this.EditModel.Foundation = string.IsNullOrEmpty(this.txtFoundation.Text) ? null :
                                       this.EntityContext.Value.Foundations.AsQuerybale
                                                                           .Where(i => i.Name == this.txtFoundation.Text)
                                                                           .FirstOrDefault();

            this.EditModel.Type = (VMSType)this.DropDownListType.SelectedIndex;

            this.EditModel.Connection = (Connection)this.DropDownListConnection.SelectedIndex;

            this.EditModel.IconPath = this.Request["listAttachments_id"];
        }


        protected override object UpdateObject()
        {
            this.EntityContext.Value.UpdateVMS(this.EditModel);
            return this.EditModel;
        }

        protected override object AddObject()
        {
            this.EntityContext.Value.AddVMS(this.EditModel);
            return this.EditModel;
        }

        public object Save()
        {
            try
            {
                this.EntityContext.Value.BeginTransaction();
                this.FillData();
                this.SaveObject<IVMS>();
                this.EntityContext.Value.CommitTransaction();
                return new
                {
                    Id = this.EditModel.Id,
                    Name = this.EditModel.Name,
                    Size = this.EditModel.Size == null ? "" : this.EditModel.Size.Length + "," + this.EditModel.Size.Width,
                    Price = this.EditModel.Price,
                    Brand = this.EditModel.Brand,
                    Type = this.EditModel.Type == null ? "" : this.EditModel.Type.ToString(),
                    Connection = this.EditModel.Connection == null ? "" : this.EditModel.Connection.ToString(),
                    Foundation = this.EditModel.Foundation == null ? "" : this.EditModel.Foundation.Name,
                    Pillar = this.EditModel.Pillar == null ? "" : this.EditModel.Pillar.Name,
                    LEDModule = this.EditModel.LEDModule == null ? "" : this.EditModel.LEDModule.Name
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

        public object FindLEDModule()
        {
            var query = this.EntityContext.Value.SearchLEDModule();
            if (this.txtModule.Text.HasValue())
            {
                query = query
                    .Where(i => i.Name.Contains(this.txtModule.Text) || i.Brand.Contains(this.txtModule.Text));
            }
            return query.Fetch(1, 10)
               .Select(i => new
               {
                   i.Id,
                   i.Name,
                   Size = i.Size == null ? "" : i.Size.Width + "x" + i.Size.Length,
                   Standard = i.Standard.ToString(),
                   i.Price,
                   i.Brand

               });
        }

        public object FindPillar()
        {
            var query = this.EntityContext.Value.SearchPillar();
            if (this.txtPillar.Text.HasValue())
            {
                query = query
                    .Where(i => i.Name.Contains(this.txtPillar.Text));
            }
            return query.Fetch(1, 10)
               .Select(i => new
               {
                   i.Id,
                   i.Name,
                   i.Diameter,
                   Type = i.Type == null ? "" : i.Type.ToString(),
                   i.Price,
                   i.Length,
                   i.Height
               });
        }

        public object FindFoundation()
        {
            var query = this.EntityContext.Value.SearchFoundation();
            if (this.txtFoundation.Text.HasValue())
            {
                query = query
                    .Where(i => i.Name.Contains(this.txtFoundation.Text));
            }
            return query.Fetch(1, 10)
               .Select(i => new
               {
                   i.Id,
                   i.Name,
                   i.Price,
                   Size = i.Size.X + "x" + i.Size.Y + "x" + i.Size.Z
               });
        }
    }
}