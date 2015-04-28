using ProjectDesigner.Foundation;
using ProjectDesigner.Pillar;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ProjectDesigner.VMS
{
    public interface IVMS : IEquipment
    {
        VMSType? Type { get; set; }
        /// <summary>
        /// 连接方式
        /// </summary>
        Connection? Connection { get; set; }
        ModuleSize Size { get; set; }
        double? Weight { get; set; }
        IFoundation Foundation { get; set; }
        IPillar Pillar { get; set; }
        ILEDModule LEDModule { get; set; }
        double? ModuleCount { get; set; }
        string IconPath { get; set; }

        List<MaterialOfEquipment> AccessorialMaterials { get; set; }

        List<MaterialOfEquipment> ConstructionMaterials { get; set; }
    }
}
