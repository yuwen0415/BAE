using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using ProjectDesigner.Domain.Equipment;
using EBA.Helpers;
using ProjectDesigner.TrafficAndEventCollection;

namespace ProjectDesigner.Website.Equipment
{
    public partial class TrafficAndEventCollectionEdit : TPageBase
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        ITrafficAndEventCollection EditModel
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
                this.EditModel = this.EntityContext.Value.TrafficAndEventCollections.NewEntity();
                //this.EntityContext.Value.Materials.DeleteAll(this.EntityContext.Value.Materials.AsQuerybale.Where(i => i.ParentId == this.SelectedId).ToList());
            }
        }

        protected override void OnEdit()
        {
            if (!IsPostBack)
            {
                this.EditModel = this.EntityContext.Value.SearchTrafficAndEventCollection(this.SelectedId);
                this.EntityContext.Value.Materials.DeleteAll(this.EntityContext.Value.Materials.AsQuerybale.Where(i => i.ParentId == this.SelectedId).ToList());
                this.EntityContext.Value.AddNewMaterials(this.EditModel.AccessorialMaterials);
                this.EntityContext.Value.AddNewMaterials(this.EditModel.ConstructionMaterials);
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
                this.EditModel = this.EntityContext.Value.SearchTrafficAndEventCollection(this.SelectedId);
                this.txtName.Text = this.EditModel.Name;
                this.txtBrand.Text = this.EditModel.Brand;
                this.txtPrice.Text = this.EditModel.Price.ToString();
                this.txtPillar.Text = this.EditModel.Pillar == null ? "" : this.EditModel.Pillar.Name;
                this.txtFoundation.Text = this.EditModel.Foundation == null ? "" : this.EditModel.Foundation.Name;
                this.DropDownListType.SelectedIndex = (int)this.EditModel.Type;
                this.DropDownListConnection.SelectedIndex = (int)this.EditModel.Connection;
                this.txtProductType.Text = this.EditModel.ProductType;
                this.txtTechnicalParameters.Text = this.EditModel.TechnicalParameters;
                this.txtTrafficAndEventCollection.Text = this.EditModel.TrafficAndEventCollectionEquipment.Name;
                this.DropDownListTrafficAndEventCollectionEquipmentNum.Text = this.EditModel.TrafficAndEventCollectionEquipmentNum.ToString();
                this.DropListTrafficAndEventCollectionEquipmentType.SelectedIndex = (int)this.EditModel.TrafficAndEventCollectionEquipmentType;
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
                this.EditModel = this.EntityContext.Value.SearchTrafficAndEventCollection(this.SelectedId);
            }
            else
            {
                this.EditModel = this.EntityContext.Value.TrafficAndEventCollections.NewEntity();
                this.EditModel.Id = Guid.NewGuid().ToString("N");
            }
            this.EditModel.Name = this.txtName.Text;
            this.EditModel.Brand = this.txtBrand.Text;
            this.EditModel.Price = this.EditModel.Price = this.CalculatePrice(this.EditModel.Id);

            this.EditModel.Pillar = string.IsNullOrEmpty(this.txtPillar.Text) ? null :
                                       this.EntityContext.Value.Pillars.AsQuerybale
                                                                       .Where(i => i.Name == this.txtPillar.Text)
                                                                       .FirstOrDefault();
            this.EditModel.Foundation = string.IsNullOrEmpty(this.txtFoundation.Text) ? null :
                                       this.EntityContext.Value.Foundations.AsQuerybale
                                                                           .Where(i => i.Name == this.txtFoundation.Text)
                                                                           .FirstOrDefault();
            this.EditModel.TrafficAndEventCollectionEquipment = this.EntityContext.Value.SearchTrafficAndEventCollectionEquipment(this.txtTrafficAndEventCollection.Text);
            this.EditModel.TrafficAndEventCollectionEquipmentNum = int.Parse(this.DropDownListTrafficAndEventCollectionEquipmentNum.Text);
            this.EditModel.TrafficAndEventCollectionEquipmentType = (TrafficAndEventCollectionEquipmentType)this.DropListTrafficAndEventCollectionEquipmentType.SelectedIndex;
            this.EditModel.Type = (TrafficAndEventCollectionType)this.DropDownListType.SelectedIndex;

            this.EditModel.Connection = (Connection)this.DropDownListConnection.SelectedIndex;

            this.EditModel.ProductType = this.txtProductType.Text;

            this.EditModel.TechnicalParameters = this.txtTechnicalParameters.Text;

            this.EditModel.Unit = "套";

            this.EditModel.IconPath = this.Request["listAttachments_id"];

            this.EditModel.AccessorialMaterials = this.EntityContext.Value
                                                        .SearchMaterials(this.EditModel.Id)
                                                        .Where(i => i.EquipmentType == EquipmentType.AccessorialMaterial)
                                                        .ToList()
                                                        .ChangeMaterialClassTo();

            this.EditModel.ConstructionMaterials = this.EntityContext.Value
                                                                     .SearchMaterials(this.EditModel.Id)
                                                                     .Where(i => i.EquipmentType == EquipmentType.ConstructionMaterial)
                                                                     .ToList()
                                                                     .ChangeMaterialClassTo();
        }


        protected override object UpdateObject()
        {
            this.EntityContext.Value.UpdateElectronicPolice(this.EditModel);
            return this.EditModel;
        }

        protected override object AddObject()
        {
            this.EntityContext.Value.AddElectronicPolice(this.EditModel);
            return this.EditModel;
        }

        public object Save()
        {
            try
            {
                this.EntityContext.Value.BeginTransaction();
                this.FillData();
                this.SaveObject<ITrafficAndEventCollection>();
                this.EntityContext.Value.CommitTransaction();
                return new
                {
                    Id = this.EditModel.Id,
                    Name = this.EditModel.Name,
                    Price = this.EditModel.Price,
                    Brand = this.EditModel.Brand,
                    Type = this.EditModel.Type.ToString(),
                    Connection = this.EditModel.Connection.ToString(),
                    Foundation = this.EditModel.Foundation == null ? "" : this.EditModel.Foundation.Name,
                    Pillar = this.EditModel.Pillar == null ? "" : this.EditModel.Pillar.Name,
                    TrafficAndEventCollectionEquipment = this.EditModel.TrafficAndEventCollectionEquipment.Name,
                    TrafficAndEventCollectionEquipmentType = this.EditModel.TrafficAndEventCollectionEquipmentType,
                    TrafficAndEventCollectionEquipmentNum = this.EditModel.TrafficAndEventCollectionEquipmentNum,
                    ProductType = this.EditModel.ProductType,
                    TechnicalParameters = this.EditModel.TechnicalParameters
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

        public object FindPillar()
        {
            var query = this.EntityContext.Value.SearchPillars();
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
            var query = this.EntityContext.Value.SearchFoundations();
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

        public object FindSelectTrafficAndEventCollectionEquipment()
        {
            var query = this.EntityContext.Value.SearchTrafficAndEventCollectionEquipments((TrafficAndEventCollectionEquipmentType)this.DropListTrafficAndEventCollectionEquipmentType.SelectedIndex);
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
               });
        }

        List<IEquipment> _Materials_DataBase = null;
        List<IEquipment> Materials_DataBase
        {
            get
            {
                if (_Materials_DataBase == null)
                {
                    _Materials_DataBase = new List<IEquipment>();
                    _Materials_DataBase.AddRange(this.EntityContext.Value.SearchAccessorialMaterials().ToList());
                    _Materials_DataBase.AddRange(this.EntityContext.Value.SearchConstructionMaterials().ToList());
                }
                return _Materials_DataBase;
            }
        }

        protected override System.Collections.IEnumerable FetchData(string tableName, string[] orderby = null)
        {
            this.FillData();
            if (tableName == "equipmenttable")
            {
                var query = this.EntityContext.Value.SearchMaterials(this.EditModel.Id);

                if (this.txtEquipmentName.Text.HasValue())
                {
                    query = query.Where(i => i.Name.Contains(this.txtEquipmentName.Text.Trim()));
                }
                if (this.DropEquipmentType.Text != "0")
                {
                    var type = (EquipmentType)(int.Parse(this.DropEquipmentType.Text));
                    query = query.Where(i => i.EquipmentType == type);
                }
                return query.OrderBy(i => i.Name).OrderBy(orderby).Fetch(this.PageIndex, this.PageSize)
.Select(i => new
{
    Id = i.Id,
    Name = i.Name,
    EquipmentType = i.EquipmentType.ToString(),
    Price = i.Price,
    Brand = i.Brand,
    Num = i.Num
});
            }
            if (tableName == "databasetable")
            {
                var query = new List<IEquipment>();
                var constructionMaterials = this.EntityContext.Value.SearchConstructionMaterials().ToList();
                var accessorialMaterials = this.EntityContext.Value.SearchAccessorialMaterials().ToList();
                query.AddRange(constructionMaterials);
                query.AddRange(accessorialMaterials);
                if (this.txtEquipmentName.Text.HasValue())
                {
                    query = query.Where(i => i.Name.Contains(this.txtEquipmentName.Text.Trim())).ToList();
                }
                if (this.DropEquipmentType.Text != "0")
                {
                    var type = (EquipmentType)(int.Parse(this.DropEquipmentType.Text));
                    query = query.Where(i => i.EquipmentType == type).ToList();
                }

                return query.OrderBy(i => i.Name).Fetch(this.PageIndex, this.PageSize)
                .Select(i => new
                {
                    Id = i.Id,
                    Name = i.Name,
                    EquipmentType = i.EquipmentType.ToString(),
                    Price = i.Price,
                    Brand = i.Brand,
                    TechnicalParameters = i.TechnicalParameters
                });
            }
            else
            {
                var query = new List<IEquipment>();
                return query.OrderBy(i => i.Name).Fetch(this.PageIndex, this.PageSize)
                .Select(i => new
                {
                    Id = i.Id,
                    Name = i.Name,
                    EquipmentType = i.EquipmentType.ToString(),
                    Price = i.Price,
                    Brand = i.Brand,
                });
            }
        }

        public object AddMaterials()
        {
            var materialIds = this.Request.Form["dataBaseTableIds"].Split(new string[] { "," }, StringSplitOptions.RemoveEmptyEntries);
            var materails = new List<IMaterial>();
            foreach (var materialId in materialIds)
            {
                var newMaterial = this.EntityContext.Value.SearchMaterial(materialId, this.Request.Form["Id"]);
                if (newMaterial == null)
                {
                    var material = Materials_DataBase.Where(i => i.Id == materialId).FirstOrDefault();
                    this.EntityContext.Value.AddNewMaterial(material, double.Parse(string.IsNullOrEmpty(this.txtNum.Text) ? "0.0" : this.txtNum.Text), this.Request.Form["Id"]);
                    newMaterial = this.EntityContext.Value.SearchMaterial(materialId, this.Request.Form["Id"]);
                    materails.Add(newMaterial);
                }
                else if (newMaterial != null && newMaterial.ParentId == this.Request.Form["Id"])
                {
                    return null;
                }
            }
            return materails;
        }

        public object UpdateMaterial()
        {
            var material = this.EntityContext.Value.SearchMaterial(this.Request.Form["equipmentTableId"]);
            material.Num = double.Parse(string.IsNullOrEmpty(this.txtNum.Text) ? "0.0" : this.txtNum.Text);
            this.EntityContext.Value.UpdateMaterial(material);
            return new
            {
                Id = material.Id,
                Name = material.Name,
                EquipmentType = material.EquipmentType.ToString(),
                Price = material.Price,
                Brand = material.Brand,
                Num = material.Num
            };
        }

        public override bool DeleteRows()
        {
            foreach (var id in this.GetSelectedItems())
            {
                this.EntityContext.Value.DeleteMaterial(id);
            }
            this.EntityContext.Value.SubmitChanges();
            return true;
        }

        public decimal CalculatePrice(string id)
        {
            decimal price = 0;
            var trafficAndEventCollectionEquipment = this.EntityContext.Value.SearchTrafficAndEventCollectionEquipments().Where(i => i.Name == this.txtEquipmentName.Text).FirstOrDefault();
            if (trafficAndEventCollectionEquipment != null)
                price += trafficAndEventCollectionEquipment.Price.Value * decimal.Parse(this.txtNum.Text);
            var pillar = this.EntityContext.Value.SearchPillars().Where(i => i.Name == this.txtPillar.Text).FirstOrDefault();
            if (pillar != null)
                price += pillar.Price.Value;
            var foundation = this.EntityContext.Value.SearchFoundations().Where(i => i.Name == this.txtFoundation.Text).FirstOrDefault();
            if (foundation != null)
                price += foundation.Price.Value;

            foreach (var ac in this.EntityContext.Value.SearchMaterials(id).ToList())
            {
                price += ac.Price.Value * decimal.Parse(ac.Num.Value.ToString());
            }

            return price;
        }

        public object RefreshProjectPrice()
        {
            return CalculatePrice(this.Request.Form["EquipmentId"]);
        }
    }
}