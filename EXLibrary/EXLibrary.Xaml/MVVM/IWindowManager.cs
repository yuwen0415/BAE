using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EXLibrary.Xaml.MVVM
{
    public interface IWindowManager
    {
        void Show(IViewModel viewModel);

        void ShowDialog(IViewModel viewModel);

    }
}
