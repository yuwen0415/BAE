using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EXLibrary.Office.Excel.XLSX
{
    public class Formula
    {
        public Formula(string expression)
        {
            this.Expression = expression;
        }

        public string Expression
        {
            get;
            set;
        }

        public virtual string Evaluate()
        {
            return this.Expression;
        }
    }
}
