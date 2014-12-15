using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace EXLibrary.File
{
    public interface IFile
    {
        string FileName { get; set; }

        string Extension { get; set; }

        DateTime CreationTime { get; set; }

        DateTime LastWriteTime { get; set; }

        string FileType { get; set; }

        long FileSize { get; set; }

        string FilePath { get; set; }

        string DirectoryName { get; set; }

        string FullName { get; set; }
    }
}
