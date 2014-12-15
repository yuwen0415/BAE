using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EXLibrary.File
{
    public abstract class OfficeFileManagementBase : FileManagementBase
    {
        public IFile File
        {
            get
            {
                return OfficeFile;
            }
            protected set
            {
                this.OfficeFile = value as IOfficeFile;
            }
        }

       protected IOfficeFile OfficeFile
        {
            get;
            set;
        }

        public OfficeFileManagementBase(IOfficeFile file)
            : base(file)
        {
            this.OfficeFile = file;
        }

        public void Show()
        {
            if (this.OfficeFile.IsInstall)
            {
                System.Diagnostics.Process.Start(this.File.FullName);
            }
        }
    }
}
