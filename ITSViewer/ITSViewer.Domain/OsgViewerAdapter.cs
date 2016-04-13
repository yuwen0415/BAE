using EXLibrary.OpenSceneGraph;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows;
using System.Windows.Forms;
using System.Windows.Forms.Integration;


namespace ITSViewer.Domain
{
    public class OsgViewerAdapter
    {
        private UIElement _OsgViewerControl;
        public UIElement OsgViewerControl
        {
            get
            {
                if (_OsgViewerControl == null)
                {
                    _OsgViewerControl = new WindowsFormsHost();
                    (_OsgViewerControl as WindowsFormsHost).Child = new PictureBox();
                }
                return _OsgViewerControl;
            }

            private set
            {
                _OsgViewerControl = value;
            }
        }

        public void LoadScene(string scenefile)
        {
            //var test = EXLibrary.OpenSceneGraph.ITSViewer.Test(1, 2);
            // System.Windows.Forms.MessageBox.Show(test.ToString());
            EXLibrary.OpenSceneGraph.ITSViewer.Initialize((this.OsgViewerControl as WindowsFormsHost).Child.Handle);
            EXLibrary.OpenSceneGraph.ITSViewer.LoadScene(scenefile);
        }


        public void PlayOsgViewer()
        {
            EXLibrary.OpenSceneGraph.ITSViewer.PlayScene();
        }

        public void StopOsgViewer()
        {
            EXLibrary.OpenSceneGraph.ITSViewer.Stop();
            //((this.OsgViewerControl as WindowsFormsHost).Child as PictureBox).Image = new Bitmap("images/bak4.jpg");
        }

        public void ChangePosition(Vec3d deltePosition)
        {
            EXLibrary.OpenSceneGraph.ITSViewer.ChangePosition(deltePosition.X, deltePosition.Y, deltePosition.Z);
        }

        public void ChangeRotation(Vec3d delteRotation)
        {
            EXLibrary.OpenSceneGraph.ITSViewer.ChangeRotation(delteRotation.X, delteRotation.Y, delteRotation.Z);
        }

        public Vec3d GetRotation()
        {
            return new Vec3d(EXLibrary.OpenSceneGraph.ITSViewer.GetRotationX(), EXLibrary.OpenSceneGraph.ITSViewer.GetRotationY(), EXLibrary.OpenSceneGraph.ITSViewer.GetRotationZ());
        }

        public void ChangeScenceModel(string modelfile)
        {
            EXLibrary.OpenSceneGraph.ITSViewer.ChangeScenceModel(modelfile);
        }

        public void DynamicPositionChangeModel(float screenX, float screenY, string modelfile)
        {
            EXLibrary.OpenSceneGraph.ITSViewer.DynamicPositionChangeModel(screenX, screenY, modelfile);
        }

        public void DynamicPositionChangeModelByViewer(string modelfile)
        {
            EXLibrary.OpenSceneGraph.ITSViewer.DynamicPositionChangeModelByViewer(modelfile);
        }

        public void SetFollowShip()
        {
            EXLibrary.OpenSceneGraph.ITSViewer.SetFollowShip();
        }

        public void SetWander()
        {
            EXLibrary.OpenSceneGraph.ITSViewer.SetWander();
        }

        public void ShipVecSpeedUp()
        {
            EXLibrary.OpenSceneGraph.ITSViewer.ShipVecSpeedUp();
        }
        public void ShipAngleVecSpeedUp()
        {
            EXLibrary.OpenSceneGraph.ITSViewer.ShipAngleVecSpeedUp();
        }
        public void ReduceShipVec()
        {
            EXLibrary.OpenSceneGraph.ITSViewer.ReduceShipVec();
        }
        public void ReduceShipAngleVec()
        {
            EXLibrary.OpenSceneGraph.ITSViewer.ReduceShipAngleVec();
        }
    }
}
