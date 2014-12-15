using EXLibrary.File.ExcelFile;
using EXLibrary.File.PowerPointFile;
using EXLibrary.File.TxtFile;
using EXLibrary.File.WordFile.Binary;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EXLibrary.File
{
    public class DocumentFileManagementFactory
    {
        public static IFileManagement CreateDocumentFileManagement(IDocumentFile file)
        {
            var extension = file.Extension.ToLower();
            if (DocumentFileFactory.FileExtensions.ContainsKey(extension))
            {
                if (string.Equals(".txt", extension))
                    return new TxtDocumentFileManagement(file);
                else if (string.Equals(".doc", extension) || string.Equals(".docx", extension))
                    return new WordDocumentFileManagement(file as IOfficeFile);
                else if (string.Equals(".xlsx", extension))
                    return new ExcelDocumentFileManagement(file as IOfficeFile);
                else if (string.Equals(".ppt", extension) || string.Equals(".pptx", extension))
                    return new PowerPointDocumentFileManagement(file as IOfficeFile);
                else
                    return null;
            }
            return null;
        }
    }
}
