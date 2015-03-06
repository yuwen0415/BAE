using EBA.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using EBA.Data;
using EBA.Modules;
using ProjectDesigner.TrafficAndEventCollection;

namespace ProjectDesigner.Domain.Equipment
{
    public static class CoilEx
    {
        public static IHitable<ICoil> SearchCoils(this IDataContext dataContext)
        {
            return dataContext.Coils
                .AsQuerybale
                .OrderBy(i => i.Name)
                .AsHitable();
        }

        public static ICoil SearchCoil(this IDataContext dataContext, string id)
        {
            if (string.IsNullOrEmpty(id))
                return null;
            return dataContext.Coils
                .AsQuerybale
                .Where(i => i.Id == id)
                .FirstOrDefault();
        }

        public static void DeleteCoil(this IDataContext dataContext, string id)
        {
            var trafficAndEventCollectionEquipment = dataContext.SearchCoil(id);
            if (trafficAndEventCollectionEquipment != null)
            {
                dataContext.Coils.Delete(trafficAndEventCollectionEquipment);
            }
        }

        public static void UpdateCoil(this IDataContext dataContext, ICoil trafficAndEventCollectionEquipment)
        {
            dataContext.SubmitChanges();
        }
        public static void AddCoil(this IDataContext dataContext, ICoil trafficAndEventCollectionEquipment)
        {
            if (trafficAndEventCollectionEquipment != null && dataContext.Coils.AsQuerybale.Any(i => i.Id == trafficAndEventCollectionEquipment.Id))
            {
                throw new DuplicatedKeyException("代码[{0}]已经存在。");
            }
            trafficAndEventCollectionEquipment.EquipmentType = EquipmentType.TrafficAndEventCollection;
            dataContext.Coils.Add(trafficAndEventCollectionEquipment);
            dataContext.SubmitChanges();
        }
    }
}
