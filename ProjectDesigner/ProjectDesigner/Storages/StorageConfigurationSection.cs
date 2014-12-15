using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;

namespace ProjectDesigner
{
    /// <summary>
    /// 存储系统配置节点
    /// </summary>
    /// <example>
    ///<eba>
    ///  <storage path="">
    ///  <previews>
    ///  <preview extension="pdf" image=""/>
    ///  <preview extension="doc,docx" image="" />
    /// </previews>
    ///  </storage>
    ///</eba>
    /// </example>
    public class StorageConfigurationSection : ConfigurationSection
    {
        [ConfigurationProperty("path", IsRequired = false, DefaultValue = "")]
        public string Path
        {
            get { return (string)this["path"]; }
            set { this["path"] = value; }
        }

    }
}
