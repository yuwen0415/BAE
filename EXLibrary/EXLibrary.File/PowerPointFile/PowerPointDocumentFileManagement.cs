using DotMaysWind.Office;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EXLibrary.File.PowerPointFile
{
    public class PowerPointDocumentFileManagement : OfficeFileManagementBase, IFileManagement
    {
        public PowerPointDocumentFileManagement(IOfficeFile file)
            : base(file)
        {

        }

        public void Close()
        {

        }

        public void Open()
        {
            if (string.Equals(".ppt", this.File.Extension) || string.Equals(".pptx", this.File.Extension))
            {
                try
                {
                    var doc = OfficeFileFactory.CreateOfficeFile(this.File.FullName);
                    this.OfficeFile.Content = (doc as IPowerPointFile).AllText;
                }
                catch (Exception ex)
                {
                    this.OfficeFile.Content = string.Empty;
                    this.Close();
                    return;
                }
            }
        }
    }
}
