﻿using System;
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
using System.Collections;
using ProjectDesigner.TrafficAndEventCollection;


namespace ProjectDesigner.Website.Popup
{
    public partial class SelectTrafficAndEventCollectionEquipment : TPageBase
    {
        protected void Page_Load(object sender, EventArgs e)
        {
        }

        protected override void InitControls()
        {
        }

        protected override System.Collections.IEnumerable FetchData(string tableName, string[] orderby = null)
        {
            var list = this.EntityContext.Value.SearchTrafficAndEventCollectionEquipments((TrafficAndEventCollectionEquipmentType)(this.DropListTrafficAndEventCollectionEquipmentType.SelectedIndex));
            if (this.txtName.Text.HasValue())
            {
                list = list.Where(i => i.Name.Contains(this.txtName.Text.Trim()));
            }
            return list.Fetch(this.PageIndex, this.PageSize)
                .Select(i => new
                {
                    Type = i.Type.ToString(),
                    i.Id,
                    i.Name,
                    i.Price,
                    i.Brand,
                    i.TechnicalParameters
                });
        }

    }
}