using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Management;
using System.Net;
using System.Net.Sockets;
using System.Text;

namespace EXLibrary.IP
{
    public class IPHelper
    {
        /// <summary>
        /// 获取当前局域网IP
        /// </summary>
        /// <returns></returns>
        public static string GetLocalHostIP()
        {
            IPAddress ipAddr = Dns.GetHostEntry(Dns.GetHostName())
                .AddressList
                .Where(i => i.IsIPv6LinkLocal == false).FirstOrDefault();
            if (ipAddr == null)
            {
                return "127.0.0.1";
            }
            return ipAddr.ToString();
        }

        /// <summary>
        /// 获取公网IP
        /// </summary>
        /// <returns></returns>
        public static string GetPublicIP()
        {
            string tempip = "";
            try
            {
                WebRequest wr = WebRequest.Create("http://city.ip138.com/ip2city.asp");
                Stream s = wr.GetResponse().GetResponseStream();
                StreamReader sr = new StreamReader(s, Encoding.Default);
                string all = sr.ReadToEnd(); //读取网站的数据

                int start = all.IndexOf("[") + 1;
                int end = all.IndexOf("]", start);
                tempip = all.Substring(start, end - start);
                sr.Close();
                s.Close();
            }
            catch
            {
                if (System.Net.Dns.GetHostEntry(System.Net.Dns.GetHostName()).AddressList.Length > 1)
                    tempip = System.Net.Dns.GetHostEntry(System.Net.Dns.GetHostName()).AddressList[1].ToString();
            }
            return tempip;
        }
        

        /// <summary>
        /// 获取Mac地址
        /// </summary>
        /// <returns></returns>
        public static string GetMac()
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
    }
}
