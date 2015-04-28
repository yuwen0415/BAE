using ProjectDesigner.Foundation;
using ProjectDesigner.Pillar;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ProjectDesigner.TrafficVideoSurveillance
{
    public interface ITrafficVideoSurveillance : IEquipment
    {
        TrafficVideoSurveillanceType Type { get; set; }

        /// <summary>
        /// 连接方式
        /// </summary>
        Connection Connection { get; set; }

        IFoundation Foundation { get; set; }
        IPillar Pillar { get; set; }
        IVideoSurveillance VideoSurveillance { get; set; }
        string IconPath { get; set; }

        List<MaterialOfEquipment> AccessorialMaterials { get; set; }

        List<MaterialOfEquipment> ConstructionMaterials { get; set; }
    }
}
