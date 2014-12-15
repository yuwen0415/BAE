using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EXLibrary.Office.Excel.XLSX
{
    public class NumberFormat
    {
        public string ID
        {
            get;
            set;
        }

        public string FormatCode
        {
            get;
            set;
        }

        public bool IsPredefined
        {
            get;
            set;
        }

        public static Dictionary<string, NumberFormat> GetNumberFormat()
        {
            //Office Open XML Part1 #1972
            Dictionary<string, NumberFormat> list = new Dictionary<string, NumberFormat>();
            //All languages

            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "0", FormatCode = "General" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "1", FormatCode = "0" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "2", FormatCode = "0.00" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "3", FormatCode = "#,##0" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "4", FormatCode = "#,##0.00" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "9", FormatCode = "0%" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "10", FormatCode = "0.00%" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "11", FormatCode = "0.00E+00" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "12", FormatCode = "# ?/?" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "13", FormatCode = "# ??/??" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "14", FormatCode = "mm-dd-yy" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "15", FormatCode = "d-mmm-yy" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "16", FormatCode = "d-mmm" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "17", FormatCode = "mmm-yy" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "18", FormatCode = "h:mm AM/PM" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "19", FormatCode = "h:mm:ss AM/PM" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "20", FormatCode = "h:mm" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "21", FormatCode = "h:mm:ss" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "22", FormatCode = "m/d/yy h:mm" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "37", FormatCode = "#,##0 );(#,##0)" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "38", FormatCode = "#,##0 );[Red](#,##0)" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "39", FormatCode = "#,##0.00);(#,##0.00)" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "40", FormatCode = "#,##0.00);[Red](#,##0.00)" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "45", FormatCode = "mm:ss" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "46", FormatCode = "[h]:mm:ss" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "47", FormatCode = "mmss.0" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "48", FormatCode = "##0.0E+0" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "49", FormatCode = "@" });

            //zh-cn
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "27", FormatCode = "yyyy\"年\"m\"月\"" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "28", FormatCode = "m\"月\"d\"日\"" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "29", FormatCode = "m\"月\"d\"日\"" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "30", FormatCode = "m-d-yy" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "31", FormatCode = "yyyy\"年\"m\"月\"d\"日\"" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "32", FormatCode = "h\"时\"mm\"分\"" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "33", FormatCode = "h\"时\"mm\"分\"ss\"秒\"" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "34", FormatCode = "上午/下午h\"时\"mm\"分\"" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "35", FormatCode = "上午/下午h\"时\"mm\"分\"ss\"秒\"" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "36", FormatCode = "yyyy\"年\"m\"月\"" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "50", FormatCode = "yyyy\"年\"m\"月\"" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "51", FormatCode = "m\"月\"d\"日\"" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "52", FormatCode = "yyyy\"年\"m\"月\"" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "53", FormatCode = "m\"月\"d\"日\"" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "54", FormatCode = "m\"月\"d\"日\"" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "55", FormatCode = "上午/下午h\"时\"mm\"分\"" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "56", FormatCode = "上午/下午h\"时\"mm\"分\"ss\"秒\"" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "57", FormatCode = "yyyy\"年\"m\"月\"" });
            AddPrefefined(list, new NumberFormat { IsPredefined = true, ID = "58", FormatCode = "m\"月\"d\"日\"" });


            //TODO: add local number format 
            //REF:  Office Open XML Part1 #1972


            return list;

        }

        static void AddPrefefined(Dictionary<string, NumberFormat> list, NumberFormat numFmt)
        {
            list.Add(numFmt.ID, numFmt);
        }
    }
}
