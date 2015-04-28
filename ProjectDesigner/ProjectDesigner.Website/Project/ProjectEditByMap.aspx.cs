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
    public partial class ProjectEditByMap : TPageBase
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        List<IProjectEquipment> _EditModel;
        List<IProjectEquipment> EditModel
        {
            get
            {
                if (_EditModel == null)
                {
                    _EditModel = new List<IProjectEquipment>();
                }
                return this._EditModel;
            }
            set
            {
                _EditModel = value;
            }
        }

        protected override void InitControls()
        {
            base.InitControls();
            //this.txtCode.AddValidator<RequiredValidator>("代码必须填写！");
            //this.txtName.AddValidator<RequiredValidator>("名称必须填写！");
            //this.ShowOrder.AddValidator<RequiredValidator>("显示顺序必须填写！");
        }


        public object ShowExistedEquipments()
        {
            var existedequipments = this.EntityContext.Value.SearchProjectEquipments(this.Request["projectId"]).ToList();
            var text = "";
            existedequipments.RemoveAll(i => i.Location == null);
            foreach (var existequipment in existedequipments)
            {
                if (existequipment.Location != null)
                    text += "{" + (int)existequipment.EquipmentType + "||" + existequipment.Location.Longitude.ToString() + "," + existequipment.Location.Latitude.ToString() + "};";
            }

            return text;
        }

        protected override object AddObject()
        {
            var selectedEquipments = this.txtDesignedEquipments.Text.Split(new string[] { ";" }, StringSplitOptions.RemoveEmptyEntries);
            foreach (var selectedEuipment in selectedEquipments)
            {
                var parms = selectedEuipment.Split(':');
                var equipment = this.EntityContext.Value.SearchEquipment(parms[0].Split('+')[1], (EquipmentType)(int.Parse(parms[0].Split('+')[0])));
                if (equipment != null)
                {
                    foreach (var location in parms[1].Split(new string[] { "||" }, StringSplitOptions.RemoveEmptyEntries))
                    {
                        var newProjectEquipment = this.EntityContext.Value.ProjectEquipments.NewEntity();
                        newProjectEquipment.Id = Guid.NewGuid().ToString("N");
                        newProjectEquipment.Location = new Location { Longitude = float.Parse(location.Split(',')[0]), Latitude = float.Parse(location.Split(',')[1]) };
                        newProjectEquipment.Name = equipment.Name;
                        newProjectEquipment.Price = equipment.Price;
                        newProjectEquipment.ProductType = equipment.ProductType;
                        newProjectEquipment.ProjectId = this.Request["projectId"];
                        newProjectEquipment.TechnicalParameters = equipment.TechnicalParameters;
                        newProjectEquipment.Unit = equipment.Unit;
                        newProjectEquipment.EquipmentType = equipment.EquipmentType;
                        newProjectEquipment.Brand = equipment.Brand;
                        newProjectEquipment.Num = 1.0;
                        EditModel.Add(newProjectEquipment);
                        this.EntityContext.Value.AddProjectEquipment(newProjectEquipment);
                    }
                }
            }
            //
            return this.EditModel;
        }

        public object Save()
        {
            try
            {
                this.EntityContext.Value.BeginTransaction();
                this.AddObject();
                this.EntityContext.Value.CommitTransaction();
                //var equipment = this.EntityContext.Value.SearchProjectEquipments(this.Request["projectId"]).FirstOrDefault();
                return Array.ConvertAll<IProjectEquipment, object>(this.EditModel.ToArray(), delegate(IProjectEquipment equipment)
                {
                    return new
                      {
                          Id = equipment.Id,
                          //Name = equipment == null ? string.Empty : equipment.Name,
                          Name = equipment.Name,
                          // Price = this.EditModel.
                          Location = equipment.Location == null ? "" : equipment.Location.Longitude + "," + equipment.Location.Latitude,
                          Price = equipment.Price,
                          ProductType = equipment.ProductType,
                          ProjectId = this.Request.Form["projectId"],
                          TechnicalParameters = equipment.TechnicalParameters,
                          Unit = equipment.Unit,
                          EquipmentType = equipment.EquipmentType.ToString(),
                          Brand = equipment.Brand,
                          Num = 1
                      };
                });

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
                //list = list.Where(i => i.Name.Contains(this.txtName.Text.Trim()));
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

