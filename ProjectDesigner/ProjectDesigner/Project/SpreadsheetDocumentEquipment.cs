using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ProjectDesigner.Project
{
    public class SpreadsheetDocumentEquipment : IEquipment
    {
        public string Id
        {
            get;
            set;
        }

        public string Name
        {
            get;
            set;
        }

        public decimal? Price
        {
            get;
            set;
        }

        public EquipmentType EquipmentType
        {
            get;
            set;
        }

        public string Brand
        {
            get;
            set;
        }

        public string ProductType
        {
            get;
            set;
        }

        public string TechnicalParameters
        {
            get;
            set;
        }

        public string Unit
        {
            set;
            get;
        }

        public double Num
        {
            get;
            set;
        }

        public decimal? SubTotal
        {
            get;
            set;
        }
    }
}
