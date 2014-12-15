using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EXLibrary.Office.Excel.XLSX
{
    public class RowCollection
    {
        Dictionary<int, Row> Items = new Dictionary<int, Row>();

        public Row this[int index]
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
                if (index > this.Count)
                {
                    this.Count = index;
                }

                this.Items[index] = value;
            }
        }

        public void Insert(int rowIndex, Row row)
        {
            for (var i = this.Count; i >= rowIndex; i--)
            {
                if (this.Items.ContainsKey(i))
                {
                    var r = this.Items[i];
                    this.Items.Remove(i);
                    this.Items[i + 1] = r;
                }
                else
                {
                    if (this.Items.ContainsKey(i + 1))
                    {
                        this.Items.Remove(i + 1);
                    }
                }

            }

            this.Items[rowIndex] = row;

            this.Count++;
        }

        public int Count
        {
            get;
            set;
        }
    }
}
