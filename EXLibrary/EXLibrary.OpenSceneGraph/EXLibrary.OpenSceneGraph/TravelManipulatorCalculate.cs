using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EXLibrary.OpenSceneGraph
{
    public class TravelManipulatorCalculate
    {
        private double Speed = 50;
        public Vec3d Rotation
        {
            get;
            set;
        }

        public TravelManipulatorCalculate()
        {
            this.Rotation = new Vec3d(Math.PI / 2, 0, 0);
        }

        public Vec3d Forward()
        {
            return new Vec3d(Speed * Math.Cos(Math.PI / 2 + Rotation.Z), Speed * Math.Sin(Math.PI / 2 + Rotation.Z), 0);
        }

        public Vec3d Back()
        {
            return new Vec3d(-Speed * Math.Cos(Math.PI / 2 + Rotation.Z), -Speed * Math.Sin(Math.PI / 2 + Rotation.Z), 0);
        }

        public Vec3d Left()
        {
            return new Vec3d(-Speed * Math.Sin(Math.PI / 2 + Rotation.Z), Speed * Math.Cos(Math.PI / 2 + Rotation.Z), 0);
        }

        public Vec3d Right()
        {
            return new Vec3d(Speed * Math.Sin(Math.PI / 2 + Rotation.Z), -Speed * Math.Cos(Math.PI / 2 + Rotation.Z), 0);
        }

        public Vec3d Up()
        {
            return new Vec3d(0, 0, 1);
        }

        public Vec3d Down()
        {
            return new Vec3d(0, 0, -1);
        }

        public Vec3d TurnLeft()
        {
            return new Vec3d(0,0,0.2);
        }

        public Vec3d TurnRight()
        {
            return new Vec3d(0, 0, -0.2);
        }
    }
}
