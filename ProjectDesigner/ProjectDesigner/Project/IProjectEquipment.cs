using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ProjectDesigner.Project
{
    public interface IProjectEquipment : IEquipment
    {

        Location Location { get; set; }
        string ProjectId { get; set; }
    }
}
