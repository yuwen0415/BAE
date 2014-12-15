using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using EBA.Linq;
using EBA.Modules.BizPackets;
using EBA.Helpers;
using ProjectDesigner.Website;
using ProjectDesigner.Domain.Equipment;


namespace TCMS.Website.Popup
{
    public partial class SelectPillar : TPageBase
    {
        protected void Page_Load(object sender, EventArgs e)
        {
        }

        protected override void InitControls()
        {
        }

        protected override System.Collections.IEnumerable FetchData(string tableName, string[] orderby = null)
        {
            var list = this.EntityContext.Value.SearchPillar();
            if (this.txtName.Text.HasValue())
            {
                list = list.Where(i => i.Name.Contains(this.txtName.Text.Trim()));
            }
            return list.Fetch(this.PageIndex, this.PageSize)
                .Select(i => new
                {
                    i.Id,
                    i.Name,
                    i.Diameter,
                    Type = i.Type == null ? "" : i.Type.ToString(),
                    i.Price,
                    i.Length,
                    i.Height
                });
        }
    }
}