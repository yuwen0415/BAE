using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ProjectDesigner
{
    public interface IEquipment
    {
        string Id { get; set; }
        string Name { get; set; }
        decimal? Price { get; set; }
        EquipmentType EquipmentType { get; set; }

        string Brand { get; set; }
    }
}
