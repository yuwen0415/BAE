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
    public static class TrafficAndEventCollectionEquipmentEx
    {
        public static IHitable<ITrafficAndEventCollectionEquipment> SearchTrafficAndEventCollectionEquipments(this IDataContext dataContext, TrafficAndEventCollectionEquipmentType type)
        {
            return dataContext.GetTrafficAndEventCollectionEquipments(type)
                .AsQuerybale
                .OrderBy(i => i.Name)
                .AsHitable();
        }

        public static ITrafficAndEventCollectionEquipment SearchTrafficAndEventCollectionEquipment(this IDataContext dataContext, string id, TrafficAndEventCollectionEquipmentType type)
        {
            if (string.IsNullOrEmpty(id))
                return null;
            return dataContext.GetTrafficAndEventCollectionEquipments(type)
                .AsQuerybale
                .Where(i => i.Id == id)
                .FirstOrDefault();
        }

        public static void DeleteTrafficAndEventCollectionEquipment(this IDataContext dataContext, string id, TrafficAndEventCollectionEquipmentType type)
        {
            var trafficAndEventCollectionEquipment = dataContext.SearchTrafficAndEventCollectionEquipment(id,type);
            if (trafficAndEventCollectionEquipment != null)
            {
                dataContext.GetTrafficAndEventCollectionEquipments(type).Delete(trafficAndEventCollectionEquipment);
            }
        }

        public static void UpdateTrafficAndEventCollectionEquipment(this IDataContext dataContext, IVideoSurveillance VideoSurveillance)
        {
            dataContext.SubmitChanges();
        }
        public static void AddVideoSurveillance(this IDataContext dataContext, ITrafficAndEventCollectionEquipment trafficAndEventCollectionEquipment, TrafficAndEventCollectionEquipmentType type)
        {
            if (trafficAndEventCollectionEquipment != null && dataContext.GetTrafficAndEventCollectionEquipments(type).AsQuerybale.Any(i => i.Id == trafficAndEventCollectionEquipment.Id))
            {
                throw new DuplicatedKeyException("代码[{0}]已经存在。");
            }
            trafficAndEventCollectionEquipment.EquipmentType = EquipmentType.TrafficAndEventCollection;
            dataContext.GetTrafficAndEventCollectionEquipments(type).Add(trafficAndEventCollectionEquipment);
            dataContext.SubmitChanges();
        }

        public static IRepository<ITrafficAndEventCollectionEquipment> GetTrafficAndEventCollectionEquipments(this IDataContext dataContext, TrafficAndEventCollectionEquipmentType type)
        {
            IRepository<ITrafficAndEventCollectionEquipment> trafficAndEventCollectionEquipments = null;
            switch ((int)type)
            {
                case 0:
                    trafficAndEventCollectionEquipments = dataContext.Geomagnetics as IRepository<ITrafficAndEventCollectionEquipment>;
                    break;
                case 1:
                    trafficAndEventCollectionEquipments = dataContext.Coils as IRepository<ITrafficAndEventCollectionEquipment>;
                    break;
                case 2:
                    trafficAndEventCollectionEquipments = dataContext.VideoSurveillances as IRepository<ITrafficAndEventCollectionEquipment>;
                    break;
                case 3:
                    trafficAndEventCollectionEquipments = dataContext.RFIDs as IRepository<ITrafficAndEventCollectionEquipment>;
                    break;
                case 4:
                    trafficAndEventCollectionEquipments = dataContext.Microwaves as IRepository<ITrafficAndEventCollectionEquipment>;
                    break;
            }
            return trafficAndEventCollectionEquipments;
        }
    }
}
