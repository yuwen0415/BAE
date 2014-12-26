using EBA.Linq;
using EBA.Modules;
using ProjectDesigner.Project;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ProjectDesigner.Domain.Project
{
    public static class ProjectEx
    {
        public static IHitable<IProject> SearchProjects(this IDataContext dataContext)
        {
            return dataContext.Projects
                .AsQuerybale
                .OrderBy(i => i.Name)
                .AsHitable();
        }

        public static IHitable<IProjectEquipment> SearchProjectEquipments(this IDataContext dataContext)
        {
            return dataContext.ProjectEquipments
                              .AsQuerybale
                              .OrderBy(i => i.Id).AsQueryable().AsHitable();
        }


        public static IHitable<IProjectEquipment> SearchProjectEquipments(this IDataContext dataContext, string projectId)
        {
            return dataContext.ProjectEquipments.AsQuerybale
                              .Where(i => i.Project.Id == projectId)
                              .AsHitable();
        }

        public static IProject SearchProject(this IDataContext dataContext, string id)
        {
            if (string.IsNullOrEmpty(id))
                return null;
            return dataContext.Projects
                .AsQuerybale
                .Where(i => i.Id == id)
                .FirstOrDefault();
        }

        public static IProjectEquipment SearchProjectEquipment(this IDataContext dataContext, string id)
        {
            if (string.IsNullOrEmpty(id))
                return null;
            return dataContext.ProjectEquipments.AsQuerybale
                              .Where(i => i.Id == id)
                              .FirstOrDefault();
        }

        public static IEquipment SearchProjectEquipment(this IDataContext dataContext, string id, EquipmentType type)
        {
            if (string.IsNullOrEmpty(id))
                return null;
            switch (type)
            {
                case EquipmentType.VMS:
                    return dataContext.VMSs.AsQuerybale.Where(i => i.Id == id).FirstOrDefault();
                default:
                    return null;
            }
        }

        public static void DeleteProject(this IDataContext dataContext, string id)
        {
            var vms = dataContext.SearchProject(id);
            if (vms != null)
            {
                dataContext.Projects.Delete(vms);
            }
        }

        public static void UpdateProject(this IDataContext dataContext, IProject project)
        {
            dataContext.SubmitChanges();
        }
        public static void AddProject(this IDataContext dataContext, IProject project)
        {
            if (project != null && dataContext.Projects.AsQuerybale.Any(i => i.Id == project.Id))
            {
                throw new DuplicatedKeyException("代码[{0}]已经存在。");
            }
            dataContext.Projects.Add(project);
            dataContext.SubmitChanges();
        }


        public static void UpdateProjectEquipment(this IDataContext dataContext, IProjectEquipment equipment)
        {
            dataContext.SubmitChanges();
        }
        public static void AddProjectEquipment(this IDataContext dataContext, IProjectEquipment equipment)
        {
            if (equipment != null && dataContext.ProjectEquipments.AsQuerybale.Any(i => i.Id == equipment.Id))
            {
                throw new DuplicatedKeyException("代码[{0}]已经存在。");
            }
            dataContext.ProjectEquipments.Add(equipment);
            dataContext.SubmitChanges();
        }

        public static void DeleteProjectEquipment(this IDataContext dataContext, string id)
        {
            var equip = dataContext.SearchProjectEquipment(id);
            if (equip != null)
            {
                dataContext.ProjectEquipments.Delete(equip);
            }
        }
    }
}
