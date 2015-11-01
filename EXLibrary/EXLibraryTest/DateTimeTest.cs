using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using EXLibrary.DateTimeEx;

namespace EXLibraryTest
{
    [TestClass]
    public class DateTimeTest
    {
        [TestMethod]
        public void TestDateTimeFormat()
        {
          var test =  DataTimeEx.Format("2014/12/30");
          Assert.AreEqual(test.ToString("yyyy/MM/dd"), "2014/12/30");
        }

        [TestMethod]
        public void TestDateTimeFormat1()
        {
            var test = DataTimeEx.Format("2014年12月30日");
            Assert.AreEqual(test.ToString("yyyy年MM月dd日"), "2014年12月30日");
        }
    }
}
