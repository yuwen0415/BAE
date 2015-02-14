using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using ProjectDesigner.Domain.Project;
using EBA.Helpers;
using EBA.Linq;
using EBA.BI.OpenReports;
using System.Data;
using ProjectDesigner.Project;

namespace ProjectDesigner.Website.Project
{
    public partial class ProjectMnt : TPageBase
    {
        //[Export(typeof(IModule))]
        //[ModuleMetadata(ID = "BaseEquipmentManagement", CName = "设备管理", Url = "Equipment/BaseEquipmentManagement.aspx")]
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
            var list = this.EntityContext.Value.SearchProjects();
            if (this.txtName.Text.HasValue())
            {
                list.Where(i => i.Name.Contains(this.txtName.Text.Trim()));
            }
            return list.OrderByDescending(i => i.Name).Fetch(this.PageIndex, this.PageSize)
                .Select(i => new
                {
                    i.Id,
                    i.Name,
                    Equipments = this.EntityContext.Value.GetEquipmentsName(i.Id),
                    i.Price,
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
                this.EntityContext.Value.DeleteProject(id);
            }
            this.EntityContext.Value.SubmitChanges();
            return true;
        }


        protected void Export()
        {
            var projectId = this.GetSelectedItems().FirstOrDefault();
            var project = this.EntityContext.Value.Projects
                                                 .AsQuerybale
                                                 .Where(i => i.Id == projectId)
                                                 .FirstOrDefault();
            if (project == null)
                return;

            var spreadsheet = new SpreadsheetDocument();
            spreadsheet.LoadTemplate(Server.MapPath("../report_templates/project_template.xlsx"));
            var data = new ReportSource();


            data.Tables = this.InputDocument(project);
            spreadsheet.ReportSource = data;
            spreadsheet.DataBind();

            var fileName = project.Name + "（" + DateTime.Now.ToString("yyyyMMdd") + "）.xlsx";
            spreadsheet.SaveAs(Server.MapPath("../report_cached/" + fileName));

            Response.Redirect("../TempFileDownHanlder.ashx?f=" + Server.UrlEncode(fileName));
        }

        private DataTableCollection InputDocument(IProject project)
        {
            var tables = new DataSet().Tables;
            var table_Para = new DataTable("para");
            table_Para.Columns.Add("Title");
            table_Para.Columns.Add("Total");

            var paraRow = table_Para.NewRow();
            paraRow["Title"] = project.Name;
            paraRow["Total"] = project.Price;
            table_Para.Rows.Add(paraRow);

            var table_Equipments = new DataTable("equipments");
            table_Equipments.Columns.Add("RowNum");
            table_Equipments.Columns.Add("Name");
            table_Equipments.Columns.Add("Brand");
            table_Equipments.Columns.Add("ProductType");
            table_Equipments.Columns.Add("TechnicalParameters");
            table_Equipments.Columns.Add("Unit");
            table_Equipments.Columns.Add("Num");
            table_Equipments.Columns.Add("Price");
            table_Equipments.Columns.Add("SubTotal");

            var equipments = this.EntityContext.Value.SearchProjectEquipments(project.Id).ToList();
            if (equipments != null)
            {
                var i = 1;
                foreach (var equipment in this.ConvertToSpreadsheetDocumentEquipment(equipments))
                {
                    var equipmentsRow = table_Equipments.NewRow();
                    equipmentsRow["RowNum"] = i + "";
                    equipmentsRow["Name"] = equipment.Name;
                    equipmentsRow["Brand"] = equipment.Brand;
                    equipmentsRow["ProductType"] = equipment.ProductType;
                    equipmentsRow["TechnicalParameters"] = equipment.TechnicalParameters;
                    equipmentsRow["Unit"] = equipment.Unit;
                    equipmentsRow["Num"] = equipment.Num;
                    equipmentsRow["Price"] = equipment.Price;
                    equipmentsRow["SubTotal"] = equipment.SubTotal;
                    table_Equipments.Rows.Add(equipmentsRow);
                    i++;
                }
            }

            tables.Add(table_Para);
            tables.Add(table_Equipments);
            return tables;
        }

        private List<SpreadsheetDocumentEquipment> ConvertToSpreadsheetDocumentEquipment(List<IProjectEquipment> equipments)
        {
            var spreadsheetDocumentEquipments = new List<SpreadsheetDocumentEquipment>();
            foreach (var equipment in equipments)
            {
                var same = spreadsheetDocumentEquipments.Where(i => i.Name == equipment.Name).FirstOrDefault();
                if (same == null)
                    spreadsheetDocumentEquipments.Add(new SpreadsheetDocumentEquipment
                    {
                        Id = equipment.Id,
                        Name = equipment.Name,
                        Brand = equipment.Brand,
                        ProductType = equipment.ProductType,
                        TechnicalParameters = equipment.TechnicalParameters,
                        Unit = equipment.Unit,
                        Num = 1,
                        Price = equipment.Price,
                        SubTotal = equipment.Price
                    });
                else
                {
                    same.Num++;
                    same.SubTotal = same.Num * same.Price;
                }
            }
            return spreadsheetDocumentEquipments;
        }
    }
}