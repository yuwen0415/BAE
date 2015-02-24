using EBA.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using EBA.Data;
using EBA.Modules;
using ProjectDesigner.TrafficVideoSurveillance;

namespace ProjectDesigner.Domain.Equipment
{
    public static class TrafficVideoSurveillanceEx
    {
        public static IHitable<ITrafficVideoSurveillance> SearchTrafficVideoSurveillances(this IDataContext dataContext)
        {
            return dataContext.TrafficVideoSurveillances
                .AsQuerybale
                .OrderBy(i => i.Name)
                .AsHitable();
        }

        public static ITrafficVideoSurveillance SearchTrafficVideoSurveillance(this IDataContext dataContext, string id)
        {
            if (string.IsNullOrEmpty(id))
                return null;
            return dataContext.TrafficVideoSurveillances
                .AsQuerybale
                .Where(i => i.Id == id)
                .FirstOrDefault();
        }

        public static void DeleteTrafficVideoSurveillance(this IDataContext dataContext, string id)
        {
            var trafficVideoSurveillance = dataContext.SearchTrafficVideoSurveillance(id);
            if (trafficVideoSurveillance != null)
            {
                dataContext.TrafficVideoSurveillances.Delete(trafficVideoSurveillance);
            }
        }

        public static void UpdateTrafficVideoSurveillance(this IDataContext dataContext, ITrafficVideoSurveillance trafficVideoSurveillance)
        {
            dataContext.SubmitChanges();
        }
        public static void AddTrafficVideoSurveillance(this IDataContext dataContext, ITrafficVideoSurveillance trafficVideoSurveillance)
        {
            if (trafficVideoSurveillance != null && dataContext.TrafficVideoSurveillances.AsQuerybale.Any(i => i.Id == trafficVideoSurveillance.Id))
            {
                throw new DuplicatedKeyException("代码[{0}]已经存在。");
            }
            trafficVideoSurveillance.EquipmentType = EquipmentType.TrafficVideoSurveillance;
            dataContext.TrafficVideoSurveillances.Add(trafficVideoSurveillance);
            dataContext.SubmitChanges();
        }
    }
}
