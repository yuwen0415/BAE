using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EXLibrary.File
{
    public interface IDocumentFile : IFile
    {
        string Content { get; set; }
    }
}
