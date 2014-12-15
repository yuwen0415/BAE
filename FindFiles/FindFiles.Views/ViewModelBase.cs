using EXLibrary.Xaml.MVVM;
using ReactiveUI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace FindFiles.Views
{
    public class ViewModelBase : ReactiveObject, IViewModel
    {
        public IView View
        {
            get;
            set;
        }

        //private bool _CanHit;
        //public bool CanHit
        //{
        //    get 
        //    {
        //        return this._CanHit;
        //    }
        //    set 
        //    {
        //        this.RaiseAndSetIfChanged(ref _CanHit, value);
        //    }
        //}
    }
}
