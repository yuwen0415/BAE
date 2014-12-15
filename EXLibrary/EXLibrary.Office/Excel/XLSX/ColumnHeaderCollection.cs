using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EXLibrary.Office.Excel.XLSX
{
    public class ColumnHeaderCollection
    {
        Dictionary<int, ColumnHeader> Items = new Dictionary<int, ColumnHeader>();

        public ColumnHeader this[int index]
        {
            get
            {
                if (this.Items.ContainsKey(index))
                {
                    return this.Items[index];
                }
                else
                {
                    return null;
                }
            }
            set
            {
                this.Items[index] = value;
            }
        }
    }
}
