using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace EXLibrary.File
{
    public abstract class FileManagementBase
    {
        public IFile File
        {
            get;
            protected set;
        }

        public FileManagementBase(IDocumentFile file)
        {
            this.File = file;
        }

        public void Delete()
        {
            if (System.IO.File.Exists(this.File.FullName))
            {
                System.IO.File.Delete(this.File.FullName);
            }
        }

        public void ReName(string newname)
        {
            System.IO.File.Move(this.File.FullName, Path.Combine(this.File.FilePath, newname));
        }

    }
}
