using EBA.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using EBA.Data;
using EBA.Modules;
using ProjectDesigner;

namespace ProjectDesigner.Domain.Equipment
{
    public static class VideoSurveillanceEx
    {
        public static IHitable<IVideoSurveillance> SearchVideoSurveillances(this IDataContext dataContext)
        {
            return dataContext.VideoSurveillances
                .AsQuerybale
                .OrderBy(i => i.Name)
                .AsHitable();
        }

        public static IVideoSurveillance SearchVideoSurveillance(this IDataContext dataContext, string id)
        {
            if (string.IsNullOrEmpty(id))
                return null;
            return dataContext.VideoSurveillances
                .AsQuerybale
                .Where(i => i.Id == id)
                .FirstOrDefault();
        }

        public static void DeleteVideoSurveillance(this IDataContext dataContext, string id)
        {
            var VideoSurveillance = dataContext.SearchVideoSurveillance(id);
            if (VideoSurveillance != null)
            {
                dataContext.VideoSurveillances.Delete(VideoSurveillance);
            }
        }

        public static void UpdateVideoSurveillance(this IDataContext dataContext, IVideoSurveillance VideoSurveillance)
        {
            dataContext.SubmitChanges();
        }
        public static void AddVideoSurveillance(this IDataContext dataContext, IVideoSurveillance VideoSurveillance)
        {
            if (VideoSurveillance != null && dataContext.VideoSurveillances.AsQuerybale.Any(i => i.Id == VideoSurveillance.Id))
            {
                throw new DuplicatedKeyException("代码[{0}]已经存在。");
            }
            VideoSurveillance.EquipmentType = EquipmentType.TrafficVideoSurveillance;
            dataContext.VideoSurveillances.Add(VideoSurveillance);
            dataContext.SubmitChanges();
        }
    }
}
