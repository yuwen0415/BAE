using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows;
using System.Windows.Threading;

namespace EXLibrary.Xaml
{
    internal sealed class ShowAndWaitHelper
    {
        private readonly Window Window;

        private DispatcherFrame DispatcherFrame;

        internal ShowAndWaitHelper(Window window)
        {
            if (window == null)
                throw new ArgumentNullException("panel");
            Window = window;
        }

        internal void ShowAndWait()
        {
            if (this.DispatcherFrame != null)
                throw new InvalidOperationException("Cannot call ShowAndWait while waiting for a previous call to ShowAndWait to return.");

            this.Window.Closed += Window_Closed;
            this.Window.Show();
            this.Window.Activate();
            this.DispatcherFrame = new DispatcherFrame();
            Dispatcher.PushFrame(this.DispatcherFrame);
        }

        private void Window_Closed(object sender, EventArgs e)
        {
            if (this.DispatcherFrame == null)
                return;
            this.DispatcherFrame.Continue = false;
        }
    }
}
