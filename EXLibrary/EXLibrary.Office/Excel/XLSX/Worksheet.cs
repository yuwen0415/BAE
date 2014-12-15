using System;
using System.Collections.Generic;
using System.IO.Packaging;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace EXLibrary.Office.Excel.XLSX
{
    public class Worksheet
    {
        public Worksheet()
        {
            this.Rows = new RowCollection();
            this.ColumnHeaders = new ColumnHeaderCollection();
            this.MergeCells = new List<string>();
        }

        public string Name
        {
            get;
            set;
        }

        public Workbook Workbook
        {
            get;
            set;
        }

        public RowCollection Rows
        {
            get;
            set;
        }

        internal XDocument Xml
        {
            get;
            set;
        }

        public ColumnHeaderCollection ColumnHeaders
        {
            get;
            set;
        }


        public int MaxColumn
        {
            get;
            set;
        }

        internal PackagePart Part
        {
            get;
            set;
        }

        internal List<string> MergeCells
        {
            get;
            set;
        }
    }
}
