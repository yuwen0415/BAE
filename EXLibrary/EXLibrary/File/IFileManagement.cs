using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EXLibrary.File
{
    public interface IFileManagement
    {
        IFile File { get; }

        void Show();
        void Delete();
        void Open();
        void Close();
        void ReName(string newname);
    }
}
