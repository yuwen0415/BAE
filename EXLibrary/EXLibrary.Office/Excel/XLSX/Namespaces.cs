using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace EXLibrary.Office.Excel.XLSX
{
    public static class Namespaces
    {
        /// <summary>
        /// http://schemas.openxmlformats.org/spreadsheetml/2006/main
        /// </summary>
        public static XNamespace Main = "http://schemas.openxmlformats.org/spreadsheetml/2006/main";
        /// <summary>
        /// http://schemas.openxmlformats.org/officeDocument/2006/relationships
        /// </summary>
        public static XNamespace Relationship = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";

        public static XNamespace X14ac = "http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac";
    }
}
