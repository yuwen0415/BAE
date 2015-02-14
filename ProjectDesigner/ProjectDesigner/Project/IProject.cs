using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ProjectDesigner.Project
{
    public interface IProject
    {
        string Id { get; set; }
        string Name { get; set; }
        decimal? Price { get; set; }

    }
}
