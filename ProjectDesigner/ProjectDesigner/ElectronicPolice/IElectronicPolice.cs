using ProjectDesigner.Foundation;
using ProjectDesigner.Pillar;
using ProjectDesigner.TrafficVideoSurveillance;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ProjectDesigner.ElectronicPolice
{
    public interface IElectronicPolice : IEquipment
    {
        ElectronicPoliceType Type { get; set; }

        /// <summary>
        /// 连接方式
        /// </summary>
        Connection Connection { get; set; }

        IFoundation Foundation { get; set; }
        IPillar Pillar { get; set; }
        string IconPath { get; set; }

        /// <summary>
        /// 电子警察设备
        /// </summary>
        IVideoSurveillance VideoSurveillance { get; set; }

        /// <summary>
        /// 电子警察设备数量
        /// </summary>
        int VideoSurveillanceNum { get; set; }
    }
}
