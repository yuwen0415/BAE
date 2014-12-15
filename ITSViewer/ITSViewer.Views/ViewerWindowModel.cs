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
//using System.Windows.Forms;

namespace ITSViewer.Views
{
    public class ViewerWindowModel : ViewModelBase
    {
        bool _ViewerPlayed;
        private bool ViewerPlayed
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
                        OsgViewerAdapter.LoadScene("cow.osg");
                        OsgViewerAdapter.PlayOsgViewer();

                    });
                }
                return _PlayViewer;
            }
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
                    });
                }
                return _StopViewer;
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

