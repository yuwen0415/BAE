using EBA.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using EBA.Data;
using EBA.Modules;
using ProjectDesigner;
using System.Collections;
using System.Linq.Expressions;
using System.Reflection;

namespace ProjectDesigner.Domain.Equipment
{
    public static class AccessorialMaterialEx
    {
        public static IHitable<IEquipment> SearchAccessorialMaterials(this IDataContext dataContext)
        {
            return dataContext.AccessorialMaterials
                .AsQuerybale
                .OrderBy(i => i.Name)
                .AsHitable();
        }

        public static IEquipment SearchAccessorialMaterial(this IDataContext dataContext, string id)
        {
            if (string.IsNullOrEmpty(id))
                return null;
            return dataContext.AccessorialMaterials
                .AsQuerybale
                .Where(i => i.Id == id)
                .FirstOrDefault();
        }

        public static void DeleteAccessorialMaterial(this IDataContext dataContext, string id)
        {
            var AccessorialMaterial = dataContext.SearchAccessorialMaterial(id);
            if (AccessorialMaterial != null)
            {
                dataContext.AccessorialMaterials.Delete(AccessorialMaterial);
            }
        }

        public static void UpdateAccessorialMaterial(this IDataContext dataContext, IEquipment AccessorialMaterial)
        {
            dataContext.SubmitChanges();
        }
        public static void AddAccessorialMaterial(this IDataContext dataContext, IEquipment AccessorialMaterial)
        {
            if (AccessorialMaterial != null && dataContext.AccessorialMaterials.AsQuerybale.Any(i => i.Id == AccessorialMaterial.Id))
            {
                throw new DuplicatedKeyException("代码[{0}]已经存在。");
            }
            AccessorialMaterial.EquipmentType = EquipmentType.AccessorialMaterial;
            dataContext.AccessorialMaterials.Add(AccessorialMaterial);
            dataContext.SubmitChanges();
        }

        public static Hits<IMaterial> Fetch(this IEnumerable<IMaterial> collections, int index = 1, int size = int.MaxValue)
        {
            var totalHits = collections.Count();
            var skip = (index - 1) * size;
            var hits = new Hits<IMaterial>(collections.Skip(skip).Take(size));

            hits.TotalHits = totalHits;

            hits.TotalPages = (int)Math.Ceiling((decimal)totalHits / (decimal)size);

            return hits;
        }

        public static Hits<IEquipment> Fetch(this IEnumerable<IEquipment> collections, int index = 1, int size = int.MaxValue)
        {
            var totalHits = collections.Count();
            var skip = (index - 1) * size;
            var hits = new Hits<IEquipment>(collections.Skip(skip).Take(size));

            hits.TotalHits = totalHits;

            hits.TotalPages = (int)Math.Ceiling((decimal)totalHits / (decimal)size);

            return hits;
        }

    }
}
