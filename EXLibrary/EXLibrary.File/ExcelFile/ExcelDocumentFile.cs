using EXLibrary.Office;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace EXLibrary.File.ExcelFile
{
    public class ExcelDocumentFile : FileBase, IOfficeFile
    {
        public ExcelDocumentFile(FileInfo fileInfo)
            : base(fileInfo)
        {
            var version = string.Empty;
            var installPath = string.Empty;
            if (OfficeHelper.IsInstallOffice(out version, out installPath))
            {
                if (version == "Office2003" && fileInfo.Extension == ".xls")
                {
                    this.IsInstall = true;
                }
                this.IsInstall = true;
            }
            else
                this.IsInstall = false;

            this.Version = version;
            this.InstallPath = installPath;
        }

        public string InstallPath
        {
            get;
            set;
        }

        public bool IsInstall
        {
            get;
            set;
        }

        public string Version
        {
            get;
            set;
        }

        public string Content
        {
            get;
            set;
        }

        public Dictionary<string, string> DocumentSummaryInformation
        {
            get;
            set;
        }

        public Dictionary<string, string> SummaryInformation
        {
            get;
            set;
        }
    }
}
