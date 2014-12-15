using EBA.Linq;
using ProjectDesigner.VMS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using EBA.Data;
using EBA.Modules;

namespace ProjectDesigner.Domain.Equipment
{
    public static class VMSEx
    {
        public static IHitable<IVMS> SearchVMS(this IDataContext dataContext)
        {
            return dataContext.VMSs
                .AsQuerybale
                .OrderBy(i => i.Name)
                .AsHitable();
        }

        public static IVMS SearchVMS(this IDataContext dataContext, string id)
        {
            if (string.IsNullOrEmpty(id))
                return null;
            return dataContext.VMSs
                .AsQuerybale
                .Where(i => i.Id == id)
                .FirstOrDefault();
        }

        public static void DeleteVMS(this IDataContext dataContext, string id)
        {
            var vms = dataContext.SearchVMS(id);
            if (vms != null)
            {
                dataContext.VMSs.Delete(vms);
            }
        }

        public static void UpdateVMS(this IDataContext dataContext, IVMS vms)
        {
            dataContext.SubmitChanges();
        }
        public static void AddVMS(this IDataContext dataContext, IVMS vms)
        {
            if (vms != null && dataContext.VMSs.AsQuerybale.Any(i => i.Id == vms.Id))
            {
                throw new DuplicatedKeyException("代码[{0}]已经存在。");
            }
            vms.EquipmentType = EquipmentType.VMS;
            dataContext.VMSs.Add(vms);
            dataContext.SubmitChanges();
        }
    }
}
