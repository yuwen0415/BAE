﻿using ProjectDesigner.VMS;
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
                var equipment = this.EntityContext.Value.SearchProjectEquipment(this.EditModel.EquipmentId, this.EditModel.EquipmentType);
                this.txtName.Text = equipment == null ? "" : equipment.Name;
                this.txtLocation.Text = this.EditModel.Location.Longitude + "," + this.EditModel.Location.Latitude;
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
            }
            this.EditModel.EquipmentType = (EquipmentType)(int.Parse(this.txtEquipmentType.Text));
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
                var equipment = this.EntityContext.Value.SearchProjectEquipment(this.EditModel.EquipmentId, this.EditModel.EquipmentType);
                return new
                {
                    Id = this.EditModel.Id,
                    Name = equipment == null ? "" : equipment.Name,
                    Location = this.EditModel.Location.Longitude + "," + this.EditModel.Location.Latitude
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