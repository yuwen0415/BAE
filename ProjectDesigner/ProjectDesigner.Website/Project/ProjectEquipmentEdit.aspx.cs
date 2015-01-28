using ProjectDesigner.VMS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using ProjectDesigner.Domain.Project;
using EBA.Helpers;
using ProjectDesigner.Project;

namespace ProjectDesigner.Website.Project
{
    public partial class ProjectEquipmentEdit : TPageBase
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        IProjectEquipment EditModel
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
                this.EditModel = this.EntityContext.Value.ProjectEquipments.NewEntity();
            }
        }

        protected override void OnEdit()
        {
            if (!IsPostBack)
            {
                this.EditModel = this.EntityContext.Value.SearchProjectEquipment(this.SelectedId);
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
                this.EditModel = this.EntityContext.Value.SearchProjectEquipment(this.SelectedId);

                this.txtName.Text = this.EditModel == null ? "" : this.EditModel.Name;
                this.txtLocation.Text = this.EditModel.Location.Longitude + "," + this.EditModel.Location.Latitude;
                this.txtPrice.Text = this.EditModel.Price == null ? "" : this.EditModel.Price.ToString();
                this.DropEquipmentType.SelectedIndex = (int)this.EditModel.EquipmentType;
            }
        }

        protected override void FillData()
        {
            if (this.IsEditMode)
            {
                this.EditModel = this.EntityContext.Value.SearchProjectEquipment(this.SelectedId);
            }
            else
            {
                this.EditModel = this.EntityContext.Value.ProjectEquipments.NewEntity();
                this.EditModel.Id = Guid.NewGuid().ToString("N");
                this.EditModel.ProjectId = this.Request["projectId"];
            }
            this.EditModel.EquipmentType = (EquipmentType)(int.Parse(this.DropEquipmentType.Text));
            this.EditModel.Name = this.txtName.Text;
            this.EditModel.Price = this.txtPrice.Text == null ? 0.0m : decimal.Parse(this.txtPrice.Text);
            var location = this.txtLocation.Text.Split(',');
            this.EditModel.Location = new Location { Longitude = float.Parse(location[0]), Latitude = float.Parse(location[1]) };
        }


        protected override object UpdateObject()
        {
            this.EntityContext.Value.UpdateProjectEquipment(this.EditModel);
            return this.EditModel;
        }

        protected override object AddObject()
        {
            this.EntityContext.Value.AddProjectEquipment(this.EditModel);
            return this.EditModel;
        }

        public object Save()
        {
            try
            {
                this.EntityContext.Value.BeginTransaction();
                this.FillData();
                this.SaveObject<IProjectEquipment>();
                this.EntityContext.Value.CommitTransaction();
                //var equipment = this.EntityContext.Value.SearchProjectEquipment(this.EditModel.EquipmentId, this.EditModel.EquipmentType);
                return new
                {
                    Id = this.EditModel.Id,
                    //Name = equipment == null ? string.Empty : equipment.Name,
                    Name = this.EditModel.Name,
                    EquipmentType = this.EditModel.EquipmentType,
                    Location = this.EditModel.Location.Longitude + "," + this.EditModel.Location.Latitude,
                    // Price = this.EditModel.
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


        protected override System.Collections.IEnumerable FetchData(string tableName, string[] orderby = null)
        {
            var list = this.EntityContext.Value.SearchEquipments((EquipmentType)int.Parse(this.DropSEquipmentType.Text));
            if (list == null)
                return null;
            if (this.txtSName.Text.HasValue())
            {
                list = list.Where(i => i.Name.Contains(this.txtName.Text.Trim()));
            }
            return list.Fetch(this.PageIndex, this.PageSize)
                .Select(i => new
                {
                    Id = i.Id,
                    Name = i.Name,
                    Price = i.Price,
                    Brand = i.Brand
                });
        }

        public object EuipmentSelected()
        {
            var equipment = this.EntityContext.Value.SearchEquipment(this.Request.Form["EquipmentId"], (EquipmentType)int.Parse(this.DropSEquipmentType.Text));
            if (equipment != null)
            {
                return new
                    {
                        Id = equipment.Id,
                        //Name = equipment == null ? string.Empty : equipment.Name,
                        Name = equipment.Name,
                        EquipmentType = this.DropSEquipmentType.Text,
                        Price = equipment.Price
                    };
            }
            else
            {
                return null;
            }
        }
    }
}