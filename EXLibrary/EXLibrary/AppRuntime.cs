using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Configuration;
using System.IO;
using Microsoft.Win32;
using EXLibrary.Exceptions;

namespace EXLibrary
{
    /// <summary>
    /// 运行环境信息。
    /// </summary>
    public static class AppRuntime
    {
        /// <summary>
        /// 是不是Web程序。
        /// </summary>
        public static bool IsWebApplication
        {
            get
            {
                return AppDomain.CurrentDomain.SetupInformation.ConfigurationFile.EndsWith("web.config", StringComparison.InvariantCulture);
            }
        }

        /// <summary>
        /// 程序所在根路径。
        /// </summary>
        public static string ApplicationPath
        {
            get
            {
                return AppDomain.CurrentDomain.SetupInformation.ApplicationBase;
            }
        }

        /// <summary>
        /// 程序运行文件路径。
        /// </summary>
        public static string AssemblyPath
        {
            get
            {
                if (IsWebApplication)
                {
                    return AppDomain.CurrentDomain.SetupInformation.ApplicationBase + "\\bin";
                }
                else
                {
                    return AppDomain.CurrentDomain.SetupInformation.ApplicationBase;
                }
            }
        }

        public static string GetWindowsServicePath(string serviceName)
        {

            string key = @"SYSTEM\CurrentControlSet\Services\" + serviceName;
            string path = Registry.LocalMachine.OpenSubKey(key).GetValue("ImagePath").ToString();
            if (!string.IsNullOrWhiteSpace(path))
            {
                //替换掉双引号   
                path = path.Replace("\"", string.Empty);
                FileInfo fi = new FileInfo(path);
                return fi.Directory.ToString();
            }
            else
            {
                throw new NotFindWindowsServiceException("没有找到对应的windows服务！");
            }
        }

        /// <summary>
        /// 打开指定路径的配置信息。
        /// </summary>
        public static Configuration OpenConfiguration(string configPath = null)
        {
            var map = new ExeConfigurationFileMap { ExeConfigFilename = configPath ?? AppDomain.CurrentDomain.SetupInformation.ConfigurationFile };

            return ConfigurationManager.OpenMappedExeConfiguration(map, ConfigurationUserLevel.None);
        }
    }
}
