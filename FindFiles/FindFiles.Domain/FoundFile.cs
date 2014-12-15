using EXLibrary.File;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace FindFiles.Domain
{
    public class FoundFile : IFile
    {
        public int Num { get; set; }

        public DateTime CreationTime
        {
            get;
            set;
        }

        public string DirectoryName
        {
            get;
            set;
        }

        public string FileName
        {
            get;
            set;
        }

        public string FilePath
        {
            get;
            set;
        }

        public long FileSize
        {
            get;
            set;
        }

        public string FileType
        {
            get;
            set;
        }

        public DateTime LastWriteTime
        {
            get;
            set;
        }

        public string FullName
        {
            get;
            set;
        }

        public static FoundFile NewFile(FileInfo fileInfo)
        {
            var item = new FoundFile();
            item.FileName = fileInfo.Name;
            item.CreationTime = fileInfo.CreationTime;
            item.LastWriteTime = fileInfo.LastWriteTime;
            item.FileSize = fileInfo.Length;
            item.FileType = fileInfo.Extension;
            item.FilePath = fileInfo.FullName;
            item.DirectoryName = fileInfo.DirectoryName;
            item.FullName = fileInfo.FullName;
            item.Extension = fileInfo.Extension;
            return item;
        }

        public static IDictionary<string, string> BesidesFileNames = new Dictionary<string, string>();



        public string Extension
        {
            get;
            set;
        }
    }
}
