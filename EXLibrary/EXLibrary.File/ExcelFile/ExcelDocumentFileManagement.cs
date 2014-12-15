using EXLibrary.Office.Excel.XLSX;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EXLibrary.File.ExcelFile
{
    public class ExcelDocumentFileManagement : OfficeFileManagementBase, IFileManagement
    {
        public ExcelDocumentFileManagement(IOfficeFile file)
            : base(file)
        {

        }

        SpreadsheetDocument SpreadsheetDocument
        {
            get;
            set;
        }

        public void Close()
        {

        }

        public void Open()
        {
            if (this.OfficeFile.Extension == ".xlsx")
            {
                SpreadsheetDocument = new SpreadsheetDocument();
                SpreadsheetDocument.LoadFile(this.File.FullName);
                var content = new List<string>();
                foreach (var row in SpreadsheetDocument.Content)
                {
                    content.Add(string.Join(";", row.Value));
                }
                this.OfficeFile.Content = string.Join("&", content);
            }
        }
    }
}
