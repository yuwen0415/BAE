using System;
using System.Collections.Generic;
using System.IO.Packaging;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace EXLibrary.Office.Excel.XLSX
{
    internal static class PackageEx
    {
        internal static PackagePart GetPartByUri(this Package package, string uri)
        {
            try
            {
                return package.GetPart(new Uri(uri, UriKind.Relative));
            }
            catch
            {
                return null;
            }
        }

        internal static XDocument GetXDocument(this Package package, string uri)
        {

            var part = package.GetPartByUri(uri);
            if (part == null)
            {
                return XDocument.Parse("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?><root></root>");
            }
            else
            {
                return XDocument.Load(part.GetStream(), LoadOptions.PreserveWhitespace);
            }
        }
    }
}
