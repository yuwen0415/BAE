using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ProjectDesigner
{
    public class NavigatorNode
    {

        /// <summary>
        /// 构造函数
        /// </summary>
        public NavigatorNode()
        {
            this.ChildNodes = new List<NavigatorNode>();
        }

        /// <summary>
        /// 节点标识
        /// </summary>
        public string Id { get; set; }
        /// <summary>
        /// 节点名称
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// WebLink
        /// </summary>
        public string WebLink { get; set; }
        /// <summary>
        /// WinLink
        /// </summary>
        public string WinLink { get; set; }
        /// <summary>
        /// WapLink
        /// </summary>
        public string WapLink { get; set; }

        /// <summary>
        /// 参数配置
        /// </summary>
        public string Parameters { get; set; }

        /// <summary>
        /// 图片路径
        /// </summary>
        public string IconFile { get; set; }

        /// <summary>
        /// 子节点
        /// </summary>
        public List<NavigatorNode> ChildNodes { get; set; }

    }
}
