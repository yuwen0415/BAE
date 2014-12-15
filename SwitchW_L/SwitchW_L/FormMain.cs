using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.Linq;
using System.Management;
using System.Text;
using System.Windows.Forms;

namespace SwitchW_L
{
    public partial class FormMain : Form
    {
        public FormMain()
        {
            InitializeComponent();
        }

        private void btnWireless_Click(object sender, EventArgs e)
        {
            try
            {
                if (ChangeNetworkConnectionStatus(false, "本地连接") && ChangeNetworkConnectionStatus(true, "无线网络连接"))
                {
                    this.btnWireless.Enabled = false;
                    this.btnLine.Enabled = true;
                    this.txtStatus.Text += DateTime.Now.ToString() + ":" + "切换成功！"+"\n";
                }
                else
                    this.txtStatus.Text += DateTime.Now.ToString() + ":" + "切换失败！" + "\n";
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.ToString());
            }
        }

        private void btnLine_Click(object sender, EventArgs e)
        {
            try
            {
                if (ChangeNetworkConnectionStatus(true, "本地连接") && ChangeNetworkConnectionStatus(false, "无线网络连接"))
                {
                    this.btnWireless.Enabled = true;
                    this.btnLine.Enabled = false;
                    this.txtStatus.Text += DateTime.Now.ToString() + ":" + "切换成功！" + "\n";
                }
                else
                    this.txtStatus.Text += DateTime.Now.ToString() + ":" + "切换失败！" + "\n";
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.ToString());
            }
        }

        /// <summary>
        /// 禁用网卡
        /// </summary>
        /// <param name="network"></param>
        /// <returns></returns>
        private bool DisableNetWork(ManagementObject network)
        {
            try
            {
                network.InvokeMethod("Disable", null);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return false;
            }
        }

        /// <summary>
        /// 启用网卡
        /// </summary>
        /// <param name="netWorkName">网卡名</param>
        /// <returns></returns>
        private bool EnableNetWork(ManagementObject network)
        {
            try
            {
                network.InvokeMethod("Enable", null);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return false;
            }
        }


        //http://blog.sina.com.cn/s/blog_552ca88a0100tz6b.html
        private bool ChangeNetworkConnectionStatus(bool enable, string networkConnectionName)
        {
            using (Process process = new Process())
            {
                string netshCmd = "interface set interface name=\"{0}\" admin={1}";
                process.EnableRaisingEvents = false;
                process.StartInfo.Arguments = String.Format(netshCmd, networkConnectionName, enable ? "ENABLED" : "DISABLED");
                process.StartInfo.FileName = "netsh.exe";
                process.StartInfo.CreateNoWindow = true;
                process.StartInfo.ErrorDialog = false;
                process.StartInfo.RedirectStandardError = false;
                process.StartInfo.RedirectStandardInput = false;
                process.StartInfo.RedirectStandardOutput = true;
                process.StartInfo.UseShellExecute = false;
                process.Start();
                string rtn = process.StandardOutput.ReadToEnd();
                if (rtn.Trim().Length == 0)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }


    }
}
