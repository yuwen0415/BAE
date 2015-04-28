using EBA.Data;
using ProjectDesigner.ElectronicPolice;
using ProjectDesigner.Foundation;
using ProjectDesigner.Pillar;
using ProjectDesigner.Project;
using ProjectDesigner.TrafficAndEventCollection;
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
        IRepository<IVideoSurveillance> VideoSurveillances { get; }
        IRepository<ITrafficVideoSurveillance> TrafficVideoSurveillances { get; }
        IRepository<IElectronicPolice> ElectronicPolices { get; }
        IRepository<ITrafficAndEventCollection> TrafficAndEventCollections { get; }
        IRepository<ICoil> Coils { get; }
        IRepository<IGeomagnetic> Geomagnetics { get; }
        IRepository<IMicrowave> Microwaves { get; }
        IRepository<IRFID> RFIDs { get; }
        /// <summary>
        /// 设备建设辅助材料
        /// </summary>
        IRepository<IEquipment> AccessorialMaterials { get; }
        /// <summary>
        /// 工程材料
        /// </summary>
        IRepository<IEquipment> ConstructionMaterials { get; }
        IRepository<IMaterial> Materials { get; }
        IRepository<ICenterEquipment> CenterEquipments { get; }
    }
}
