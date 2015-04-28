using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ProjectDesigner
{
    public interface IMaterial : IEquipment
    {
        double? Num { get; set; }

        string ParentId { get; set; }

        string MaterialId { get; set; }
    }
}
