using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ProjectDesigner.TrafficAndEventCollection
{
    public interface ITrafficAndEventCollectionEquipment : IEquipment
    {
        TrafficAndEventCollectionEquipmentType Type { get; set; }
    }
}
