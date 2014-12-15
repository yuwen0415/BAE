using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace EXLibrary.Office.Excel.XLSX
{
    public class StringItem : ICloneable
    {
        public int Index
        {
            get;
            set;
        }

        public string AllText
        {
            get
            {
                //var tempt = this.Element.Descendants(Namespaces.Main + "t").Select(i => i.Value).ToList();
                return StringHelper.Join("", this.Element.Descendants(Namespaces.Main + "t").Select(i => i.Value).ToList());
            }
        }

        public XElement Element
        {
            get;
            set;
        }

        public object Clone()
        {
            var item = new StringItem
            {
                Index = this.Index,
                Element = new XElement(this.Element)
            };

            return item;
        }
    }
}
