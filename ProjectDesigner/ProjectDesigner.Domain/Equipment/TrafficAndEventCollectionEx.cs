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
    public static class TrafficAndEventCollectionEx
    {
        public static IHitable<ITrafficAndEventCollection> SearchTrafficAndEventCollections(this IDataContext dataContext)
        {
            return dataContext.TrafficAndEventCollections
                .AsQuerybale
                .OrderBy(i => i.Name)
                .AsHitable();
        }

        public static ITrafficAndEventCollection SearchTrafficAndEventCollection(this IDataContext dataContext, string id)
        {
            if (string.IsNullOrEmpty(id))
                return null;
            return dataContext.TrafficAndEventCollections
                .AsQuerybale
                .Where(i => i.Id == id)
                .FirstOrDefault();
        }

        public static void DeleteTrafficAndEventCollection(this IDataContext dataContext, string id)
        {
            var trafficAndEventCollection = dataContext.SearchTrafficAndEventCollection(id);
            if (trafficAndEventCollection != null)
            {
                dataContext.TrafficAndEventCollections.Delete(trafficAndEventCollection);
            }
        }

        public static void UpdateElectronicPolice(this IDataContext dataContext, ITrafficAndEventCollection trafficAndEventCollection)
        {
            dataContext.SubmitChanges();
        }
        public static void AddElectronicPolice(this IDataContext dataContext, ITrafficAndEventCollection trafficAndEventCollection)
        {
            if (trafficAndEventCollection != null && dataContext.ElectronicPolices.AsQuerybale.Any(i => i.Id == trafficAndEventCollection.Id))
            {
                throw new DuplicatedKeyException("代码[{0}]已经存在。");
            }
            trafficAndEventCollection.EquipmentType = EquipmentType.ElectronicPolice;
            dataContext.TrafficAndEventCollections.Add(trafficAndEventCollection);
            dataContext.SubmitChanges();
        }
    }
}
