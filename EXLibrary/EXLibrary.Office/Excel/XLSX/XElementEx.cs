using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace EXLibrary.Office.Excel.XLSX
{
    public static class XElementEx
    {
        public static string GetAttributeValue(this XElement element, XName attrName)
        {
            var attr = element.Attribute(attrName);

            return attr == null ? string.Empty : attr.Value;
        }
    }
}
