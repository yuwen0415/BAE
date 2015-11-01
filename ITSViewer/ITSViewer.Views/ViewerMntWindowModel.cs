using EXLibrary.OpenSceneGraph;
using ITSViewer.Domain;
using ReactiveUI;
using ReactiveUI.Xaml;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ITSViewer.Views
{
    public class ViewerMntWindowModel : ViewModelBase
    {
        private OsgViewerAdapter OsgViewerAdapter
        {
            get; set;
        }
        public ViewerMntWindowModel(OsgViewerAdapter osgViewerAdapter)
        {
            OsgViewerAdapter = osgViewerAdapter;
        }

        private TravelManipulatorCalculate TravelManipulatorCalculate = new TravelManipulatorCalculate();

        ReactiveCommand _Rise;
        public ReactiveCommand Rise
        {
            get
            {
                if (_Rise == null)
                {
                    _Rise = new ReactiveCommand();
                    _Rise.Subscribe(i =>
                    {
                        TravelManipulatorCalculate.Rotation = OsgViewerAdapter.GetRotation();
                        OsgViewerAdapter.ChangePosition(TravelManipulatorCalculate.Up());
                    });
                }
                return _Rise;
            }
        }

        ReactiveCommand _Forward;
        public ReactiveCommand Forward
        {
            get
            {
                if (_Forward == null)
                {
                    _Forward = new ReactiveCommand();
                    _Forward.Subscribe(i =>
                        {
                            TravelManipulatorCalculate.Rotation = OsgViewerAdapter.GetRotation();
                            OsgViewerAdapter.ChangePosition(TravelManipulatorCalculate.Forward());
                        });
                }
                return _Forward;
            }
        }

        ReactiveCommand _Drop;
        public ReactiveCommand Drop
        {
            get
            {
                if (_Drop == null)
                {
                    _Drop = new ReactiveCommand();
                    _Drop.Subscribe(i =>
                    {
                        TravelManipulatorCalculate.Rotation = OsgViewerAdapter.GetRotation();
                        OsgViewerAdapter.ChangePosition(TravelManipulatorCalculate.Down());
                    });
                }
                return _Drop;
            }
        }

        ReactiveCommand _TurnLeft;
        public ReactiveCommand TurnLeft
        {
            get
            {
                if (_TurnLeft == null)
                {
                    _TurnLeft = new ReactiveCommand();
                    _TurnLeft.Subscribe(i =>
                    {
                        TravelManipulatorCalculate.Rotation = OsgViewerAdapter.GetRotation();
                        OsgViewerAdapter.ChangeRotation(TravelManipulatorCalculate.TurnLeft());
                    });
                }
                return _TurnLeft;
            }
        }

        ReactiveCommand _TurnRight;
        public ReactiveCommand TurnRight
        {
            get
            {
                if (_TurnRight == null)
                {
                    _TurnRight = new ReactiveCommand();
                    _TurnRight.Subscribe(i =>
                    {
                        TravelManipulatorCalculate.Rotation = OsgViewerAdapter.GetRotation();
                        OsgViewerAdapter.ChangeRotation(TravelManipulatorCalculate.TurnRight());
                    });
                }
                return _TurnRight;
            }
        }

        ReactiveCommand _Back;
        public ReactiveCommand Back
        {
            get
            {
                if (_Back == null)
                {
                    _Back = new ReactiveCommand();
                    _Back.Subscribe(i =>
                    {
                        TravelManipulatorCalculate.Rotation = OsgViewerAdapter.GetRotation();
                        OsgViewerAdapter.ChangePosition(TravelManipulatorCalculate.Back());
                    });
                }
                return _Back;
            }
        }

        private string _FileName = "cow.osgt";
        public string FileName
        {
            get
            {
                return this._FileName;
            }
            set
            {
                this.RaiseAndSetIfChanged(ref _FileName, value);
            }
        }
        

        ReactiveCommand _ChangeModel;
        public ReactiveCommand ChangeModel
        {
            get
            {
                if (_ChangeModel == null)
                {
                    _ChangeModel = new ReactiveCommand();
                    _ChangeModel.Subscribe(i =>
                    {

                        OsgViewerAdapter.ChangeScenceModel(FileName);

                    });
                }
                return _ChangeModel;
            }
        }

        ReactiveCommand _OpenFileDialog;
        public ReactiveCommand OpenFileDialog
        {
            get
            {
                if (_OpenFileDialog == null)
                {
                    _OpenFileDialog = new ReactiveCommand();
                    _OpenFileDialog.Subscribe(i =>
                    {
                        var openFileDialog = new Microsoft.Win32.OpenFileDialog();
                        var result = openFileDialog.ShowDialog();
                        if (result == true)
                        {
                            FileName = openFileDialog.FileName;
                        }
                    });
                }
                return _OpenFileDialog;
            }
        }
    }
}
