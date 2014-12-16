using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ProjectDesigner
{
    public interface INavigator
    {
        /// <summary>
        /// 标识
        /// </summary>
        string Id { get; set; }
        /// <summary>
        /// 名称
        /// </summary>
        string Name { get; set; }
        /// <summary>
        /// 父导航
        /// </summary>
        //INavigator Parent { get; set; }
        /// <summary>
        /// 子导航集合
        /// </summary>
        //ICollection<INavigator> ChildNavigators { get; }


        /// <summary>
        ///所在布局位置
        /// </summary>
        string LayoutName { get; set; }

        /// <summary>
        /// 相对链接（互联网）
        /// </summary>
        string WebLink { get; set; }

        /// <summary>
        /// 链接（Windows）
        /// </summary>
        string WinLink { get; set; }

        /// <summary>
        /// 相对链接（移动互联网）
        /// </summary>
        string WapLink { get; set; }

        /// <summary>
        /// 排序
        /// </summary>
        int SortIndex { get; set; }

        /// <summary>
        /// 参数配置
        /// </summary>
        string Parameters { get; set; }

        /// <summary>
        /// 图片路径
        /// </summary>
        string IconFile { get; set; }
    }
}
