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
    public static class RFIDEx
    {
        public static IHitable<IRFID> SearchRFIDs(this IDataContext dataContext)
        {
            return dataContext.RFIDs
                .AsQuerybale
                .OrderBy(i => i.Name)
                .AsHitable();
        }

        public static IRFID SearchRFID(this IDataContext dataContext, string id)
        {
            if (string.IsNullOrEmpty(id))
                return null;
            return dataContext.RFIDs
                .AsQuerybale
                .Where(i => i.Id == id)
                .FirstOrDefault();
        }

        public static void DeleteRFID(this IDataContext dataContext, string id)
        {
            var trafficAndEventCollectionEquipment = dataContext.SearchRFID(id);
            if (trafficAndEventCollectionEquipment != null)
            {
                dataContext.RFIDs.Delete(trafficAndEventCollectionEquipment);
            }
        }

        public static void UpdateRFID(this IDataContext dataContext, IRFID trafficAndEventCollectionEquipment)
        {
            dataContext.SubmitChanges();
        }
        public static void AddRFID(this IDataContext dataContext, IRFID trafficAndEventCollectionEquipment)
        {
            if (trafficAndEventCollectionEquipment != null && dataContext.RFIDs.AsQuerybale.Any(i => i.Id == trafficAndEventCollectionEquipment.Id))
            {
                throw new DuplicatedKeyException("代码[{0}]已经存在。");
            }
            trafficAndEventCollectionEquipment.EquipmentType = EquipmentType.TrafficAndEventCollection;
            dataContext.RFIDs.Add(trafficAndEventCollectionEquipment);
            dataContext.SubmitChanges();
        }
    }
}
