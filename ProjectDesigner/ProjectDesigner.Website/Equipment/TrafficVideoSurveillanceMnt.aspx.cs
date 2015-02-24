using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using ProjectDesigner.Domain.Equipment;
using EBA.Helpers;
using EBA.Linq;

namespace ProjectDesigner.Website.Equipment
{
    public partial class TrafficVideoSurveillanceMnt : TPageBase
    {
        protected void Page_Load(object sender, EventArgs e)
        {
        }

        /// <summary>
        /// 初始化控件
        /// </summary>
        protected override void InitControls()
        {
            base.InitControls();
        }
        /// <summary>
        /// 给列别赋值
        /// </summary>
        /// <param name="tableName"></param>
        /// <param name="orderby"></param>
        /// <returns></returns>
        protected override System.Collections.IEnumerable FetchData(string tableName, string[] orderby = null)
        {
            var list = this.EntityContext.Value.SearchTrafficVideoSurveillances();
            if (this.txtName.Text.HasValue())
            {
                list.Where(i => i.Name.Contains(this.txtName.Text.Trim()));
            }
            return list.OrderByDescending(i => i.Name).Fetch(this.PageIndex, this.PageSize)
                .Select(i => new
                {
                    i.Id,
                    i.Name,
                    i.Price,
                    i.Brand,
                    Type = i.Type.ToString(),
                    Connection = i.Connection.ToString(),
                    Foundation = i.Foundation == null ? "" : i.Foundation.Name,
                    Pillar = i.Pillar == null ? "" : i.Pillar.Name,
                    ProductType = i.ProductType,
                    TechnicalParameters = i.TechnicalParameters
                });
        }

        /// <summary>
        /// 删除行的方法
        /// </summary>
        /// <returns></returns>
        public override bool DeleteRows()
        {
            foreach (var id in this.GetSelectedItems())
            {
                this.EntityContext.Value.DeleteTrafficVideoSurveillance(id);
            }
            this.EntityContext.Value.SubmitChanges();
            return true;
        }
    }
}