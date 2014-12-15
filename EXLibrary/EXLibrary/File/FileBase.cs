using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace EXLibrary.File
{
    public abstract class FileBase : IFile
    {
        public FileBase(FileInfo fileinfo)
        {
            this.FileName = fileinfo.Name;
            this.CreationTime = fileinfo.CreationTime;
            this.LastWriteTime = fileinfo.LastWriteTime;
            this.FileSize = fileinfo.Length;
            this.FileType = fileinfo.Extension;
            this.FilePath = fileinfo.FullName;
            this.DirectoryName = fileinfo.DirectoryName;
            this.FullName = fileinfo.FullName;
            this.Extension = fileinfo.Extension;
        }

        public string FileName
        {
            get;
            set;
        }

        public DateTime CreationTime
        {
            get;
            set;
        }

        public DateTime LastWriteTime
        {
            get;
            set;
        }

        public string FileType
        {
            get;
            set;
        }

        public long FileSize
        {
            get;
            set;
        }

        public string FilePath
        {
            get;
            set;
        }

        public string DirectoryName
        {
            get;
            set;
        }

        public string FullName
        {
            get;
            set;
        }


        public string Extension
        {
            get;
            set;
        }
    }
}
