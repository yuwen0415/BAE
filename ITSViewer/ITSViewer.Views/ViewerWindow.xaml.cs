using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;
using EXLibrary.OpenSceneGraph;

namespace ITSViewer.Views
{
    /// <summary>
    /// Interaction logic for ViewerWindow.xaml
    /// </summary>
    public partial class ViewerWindow : Window
    {
        public ViewerWindow()
        {
            InitializeComponent();
            this.Closed += ViewerWindow_Closed;
        }

        private void ViewerWindow_Closed(object sender, EventArgs e)
        {
            (this.DataContext as ViewerWindowModel).OsgViewerAdapter.StopOsgViewer();
        }

        bool _ViewModelIsInitialized = false;

        private void Window_Loaded(object sender, RoutedEventArgs e)
        {

            if (this._ViewModelIsInitialized == false)
            {

                Dispatcher.BeginInvoke(new Action(() =>
                {
                    lock (this)
                    {
                        if (this._ViewModelIsInitialized == false)
                        {
                            var viewModel = this.DataContext as ViewerWindowModel;
                            if (viewModel != null)
                            {
                                this.OsgViewer.Children.Add(viewModel.OsgViewerAdapter.OsgViewerControl);
                            }

                            this._ViewModelIsInitialized = true;
                        }
                    }
                }));
            }
        }

        private TravelManipulatorCalculate TravelManipulatorCalculate = new TravelManipulatorCalculate();


        private void Border_KeyDown(object sender, KeyEventArgs e)
        {
            var viewModel = this.DataContext as ViewerWindowModel;
            if (viewModel != null && viewModel.ViewerPlayed)
            {
                TravelManipulatorCalculate.Rotation = viewModel.OsgViewerAdapter.GetRotation();
                switch (e.Key)
                {
                    case Key.W:
                        viewModel.OsgViewerAdapter.ChangePosition(TravelManipulatorCalculate.Forward());
                        break;
                    case Key.S:
                        viewModel.OsgViewerAdapter.ChangePosition(TravelManipulatorCalculate.Back());
                        break;
                    case Key.A:
                        viewModel.OsgViewerAdapter.ChangePosition(TravelManipulatorCalculate.Left());
                        break;
                    case Key.D:
                        viewModel.OsgViewerAdapter.ChangePosition(TravelManipulatorCalculate.Right());
                        break;
                    case Key.Q:
                        viewModel.OsgViewerAdapter.ChangePosition(TravelManipulatorCalculate.Down());
                        break;
                    case Key.E:
                        viewModel.OsgViewerAdapter.ChangePosition(TravelManipulatorCalculate.Up());
                        break;
                    case Key.Left:
                        viewModel.OsgViewerAdapter.ChangeRotation(TravelManipulatorCalculate.TurnLeft());
                        break;
                    case Key.Right:
                        viewModel.OsgViewerAdapter.ChangeRotation(TravelManipulatorCalculate.TurnRight());
                        break;
                    default:
                        break;
                }
            }
        }
    }
}
