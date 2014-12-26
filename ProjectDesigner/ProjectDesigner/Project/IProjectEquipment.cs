using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ProjectDesigner.Project
{
    public interface IProjectEquipment
    {
        string Id { get; set; }

        string Name { get; set; }
        string EquipmentId { get; set; }
        Location Location { get; set; }
        EquipmentType EquipmentType { get; set; }
        IProject Project { get; set; }
        double? Price { get; set; }
    }
}
