using ProjectDesigner.Foundation;
using ProjectDesigner.Pillar;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ProjectDesigner.TrafficAndEventCollection
{
    public interface ITrafficAndEventCollection : IEquipment
    {
        TrafficAndEventCollectionType Type { get; set; }

        /// <summary>
        /// 连接方式
        /// </summary>
        Connection Connection { get; set; }

        string IconPath { get; set; }

        /// <summary>
        /// 设备类型
        /// </summary>
        ITrafficAndEventCollectionEquipment TrafficAndEventCollectionEquipment { get; set; }

        TrafficAndEventCollectionEquipmentType TrafficAndEventCollectionEquipmentType { get; set; }

        IFoundation Foundation { get; set; }
        IPillar Pillar { get; set; }

        /// <summary>
        /// 设备数量
        /// </summary>
        int TrafficAndEventCollectionEquipmentNum { get; set; }

        List<MaterialOfEquipment> AccessorialMaterials { get; set; }

        List<MaterialOfEquipment> ConstructionMaterials { get; set; }
    }
}
