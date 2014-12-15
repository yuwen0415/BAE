using EBA.IoC;
using EXLibrary.Xaml.MVVM;
using ITSViewer.Views;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Windows;

namespace ITSViewer
{
    /// <summary>
    /// Interaction logic for App.xaml
    /// </summary>
    public partial class App : Application
    {
        protected override void OnStartup(StartupEventArgs e)
        {
            Container.Default = new ContainerConfiguration()
                                   .WithAssemblies(WindowsAssembly.GetAssemblies(x => x.Name.StartsWith("ITSViewer.") && x.Name.EndsWith(".dll")))
                                   .CreateContainer();

            Container.Default.GetExport<IWindowManager>().ShowDialog(new ViewerWindowModel());
        }
    }
}
