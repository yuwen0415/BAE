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
    public partial class ProjectEdit : TPageBase
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        IProject EditModel
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
                this.EditModel = this.EntityContext.Value.Projects.NewEntity();
                var id = Guid.NewGuid().ToString("N");
                this.btnAdd.Attributes["data-params"] = "&projectId=" + id;
                //this.btnUpdate.Attributes["data-params"] = "&projectId=" + id;
            }
        }

        protected override void OnEdit()
        {
            if (!IsPostBack)
            {
                this.EditModel = this.EntityContext.Value.SearchProject(this.SelectedId);
                this.btnAdd.Attributes["data-params"] = "&projectId=" + this.SelectedId;
                //this.btnUpdate.Attributes["data-params"] = "&projectId=" + this.SelectedId;
            }
        }

        protected override void OnView()
        {
            if (!IsPostBack)
            {
                base.OnView();
                this.DisableUI();
                this.btnSave.Visible = false;
                this.btnAdd.Attributes["data-params"] = "&projectId=" + this.SelectedId;
                //this.btnUpdate.Attributes["data-params"] = "&projectId=" + this.SelectedId;
            }
        }

        protected override void BindControls()
        {
            if (IsEditMode || IsViewMode)
            {
                this.EditModel = this.EntityContext.Value.SearchProject(this.SelectedId);
                this.txtName.Text = this.EditModel.Name;
                this.txtPrice.Text = this.EditModel.Price.ToString();

            }
        }

        protected override void FillData()
        {
            if (this.IsEditMode)
            {
                this.EditModel = this.EntityContext.Value.SearchProject(this.SelectedId);
            }
            else
            {
                var id =
                this.EditModel = this.EntityContext.Value.Projects.NewEntity();
                this.EditModel.Id = this.btnAdd.Attributes["data-params"].Replace("&projectId=", "");
            }
            this.EditModel.Name = this.txtName.Text;
            this.EditModel.Price = string.IsNullOrEmpty(this.txtPrice.Text) ? 0.0m : decimal.Parse(this.txtPrice.Text);
            // this.EditModel.Equipments = this.EntityContext.Value.SearchProjectEquipments(this.EditModel.Id).ToList();
        }


        protected override object UpdateObject()
        {
            this.EntityContext.Value.UpdateProject(this.EditModel);
            return this.EditModel;
        }

        protected override object AddObject()
        {
            this.EntityContext.Value.AddProject(this.EditModel);
            return this.EditModel;
        }


        protected override System.Collections.IEnumerable FetchData(string tableName, string[] orderby = null)
        {
            this.FillData();
            var query = this.EntityContext.Value.SearchProjectEquipments(this.EditModel.Id);

            if (this.txtEquipmentName.Text.HasValue())
            {
                query.Where(i => i.Name.Contains(this.txtEquipmentName.Text.Trim()));
            }
            if (this.DropEquipmentType.Text != "0")
            {
                var type = (EquipmentType)(int.Parse(this.DropEquipmentType.Text));
                query.Where(i => i.EquipmentType == type);
            }
            return query.OrderBy(i => i.Id).OrderBy(orderby).Fetch(this.PageIndex, this.PageSize)
            .Select(i => new
            {
                Id = i.Id,
                Name = i.Name,
                EquipmentType = i.EquipmentType.ToString(),
                Location = i.Location.Longitude + "," + i.Location.Latitude,
                Price = i.Price
            });

        }



        public object Save()
        {
            try
            {
                this.EntityContext.Value.BeginTransaction();

                this.FillData();

                var equipments = this.EntityContext.Value.SearchProjectEquipments(this.EditModel.Id).ToList();
                decimal? price = 0.0m;
                var equipmentsName = "";
                foreach (var equipment in equipments)
                {
                    price += equipment.Price;
                    equipmentsName += equipment.Name;
                }
                this.EditModel.Price = price;
                this.SaveObject<IProject>();
                this.EntityContext.Value.CommitTransaction();

                return new
                {
                    Id = this.EditModel.Id,
                    Name = this.EditModel.Name,
                    Price = this.EditModel.Price,
                    Equipments = equipmentsName
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

        public override bool DeleteRows()
        {
            foreach (var id in this.GetSelectedItems())
            {
                this.EntityContext.Value.DeleteProjectEquipment(id);
            }
            this.EntityContext.Value.SubmitChanges();
            return true;
        }

    }
}