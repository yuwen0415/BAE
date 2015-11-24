using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;

namespace EXLibrary.OpenSceneGraph
{
    public class ITSViewer
    {
        [DllImport("ITSViewerDll.dll")]
        public static extern void PlayScene();

        [DllImport("ITSViewerDll.dll")]
        public static extern void LoadScene(string fileName);

        [DllImport("ITSViewerDll.dll")]
        public static extern void Initialize(IntPtr hWnd);

        [DllImport("ITSViewerDll.dll")]
        public static extern void Stop();

        [DllImport("ITSViewerDll.dll")]
        public static extern void ChangePosition(double delte_X, double delte_Y, double delte_Z);

        [DllImport("ITSViewerDll.dll")]
        public static extern void ChangeRotation(double delte_X, double delte_Y, double delte_Z);

        [DllImport("ITSViewerDll.dll")]
        public static extern float GetRotationX();

        [DllImport("ITSViewerDll.dll")]
        public static extern float GetRotationY();

        [DllImport("ITSViewerDll.dll")]
        public static extern float GetRotationZ();

        [DllImport("ITSViewerDll.dll")]
        public static extern void ChangeScenceModel(string modelfile);

        [DllImport("ITSViewerDll.dll")]
        public static extern void DynamicPositionChangeModel(float screenX, float screenY, string modelfile);

        [DllImport("ITSViewerDll.dll")]
        public static extern void DynamicPositionChangeModelByViewer(string modelfile);

        [DllImport("ITSViewerDll.dll")]
        public static extern int Test(Int16 a, Int16 b);
    }
}
