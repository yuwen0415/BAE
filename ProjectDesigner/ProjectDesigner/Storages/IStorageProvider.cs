using EBA.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ProjectDesigner
{
    /// <summary>
    /// 存储数据提供者
    /// </summary>
    public interface IStorageProvider : IUnitOfWork
    {
        /// <summary>
        /// 文件仓库
        /// </summary>
        IRepository<IFile> Files { get; }
    }
}
