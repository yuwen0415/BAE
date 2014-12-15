using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using EXLibrary.Office.Word;
using EXLibrary.Office.Excel;
using System.IO;
using EXLibrary.Office.Excel.XLSX;

namespace EXLibrary.Office.UnitTest
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void TestWord()
        {
            var wordApplication = new WordActivator();
            object nullobj = System.Reflection.Missing.Value;
            object ofalse = false;
            object ofile = @"F:\迅雷下载\会议纪要140107--修改.doc";
            Microsoft.Office.Interop.Word.Document doc = wordApplication.Instance.Documents.Open(
                                            ref ofile, ref nullobj, true,
                                            ref nullobj, ref nullobj, ref nullobj,
                                            ref nullobj, ref nullobj, ref nullobj,
                                            ref nullobj, ref nullobj, ref nullobj,
                                            ref nullobj, ref nullobj, ref nullobj,
                                            ref nullobj);
            string result = doc.Content.Text.Trim();
            doc.Close(ref ofalse, ref nullobj, ref nullobj);
            wordApplication.Instance.Quit();
        }

        [TestMethod]
        public void TestGetWordContent()
        {
            var fileStream = new FileStream(@"F:\迅雷下载\会议纪要140107--修改.doc",
                                              FileMode.OpenOrCreate, FileAccess.ReadWrite, FileShare.ReadWrite);
            var reader = new StreamReader(fileStream, System.Text.Encoding.UTF32);
            var content = reader.ReadToEnd();
        }

        [TestMethod]
        public void TestExcel()
        {
            var ExcelApplication = new ExcelActivator();
            object nullobj = System.Reflection.Missing.Value;
            object ofalse = false;
            string ofile = @"F:\迅雷下载\轨道交通1号线施工期间交通疏解方案审核表.xls";
            Microsoft.Office.Interop.Excel.Workbook workbook = ExcelApplication.Instance.Workbooks.Open(ofile);
            //string result = doc.Content.Text.Trim();
            workbook.Close(false);
            ExcelApplication.Instance.Quit();
        }

        [TestMethod]
        public void TestExcelXlsx()
        {
            var xlsx = new SpreadsheetDocument();
            xlsx.LoadFile(@"E:\ExcelTest\baocanguanli.xlsx");
        }
    }
}
