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
        public ViewerMntWindowModel ViewerMntWindow
        {
            get; private set;
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
                        ViewerMntWindow.ViewerModeText = "漫游模式";
                        this.IsWander = true;
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

        ReactiveCommand _ChangeShipModel;
        public ReactiveCommand ChangeShipModel
        {
            get
            {
                if (_ChangeShipModel == null)
                {
                    _ChangeShipModel = new ReactiveCommand(this.WhenAny(x => x.ViewerPlayed, x => x.Value == true));
                    _ChangeShipModel.Subscribe(i =>
                    {
                        //((this.View as WindowView).Window as ViewerWindow).Border.CaptureMouse();
                        OsgViewerAdapter.DynamicPositionChangeModelByViewer("ferry02.ive");
                        ViewerMntWindow.ViewerModeText = "本船模式";
                        this.IsWander = false;
                        this.IsFollow = true;
                        OsgViewerAdapter.SetFollowShip();
                        ViewerMntWindow.IsWander = false;
                    });
                }
                return _ChangeShipModel;
            }
        }


        bool _IsWander = false;
        public bool IsWander
        {
            get
            {
                return _IsWander;
            }
            set
            {
                this.RaiseAndSetIfChanged(ref _IsWander, value);
            }
        }

        ReactiveCommand _Wander;
        public ReactiveCommand Wander
        {
            get
            {
                if (this._Wander == null)
                {
                    _Wander = new ReactiveCommand(this.WhenAny(x => x.IsWander, y => y.ViewerPlayed, (x, y) => x.Value == false && y.Value == true));
                    _Wander.Subscribe(i =>
                    {
                        this.IsWander = true;
                        this.IsFollow = false;
                        ViewerMntWindow.ViewerModeText = "漫游模式";
                        OsgViewerAdapter.SetWander();
                        ViewerMntWindow.IsWander = true;
                    });
                }
                return this._Wander;
            }
        }

        bool _IsFollow = false;
        public bool IsFollow
        {
            get { return _IsFollow; }
            set
            {
                this.RaiseAndSetIfChanged(ref this._IsFollow, value);
            }
        }

        ReactiveCommand _FollowShip;
        public ReactiveCommand FollowShip
        {
            get
            {
                if (this._FollowShip == null)
                {
                    this._FollowShip = new ReactiveCommand(this.WhenAny(x => x.IsWander, y => y.IsFollow, (x, y) => x.Value == true && y.Value == false));
                    this._FollowShip.Subscribe(i =>
                    {
                        this.IsWander = false;
                        this.IsFollow = true;
                        OsgViewerAdapter.SetFollowShip();
                        ViewerMntWindow.IsWander = false;
                    });
                }
                return this._FollowShip;
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

