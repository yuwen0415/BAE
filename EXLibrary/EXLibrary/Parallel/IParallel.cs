using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EXLibrary.Parallel
{
    public interface IParallel
    {
        void Start<T>(ICollection<T> collection, Action<T> action);

        void Start<T>(IEnumerable<T> collection, Action<T> action);


        void Stop();
    }
}
