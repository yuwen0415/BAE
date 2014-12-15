using EXLibrary.File.ExcelFile;
using EXLibrary.File.PowerPointFile;
using EXLibrary.File.TxtFile;
using EXLibrary.File.WordFile;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace EXLibrary.File
{
    public class DocumentFileFactory
    {
        public static IFile CreateFile(FileInfo fileInfo)
        {
            var extension = fileInfo.Extension.ToLower();
            if (FileExtensions.ContainsKey(extension))
            {
                if (string.Equals(".txt", extension))
                    return new TxtDocementFile(fileInfo);
                else if (string.Equals(".doc", extension) || string.Equals(".docx", extension))
                    return new WordDocumentFile(fileInfo);
                else if (string.Equals(".xls", extension) || string.Equals(".xlsx", extension))
                    return new ExcelDocumentFile(fileInfo);
                else if (string.Equals(".ppt", extension) || string.Equals(".pptx", extension))
                    return new PowerPointDocumentFile(fileInfo);
                else
                    return null;
            }
            return null;
        }


        private static IDictionary<string, string> _FileExtensions;
        public static IDictionary<string, string> FileExtensions
        {
            get
            {
                if (_FileExtensions == null)
                {
                    _FileExtensions = new Dictionary<string, string>();
                    _FileExtensions.Add(".xlsx", ".xlsx");
                    _FileExtensions.Add(".xls", ".xls");
                    _FileExtensions.Add(".doc", ".doc");
                    _FileExtensions.Add(".docx", ".docx");
                    _FileExtensions.Add(".ppt", ".ppt");
                    _FileExtensions.Add(".pptx", ".pptx");
                    _FileExtensions.Add(".txt", ".txt");
                }
                return _FileExtensions;
            }
        }
    }
}
