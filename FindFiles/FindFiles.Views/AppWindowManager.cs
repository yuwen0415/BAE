using EXLibrary.Xaml.MVVM;
using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Linq;
using System.Text;
using System.Windows;
using System.Windows.Markup;

namespace FindFiles.Views
{
    [Export(typeof(IWindowManager))]
    public class AppWindowManager : WindowManager
    {
        Window ActivatedWindow { get; set; }
        protected override IView NewView(IViewModel viewModel)
        {
            foreach (Window item in Application.Current.Windows)
            {
                if (item.DataContext.GetType() == viewModel.GetType())
                {

                    item.Activate();

                    return new WindowView(item);
                }
            }

            var view = base.NewView(viewModel) as WindowView;



            if (view.Window != null)
            {
                view.Window.Activated += Window_Activated;
                view.Window.Closed += Window_Closed;
                if (view.Window != Application.Current.MainWindow)
                {
                    if (view.Window.Owner == null)
                    {
                        if (this.ActivatedWindow == null)
                        {
                            view.Owner = Application.Current.MainWindow;
                        }
                        else
                        {
                            if (view.Window != this.ActivatedWindow)
                            {
                                view.Owner = this.ActivatedWindow;
                            }
                        }
                    }


                    view.Window.ShowInTaskbar = false;
                }
                else
                {
                    view.Window.ShowInTaskbar = true;
                }

                view.Window.SizeToContent = SizeToContent.Manual;

                var component = (view.Window as IComponentConnector);
                if (component != null)
                {
                    component.InitializeComponent();
                }

                view.Window.Activate();

            }

            return view;
        }

        void Window_Closed(object sender, EventArgs e)
        {
            if (Application.Current.MainWindow != null)
            {
                Application.Current.MainWindow.Activate();
            }
        }

        void Window_Activated(object sender, EventArgs e)
        {
            this.ActivatedWindow = (Window)sender;
        }
    }
}