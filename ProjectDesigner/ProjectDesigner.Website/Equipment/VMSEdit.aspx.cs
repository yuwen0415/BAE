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
                // this.EntityContext.Value.Materials.DeleteAll(this.EntityContext.Value.Materials.AsQuerybale.Where(i => i.ParentId == this.SelectedId).ToList());
            }
        }

        protected override void OnEdit()
        {
            if (!IsPostBack)
            {
                this.EditModel = this.EntityContext.Value.SearchVMS(this.SelectedId);
                this.EntityContext.Value.Materials.DeleteAll(this.EntityContext.Value.Materials.AsQuerybale.Where(i => i.ParentId == this.SelectedId).ToList());
                this.EntityContext.Value.SubmitChanges();
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
                this.txtProductType.Text = this.EditModel.ProductType;
                this.txtTechnicalParameters.Text = this.EditModel.TechnicalParameters;
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
            this.EditModel.Price = this.CalculatePrice(this.EditModel.Id);
            //string.IsNullOrEmpty(this.txtPrice.Text) ? decimal.Zero : decimal.Parse(this.txtPrice.Text);

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
            this.EditModel.ModuleCount = string.IsNullOrEmpty(this.txtModuleCount.Text) ? 0 : double.Parse(this.txtModuleCount.Text);
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

            this.EditModel.ProductType = this.txtProductType.Text;

            this.EditModel.TechnicalParameters = this.txtTechnicalParameters.Text;

            this.EditModel.Unit = "台";

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
                    Size = this.EditModel.Size == null ? "" : this.EditModel.Size.Width + "x" + this.EditModel.Size.Length,
                    Price = this.EditModel.Price,
                    Brand = this.EditModel.Brand,
                    Type = this.EditModel.Type == null ? "" : this.EditModel.Type.ToString(),
                    Connection = this.EditModel.Connection == null ? "" : this.EditModel.Connection.ToString(),
                    Foundation = this.EditModel.Foundation == null ? "" : this.EditModel.Foundation.Name,
                    Pillar = this.EditModel.Pillar == null ? "" : this.EditModel.Pillar.Name,
                    LEDModule = this.EditModel.LEDModule == null ? "" : this.EditModel.LEDModule.Name,
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

        public object FindLEDModule()
        {
            var query = this.EntityContext.Value.SearchLEDModules();
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
                    TechnicalParameters = i.TechnicalParameters
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
            var ledModule = this.EntityContext.Value.SearchLEDModules().Where(i => i.Name == this.txtModule.Text).FirstOrDefault();
            if (ledModule != null)
                price += ledModule.Price.Value * decimal.Parse(this.txtModuleCount.Text);
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