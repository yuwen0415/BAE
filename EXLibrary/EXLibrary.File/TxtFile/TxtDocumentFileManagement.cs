using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;
using System.Diagnostics;

namespace EXLibrary.File.TxtFile
{
    public class TxtDocumentFileManagement : FileManagementBase, IFileManagement
    {


        FileStream FileStream { get; set; }

        public TxtDocumentFileManagement(IDocumentFile file)
            : base(file)
        {
        }



        public void Open()
        {
            FileStream = new FileStream(this.File.FullName, FileMode.OpenOrCreate, FileAccess.ReadWrite, FileShare.ReadWrite);
            var reader = new StreamReader(FileStream, System.Text.Encoding.Default);
            (this.File as IDocumentFile).Content = reader.ReadToEnd();
            reader.Close();
        }

        public void Close()
        {
            FileStream.Close();
        }

        public void Show()
        {
            System.Diagnostics.Process.Start(this.File.FullName);
        }
    }
}
