using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EXLibrary.Office.Excel.XLSX
{
    public static class StringHelper
    {
        public static string Join(string str, List<string> strArray)
        {
            var temp = "";
            for (var i = 0; i < strArray.Count(); i++)
            {
                if (i != strArray.Count() - 1)
                { temp += strArray[i] + str; }
                else
                {
                    temp += strArray[i];
                }

            }
            return temp;
        }
    }
}
