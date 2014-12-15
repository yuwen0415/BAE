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
            EXLibrary.OpenSceneGraph.ITSViewer.Initialize((this.OsgViewerControl as WindowsFormsHost).Child.Handle);
            EXLibrary.OpenSceneGraph.ITSViewer.LoadScene("cow.osg");
        }

        public void PlayOsgViewer()
        {
            EXLibrary.OpenSceneGraph.ITSViewer.PlayScene();
        }

        public void StopOsgViewer()
        {
            EXLibrary.OpenSceneGraph.ITSViewer.Stop();
            ((this.OsgViewerControl as WindowsFormsHost).Child as PictureBox).Image = new Bitmap("images/bak4.jpg");
        }
    }
}
