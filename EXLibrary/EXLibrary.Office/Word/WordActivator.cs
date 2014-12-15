using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using WD = Microsoft.Office.Interop.Word;

namespace EXLibrary.Office.Word
{
    public class WordActivator
    {
        WD.Application _WDApplication;
        public WD.Application Instance
        {
            get
            {
                if (this._WDApplication == null)
                {

                    if (this.WDProcess != null)
                    {
                        // First, get Excel's main window handle.
                        int hwnd = (int)this.WDProcess.MainWindowHandle;

                        // We need to enumerate the child windows to find one that
                        // supports accessibility. To do this, instantiate the
                        // delegate and wrap the callback method in it, then call
                        // EnumChildWindows, passing the delegate as the 2nd arg.
                        if (hwnd != 0)
                        {
                            int hwndChild = 0;
                            cb = new Win32.EnumChildCallback(EnumChildProc);
                            Win32.EnumChildWindows(hwnd, cb, ref hwndChild);

                            // If we found an accessible child window, call
                            // AccessibleObjectFromWindow, passing the constant
                            // OBJID_NATIVEOM (defined in winuser.h) and
                            // IID_IDispatch - we want an IDispatch pointer
                            // into the native object model.
                            if (hwndChild != 0)
                            {
                                const uint OBJID_NATIVEOM = 0xFFFFFFF0;
                                Guid IID_IDispatch = new Guid("{00020400-0000-0000-C000-000000000046}");
                                WD.Window ptr = null;

                                int hr = AccessibleObjectFromWindow(hwndChild, OBJID_NATIVEOM, IID_IDispatch.ToByteArray(), ref ptr);
                                if (hr >= 0)
                                {
                                    // If we successfully got a native OM
                                    // IDispatch pointer, we can QI this for
                                    // an Excel Application (using the implicit
                                    // cast operator supplied in the PIA).
                                    _WDApplication = ptr.Application;
                                }
                            }
                        }
                    }


                    if (this._WDApplication == null)
                    {
                        this._WDApplication = new WD.Application();
                    }
                }

                return this._WDApplication;
            }
        }

        Process _WDProcess;
        Process WDProcess
        {
            get
            {
                if (this._WDProcess == null)
                {
                    this._WDProcess = Process.GetProcessesByName("WINWORD").Where(i => i.HasExited == false).FirstOrDefault();
                    if (this._WDProcess != null)
                    {
                        this._WDProcess.Exited += Process_Exited;
                    }
                }

                return this._WDProcess;
            }
        }

        public void Show()
        {
            if (this.Instance != null)
            {
                this.Instance.Visible = true;
                if (this.WDProcess != null)
                {
                    Win32.BringWindowToTop(this.WDProcess.MainWindowHandle);
                }
            }
        }

        public void Hide()
        {
            if (this.Instance != null)
            {
                if (this.WDProcess != null)
                {
                    Win32.SetForegroundWindow(this.WDProcess.MainWindowHandle);
                }
            }
        }

        void Process_Exited(object sender, EventArgs e)
        {
            this._WDProcess.Exited -= Process_Exited;
            this._WDProcess = null;
            this._WDApplication = null;
        }


        [DllImport("Oleacc.dll")]
        public static extern int AccessibleObjectFromWindow(
              int hwnd, uint dwObjectID, byte[] riid,
              ref WD.Window ptr);

        private Win32.EnumChildCallback cb;
        public bool EnumChildProc(int hwndChild, ref int lParam)
        {
            StringBuilder buf = new StringBuilder(128);
            Win32.GetClassName(hwndChild, buf, 128);
            if (buf.ToString() == "WORD7")
            {
                lParam = hwndChild;
                return false;
            }
            return true;
        }

    }
}
