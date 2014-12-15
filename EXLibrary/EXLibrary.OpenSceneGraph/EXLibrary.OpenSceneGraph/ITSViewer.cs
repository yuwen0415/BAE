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
        public static extern bool Initialize(IntPtr hWnd);

        [DllImport("ITSViewerDll.dll")]
        public static extern void Stop();
    }
}
