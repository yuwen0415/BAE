using EBA.Data;
using ProjectDesigner.Foundation;
using ProjectDesigner.Pillar;
using ProjectDesigner.Project;
using ProjectDesigner.TrafficVideoSurveillance;
using ProjectDesigner.VMS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ProjectDesigner
{
    public interface IDataContext : INavigationProvider, IStorageProvider
    {
        IRepository<IVMS> VMSs { get; }
        IRepository<ILEDModule> LEDModules { get; }
        IRepository<IFoundation> Foundations { get; }
        IRepository<IPillar> Pillars { get; }
        IRepository<IProject> Projects { get; }
        IRepository<IProjectEquipment> ProjectEquipments { get; }
        IRepository<ITrafficVideoSurveillance> TrafficVideoSurveillances { get; }
    }
}
