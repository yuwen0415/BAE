using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EXLibrary.Office
{
    public class OfficeHelper
    {
        #region 检测Office是否安装
        ///<summary>
        /// 检测是否安装office
        ///</summary>
        ///<param name="office_Version"> 获得并返回安装的office版本</param>
        ///<returns></returns>
        public static bool IsInstallOffice(out string office_Version, out string office_Path)
        {
            bool result = false;
            string str_OfficePath = string.Empty;
            string str_OfficeVersion = string.Empty;
            office_Version = string.Empty;
            office_Path = string.Empty;

            GetOfficePath(out str_OfficePath, out str_OfficeVersion);
            if (!string.IsNullOrEmpty(str_OfficePath) && !string.IsNullOrEmpty(str_OfficeVersion))
            {
                result = true;
                office_Version = str_OfficeVersion;
                office_Path = str_OfficePath;
            }
            return result;
        }

        ///<summary>
        /// 获取并返回当前安装的office版本和安装路径
        ///</summary>
        ///<param name="str_OfficePath">office的安装路径</param>
        ///<param name="str_OfficeVersion">office的安装版本</param>
        private static void GetOfficePath(out string str_OfficePath, out string str_OfficeVersion)
        {
            string str_PatheResult = string.Empty;
            string str_VersionResult = string.Empty;
            string str_KeyName = "Path";
            object objResult = null;
            Microsoft.Win32.RegistryValueKind regValueKind;//指定在注册表中存储值时所用的数据类型，或标识注册表中某个值的数据类型。
            Microsoft.Win32.RegistryKey regKey = null;//表示 Windows 注册表中的项级节点(注册表对象?)
            Microsoft.Win32.RegistryKey regSubKey = null;
            try
            {
                regKey = Microsoft.Win32.Registry.LocalMachine;//读取HKEY_LOCAL_MACHINE项
                if (regSubKey == null)
                {//office97
                    regSubKey = regKey.OpenSubKey(@"SOFTWARE\Microsoft\Office\8.0\Common\InstallRoot", false);//如果bool值为true则对打开的项进行读写操作,否则为只读打开
                    str_VersionResult = "Office97";
                    str_KeyName = "OfficeBin";
                }
                if (regSubKey == null)
                {//Office2000
                    regSubKey = regKey.OpenSubKey(@"SOFTWARE\Microsoft\Office\9.0\Common\InstallRoot", false);
                    str_VersionResult = "Office2000";
                    str_KeyName = "Path";
                }
                if (regSubKey == null)
                {//officeXp
                    regSubKey = regKey.OpenSubKey(@"SOFTWARE\Microsoft\Office\10.0\Common\InstallRoot", false);
                    str_VersionResult = "OfficeXP";
                    str_KeyName = "Path";
                }

                if (regSubKey == null)
                {//Office2003
                    regSubKey = regKey.OpenSubKey(@"SOFTWARE\Microsoft\Office\11.0\Common\InstallRoot", false);
                    str_VersionResult = "Office2003";
                    str_KeyName = "Path";
                    try
                    {
                        objResult = regSubKey.GetValue(str_KeyName);
                        regValueKind = regSubKey.GetValueKind(str_KeyName);
                    }
                    catch (Exception ex)
                    {
                        regSubKey = null;
                    }
                }

                if (regSubKey == null)
                {//office2007
                    regSubKey = regKey.OpenSubKey(@"SOFTWARE\Microsoft\Office\12.0\Common\InstallRoot", false);
                    str_VersionResult = "Office2007";
                    str_KeyName = "Path";
                }
                if (regSubKey == null)
                {
                    regSubKey = regKey.OpenSubKey(@"SOFTWARE\\Microsoft\\Office\\14.0\\Common\\InstallRoot\\", false);
                    str_VersionResult = "Office2010";
                    str_KeyName = "Path";
                }

                objResult = regSubKey.GetValue(str_KeyName);
                regValueKind = regSubKey.GetValueKind(str_KeyName);
                if (regValueKind == Microsoft.Win32.RegistryValueKind.String)
                {
                    str_PatheResult = objResult.ToString();
                }
            }
            catch (Exception ex)
            {
                //throw ex;
            }
            finally
            {
                if (regKey != null)
                {
                    regKey.Close();
                    regKey = null;
                }

                if (regSubKey != null)
                {
                    regSubKey.Close();
                    regSubKey = null;
                }
            }
            str_OfficePath = str_PatheResult;
            str_OfficeVersion = str_VersionResult;
        }
        #endregion

    }
}
