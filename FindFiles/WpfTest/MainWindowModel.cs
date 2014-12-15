using ReactiveUI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace WpfTest
{
    public class MainWindowModel : ReactiveObject
    {
        string _Test = string.Empty;
        public string Test
        {
            get
            {
                return _Test;
            }
            set
            {
                this.RaiseAndSetIfChanged(ref _Test, value);
            }
        }
    }
}
