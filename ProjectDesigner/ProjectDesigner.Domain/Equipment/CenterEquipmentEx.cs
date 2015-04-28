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
    public static class CenterEquipmentEx
    {
        public static IHitable<ICenterEquipment> SearchCenterEquipments(this IDataContext dataContext)
        {
            return dataContext.CenterEquipments
                .AsQuerybale
                .OrderBy(i => i.Name)
                .AsHitable();
        }

        public static ICenterEquipment SearchCenterEquipment(this IDataContext dataContext, string id)
        {
            if (string.IsNullOrEmpty(id))
                return null;
            return dataContext.CenterEquipments
                .AsQuerybale
                .Where(i => i.Id == id)
                .FirstOrDefault();
        }

        public static void DeleteCenterEquipment(this IDataContext dataContext, string id)
        {
            var centerEquipment = dataContext.SearchCenterEquipment(id);
            if (centerEquipment != null)
            {
                dataContext.CenterEquipments.Delete(centerEquipment);
            }
        }

        public static void UpdateCenterEquipment(this IDataContext dataContext, ICenterEquipment centerEquipment)
        {
            dataContext.SubmitChanges();
        }
        public static void AddCenterEquipment(this IDataContext dataContext, ICenterEquipment centerEquipment)
        {
            if (centerEquipment != null && dataContext.CenterEquipments.AsQuerybale.Any(i => i.Id == centerEquipment.Id))
            {
                throw new DuplicatedKeyException("代码[{0}]已经存在。");
            }
            centerEquipment.EquipmentType = EquipmentType.CenterEquipment;
            dataContext.CenterEquipments.Add(centerEquipment);
            dataContext.SubmitChanges();
        }

    }
}
