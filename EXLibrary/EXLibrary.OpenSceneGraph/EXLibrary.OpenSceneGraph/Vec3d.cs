using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EXLibrary.OpenSceneGraph
{
    public class Vec3d
    {
        public double X
        {
            get; set;
        }

        public double Y
        {
            get; set;
        }
        public double Z
        {
            get; set;
        }

        public Vec3d()
        {

        }

        public Vec3d(double x, double y, double z)
        {
            this.X = x;
            this.Y = y;
            this.Z = z;
        }
    }
}
