using EXLibrary.File;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace FindFiles.Domain
{
    public class EventHandler
    {
        public delegate void FileFoundHandler(FoundFile file);
    }
}
