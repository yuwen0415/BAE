using EBA.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using EBA.Data;
using EBA.Modules;
using ProjectDesigner;

namespace ProjectDesigner.Domain.Equipment
{
    public static class ConstructionMaterialEx
    {
        public static IHitable<IEquipment> SearchConstructionMaterials(this IDataContext dataContext)
        {
            return dataContext.ConstructionMaterials
                .AsQuerybale
                .OrderBy(i => i.Name)
                .AsHitable();
        }

        public static IEquipment SearchConstructionMaterial(this IDataContext dataContext, string id)
        {
            if (string.IsNullOrEmpty(id))
                return null;
            return dataContext.ConstructionMaterials
                .AsQuerybale
                .Where(i => i.Id == id)
                .FirstOrDefault();
        }

        public static void DeleteConstructionMaterial(this IDataContext dataContext, string id)
        {
            var ConstructionMaterial = dataContext.SearchConstructionMaterial(id);
            if (ConstructionMaterial != null)
            {
                dataContext.ConstructionMaterials.Delete(ConstructionMaterial);
            }
        }

        public static void UpdateConstructionMaterial(this IDataContext dataContext, IEquipment constructionMaterial)
        {
            dataContext.SubmitChanges();
        }
        public static void AddConstructionMaterial(this IDataContext dataContext, IEquipment constructionMaterial)
        {
            if (constructionMaterial != null && dataContext.ConstructionMaterials.AsQuerybale.Any(i => i.Id == constructionMaterial.Id))
            {
                throw new DuplicatedKeyException("代码[{0}]已经存在。");
            }
            constructionMaterial.EquipmentType = EquipmentType.Unknown;
            dataContext.ConstructionMaterials.Add(constructionMaterial);
            dataContext.SubmitChanges();
        }
    }
}
