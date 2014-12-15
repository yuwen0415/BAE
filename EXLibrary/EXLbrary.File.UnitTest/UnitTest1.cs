using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using EXLibrary.File;
using EXLibrary.File.WordFile;
using System.IO;
using System.Diagnostics;

namespace EXLbrary.File.UnitTest
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void GetWordContent()
        {
            //IOfficeFile
            var stopwatch = new Stopwatch();
            stopwatch.Start(); //  开始监视代码

            var wordfileMnt = new WordDocumentFileManagement(new WordDocumentFile(new FileInfo(@"F:\迅雷下载\会议纪要140107--修改.doc")));
            wordfileMnt.Open();
            var test = (wordfileMnt.File as IOfficeFile).Content;
            wordfileMnt.Close();

            stopwatch.Stop();

            TimeSpan timeSpan = stopwatch.Elapsed; //  获取总时间
        }

        [TestMethod]
        public void WordSaveAsTxt()
        {
            var wordfileMnt = new WordDocumentFileManagement(new WordDocumentFile(new FileInfo(@"F:\迅雷下载\会议纪要140107--修改.doc")));
            wordfileMnt.SaveAs();
            wordfileMnt.Close();
        }

        [TestMethod]
        public void GetWordContentByBinary()
        {
            IFile document = DocumentFileFactory.CreateFile(new FileInfo(@"E:\公安局资料\项目\智能交通系统建设总体规划及示范路\示范路\关于厦门市智能交通试点工程的情况报告\关于厦门市智能交通试点工程的情况报告20130825.doc"));
            IFileManagement documentManager = DocumentFileManagementFactory.CreateDocumentFileManagement(document as IDocumentFile);
            if (documentManager != null)
            {
                try
                {
                    documentManager.Open();
                    var _return = (documentManager.File as IDocumentFile).Content;
                }
                catch (Exception ex)
                {
                    return;
                }
            }
        }

        [TestMethod]
        public void GetPPTCont()
        {
            
        }
    }
}
