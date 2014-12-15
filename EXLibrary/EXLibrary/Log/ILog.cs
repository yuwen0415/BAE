using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EXLibrary.Log
{
    public interface ILog
    {
        void Write(string format, params object[] arg);

        void WriteLine(string format, params object[] arg);


    }
}
