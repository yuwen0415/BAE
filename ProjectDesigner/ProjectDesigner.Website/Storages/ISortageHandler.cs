using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using EBA.Modules.Storages;

namespace ProjectDesigner.Website.Storages
{
    public interface ISortageHandler
    {
        IFile BizModule { get; set; }
    }
}
