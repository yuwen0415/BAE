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
        string Brand { get; set; }
        VMSType? Type { get; set; }
        Connection? Connection { get; set; }
        ModuleSize Size { get; set; }
        double? Weight { get; set; }
        IFoundation Foundation { get; set; }
        IPillar Pillar { get; set; }
        ILEDModule LEDModule { get; set; }
        int? ModuleCount { get; set; }
        string IconPath { get; set; }
    }
}
