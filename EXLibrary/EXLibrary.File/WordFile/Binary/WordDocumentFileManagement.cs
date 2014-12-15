using DotMaysWind.Office;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EXLibrary.File.WordFile.Binary
{
    public class WordDocumentFileManagement : OfficeFileManagementBase, IFileManagement
    {
        public WordDocumentFileManagement(IOfficeFile file)
            : base(file)
        {

        }

        public void Close()
        {

        }

        public void Open()
        {
            if (string.Equals(".doc", this.File.Extension) || string.Equals(".docx", this.File.Extension))
            {
                try
                {
                    var doc = OfficeFileFactory.CreateOfficeFile(this.File.FullName);
                    this.OfficeFile.Content = (doc as IWordFile).ParagraphText;
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
