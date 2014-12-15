using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ProjectDesigner.Pillar
{
    public interface IPillar : IEquipment
    {
        PillarType? Type { get; set; }
        double? Height { get; set; }
        //直径
        double? Diameter { get; set; }
        double? Length { get; set; }
    }
}
