using EXLibrary.Xaml.MVVM;
using ITSViewer.Domain;
using ReactiveUI;
using ReactiveUI.Xaml;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Windows;
using EBA.IoC;
//using System.Windows.Forms;

namespace ITSViewer.Views
{
    public class ViewerWindowModel : ViewModelBase
    {
        ViewerMntWindowModel ViewerMntWindow
        {
            get; set;
        }

        bool _ViewerPlayed;
        public bool ViewerPlayed
        {
            get
            {
                return _ViewerPlayed;
            }
            set
            {
                this.RaiseAndSetIfChanged(ref _ViewerPlayed, value);
            }
        }


        ReactiveCommand _PlayViewer;
        public ReactiveCommand PlayViewer
        {
            get
            {
                if (_PlayViewer == null)
                {
                    _PlayViewer = new ReactiveCommand(this.WhenAny(x => x.ViewerPlayed, x => x.Value == false));
                    _PlayViewer.Subscribe(i =>
                    {
                        this.ViewerPlayed = true;
                        OsgViewerAdapter.LoadScene(@"resources\island\islands.ive");//"cow.osgt"///xiamen.ive
                        OsgViewerAdapter.PlayOsgViewer();
                        ViewerMntWindow = new ViewerMntWindowModel(this.OsgViewerAdapter);

                        Container.Default.GetExport<IWindowManager>().Show(ViewerMntWindow);
                        (ViewerMntWindow.View as WindowView).Window.Left = this.View.Left + 800;
                        (ViewerMntWindow.View as WindowView).Window.Top = this.View.Top;
                        (this.View as WindowView).Window.LocationChanged += Window_LocationChanged;
                    });
                }
                return _PlayViewer;
            }
        }

        private void Window_LocationChanged(object sender, EventArgs e)
        {
            (ViewerMntWindow.View as WindowView).Window.Left = this.View.Left + 800;
            (ViewerMntWindow.View as WindowView).Window.Top = this.View.Top;
        }

        ReactiveCommand _StopViewer;
        public ReactiveCommand StopViewer
        {
            get
            {
                if (_StopViewer == null)
                {
                    _StopViewer = new ReactiveCommand(this.WhenAny(x => x.ViewerPlayed, x => x.Value == true));
                    _StopViewer.Subscribe(i =>
                    {
                        this.ViewerPlayed = false;
                        OsgViewerAdapter.StopOsgViewer();
                        if (ViewerMntWindow != null)
                        {
                            ViewerMntWindow.View.Close();
                        }
                        MessageBox.Show("视景已停止。");
                    });
                }
                return _StopViewer;
            }
        }


        ReactiveCommand _ChangeModel;
        public ReactiveCommand ChangeModel
        {
            get
            {
                if (_ChangeModel == null)
                {
                    _ChangeModel = new ReactiveCommand(this.WhenAny(x => x.ViewerPlayed, x => x.Value == true));
                    _ChangeModel.Subscribe(i =>
                    {
                        var openFileDialog = new Microsoft.Win32.OpenFileDialog();
                        var result = openFileDialog.ShowDialog();
                        if (result == true)
                        {
                            OsgViewerAdapter.ChangeScenceModel(openFileDialog.FileName);
                        }
                    });
                }
                return _ChangeModel;
            }
        }

        private OsgViewerAdapter _OsgViewerAdapter;
        public OsgViewerAdapter OsgViewerAdapter
        {
            get
            {
                if (_OsgViewerAdapter == null)
                {
                    _OsgViewerAdapter = new OsgViewerAdapter();
                }
                return _OsgViewerAdapter;
            }
            private set
            {
                _OsgViewerAdapter = value;
            }
        }
    }
}

