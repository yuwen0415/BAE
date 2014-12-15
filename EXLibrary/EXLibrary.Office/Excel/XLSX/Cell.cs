using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EXLibrary.Office.Excel.XLSX
{
    public class Cell : ICloneable
    {
        public int RowSpans
        {
            get;
            set;
        }

        public int ColSpans
        {
            get;
            set;
        }

        public string Text
        {
            get;
            set;
        }

        public string Value
        {
            get;
            set;
        }

        public string DataType
        {
            get;
            set;
        }

        public NumberFormat NumberFormat
        {
            get;
            set;
        }

        public string StyleIndex
        {
            get;
            set;
        }

        public Formula Formula
        {
            get;
            set;
        }

        public StringItem StringItem
        {
            get;
            set;
        }

        public Worksheet Worksheet
        {
            get;
            set;
        }

        public object Clone()
        {
            var cell = new Cell
            {
                Text = this.Text,
                Value = this.Value,
                DataType = this.DataType,
                ColSpans = this.ColSpans,
                RowSpans = this.RowSpans,
                StyleIndex = this.StyleIndex,
                Worksheet = this.Worksheet
            };

            if (this.Formula != null)
            {
                cell.Formula = new Formula(this.Formula.Expression);
            }

            if (this.NumberFormat != null)
            {
                cell.NumberFormat = new NumberFormat { FormatCode = this.NumberFormat.FormatCode, ID = this.NumberFormat.ID, IsPredefined = this.NumberFormat.IsPredefined };
            }

            if (this.StringItem != null)
            {
                var stringItem = this.StringItem.Clone() as StringItem;
                stringItem.Index = this.Worksheet.Workbook.SharedStrings.Count;
                this.Worksheet.Workbook.SharedStrings.Add(stringItem);
                cell.StringItem = stringItem;
                cell.Value = stringItem.Index.ToString();
            }

            return cell;
        }
    }
}
