using EBA.Linq;
using EBA.Modules;
using ProjectDesigner.VMS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ProjectDesigner.Domain.Equipment
{
    public static class LEDModuleEx
    {
        public static IHitable<ILEDModule> SearchLEDModules(this IDataContext dataContext)
        {
            return dataContext.LEDModules
                .AsQuerybale
                .OrderBy(i => i.Name)
                .AsHitable();
        }

        public static ILEDModule SearchLEDModule(this IDataContext dataContext, string id)
        {
            if (string.IsNullOrEmpty(id))
                return null;
            return dataContext.LEDModules
                .AsQuerybale
                .Where(i => i.Id == id)
                .FirstOrDefault();
        }

        public static void DeleteLEDModule(this IDataContext dataContext, string id)
        {
            var led = dataContext.SearchLEDModule(id);
            if (led != null)
            {
                dataContext.LEDModules.Delete(led);
            }
        }

        public static void UpdateLEDModule(this IDataContext dataContext, ILEDModule vms)
        {
            dataContext.SubmitChanges();
        }
        public static void AddLEDModule(this IDataContext dataContext, ILEDModule ledmodule)
        {
            if (ledmodule != null && dataContext.LEDModules.AsQuerybale.Any(i => i.Id == ledmodule.Id))
            {
                throw new DuplicatedKeyException("代码[{0}]已经存在。");
            }
            ledmodule.EquipmentType = EquipmentType.LEDModule;
            dataContext.LEDModules.Add(ledmodule);
            dataContext.SubmitChanges();
        }
    }
}
