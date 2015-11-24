using EXLibrary.OpenSceneGraph;
using ITSViewer.Domain;
using ReactiveUI;
using ReactiveUI.Xaml;
using System;
using System.Windows;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using EXLibrary.Xaml.MVVM;

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

        private string _TerrainFileName = "cow.osgt";
        public string TerrainFileName
        {
            get
            {
                return this._TerrainFileName;
            }
            set
            {
                this.RaiseAndSetIfChanged(ref _TerrainFileName, value);
            }
        }

        string _ViewerModeText;
        public string ViewerModeText
        {
            get
            {
                return this._ViewerModeText;
            }
            set
            {
                this.RaiseAndSetIfChanged(ref _ViewerModeText, value);
            }
        }


        ReactiveCommand _ChangeTerrainModel;
        public ReactiveCommand ChangeTerrainModel
        {
            get
            {
                if (_ChangeTerrainModel == null)
                {
                    _ChangeTerrainModel = new ReactiveCommand();
                    _ChangeTerrainModel.Subscribe(i =>
                    {

                        OsgViewerAdapter.ChangeScenceModel(TerrainFileName);

                    });
                }
                return _ChangeTerrainModel;
            }
        }

        ReactiveCommand _OpenTerrainFileDialog;
        public ReactiveCommand OpenTerrainFileDialog
        {
            get
            {
                if (_OpenTerrainFileDialog == null)
                {
                    _OpenTerrainFileDialog = new ReactiveCommand();
                    _OpenTerrainFileDialog.Subscribe(i =>
                    {
                        var openFileDialog = new Microsoft.Win32.OpenFileDialog();
                        var result = openFileDialog.ShowDialog();
                        if (result == true)
                        {
                            TerrainFileName = openFileDialog.FileName;
                        }
                    });
                }
                return _OpenTerrainFileDialog;
            }
        }

    }
}
