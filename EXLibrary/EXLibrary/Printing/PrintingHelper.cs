using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Management;
using System.Printing;
using System.Runtime.InteropServices;
using System.Text;

namespace EXLibrary.Printing
{
    /// <summary>
    /// 打印帮助
    /// </summary>
    public class PrintingHelper
    {
        /// <summary>
        /// 获得本机的Mac地址
        /// </summary>
        /// <returns></returns>
        public static string GetServiceId()
        {
            string _return = null;
            ManagementClass mc = new ManagementClass("Win32_NetworkAdapterConfiguration");
            foreach (var mac in mc.GetInstances())
            {
                if (mac["IPEnabled"].ToString() == "True")
                {
                    return _return = mac["MacAddress"].ToString();
                }
            }
            return _return;
        }

        /// <summary>
        /// 获取本机的所有打印机
        /// </summary>
        /// <returns></returns>
        public static IDictionary<string, PrinterStatus> GetLocalPrinters()
        {
            var printers = new Dictionary<string, PrinterStatus>();
            var managementClass = new ManagementClass("Win32_Printer");
            var managementObjectCollection = managementClass.GetInstances();
            foreach (ManagementObject managementObject in managementObjectCollection)
            {
                var printerName = managementObject.Properties["Caption"].Value.ToString();
                var printerStatus = (PrinterStatus)GetPrinterStatusInt(printerName);
                printers.Add(printerName, printerStatus);
            }
            return printers;
        }

        /// <summary>
        /// 获得打印机的状态
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public static PrinterStatus GetPrinterStatus(string name)
        {
            return (PrinterStatus)GetPrinterStatusInt(name);
        }

        /// <summary>
        /// 打印机的状态（汉语）
        /// </summary>
        /// <param name="PrinterName">打印机名称</param>
        /// <returns></returns>
        public static string GetPrinterStatusName(string PrinterName)
        {
            int intValue = GetPrinterStatusInt(PrinterName);
            return TranslateStatusToMessage(intValue);
        }

        /// <summary>
        /// 打印机的状态（汉语）
        /// </summary>
        /// <param name="status">状态英语</param>
        /// <returns></returns>
        public static string GetPrinterStatusName(PrinterStatus status)
        {
            if (status == null)
            {
                return "未知状态（Unknown Status）";
            }
            int intValue = (int)status;
            return TranslateStatusToMessage(intValue);
        }

        /// <summary>
        /// 将PCL文件转换成可以显示的EMF文件
        /// </summary>
        /// <param name="sourcefile"></param>
        /// <param name="outfile"></param>
        public static void TranslatePCLToEMF(string sourcefile, string outfile)
        {
            bool addsig = false;
            var _return = new List<byte>();
            var buffer = System.IO.File.ReadAllBytes(sourcefile);


            var length = buffer.Length;
            var remainder = length % 4;
            int num = length / 4;
            if (remainder > 0)
            {
                num = num + 1;
            }
            for (var i = 0; i < num; i++)
            {
                var tempt = new byte[4];
                for (var j = 0; j < 4; j++)
                {
                    tempt[j] = buffer[i * 4 + j];
                }
                if (BitConverter.ToInt32(tempt, 0) == 12)
                {
                    addsig = true;
                }
                if (addsig)
                {
                    _return.AddRange(tempt);
                }
            }
            _return = _return.Skip(8).ToList();

            FileStream fs = new FileStream(outfile, FileMode.Create, FileAccess.Write);
            fs.Write(_return.ToArray(), 0, _return.ToArray().Length);
            fs.Close();
        }

        /// <summary>
        /// 获取指定打印机的打印任务信息
        /// </summary>
        /// <param name="name">打印机名称</param>
        /// <returns></returns>
        public static Dictionary<DateTime, PrintSystemJobInfo> GetPrintJobs(string name)
        {
            var tempDict = new Dictionary<DateTime, PrintSystemJobInfo>();

            PrintServer printServer = new PrintServer();

            PrintQueueCollection queues = printServer.GetPrintQueues();

            PrintQueue queue = queues.Where(i => i.Name == name).FirstOrDefault();

            queue.Refresh();
            if (queue.NumberOfJobs > 0)
            {
                var Jobs = queue.GetPrintJobInfoCollection();
                foreach (PrintSystemJobInfo job in Jobs)
                {
                    tempDict.Add(job.TimeJobSubmitted.AddHours(8), job);
                }
            }
            return tempDict;
        }

        /// <summary>
        /// 取消对应打印任务
        /// </summary>
        /// <param name="printerName">打印机名称</param>
        /// <param name="printJobID">打印任务Id</param>
        /// <returns></returns>
        public static bool CancelPrintJob(string printerName, int printJobID)
        {          
            bool isActionPerformed = false;
            try
            {
                var searchPrintJobs = new ManagementObjectSearcher("SELECT * FROM Win32_PrintJob");
                var prntJobCollection = searchPrintJobs.Get();
                foreach (ManagementObject prntJob in prntJobCollection)
                {
                    var jobInfo = prntJob.Properties["Name"].Value.ToString().Split(',');

                    if (Convert.ToInt32(jobInfo[1]) == printJobID && jobInfo[0] == printerName)
                    {
                        prntJob.Delete();
                        isActionPerformed = true;
                        break;
                    }
                }
            }
            catch (Exception sysException)
            {
                // Log the exception.                
                isActionPerformed = false;
            }

            return isActionPerformed;
        }

        #region 内部实现

        private static string TranslateStatusToMessage(int intValue)
        {
            string strRet = string.Empty;
            switch (intValue)
            {
                case 0:
                    strRet = "准备就绪（Ready）";
                    break;
                case 0x00000200:
                    strRet = "忙(Busy）";
                    break;
                case 0x00400000:
                    strRet = "被打开（Printer Door Open）";
                    break;
                case 0x00000002:
                    strRet = "错误(Printer Error）";
                    break;
                case 0x0008000:
                    strRet = "初始化(Initializing）";
                    break;
                case 0x00000100:
                    strRet = "正在输入,输出（I/O Active）";
                    break;
                case 0x00000020:
                    strRet = "手工送纸（Manual Feed）";
                    break;
                case 0x00040000:
                    strRet = "无墨粉（No Toner）";
                    break;
                case 0x00001000:
                    strRet = "不可用（Not Available）";
                    break;
                case 0x00000080:
                    strRet = "脱机（Off Line）";
                    break;
                case 0x00200000:
                    strRet = "内存溢出（Out of Memory）";
                    break;
                case 0x00000800:
                    strRet = "输出口已满（Output Bin Full）";
                    break;
                case 0x00080000:
                    strRet = "当前页无法打印（Page Punt）";
                    break;
                case 0x00000008:
                    strRet = "塞纸（Paper Jam）";
                    break;
                case 0x00000010:
                    strRet = "打印纸用完（Paper Out）";
                    break;
                case 0x00000040:
                    strRet = "纸张问题（Pager Problem）";
                    break;
                case 0x00000001:
                    strRet = "暂停（Paused）";
                    break;
                case 0x00000004:
                    strRet = "正在删除（Pending Deletion）";
                    break;
                case 0x00000400:
                    strRet = "正在打印（Printing）";
                    break;
                case 0x00004000:
                    strRet = "正在处理（Processing）";
                    break;
                case 0x00020000:
                    strRet = "墨粉不足（Toner Low）";
                    break;
                case 0x00100000:
                    strRet = "需要用户干预（User Intervention）";
                    break;
                case 0x20000000:
                    strRet = "等待（Waiting）";
                    break;
                case 0x00010000:
                    strRet = "热机中（Warming Up）";
                    break;
                default:
                    strRet = "未知状态（Unknown Status）";
                    break;
            }
            return strRet;
        }

        private static int GetPrinterStatusInt(string PrinterName)
        {
            int intRet = 0;
            IntPtr hPrinter;
            StructPrinterDefaults defaults = new StructPrinterDefaults();

            if (Win32.OpenPrinter(PrinterName, out hPrinter, ref defaults))
            {
                int cbNeeded = 0;
                bool bolRet = Win32.GetPrinter(hPrinter, 2, IntPtr.Zero, 0, out cbNeeded);
                if (cbNeeded > 0)
                {
                    IntPtr pAddr = Marshal.AllocHGlobal((int)cbNeeded);
                    bolRet = Win32.GetPrinter(hPrinter, 2, pAddr, cbNeeded, out cbNeeded);
                    if (bolRet)
                    {
                        Win32.PRINTER_INFO_2 Info2 = new Win32.PRINTER_INFO_2();

                        Info2 = (Win32.PRINTER_INFO_2)Marshal.PtrToStructure(pAddr, typeof(Win32.PRINTER_INFO_2));

                        intRet = System.Convert.ToInt32(Info2.Status);
                    }
                    Marshal.FreeHGlobal(pAddr);
                }
                Win32.ClosePrinter(hPrinter);
            }

            return intRet;
        }

        #endregion
    }
}
