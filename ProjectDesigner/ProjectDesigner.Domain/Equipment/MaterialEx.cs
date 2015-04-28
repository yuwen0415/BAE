using EBA.Linq;
using ProjectDesigner.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ProjectDesigner.Domain.Equipment
{
    public static class MaterialEx
    {
        public static IHitable<IMaterial> SearchMaterials(this IDataContext dataContext, string parentId)
        {
            return dataContext.Materials
                .AsQuerybale
                .Where(i => i.ParentId == parentId)
                .OrderBy(i => i.Name)
                .AsHitable();
        }

        public static IMaterial SearchMaterial(this IDataContext dataContext, string id)
        {
            return dataContext.Materials
               .AsQuerybale
               .Where(i => i.Id == id)
               .FirstOrDefault();
        }

        public static IMaterial SearchMaterial(this IDataContext dataContext, string materialId, string parentId)
        {
            return dataContext.Materials
                .AsQuerybale
                .Where(i => i.MaterialId == materialId && i.ParentId == parentId)
                .FirstOrDefault();
        }

        public static IMaterial SearchMaterialbyName(this IDataContext dataContext, string name)
        {
            return dataContext.Materials
                .AsQuerybale
                .Where(i => i.Id == name)
                .FirstOrDefault();
        }

        public static void AddNewMaterial(this IDataContext dataContext, IEquipment equipment, double num, string parentId)
        {
            var newMaterial = dataContext.Materials.NewEntity();
            newMaterial.Id = Guid.NewGuid().ToString("N");
            newMaterial.MaterialId = equipment.Id;
            newMaterial.Name = equipment.Name;
            newMaterial.Price = equipment.Price;
            newMaterial.EquipmentType = equipment.EquipmentType;
            newMaterial.Brand = equipment.Brand;
            newMaterial.Num = num;
            newMaterial.ProductType = equipment.ProductType;
            newMaterial.TechnicalParameters = equipment.TechnicalParameters;
            newMaterial.Unit = equipment.Unit;
            newMaterial.ParentId = parentId;
            dataContext.Materials.Add(newMaterial);
            dataContext.SubmitChanges();
        }

        public static void AddNewMaterial(this IDataContext dataContext, IMaterial equipment)
        {
            var newMaterial = dataContext.Materials.NewEntity();
            newMaterial.Id = Guid.NewGuid().ToString("N");
            newMaterial.MaterialId = equipment.Id;
            newMaterial.Name = equipment.Name;
            newMaterial.Price = equipment.Price;
            newMaterial.EquipmentType = equipment.EquipmentType;
            newMaterial.Brand = equipment.Brand;
            newMaterial.Num = equipment.Num;
            newMaterial.ProductType = equipment.ProductType;
            newMaterial.TechnicalParameters = equipment.TechnicalParameters;
            newMaterial.Unit = equipment.Unit;
            newMaterial.ParentId = equipment.ParentId;
            dataContext.Materials.Add(newMaterial);
            dataContext.SubmitChanges();
        }

        public static void AddNewMaterials(this IDataContext dataContext, List<MaterialOfEquipment> equipments)
        {
            foreach (var equipment in equipments)
            {
                var newMaterial = dataContext.Materials.NewEntity();
                newMaterial.Id = Guid.NewGuid().ToString("N");
                newMaterial.MaterialId = equipment.Id;
                newMaterial.Name = equipment.Name;
                newMaterial.Price = equipment.Price;
                newMaterial.EquipmentType = equipment.EquipmentType;
                newMaterial.Brand = equipment.Brand;
                newMaterial.Num = equipment.Num;
                newMaterial.ProductType = equipment.ProductType;
                newMaterial.TechnicalParameters = equipment.TechnicalParameters;
                newMaterial.Unit = equipment.Unit;
                newMaterial.ParentId = equipment.ParentId;
                dataContext.Materials.Add(newMaterial);
            }
            dataContext.SubmitChanges();
        }

        public static void DeleteMaterial(this IDataContext datacontext, string equipmentId)
        {
            var row = datacontext.Materials
                                 .AsQuerybale
                                 .Where(i => i.Id == equipmentId)
                                 .FirstOrDefault();
            datacontext.Materials.Delete(row);
        }

        public static void UpdateMaterial(this IDataContext datacontext, IMaterial material)
        {
            datacontext.SubmitChanges();
        }

        public static MaterialOfEquipment ChangeMaterialClassTo(this IMaterial material)
        {
            var materialOfEquipment = new MaterialOfEquipment();
            materialOfEquipment.Id = material.Id;
            materialOfEquipment.MaterialId = material.MaterialId;
            materialOfEquipment.Name = material.Name;
            materialOfEquipment.Price = material.Price;
            materialOfEquipment.EquipmentType = (EquipmentType)material.EquipmentType;
            materialOfEquipment.Brand = material.Brand;
            materialOfEquipment.Num = material.Num;
            materialOfEquipment.ProductType = material.ProductType;
            materialOfEquipment.TechnicalParameters = material.TechnicalParameters;
            materialOfEquipment.Unit = material.Unit;
            materialOfEquipment.ParentId = material.ParentId;
            return materialOfEquipment;
        }

        public static List<MaterialOfEquipment> ChangeMaterialClassTo(this List<IMaterial> materials)
        {
            var materialsOfEquipment = new List<MaterialOfEquipment>();
            foreach (var material in materials)
            {
                var materialOfEquipment = new MaterialOfEquipment();
                materialOfEquipment.Id = material.Id;
                materialOfEquipment.MaterialId = material.MaterialId;
                materialOfEquipment.Name = material.Name;
                materialOfEquipment.Price = material.Price;
                materialOfEquipment.EquipmentType = (EquipmentType)material.EquipmentType;
                materialOfEquipment.Brand = material.Brand;
                materialOfEquipment.Num = material.Num;
                materialOfEquipment.ProductType = material.ProductType;
                materialOfEquipment.TechnicalParameters = material.TechnicalParameters;
                materialOfEquipment.Unit = material.Unit;
                materialOfEquipment.ParentId = material.ParentId;
                materialsOfEquipment.Add(materialOfEquipment);
            }
            return materialsOfEquipment;
        }

    }
}
