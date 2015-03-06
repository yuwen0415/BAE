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
    public static class GeomagneticEx
    {
        public static IHitable<IGeomagnetic> SearchGeomagnetics(this IDataContext dataContext)
        {
            return dataContext.Geomagnetics
                .AsQuerybale
                .OrderBy(i => i.Name)
                .AsHitable();
        }

        public static IGeomagnetic SearchGeomagnetic(this IDataContext dataContext, string id)
        {
            if (string.IsNullOrEmpty(id))
                return null;
            return dataContext.Geomagnetics
                .AsQuerybale
                .Where(i => i.Id == id)
                .FirstOrDefault();
        }

        public static void DeleteGeomagnetic(this IDataContext dataContext, string id)
        {
            var trafficAndEventCollectionEquipment = dataContext.SearchGeomagnetic(id);
            if (trafficAndEventCollectionEquipment != null)
            {
                dataContext.Geomagnetics.Delete(trafficAndEventCollectionEquipment);
            }
        }

        public static void UpdateGeomagnetic(this IDataContext dataContext, IGeomagnetic trafficAndEventCollectionEquipment)
        {
            dataContext.SubmitChanges();
        }
        public static void AddGeomagnetic(this IDataContext dataContext, IGeomagnetic trafficAndEventCollectionEquipment)
        {
            if (trafficAndEventCollectionEquipment != null && dataContext.Geomagnetics.AsQuerybale.Any(i => i.Id == trafficAndEventCollectionEquipment.Id))
            {
                throw new DuplicatedKeyException("代码[{0}]已经存在。");
            }
            trafficAndEventCollectionEquipment.EquipmentType = EquipmentType.TrafficAndEventCollection;
            dataContext.Geomagnetics.Add(trafficAndEventCollectionEquipment);
            dataContext.SubmitChanges();
        }
    }
}
