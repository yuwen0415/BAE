﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EXLibrary.Xaml.MVVM
{
    public interface IViewModel
    {
        IView View { get; set; }
    }
}
