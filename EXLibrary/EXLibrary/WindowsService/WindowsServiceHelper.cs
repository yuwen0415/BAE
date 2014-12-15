using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceProcess;
using System.Text;

namespace EXLibrary.WindowsService
{
    public class WindowsServiceHelper
    {
        static public ServiceController GetWindowsService(string serviceName)
        {
            return ServiceController.GetServices().Where(i => i.ServiceName == serviceName).FirstOrDefault();
        }
    }
}
