using EXLibrary.File;
using EXLibrary.File.ExcelFile;
using EXLibrary.File.TxtFile;
using EXLibrary.File.WordFile;
using EXLibrary.Parallel;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace FindFiles.Domain
{
    public class FindManagement
    {
        bool IsFinding = true;

        bool IsParallel = false;

        int Num = 0;

        public bool FindByName = true;
        public bool FindByContent = false;
        /// <summary>
        /// 在结果中查找
        /// </summary>
        public bool FindInResult = false;

        public event EventHandler.FileFoundHandler FileFound;

        public string Keyword { get; set; }

        public string Path { get; set; }

        public List<FoundFile> FoundFiles = new List<FoundFile>();

        IParallel Parallel = new ParallelMicrosoft();

        /// <summary>
        /// 待查文件类型
        /// </summary>
        public IDictionary<string, string> UnknownOriginFileExtension = new Dictionary<string, string>();



        public FindManagement()
        {
            this.DirectorySafeAdd<string, string>(FoundFile.BesidesFileNames, "$RECYCLE.BIN", "$RECYCLE.BIN");
            this.DirectorySafeAdd<string, string>(FoundFile.BesidesFileNames, "System Volume Information", "System Volume Information");
        }

        public void Start(bool isParallel = false)
        {
            this.Num = 0;

            this.IsParallel = isParallel;
            this.IsFinding = true;

            try
            {
                if (!this.FindInResult)
                {
                    if (isParallel)
                    {
                        this.ParallelFind(Keyword, Path);
                    }
                    else
                    {

                        this.SingleThreadFind(Keyword, Path);
                    }
                }
                else
                    this.FindFile(Keyword, FoundFiles);
            }
            catch (Exception ex)
            {
                return;
            }
        }

        public void StopFind()
        {
            if (this.IsParallel)
            {
                Parallel.Stop();
            }
            this.IsFinding = false;
        }

        public event GetNowSeekFileEventHandle GetNowSeekFile;

        #region 内部实现

        private void SingleThreadFind(string keyword, string path)
        {
            if (GetNowSeekFile != null)
                GetNowSeekFile(path);
            if (IsFinding)
            {

                path = FormatPath(path);
                var dir = new DirectoryInfo(path);
                var files = dir.GetFiles("*.*");
                foreach (var file in files)
                {
                    if (AnalyzeFileInfo(file, keyword))
                    {
                        this.Num++;
                        var item = FoundFile.NewFile(file);
                        item.Num = this.Num;
                        this.RespondFound(item);
                    }
                }

                var directories = dir.GetDirectories();
                foreach (var directory in directories)
                {
                    if (!FoundFile.BesidesFileNames.ContainsKey(directory.Name))
                        this.SingleThreadFind(keyword, directory.FullName);
                }
            }
        }

        private void ParallelFind(string keyword, string path)
        {
            if (GetNowSeekFile != null)
                GetNowSeekFile(path);
            if (IsFinding)
            {
                path = FormatPath(path);
                DirectoryInfo dir;
                FileInfo[] files;

                try
                {
                    dir = new DirectoryInfo(path);
                    files = dir.GetFiles("*.*");
                }
                catch (Exception ex)
                {
                    DirectorySafeAdd<string, string>(FoundFile.BesidesFileNames, path, path);
                    return;
                }
                Parallel.Start(files, x =>
                {
                    if (AnalyzeFileInfo(x, keyword))
                    {
                        this.Num++;
                        var item = FoundFile.NewFile(x);
                        item.Num = this.Num;
                        this.RespondFound(item);
                    }
                });

                var directories = dir.GetDirectories();

                Parallel.Start(directories, i =>
                {
                    if (!FoundFile.BesidesFileNames.ContainsKey(i.Name))
                        this.ParallelFind(keyword, i.FullName);
                });
            }
        }

        private void FindFile(string keyword, List<FoundFile> files)
        {
            if (this.IsParallel)
            {
                Parallel.Start(files, x =>
                {
                    var fileiInfo = new FileInfo(x.FullName);
                    if (AnalyzeFileInfo(fileiInfo, keyword))
                    {
                        this.Num++;
                        var item = FoundFile.NewFile(fileiInfo);
                        item.Num = this.Num;
                        this.RespondFound(item);
                    }
                });
            }
            else
            {
                foreach (var file in files)
                {
                    var fileiInfo = new FileInfo(file.FullName);
                    if (AnalyzeFileInfo(fileiInfo, keyword))
                    {
                        this.Num++;
                        var item = FoundFile.NewFile(fileiInfo);
                        item.Num = this.Num;
                        this.RespondFound(item);
                    }
                }
            }
        }

        private string FormatPath(string path)
        {
            var drivers = System.IO.DriveInfo.GetDrives();

            if (path.Length <= 3)
            {
                var startstr = path.Substring(0, 1).ToUpper();
                var driver = drivers.Where(i => i.Name.Contains(startstr)).FirstOrDefault();
                if (driver != null)
                {
                    path = driver.Name;
                }
            }
            return path;
        }

        private void RespondFound(FoundFile file)
        {
            if (FileFound != null)
            {
                FileFound(file);
            }
        }

        private void DirectorySafeAdd<T, F>(IDictionary<T, F> dictionary, T key, F value)
        {
            if (!dictionary.ContainsKey(key))
                dictionary.Add(key, value);
        }

        private bool AnalyzeFileInfo(FileInfo fileinfo, string keyword)
        {
            bool _return = false;

            if (this.FindByName)
            {
                _return = fileinfo.Name.Contains(keyword) && !fileinfo.Name.StartsWith("~$");
            }


            if (this.FindByContent && !_return && UnknownOriginFileExtension.ContainsKey(fileinfo.Extension.ToLower()))
            {
                try
                {
                    IFile document = DocumentFileFactory.CreateFile(fileinfo);
                    if (document != null)
                    {
                        IFileManagement documentManager = DocumentFileManagementFactory.CreateDocumentFileManagement(document as IDocumentFile);
                        if (documentManager != null)
                        {

                            documentManager.Open();
                            _return = (documentManager.File as IDocumentFile).Content.Contains(keyword);

                        }
                    }
                }
                catch (Exception ex)
                {
                    _return = false;
                }
            }

            return _return;
        }

        #endregion

    }

    public delegate void GetNowSeekFileEventHandle(string path);

}
