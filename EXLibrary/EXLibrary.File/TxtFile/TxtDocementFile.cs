using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace EXLibrary.File.TxtFile
{
    public class TxtDocementFile : FileBase, IDocumentFile
    {
        public TxtDocementFile(FileInfo info)
            : base(info)
        {

        }



        public string Content
        {
            get;
            set;
        }
    }
}
