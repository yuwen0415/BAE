using EXLibrary.File;
using EXLibrary.Xaml.MVVM;
using FindFiles.Domain;
using ReactiveUI;
using ReactiveUI.Xaml;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Windows;
using System.Windows.Forms;

namespace FindFiles.Views
{
    public class MainWindowModel : ViewModelBase
    {
        bool _IsStart;
        public bool IsStart
        {
            get
            {
                return _IsStart;
            }
            set
            {
                this.RaiseAndSetIfChanged(ref _IsStart, value);
            }
        }

        string _KeyWord;
        public string KeyWord
        {
            get
            {
                return _KeyWord;
            }
            set
            {
                this.RaiseAndSetIfChanged(ref _KeyWord, value);
            }
        }

        string _Directory = @"E:\公安局资料";
        public string Directory
        {
            get
            {
                return this._Directory;
            }
            set
            {
                this.RaiseAndSetIfChanged(ref _Directory, value);
            }
        }

        string _Result;
        public string Result
        {
            get
            {
                return _Result;
            }
            set
            {
                this.RaiseAndSetIfChanged(ref _Result, value);
            }
        }

        IFile _SelectedItem;
        public IFile SelectedItem
        {
            get
            {
                return _SelectedItem;
            }
            set
            {
                this.RaiseAndSetIfChanged(ref _SelectedItem, value);
            }
        }

        FindManagement _FindMnt;
        FindManagement FindMnt
        {
            get
            {
                if (this._FindMnt == null)
                {
                    this._FindMnt = new FindManagement();
                    _FindMnt.FileFound += findmnt_FileFound;
                }
                return _FindMnt;
            }
            set
            {
                this._FindMnt = value;
            }
        }

        /// <summary>
        /// 是否在结果中查找
        /// </summary>
        bool _FindInResult;
        public bool FindInResult
        {
            get
            {
                return _FindInResult;
            }
            set
            {
                this.RaiseAndSetIfChanged(ref _FindInResult, value);
            }
        }

        bool _FindByName = true;
        public bool FindByName
        {
            get
            {
                return _FindByName;
            }
            set
            {
                this.RaiseAndSetIfChanged(ref _FindByName, value);
            }
        }

        bool _FindByContent;
        public bool FindByContent
        {
            get
            {
                return _FindByContent;
            }
            set
            {
                this.RaiseAndSetIfChanged(ref _FindByContent, value);
            }
        }

        bool _FindTxt;
        public bool FindTxt
        {
            get
            {
                return _FindTxt;
            }
            set
            {
                this.RaiseAndSetIfChanged(ref _FindTxt, value);
            }
        }

        bool _FindWord;
        public bool FindWord
        {
            get
            {
                return _FindWord;
            }
            set
            {
                this.RaiseAndSetIfChanged(ref _FindWord, value);
            }
        }

        bool _FindExcel;
        public bool FindExcel
        {
            get
            {
                return _FindExcel;
            }
            set
            {
                this.RaiseAndSetIfChanged(ref _FindExcel, value);
            }
        }


        bool _FindPowerPoint;
        public bool FindPowerPoint
        {
            get
            {
                return _FindPowerPoint;
            }
            set
            {
                this.RaiseAndSetIfChanged(ref _FindPowerPoint, value);
            }
        }


        bool _FindParallel;
        public bool FindParallel
        {
            get
            {
                return _FindParallel;
            }
            set
            {
                this.RaiseAndSetIfChanged(ref _FindParallel, value);
            }
        }


        #region 按钮
        ReactiveAsyncCommand _Find;
        public ReactiveAsyncCommand Find
        {
            get
            {
                if (_Find == null)
                {
                    _Find = new ReactiveAsyncCommand(this.WhenAny(x => x.KeyWord, x => !string.IsNullOrEmpty(x.Value)));
                    _Find.RegisterAsyncAction(i =>
                    {
                        this.Result = "开始查找!";
                        IsStart = true;
                        var stopwatch = new Stopwatch();
                        stopwatch.Start(); //  开始监视代码

                        FindMnt.FindInResult = this.FindInResult;
                        FindMnt.FoundFiles = this.Items.ToList<FoundFile>();

                        this.InvokeToUI((Action)delegate() { this.Items.Clear(); });

                        FindMnt.Keyword = this.KeyWord;
                        FindMnt.Path = this.Directory;

                        FindMnt.FindByContent = this.FindByContent;
                        FindMnt.FindByName = this.FindByName;
                        FindMnt.GetNowSeekFile += FindMnt_GetNowSeekFile;

                        FindMnt.UnknownOriginFileExtension = new Dictionary<string, string>();
                        if (this.FindExcel)
                        {
                            FindMnt.UnknownOriginFileExtension.Add(".xls", ".xls");
                            FindMnt.UnknownOriginFileExtension.Add(".xlsx", ".xlsx");
                        }
                        else if (this.FindWord)
                        {
                            FindMnt.UnknownOriginFileExtension.Add(".doc", ".doc");
                            FindMnt.UnknownOriginFileExtension.Add(".docx", ".docx");
                        }
                        else if (this.FindPowerPoint)
                        {
                            FindMnt.UnknownOriginFileExtension.Add(".ppt", ".ppt");
                            FindMnt.UnknownOriginFileExtension.Add(".pptx", ".pptx");
                        }
                        else if (this.FindTxt)
                        {
                            FindMnt.UnknownOriginFileExtension.Add(".txt", ".txt");
                        }




                        FindMnt.Start(this.FindParallel);

                        IsStart = false;

                        stopwatch.Stop();

                        TimeSpan timeSpan = stopwatch.Elapsed; //  获取总时间

                        this.Result = "已完成查找！共发现" + this.Items.Count + "个符合条件的文档！" + "\r\n共使用时间:" + timeSpan.TotalSeconds + "秒";
                    });
                }
                return _Find;
            }
        }

        private void FindMnt_GetNowSeekFile(string path)
        {
            this.InvokeToUI((Action)delegate() // <--- HERE
            {
                // this.Items.Clear();
                this.Result = string.Format("正在查找文件为{0}", path);
            });
        }


        ReactiveCommand _Cancel;
        public ReactiveCommand Cancel
        {
            get
            {
                if (_Cancel == null)
                {
                    _Cancel = new ReactiveCommand(this.WhenAny(x => x.IsStart, x => x.Value == true));
                    _Cancel.Subscribe(i =>
                        {
                            IsStart = false;
                            FindMnt.StopFind();
                            //TODO:取消查找
                        });
                }
                return _Cancel;
            }
        }

        ReactiveCommand _GetDirectory;
        public ReactiveCommand GetDirectory
        {
            get
            {
                if (_GetDirectory == null)
                {
                    _GetDirectory = new ReactiveCommand(this.WhenAny(x => x.Directory, x => true));
                    _GetDirectory.Subscribe(i =>
                    {
                        var fbd = new FolderBrowserDialog();
                        fbd.ShowDialog();
                        if (fbd.SelectedPath != string.Empty)
                            this.Directory = fbd.SelectedPath;
                    });
                }
                return _GetDirectory;
            }
        }

        ReactiveAsyncCommand _OpenFile;
        public ReactiveAsyncCommand OpenFile
        {
            get
            {
                if (_OpenFile == null)
                {
                    _OpenFile = new ReactiveAsyncCommand(this.WhenAny(x => x.SelectedItem, x => x.Value != null));
                    _OpenFile.RegisterAsyncAction(i =>
                    {
                        IFile document = DocumentFileFactory.CreateFile(new FileInfo(this.SelectedItem.FullName));
                        if (document != null)
                        {
                            IFileManagement documentManager = DocumentFileManagementFactory.CreateDocumentFileManagement(document as IDocumentFile);
                            if (documentManager != null)
                                documentManager.Show();
                            else
                                System.Windows.MessageBox.Show(string.Format("未找到打开文件[{0}]的程序！", this.SelectedItem.FileName));
                        }

                    });
                }
                return _OpenFile;
            }
        }

        ReactiveAsyncCommand _OpenPath;
        public ReactiveAsyncCommand OpenPath
        {
            get
            {
                if (_OpenPath == null)
                {
                    _OpenPath = new ReactiveAsyncCommand(this.WhenAny(x => x.SelectedItem, x => x.Value != null));
                    _OpenPath.RegisterAsyncAction(i =>
                    {
                        System.Diagnostics.Process.Start("explorer.exe", this.SelectedItem.DirectoryName);
                    });
                }
                return _OpenPath;
            }
        }
        #endregion



        ObservableCollection<FoundFile> _Items;
        public ObservableCollection<FoundFile> Items
        {
            get
            {
                if (this._Items == null)
                {
                    this._Items = new ObservableCollection<FoundFile>();
                }
                return _Items;
            }
            set
            {
                this.RaiseAndSetIfChanged(ref _Items, value);
            }
        }



        private void findmnt_FileFound(FoundFile file)
        {
            this.InvokeToUI((Action)delegate() // <--- HERE
            {
                // this.Items.Clear();
                this.Items.Add(file);
            });
        }

        private void InvokeToUI(Delegate action)
        {
            System.Windows.Application.Current.Dispatcher.Invoke(action);
        }
    }
}

