using EBA.Linq;
using EBA.Modules;
using ProjectDesigner.Foundation;
using ProjectDesigner.Pillar;
using ProjectDesigner.VMS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ProjectDesigner.Domain.Equipment
{
    public static class FoundationEx
    {
        public static IHitable<IFoundation> SearchFoundations(this IDataContext dataContext)
        {
            return dataContext.Foundations
                .AsQuerybale
                .OrderBy(i => i.Name)
                .AsHitable();
        }

        public static IFoundation SearchFoundation(this IDataContext dataContext, string id)
        {
            if (string.IsNullOrEmpty(id))
                return null;
            return dataContext.Foundations
                .AsQuerybale
                .Where(i => i.Id == id)
                .FirstOrDefault();
        }

        public static void DeleteFoundation(this IDataContext dataContext, string id)
        {
            var pillar = dataContext.SearchFoundation(id);
            if (pillar != null)
            {
                dataContext.Foundations.Delete(pillar);
            }
        }

        public static void UpdateFoundation(this IDataContext dataContext, IFoundation foundation)
        {
            dataContext.SubmitChanges();
        }
        public static void AddFoundation(this IDataContext dataContext, IFoundation foundation)
        {
            if (foundation != null && dataContext.Foundations.AsQuerybale.Any(i => i.Id == foundation.Id))
            {
                throw new DuplicatedKeyException("代码[{0}]已经存在。");
            }
            foundation.EquipmentType = EquipmentType.Foundation;
            dataContext.Foundations.Add(foundation);
            dataContext.SubmitChanges();
        }
    }
}
