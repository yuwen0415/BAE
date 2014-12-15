using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EXLibrary.Algorithm
{
    public interface IAlgorithm
    {
        Dictionary<string, object> Parameters
        {
            get;
            set;
        }

        double[] GetResult();
    }
}
