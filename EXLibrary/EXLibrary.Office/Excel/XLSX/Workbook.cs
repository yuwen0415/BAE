using System;
using System.Collections.Generic;
using System.IO.Packaging;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace EXLibrary.Office.Excel.XLSX
{
    public class Workbook
    {
        public Workbook()
        {
            Worksheets = new List<Worksheet>();
            CalcChains = new List<StringItem>();
            SharedStrings = new List<StringItem>();
        }

        public List<Worksheet> Worksheets
        {
            get;
            set;
        }

        public List<StringItem> CalcChains
        {
            get;
            set;
        }

        public string Theme
        {
            get;
            set;
        }

        public PackagePart WorkbookPart
        {
            get;
            set;
        }

        public XDocument WorkbookXml
        {
            get;
            set;
        }

        public List<StringItem> SharedStrings
        {
            get;
            set;
        }

        internal PackagePart SharedStringsPart
        {
            get;
            set;
        }

        internal XDocument SharedStringsXml
        {
            get;
            set;
        }
    }
}
