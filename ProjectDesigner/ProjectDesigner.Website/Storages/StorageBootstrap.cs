using System;
using System.Collections.Generic;
using System.Linq;
using WebActivator;
using EBA.Modules.Authorizations;
using EBA.IoC;
using System.Web;
using EBA.Localization;
using Microsoft.Web.Infrastructure;
using Microsoft.Web.Infrastructure.DynamicModuleHelper;
using System.Web.Compilation;

[assembly: WebActivator.PreApplicationStartMethodAttribute(typeof(ProjectDesigner.Website.Storages.StorageBootstrap), "Initialize")]
namespace ProjectDesigner.Website.Storages
{
    /// <summary>
    /// 导航系统WEB启动器
    /// </summary>
    public static class StorageBootstrap
    {
        /// <summary>
        /// 注册导航的WEB请求模块。
        /// </summary>
        public static void Initialize()
        {
            DynamicModuleUtility.RegisterModule(typeof(StorageHttpModule));
        }
    }
}
