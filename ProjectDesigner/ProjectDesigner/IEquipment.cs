using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ProjectDesigner
{
    public interface IEquipment
    {
        string Id { get; set; }
        string Name { get; set; }
        decimal? Price { get; set; }

        /// <summary>
        /// 设备类型
        /// </summary>
        EquipmentType EquipmentType { get; set; }

        string Brand { get; set; }

        /// <summary>
        /// 型号
        /// </summary>
        string ProductType { get; set; }

        /// <summary>
        /// 主要技术参数
        /// </summary>
        string TechnicalParameters { get; set; }

        /// <summary>
        /// 单位
        /// </summary>
        string Unit { get; set; }

    }
}
