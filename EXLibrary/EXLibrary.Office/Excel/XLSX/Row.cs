using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EXLibrary.Office.Excel.XLSX
{
    public class Row : ICloneable
    {
        Dictionary<int, Cell> Items = new Dictionary<int, Cell>();

        public string DyDescent
        {
            get;
            set;
        }

        public int MaxColumn
        {
            get;
            set;
        }

        public string CustomHeight
        {
            get;
            set;
        }

        public decimal? Height
        {
            get;
            set;
        }

        public Cell this[string colName]
        {
            get
            {
                return this[colName.ToColumnIndex()];
            }
            set
            {
                this[colName.ToColumnIndex()] = value;
            }
        }

        public Cell this[int col]
        {
            get
            {
                if (this.Items.ContainsKey(col))
                {
                    return this.Items[col];
                }
                else
                {
                    return null;
                }
            }
            set
            {
                if (col < 0)
                {
                    throw new ArgumentOutOfRangeException("col");
                }
                if (col > this.MaxColumn)
                {
                    this.MaxColumn = col;
                }
                this.Items[col] = value;
            }
        }

        internal void ClearCells()
        {
            this.Items.Clear();
        }

        public object Clone()
        {
            var row = new Row()
            {
                DyDescent = this.DyDescent,
                Height = this.Height,
                MaxColumn = this.MaxColumn,
                CustomHeight = this.CustomHeight
            };

            foreach (var i in this.Items.Keys)
            {
                if (this.Items[i] != null)
                {
                    row[i] = this.Items[i].Clone() as Cell;
                }
            }

            return row;
        }
    }
}
