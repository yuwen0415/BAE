using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ProjectDesigner
{
    public interface IFile
    {
        /// <summary>
        /// 标识
        /// </summary>
        string Id { get; set; }

        /// <summary>
        /// 名称
        /// <remarks>
        /// 默认等于原始文件名称，不包含扩展名。
        /// </remarks>
        /// </summary>
        string Name { get; set; }

        /// <summary>
        /// 扩展名
        /// </summary>
        string Extension { get; set; }

        /// <summary>
        /// 原始文件名
        /// </summary>
        string FileName { get; set; }

        /// <summary>
        /// 备注说明
        /// </summary>
        string Remark { get; set; }

        /// <summary>
        /// 文件分类的扁平显示，以逗号为分隔符。
        /// </summary>
        string Tags { get; set; }

        /// <summary>
        /// 文件上传时间
        /// </summary>
        DateTime UploadedTime { get; set; }
    }
}
