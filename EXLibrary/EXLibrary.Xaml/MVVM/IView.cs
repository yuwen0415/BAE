using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EXLibrary.Xaml.MVVM
{
    public interface IView
    {
        string Title { get; }
        object DataContext { get; set; }
        void Show();
        bool? ShowDialog();
        void Close();
    }
}
