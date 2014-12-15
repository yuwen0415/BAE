using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml;
using System.Xml.Linq;

namespace EXLibrary.Office.Excel.XLSX
{
    public static class XDocumentHelper
    {
        public static XDocument Load(Stream stream)
        {
            return XDocument.Load(XmlReader.Create(stream));
        }

        public static XDocument Load(Stream stream, LoadOptions options)
        {
            var option = new XmlReaderSettings();
            switch (options)
            {
                case LoadOptions.None:
                    option = null;
                    break;
                case LoadOptions.PreserveWhitespace:
                    option.IgnoreWhitespace = false;
                    break;
                default:
                    option = null;
                    break;
            }
            return XDocument.Load(XmlReader.Create(stream, option));
        }
    }
}
