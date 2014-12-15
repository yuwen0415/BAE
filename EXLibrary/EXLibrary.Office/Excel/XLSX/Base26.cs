using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EXLibrary.Office.Excel.XLSX
{
    internal static class Base26
    {
        public static int ToColumnIndex(this string columnName)
        {
            int index = 0;

            var chars = columnName.ToUpperInvariant().ToCharArray().Reverse().ToArray();
            for (var i = 0; i < chars.Length; i++)
            {
                var c = (chars[i] - 64);
                index += i == 0 ? c : (c * (int)Math.Pow(26, i));
            }

            if (index < 0)
            {
                throw new ArgumentOutOfRangeException("the index must start with zero.");
            }


            return index;
        }

        public static string ToColumnName(this int column)
        {
            if (column < 0)
            {
                throw new ArgumentOutOfRangeException("the index must start with zero.");
            }


            int dividend = column;
            string columnName = String.Empty;
            int modulo;

            while (dividend > 0)
            {
                modulo = (dividend - 1) % 26;
                columnName = Convert.ToChar(65 + modulo).ToString() + columnName;
                dividend = (int)((dividend - modulo) / 26);
            }

            return columnName;
        }
    }
}
