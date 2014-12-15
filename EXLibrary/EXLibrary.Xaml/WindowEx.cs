using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows;
using System.Windows.Interop;

namespace EXLibrary.Xaml
{
    public static class WindowEx
    {
        public static IntPtr GetHandle(this Window window)
        {
            if (window == null)
            {
                return IntPtr.Zero;
            }
            else
            {
                return new WindowInteropHelper(window).Handle;
            }
        }
    }
}
