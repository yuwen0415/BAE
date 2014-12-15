using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace EXLibrary.Office.Excel.XLSX
{
    public class Range
    {
        public Range(string range)
        {
            var items = range.Split(':');

            var start = FindPosition(items[0]);
            this.StartRow = int.Parse(start[0]);
            this.StartCol = start[1].ToColumnIndex();

            if (items.Length == 2)
            {
                var end = FindPosition(items[1]);
                this.EndRow = int.Parse(end[0]);
                this.EndCol = end[1].ToColumnIndex();
            }
            else
            {
                this.EndRow = this.StartRow;
                this.EndCol = this.StartCol;
            }
        }

        string[] FindPosition(string cellReference)
        {

            var colName = Regex.Replace(cellReference, @"\d", "");

            var row = cellReference.Replace(colName, "");

            return new string[]{
                row,
                colName
            };
        }

        public int StartRow
        {
            get;
            set;
        }

        public int EndRow
        {
            get;
            set;
        }

        public int StartCol
        {
            get;
            set;
        }

        public int EndCol
        {
            get;
            set;
        }
    }
}
