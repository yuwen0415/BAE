using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Windows;
using System.Windows.Interop;

namespace EXLibrary.Xaml.MVVM
{
    public class WindowView : IView
    {
        public Window Window { get; private set; }

        public string Title
        {
            get
            {
                return Window.Title;
            }
        }

        public Window Owner
        {
            get
            {
                return this.Window == null ? null : this.Window.Owner;
            }
            set
            {
                if (this.Window != null)
                {
                    this.Window.Owner = value;
                }
            }
        }

        public object DataContext
        {
            get
            {
                return Window.DataContext;
            }
            set
            {
                this.Window.DataContext = value;
            }
        }


        public WindowView(Window window)
        {
            this.Window = window;
        }

        public void Show()
        {
            this.Window.Show();
        }

        public bool? ShowDialog()
        {
            return this.Window.ShowDialog();
        }

        public void Close()
        {
            this.Window.Close();
        }
    }
}
