using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ProjectDesigner.VMS
{
    public interface ILEDModule : IEquipment
    {
        string Brand { get; set; }
        LedStandard? Standard { get; set; }
        ModuleSize Size { get; set; }
    }
}
