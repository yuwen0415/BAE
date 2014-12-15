using EXLibrary.Office;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace EXLibrary.File.PowerPointFile
{
    public class PowerPointDocumentFile : FileBase, IOfficeFile
    {
        public PowerPointDocumentFile(FileInfo fileInfo)
            : base(fileInfo)
        {
            var version = string.Empty;
            var installPath = string.Empty;
            if (OfficeHelper.IsInstallOffice(out version, out installPath))
            {
                if (version == "Office2003" && fileInfo.Extension == ".ppt")
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

        public string Content
        {
            get;
            set;
        }

        public string Version
        {
            get;
            private set;
        }

        public string InstallPath
        {
            get;
            private set;
        }

        public bool IsInstall
        {
            get;
            private set;
        }
    }
}
