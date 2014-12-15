using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using XL = Microsoft.Office.Interop.Excel;

namespace EXLibrary.Office.Excel
{
    /// <summary> 
    /// http://blogs.officezealot.com/whitechapel/archive/2005/04/10/4514.aspx
    /// </summary>
    public class ExcelActivator
    {
        XL.Application _XLApplication;

        public XL.Application Instance
        {
            get
            {
                if (this._XLApplication == null)
                {

                    if (this.XLProcess != null)
                    {
                        // First, get Excel's main window handle.
                        int hwnd = (int)this.XLProcess.MainWindowHandle;

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
                                XL.Window ptr = null;

                                int hr = AccessibleObjectFromWindow(hwndChild, OBJID_NATIVEOM, IID_IDispatch.ToByteArray(), ref ptr);
                                if (hr >= 0)
                                {
                                    // If we successfully got a native OM
                                    // IDispatch pointer, we can QI this for
                                    // an Excel Application (using the implicit
                                    // cast operator supplied in the PIA).
                                    _XLApplication = ptr.Application;
                                }
                            }
                        }
                    }


                    if (this._XLApplication == null)
                    {
                        this._XLApplication = new XL.Application();
                    }
                }

                return this._XLApplication;
            }
        }

        Process _XLProcess;
        Process XLProcess
        {
            get
            {
                if (this._XLProcess == null)
                {
                    this._XLProcess = Process.GetProcessesByName("EXCEL").Where(i => i.HasExited == false).FirstOrDefault();
                    if (this._XLProcess != null)
                    {
                        this._XLProcess.Exited += Process_Exited;
                    }
                }

                return this._XLProcess;
            }
        }

        public void Show()
        {
            if (this.Instance != null)
            {
                this.Instance.Visible = true;
                if (this.XLProcess != null)
                {
                    Win32.BringWindowToTop(this.XLProcess.MainWindowHandle);
                }
            }
        }

        public void Hide()
        {
            if (this.Instance != null)
            {
                if (this.XLProcess != null)
                {
                    Win32.SetForegroundWindow(this.XLProcess.MainWindowHandle);
                }
            }
        }

        void Process_Exited(object sender, EventArgs e)
        {
            this._XLProcess.Exited -= Process_Exited;
            this._XLProcess = null;
            this._XLApplication = null;
        }

        private Win32.EnumChildCallback cb;
        public bool EnumChildProc(int hwndChild, ref int lParam)
        {
            StringBuilder buf = new StringBuilder(128);
            Win32.GetClassName(hwndChild, buf, 128);
            if (buf.ToString() == "EXCEL7")
            {
                lParam = hwndChild;
                return false;
            }
            return true;
        }

        [DllImport("Oleacc.dll")]
        public static extern int AccessibleObjectFromWindow(
              int hwnd, uint dwObjectID, byte[] riid,
              ref XL.Window ptr);

        public void OpenAndPrint(string fileName)
        {
            var workbook = this.Instance.Workbooks.Open(fileName, Type.Missing, Type.Missing, Type.Missing, Type.Missing, Type.Missing, Type.Missing, Type.Missing, Type.Missing, Type.Missing, Type.Missing, Type.Missing, Type.Missing, Type.Missing, Type.Missing);
            this.Show();
            workbook.PrintPreview(Type.Missing);
        }
    }
}
