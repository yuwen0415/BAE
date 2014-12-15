using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Configuration;

namespace EXLibrary
{
    public static class SettingManager
    {
        /// <summary>
        /// 默认数据库连接名称
        /// </summary>
        public static string DefaultConnectionName = "Database";

        /// <summary>
        /// 读取指定名称的数据库连接配置，如果不存在，则读取默认的数据库连接
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public static string GetConnection(string name = null)
        {

            var conn = ConfigurationManager.ConnectionStrings[name];

            if (conn == null)
            {
                conn = ConfigurationManager.ConnectionStrings[DefaultConnectionName];
            }

            if (conn == null)
            {
                throw new Exception("数据库连接未被配置");
            }

            return conn.ConnectionString;
        }

        /// <summary>
        /// 读取AppSettings配置节点的值
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public static string GetAppSetting(string name)
        {
            return ConfigurationManager.AppSettings.Get(name);
        }
    }
}
