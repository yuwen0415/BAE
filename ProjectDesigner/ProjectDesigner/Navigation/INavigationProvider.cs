using EBA.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ProjectDesigner
{
    public interface INavigationProvider : IUnitOfWork
    {
        IRepository<INavigator> Navigators { get; }
    }
}
