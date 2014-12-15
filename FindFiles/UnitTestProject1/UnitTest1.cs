using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.IO;

namespace UnitTestProject1
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void TestMethod1()
        {
            var info = new FileInfo(@"E:\\公安局资料\\项目\\科技设施处项目\\莲岳隧道\\厦门莲岳隧道交通智能化工程初步设计预算.xlsx");

            var drives = System.IO.DriveInfo.GetDrives();
            

        }
    }
}
