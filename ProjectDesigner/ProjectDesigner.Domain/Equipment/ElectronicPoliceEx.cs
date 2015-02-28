using EBA.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using EBA.Data;
using EBA.Modules;
using ProjectDesigner.ElectronicPolice;

namespace ProjectDesigner.Domain.Equipment
{
    public static class ElectronicPoliceEx
    {
        public static IHitable<IElectronicPolice> SearchElectronicPolices(this IDataContext dataContext)
        {
            return dataContext.ElectronicPolices
                .AsQuerybale
                .OrderBy(i => i.Name)
                .AsHitable();
        }

        public static IElectronicPolice SearchElectronicPolice(this IDataContext dataContext, string id)
        {
            if (string.IsNullOrEmpty(id))
                return null;
            return dataContext.ElectronicPolices
                .AsQuerybale
                .Where(i => i.Id == id)
                .FirstOrDefault();
        }

        public static void DeleteElectronicPolice(this IDataContext dataContext, string id)
        {
            var electronicPolice = dataContext.SearchElectronicPolice(id);
            if (electronicPolice != null)
            {
                dataContext.ElectronicPolices.Delete(electronicPolice);
            }
        }

        public static void UpdateElectronicPolice(this IDataContext dataContext, IElectronicPolice electronicPolice)
        {
            dataContext.SubmitChanges();
        }
        public static void AddElectronicPolice(this IDataContext dataContext, IElectronicPolice electronicPolice)
        {
            if (electronicPolice != null && dataContext.ElectronicPolices.AsQuerybale.Any(i => i.Id == electronicPolice.Id))
            {
                throw new DuplicatedKeyException("代码[{0}]已经存在。");
            }
            electronicPolice.EquipmentType = EquipmentType.ElectronicPolice;
            dataContext.ElectronicPolices.Add(electronicPolice);
            dataContext.SubmitChanges();
        }
    }
}
