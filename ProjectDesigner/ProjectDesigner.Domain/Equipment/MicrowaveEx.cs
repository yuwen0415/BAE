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
    public static class MicrowaveEx
    {
        public static IHitable<IMicrowave> SearchMicrowaves(this IDataContext dataContext)
        {
            return dataContext.Microwaves
                .AsQuerybale
                .OrderBy(i => i.Name)
                .AsHitable();
        }

        public static IMicrowave SearchMicrowave(this IDataContext dataContext, string id)
        {
            if (string.IsNullOrEmpty(id))
                return null;
            return dataContext.Microwaves
                .AsQuerybale
                .Where(i => i.Id == id)
                .FirstOrDefault();
        }

        public static void DeleteMicrowave(this IDataContext dataContext, string id)
        {
            var trafficAndEventCollectionEquipment = dataContext.SearchMicrowave(id);
            if (trafficAndEventCollectionEquipment != null)
            {
                dataContext.Microwaves.Delete(trafficAndEventCollectionEquipment);
            }
        }

        public static void UpdateMicrowave(this IDataContext dataContext, IMicrowave trafficAndEventCollectionEquipment)
        {
            dataContext.SubmitChanges();
        }
        public static void AddMicrowave(this IDataContext dataContext, IMicrowave trafficAndEventCollectionEquipment)
        {
            if (trafficAndEventCollectionEquipment != null && dataContext.Coils.AsQuerybale.Any(i => i.Id == trafficAndEventCollectionEquipment.Id))
            {
                throw new DuplicatedKeyException("代码[{0}]已经存在。");
            }
            trafficAndEventCollectionEquipment.EquipmentType = EquipmentType.TrafficAndEventCollection;
            dataContext.Microwaves.Add(trafficAndEventCollectionEquipment);
            dataContext.SubmitChanges();
        }
    }
}
