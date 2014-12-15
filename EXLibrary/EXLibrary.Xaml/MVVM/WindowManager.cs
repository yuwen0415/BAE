using EBA.IoC;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows;

namespace EXLibrary.Xaml.MVVM
{
    public class WindowManager : IWindowManager
    {
        Dictionary<Type, Type> RouteTable = new Dictionary<Type, Type>();


        public virtual void Show(IViewModel viewModel)
        {
            var view = this.NewView(viewModel);
            if (view != null)
            {
                view.DataContext = viewModel;
                viewModel.View = view;
                view.Show();
            }
        }

        public virtual void ShowDialog(IViewModel viewModel)
        {
            var view = this.NewView(viewModel);
            if (view != null)
            {
                view.DataContext = viewModel;
                viewModel.View = view;
                view.ShowDialog();
            }
        }

        protected virtual IView NewView(IViewModel viewModel)
        {
            if (viewModel == null)
            {
                return null;
            }
            var viewModelType = viewModel.GetType();
            Type viewType;

            if (RouteTable.ContainsKey(viewModelType))
            {
                viewType = RouteTable[viewModelType];
            }
            else
            {
                viewType = Type.GetType(viewModelType.FullName.Substring(0, viewModelType.FullName.Length - 5) + "," + viewModelType.Assembly.FullName);
                if (viewType != null)
                {
                    RouteTable[viewModelType] = viewType;
                }
            }


            if (viewType != null)
            {
                var view = Container.Default.GetExport(viewType);
                if (view != null)
                {
                    return new WindowView(view as Window);
                }
                else
                {
                    return null;
                }
            }
            else
            {
                return null;
            }
        }
    }
    
}
