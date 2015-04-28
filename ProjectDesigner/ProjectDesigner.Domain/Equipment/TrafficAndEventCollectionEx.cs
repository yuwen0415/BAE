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

        public static ITrafficAndEventCollectionEquipment SearchTrafficAndEventCollectionEquipment(this IDataContext dataContext, string equipmentname)
        {
            if (string.IsNullOrEmpty(equipmentname))
                return null;
            var trafficAndEventCollectionEquipments = new List<ITrafficAndEventCollectionEquipment>();
            trafficAndEventCollectionEquipments.AddRange(dataContext.Coils.AsQuerybale.ToList());
            trafficAndEventCollectionEquipments.AddRange(dataContext.Geomagnetics.AsQuerybale.ToList());
            trafficAndEventCollectionEquipments.AddRange(dataContext.Microwaves.AsQuerybale.ToList());
            trafficAndEventCollectionEquipments.AddRange(dataContext.RFIDs.AsQuerybale.ToList());
            trafficAndEventCollectionEquipments.AddRange(dataContext.VideoSurveillances.AsQuerybale.ToList());
            var test = trafficAndEventCollectionEquipments.Where(i => i.Name == equipmentname).FirstOrDefault();
            return test;
        }

        public static List<ITrafficAndEventCollectionEquipment> SearchTrafficAndEventCollectionEquipments(this IDataContext dataContext)
        {
            var trafficAndEventCollectionEquipments = new List<ITrafficAndEventCollectionEquipment>();
            trafficAndEventCollectionEquipments.AddRange(dataContext.Coils.AsQuerybale.ToList());
            trafficAndEventCollectionEquipments.AddRange(dataContext.Geomagnetics.AsQuerybale.ToList());
            trafficAndEventCollectionEquipments.AddRange(dataContext.Microwaves.AsQuerybale.ToList());
            trafficAndEventCollectionEquipments.AddRange(dataContext.RFIDs.AsQuerybale.ToList());
            trafficAndEventCollectionEquipments.AddRange(dataContext.VideoSurveillances.AsQuerybale.ToList());
            return trafficAndEventCollectionEquipments;
        }

        public static IHitable<ITrafficAndEventCollectionEquipment> SearchTrafficAndEventCollectionEquipments(this IDataContext dataContext, TrafficAndEventCollectionEquipmentType equipmentType)
        {

            switch (equipmentType)
            {
                case TrafficAndEventCollectionEquipmentType.GEOMAGNETIC:
                    return dataContext.Geomagnetics
                                      .AsQuerybale
                                      .OrderBy(i => i.Name)
                                      .AsHitable<ITrafficAndEventCollectionEquipment>();
                case TrafficAndEventCollectionEquipmentType.COIL:
                    return dataContext.Coils
                                      .AsQuerybale
                                      .OrderBy(i => i.Name)
                                      .AsHitable<ITrafficAndEventCollectionEquipment>();
                case TrafficAndEventCollectionEquipmentType.VIDEO_SURVEILLANCE:
                    return dataContext.VideoSurveillances
                                      .AsQuerybale
                                      .OrderBy(i => i.Name)
                                      .AsHitable<ITrafficAndEventCollectionEquipment>();
                case TrafficAndEventCollectionEquipmentType.RFID:
                    return dataContext.RFIDs
                                      .AsQuerybale
                                      .OrderBy(i => i.Name)
                                      .AsHitable<ITrafficAndEventCollectionEquipment>();
                case TrafficAndEventCollectionEquipmentType.MICROWAVE:
                    return dataContext.Microwaves
                                      .AsQuerybale
                                      .OrderBy(i => i.Name)
                                      .AsHitable<ITrafficAndEventCollectionEquipment>();
                default:
                    return null;
            }

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
