using EBA.Linq;
using EBA.Modules;
using ProjectDesigner.Pillar;
using ProjectDesigner.VMS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ProjectDesigner.Domain.Equipment
{
    public static class PillarEx
    {
        public static IHitable<IPillar> SearchPillars(this IDataContext dataContext)
        {
            return dataContext.Pillars
                .AsQuerybale
                .OrderBy(i => i.Name)
                .AsHitable();
        }

        public static IPillar SearchPillar(this IDataContext dataContext, string id)
        {
            if (string.IsNullOrEmpty(id))
                return null;
            return dataContext.Pillars
                .AsQuerybale
                .Where(i => i.Id == id)
                .FirstOrDefault();
        }

        public static void DeletePillar(this IDataContext dataContext, string id)
        {
            var pillar = dataContext.SearchPillar(id);
            if (pillar != null)
            {
                dataContext.Pillars.Delete(pillar);
            }
        }


        public static void UpdatePillar(this IDataContext dataContext, IPillar pillar)
        {
            dataContext.SubmitChanges();
        }
        public static void AddPillar(this IDataContext dataContext, IPillar pillar)
        {
            if (pillar != null && dataContext.Pillars.AsQuerybale.Any(i => i.Id == pillar.Id))
            {
                throw new DuplicatedKeyException("代码[{0}]已经存在。");
            }
            pillar.EquipmentType = EquipmentType.Pillar;
            dataContext.Pillars.Add(pillar);
            dataContext.SubmitChanges();
        }
    }
}
