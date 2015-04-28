using EBA.Linq;
using EBA.Modules;
using ProjectDesigner.ElectronicPolice;
using ProjectDesigner.Project;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using ProjectDesigner.Domain.Equipment;

namespace ProjectDesigner.Domain.Project
{
    public static class ProjectEx
    {
        public static IHitable<IProject> SearchProjects(this IDataContext dataContext)
        {
            return dataContext.Projects
                .AsQuerybale
                .OrderBy(i => i.Name)
                .AsHitable();
        }

        public static IHitable<IEquipment> SearchEquipments(this IDataContext datacontext, EquipmentType type)
        {
            switch (type)
            {
                case EquipmentType.VMS:
                    return datacontext.VMSs
                                      .AsQuerybale
                                      .OrderBy(i => i.Name)
                                      .AsHitable<IEquipment>();
                case EquipmentType.Pillar:
                    return datacontext.Pillars
                                      .AsQuerybale
                                      .OrderBy(i => i.Name)
                                      .AsHitable<IEquipment>();
                case EquipmentType.Foundation:
                    return datacontext.Foundations
                                      .AsQuerybale
                                      .OrderBy(i => i.Name)
                                      .AsHitable<IEquipment>();
                case EquipmentType.TrafficVideoSurveillance:
                    return datacontext.TrafficVideoSurveillances
                                      .AsQuerybale
                                      .OrderBy(i => i.Name)
                                      .AsHitable<IEquipment>();
                case EquipmentType.ElectronicPolice:
                    return datacontext.ElectronicPolices
                                      .AsQuerybale
                                      .OrderBy(i => i.Name)
                                      .AsHitable<IEquipment>();
                case EquipmentType.TrafficAndEventCollection:
                    return datacontext.TrafficAndEventCollections
                                      .AsQuerybale
                                      .OrderBy(i => i.Name)
                                      .AsHitable<IEquipment>();
                case EquipmentType.AccessorialMaterial:
                    return datacontext.AccessorialMaterials
                                      .AsQuerybale
                                      .OrderBy(i => i.Name)
                                      .AsHitable<IEquipment>();
                case EquipmentType.ConstructionMaterial:
                    return datacontext.ConstructionMaterials
                                      .AsQuerybale
                                      .OrderBy(i => i.Name)
                                      .AsHitable<IEquipment>();
                case EquipmentType.CenterEquipment:
                    return datacontext.CenterEquipments
                                      .AsQuerybale
                                      .OrderBy(i => i.Name)
                                      .AsHitable<IEquipment>();
                default:
                    return null;
            }
        }

        public static IEquipment SearchEquipment(this IDataContext datacontext, string equipmentId, EquipmentType type)
        {
            return SearchEquipments(datacontext, type).Where(i => i.Id == equipmentId).FirstOrDefault();
        }

        public static IHitable<IProjectEquipment> SearchProjectEquipments(this IDataContext dataContext)
        {
            return dataContext.ProjectEquipments
                              .AsQuerybale
                              .OrderBy(i => i.Id).AsQueryable().AsHitable();
        }


        public static IHitable<IProjectEquipment> SearchProjectEquipments(this IDataContext dataContext, string projectId)
        {
            return dataContext.ProjectEquipments.AsQuerybale
                              .Where(i => i.ProjectId == projectId)
                              .AsHitable();
        }

        public static IProject SearchProject(this IDataContext dataContext, string id)
        {
            if (string.IsNullOrEmpty(id))
                return null;
            return dataContext.Projects
                .AsQuerybale
                .Where(i => i.Id == id)
                .FirstOrDefault();
        }

        public static IProjectEquipment SearchProjectEquipment(this IDataContext dataContext, string id)
        {
            if (string.IsNullOrEmpty(id))
                return null;
            return dataContext.ProjectEquipments.AsQuerybale
                              .Where(i => i.Id == id)
                              .FirstOrDefault();
        }

        public static IEquipment SearchProjectEquipment(this IDataContext dataContext, string id, EquipmentType type)
        {
            if (string.IsNullOrEmpty(id))
                return null;
            switch (type)
            {
                case EquipmentType.VMS:
                    return dataContext.VMSs.AsQuerybale.Where(i => i.Id == id).FirstOrDefault();
                default:
                    return null;
            }
        }

        public static void DeleteProject(this IDataContext dataContext, string id)
        {
            var equipments = dataContext.SearchProjectEquipments(id).ToList();
            if (equipments.Count > 0)
            {
                dataContext.ProjectEquipments.DeleteAll(equipments);
            }
            var project = dataContext.SearchProject(id);
            if (project != null)
            {
                dataContext.Projects.Delete(project);
            }
        }

        public static void UpdateProject(this IDataContext dataContext, IProject project)
        {
            dataContext.SubmitChanges();
        }
        public static void AddProject(this IDataContext dataContext, IProject project)
        {
            if (project != null && dataContext.Projects.AsQuerybale.Any(i => i.Id == project.Id))
            {
                throw new DuplicatedKeyException("代码[{0}]已经存在。");
            }
            dataContext.Projects.Add(project);
            dataContext.SubmitChanges();
        }


        public static void UpdateProjectEquipment(this IDataContext dataContext, IProjectEquipment equipment)
        {
            dataContext.SubmitChanges();
        }
        public static void AddProjectEquipment(this IDataContext dataContext, IProjectEquipment equipment)
        {
            if (equipment != null && dataContext.ProjectEquipments.AsQuerybale.Any(i => i.Id == equipment.Id))
            {
                throw new DuplicatedKeyException("代码[{0}]已经存在。");
            }
            dataContext.ProjectEquipments.Add(equipment);
            dataContext.SubmitChanges();
        }

        public static void DeleteProjectEquipment(this IDataContext dataContext, string id)
        {
            var equip = dataContext.SearchProjectEquipment(id);
            if (equip != null)
            {
                dataContext.ProjectEquipments.Delete(equip);
            }
        }

        public static string GetEquipmentsName(this IDataContext dataContext, string projectId)
        {
            var equipments = dataContext.ProjectEquipments
                                        .AsQuerybale
                                        .Where(i => i.ProjectId == projectId)
                                        .ToList();
            if (equipments.Count > 0)
            {
                var name = "";
                foreach (var equipment in equipments)
                {
                    name += equipment.Name + ",";
                }
                return name;
            }
            return "";
        }


        public static DataTableCollection InputDocument(this IDataContext dataContext, IProject project)
        {
            var tables = new DataSet().Tables;
            var table_Para = new DataTable("para");
            table_Para.Columns.Add("Title");
            table_Para.Columns.Add("Price");
            table_Para.Columns.Add("Taxes");
            table_Para.Columns.Add("TotalPrice");
            table_Para.Columns.Add("TaxesPrice");
            table_Para.Columns.Add("ElectronicPolicePrice");
            table_Para.Columns.Add("VMSPrice");
            table_Para.Columns.Add("TrafficAndEventCollectionPrice");
            table_Para.Columns.Add("TrafficVideoSurveillancePrice");
            table_Para.Columns.Add("OtherPrice");
            table_Para.Columns.Add("CenterPrice");

            var paraRow = table_Para.NewRow();
            paraRow["Title"] = project.Name;
            paraRow["TotalPrice"] = project.Price;
            var taxes = project.Taxes == null ? 0.0m : project.Taxes;
            paraRow["Taxes"] = taxes;
            paraRow["Price"] = project.Price / (1 + taxes / 100);
            paraRow["TaxesPrice"] = (project.Price / (1 + taxes / 100)) * (taxes / 100);


            //VMS设备table
            var VMSs = new List<SpreadsheetDocumentEquipment>();
            var VMSsC = new List<SpreadsheetDocumentEquipment>();
            var VMSsPrice = 0.0m;

            var table_VMSEquipments = new DataTable("VMSEquipments");
            table_VMSEquipments.Columns.Add("RowNum");
            table_VMSEquipments.Columns.Add("Name");
            table_VMSEquipments.Columns.Add("Brand");
            table_VMSEquipments.Columns.Add("ProductType");
            table_VMSEquipments.Columns.Add("TechnicalParameters");
            table_VMSEquipments.Columns.Add("Unit");
            table_VMSEquipments.Columns.Add("Num");
            table_VMSEquipments.Columns.Add("Price");
            table_VMSEquipments.Columns.Add("SubTotal");

            var table_VMSEquipmentsC = new DataTable("VMSEquipmentsC");
            table_VMSEquipmentsC.Columns.Add("RowNum");
            table_VMSEquipmentsC.Columns.Add("Name");
            table_VMSEquipmentsC.Columns.Add("Brand");
            table_VMSEquipmentsC.Columns.Add("ProductType");
            table_VMSEquipmentsC.Columns.Add("TechnicalParameters");
            table_VMSEquipmentsC.Columns.Add("Unit");
            table_VMSEquipmentsC.Columns.Add("Num");
            table_VMSEquipmentsC.Columns.Add("Price");
            table_VMSEquipmentsC.Columns.Add("SubTotal");

            //TrafficAndEventCollection设备table
            var trafficAndEventCollections = new List<SpreadsheetDocumentEquipment>();
            var trafficAndEventCollectionsC = new List<SpreadsheetDocumentEquipment>();
            var trafficAndEventCollectionsPrice = 0.0m;

            var table_TrafficAndEventCollectionEquipments = new DataTable("TrafficAndEventCollectionEquipments");
            table_TrafficAndEventCollectionEquipments.Columns.Add("RowNum");
            table_TrafficAndEventCollectionEquipments.Columns.Add("Name");
            table_TrafficAndEventCollectionEquipments.Columns.Add("Brand");
            table_TrafficAndEventCollectionEquipments.Columns.Add("ProductType");
            table_TrafficAndEventCollectionEquipments.Columns.Add("TechnicalParameters");
            table_TrafficAndEventCollectionEquipments.Columns.Add("Unit");
            table_TrafficAndEventCollectionEquipments.Columns.Add("Num");
            table_TrafficAndEventCollectionEquipments.Columns.Add("Price");
            table_TrafficAndEventCollectionEquipments.Columns.Add("SubTotal");

            var table_TrafficAndEventCollectionEquipmentsC = new DataTable("TrafficAndEventCollectionEquipmentsC");
            table_TrafficAndEventCollectionEquipmentsC.Columns.Add("RowNum");
            table_TrafficAndEventCollectionEquipmentsC.Columns.Add("Name");
            table_TrafficAndEventCollectionEquipmentsC.Columns.Add("Brand");
            table_TrafficAndEventCollectionEquipmentsC.Columns.Add("ProductType");
            table_TrafficAndEventCollectionEquipmentsC.Columns.Add("TechnicalParameters");
            table_TrafficAndEventCollectionEquipmentsC.Columns.Add("Unit");
            table_TrafficAndEventCollectionEquipmentsC.Columns.Add("Num");
            table_TrafficAndEventCollectionEquipmentsC.Columns.Add("Price");
            table_TrafficAndEventCollectionEquipmentsC.Columns.Add("SubTotal");

            //TrafficVideoSurveillance设备table
            var trafficVideoSurveillances = new List<SpreadsheetDocumentEquipment>();
            var trafficVideoSurveillancesC = new List<SpreadsheetDocumentEquipment>();
            var trafficVideoSurveillancesPrice = 0.0m;

            var table_TrafficVideoSurveillanceEquipments = new DataTable("TrafficVideoSurveillancEquipments");
            table_TrafficVideoSurveillanceEquipments.Columns.Add("RowNum");
            table_TrafficVideoSurveillanceEquipments.Columns.Add("Name");
            table_TrafficVideoSurveillanceEquipments.Columns.Add("Brand");
            table_TrafficVideoSurveillanceEquipments.Columns.Add("ProductType");
            table_TrafficVideoSurveillanceEquipments.Columns.Add("TechnicalParameters");
            table_TrafficVideoSurveillanceEquipments.Columns.Add("Unit");
            table_TrafficVideoSurveillanceEquipments.Columns.Add("Num");
            table_TrafficVideoSurveillanceEquipments.Columns.Add("Price");
            table_TrafficVideoSurveillanceEquipments.Columns.Add("SubTotal");

            var table_TrafficVideoSurveillanceEquipmentsC = new DataTable("TrafficVideoSurveillancEquipmentsC");
            table_TrafficVideoSurveillanceEquipmentsC.Columns.Add("RowNum");
            table_TrafficVideoSurveillanceEquipmentsC.Columns.Add("Name");
            table_TrafficVideoSurveillanceEquipmentsC.Columns.Add("Brand");
            table_TrafficVideoSurveillanceEquipmentsC.Columns.Add("ProductType");
            table_TrafficVideoSurveillanceEquipmentsC.Columns.Add("TechnicalParameters");
            table_TrafficVideoSurveillanceEquipmentsC.Columns.Add("Unit");
            table_TrafficVideoSurveillanceEquipmentsC.Columns.Add("Num");
            table_TrafficVideoSurveillanceEquipmentsC.Columns.Add("Price");
            table_TrafficVideoSurveillanceEquipmentsC.Columns.Add("SubTotal");

            //ElectronicPolice设备table
            var electronicPolices = new List<SpreadsheetDocumentEquipment>();
            var electronicPolicesC = new List<SpreadsheetDocumentEquipment>();
            var electronicPolicesPrice = 0.0m;

            var table_ElectronicPoliceEquipments = new DataTable("ElectronicPoliceEquipments");
            table_ElectronicPoliceEquipments.Columns.Add("RowNum");
            table_ElectronicPoliceEquipments.Columns.Add("Name");
            table_ElectronicPoliceEquipments.Columns.Add("Brand");
            table_ElectronicPoliceEquipments.Columns.Add("ProductType");
            table_ElectronicPoliceEquipments.Columns.Add("TechnicalParameters");
            table_ElectronicPoliceEquipments.Columns.Add("Unit");
            table_ElectronicPoliceEquipments.Columns.Add("Num");
            table_ElectronicPoliceEquipments.Columns.Add("Price");
            table_ElectronicPoliceEquipments.Columns.Add("SubTotal");

            var table_ElectronicPoliceEquipmentsC = new DataTable("ElectronicPoliceEquipmentsC");
            table_ElectronicPoliceEquipmentsC.Columns.Add("RowNum");
            table_ElectronicPoliceEquipmentsC.Columns.Add("Name");
            table_ElectronicPoliceEquipmentsC.Columns.Add("Brand");
            table_ElectronicPoliceEquipmentsC.Columns.Add("ProductType");
            table_ElectronicPoliceEquipmentsC.Columns.Add("TechnicalParameters");
            table_ElectronicPoliceEquipmentsC.Columns.Add("Unit");
            table_ElectronicPoliceEquipmentsC.Columns.Add("Num");
            table_ElectronicPoliceEquipmentsC.Columns.Add("Price");
            table_ElectronicPoliceEquipmentsC.Columns.Add("SubTotal");

            //Other设备table
            var otherPrice = 0.0m;
            var otherEquipments = new List<SpreadsheetDocumentEquipment>();

            var table_OtherEquipments = new DataTable("OtherEquipments");
            table_OtherEquipments.Columns.Add("RowNum");
            table_OtherEquipments.Columns.Add("Name");
            table_OtherEquipments.Columns.Add("Brand");
            table_OtherEquipments.Columns.Add("ProductType");
            table_OtherEquipments.Columns.Add("TechnicalParameters");
            table_OtherEquipments.Columns.Add("Unit");
            table_OtherEquipments.Columns.Add("Num");
            table_OtherEquipments.Columns.Add("Price");
            table_OtherEquipments.Columns.Add("SubTotal");

            //Center设备table
            var centerPrice = 0.0m;
            var centerEquipments = new List<SpreadsheetDocumentEquipment>();

            var table_CenterEquipments = new DataTable("CenterEquipments");
            table_CenterEquipments.Columns.Add("RowNum");
            table_CenterEquipments.Columns.Add("Name");
            table_CenterEquipments.Columns.Add("Brand");
            table_CenterEquipments.Columns.Add("ProductType");
            table_CenterEquipments.Columns.Add("TechnicalParameters");
            table_CenterEquipments.Columns.Add("Unit");
            table_CenterEquipments.Columns.Add("Num");
            table_CenterEquipments.Columns.Add("Price");
            table_CenterEquipments.Columns.Add("SubTotal");




            var originalEquipments = dataContext.SearchProjectEquipments(project.Id).ToList();
            if (originalEquipments != null)
            {
                foreach (var equipment in originalEquipments)
                {
                    switch (equipment.EquipmentType)
                    {
                        case EquipmentType.ElectronicPolice:
                            electronicPolicesPrice += equipment.Price.HasValue ? equipment.Price.Value : 0.0m;
                            var electronicPolice = dataContext.ElectronicPolices
                                                              .AsQuerybale
                                                              .Where(i => i.Name == equipment.Name && i.Brand == equipment.Brand && i.Price == equipment.Price)
                                                              .FirstOrDefault();

                            electronicPolices.Add(ConvertToSpreadsheetDocumentEquipment(electronicPolice.VideoSurveillance, electronicPolice.VideoSurveillanceNum));
                            if (electronicPolice.Pillar != null)
                                electronicPolices.Add(ConvertToSpreadsheetDocumentEquipment(electronicPolice.Pillar, 1));
                            if (electronicPolice.Foundation != null)
                                electronicPolices.Add(ConvertToSpreadsheetDocumentEquipment(electronicPolice.Foundation, 1));
                            //electronicPolices.AddRange(electronicPolice.ConstructionMaterials);
                            electronicPolices.AddRange(electronicPolice.AccessorialMaterials);
                            electronicPolicesC.AddRange(electronicPolice.ConstructionMaterials);
                            break;
                        case EquipmentType.TrafficAndEventCollection:
                            trafficAndEventCollectionsPrice += equipment.Price.HasValue ? equipment.Price.Value : 0.0m;
                            var trafficAndEventCollection = dataContext.TrafficAndEventCollections
                                                              .AsQuerybale
                                                              .Where(i => i.Name == equipment.Name && i.Brand == equipment.Brand && i.Price == equipment.Price)
                                                              .FirstOrDefault();

                            trafficAndEventCollections.Add(ConvertToSpreadsheetDocumentEquipment(trafficAndEventCollection.TrafficAndEventCollectionEquipment, trafficAndEventCollection.TrafficAndEventCollectionEquipmentNum));
                            if (trafficAndEventCollection.Pillar != null)
                                trafficAndEventCollections.Add(ConvertToSpreadsheetDocumentEquipment(trafficAndEventCollection.Pillar, 1));
                            if (trafficAndEventCollection.Foundation != null)
                                trafficAndEventCollections.Add(ConvertToSpreadsheetDocumentEquipment(trafficAndEventCollection.Foundation, 1));
                            //electronicPolices.AddRange(electronicPolice.ConstructionMaterials);
                            trafficAndEventCollections.AddRange(trafficAndEventCollection.AccessorialMaterials);
                            trafficAndEventCollectionsC.AddRange(trafficAndEventCollection.ConstructionMaterials);
                            break;
                        case EquipmentType.TrafficVideoSurveillance:
                            trafficVideoSurveillancesPrice += equipment.Price.HasValue ? equipment.Price.Value : 0.0m;
                            var trafficVideoSurveillance = dataContext.TrafficVideoSurveillances
                                                              .AsQuerybale
                                                              .Where(i => i.Name == equipment.Name && i.Brand == equipment.Brand && i.Price == equipment.Price)
                                                              .FirstOrDefault();

                            trafficVideoSurveillances.Add(ConvertToSpreadsheetDocumentEquipment(trafficVideoSurveillance.VideoSurveillance, 1));
                            if (trafficVideoSurveillance.Pillar != null)
                                trafficVideoSurveillances.Add(ConvertToSpreadsheetDocumentEquipment(trafficVideoSurveillance.Pillar, 1));
                            if (trafficVideoSurveillance.Foundation != null)
                                trafficVideoSurveillances.Add(ConvertToSpreadsheetDocumentEquipment(trafficVideoSurveillance.Foundation, 1));
                            //electronicPolices.AddRange(electronicPolice.ConstructionMaterials);
                            trafficVideoSurveillances.AddRange(trafficVideoSurveillance.AccessorialMaterials);
                            trafficVideoSurveillancesC.AddRange(trafficVideoSurveillance.ConstructionMaterials);
                            break;
                        case EquipmentType.VMS:
                            VMSsPrice += equipment.Price.HasValue ? equipment.Price.Value : 0.0m;
                            var vms = dataContext.VMSs
                                                 .AsQuerybale
                                                 .Where(i => i.Name == equipment.Name && i.Brand == equipment.Brand && i.Price == equipment.Price)
                                                 .FirstOrDefault();

                            if (vms.LEDModule != null && vms.ModuleCount.HasValue)
                                VMSs.Add(ConvertToSpreadsheetDocumentEquipment(vms.LEDModule, vms.ModuleCount.Value));
                            if (vms.Pillar != null)
                                VMSs.Add(ConvertToSpreadsheetDocumentEquipment(vms.Pillar, 1));
                            if (vms.Foundation != null)
                                VMSs.Add(ConvertToSpreadsheetDocumentEquipment(vms.Foundation, 1));
                            VMSs.AddRange(vms.AccessorialMaterials);
                            VMSsC.AddRange(vms.ConstructionMaterials);
                            break;
                        case EquipmentType.CenterEquipment:
                            centerPrice += equipment.Price.HasValue ? equipment.Price.Value : 0.0m;
                            var center = dataContext.CenterEquipments
                                                              .AsQuerybale
                                                              .Where(i => i.Name == equipment.Name && i.Brand == equipment.Brand && i.Price == equipment.Price)
                                                              .FirstOrDefault();

                            centerEquipments.Add(ConvertToSpreadsheetDocumentEquipment(center, 1));

                            break;
                        default:
                            var other = dataContext.AccessorialMaterials
                                                   .AsQuerybale
                                                   .Where(i => i.Name == equipment.Name && i.Brand == equipment.Brand && i.Price == equipment.Price)
                                                   .FirstOrDefault();
                            if (other == null)
                            {
                                other = dataContext.ConstructionMaterials
                                                   .AsQuerybale
                                                   .Where(i => i.Name == equipment.Name && i.Brand == equipment.Brand && i.Price == equipment.Price)
                                                   .FirstOrDefault();
                            }
                            if (other == null)
                            {
                                break;
                            }
                            otherPrice += other.Price.HasValue ? other.Price.Value : 0.0m;
                            otherEquipments.Add(ConvertToSpreadsheetDocumentEquipment(other, equipment.Num));
                            break;
                    }
                }
                paraRow["ElectronicPolicePrice"] = electronicPolicesPrice;
                paraRow["VMSPrice"] = VMSsPrice;
                paraRow["TrafficAndEventCollectionPrice"] = trafficAndEventCollectionsPrice;
                paraRow["TrafficVideoSurveillancePrice"] = trafficVideoSurveillancesPrice;
                paraRow["OtherPrice"] = otherPrice;
                paraRow["CenterPrice"] = centerPrice;

            }


            DealWithDatabase(table_ElectronicPoliceEquipments, table_ElectronicPoliceEquipmentsC, electronicPolices, electronicPolicesC);
            DealWithDatabase(table_VMSEquipments, table_VMSEquipmentsC, VMSs, VMSsC);
            DealWithDatabase(table_TrafficAndEventCollectionEquipments, table_TrafficAndEventCollectionEquipmentsC, trafficAndEventCollections, trafficAndEventCollectionsC);
            DealWithDatabase(table_TrafficVideoSurveillanceEquipments, table_TrafficVideoSurveillanceEquipmentsC, trafficVideoSurveillances, trafficVideoSurveillancesC);
            DealWithDatabase(table_CenterEquipments, null, centerEquipments, null);
            DealWithDatabase(table_OtherEquipments, null, otherEquipments, null);

            table_Para.Rows.Add(paraRow);

            tables.Add(table_Para);
            tables.Add(table_VMSEquipments);
            tables.Add(table_VMSEquipmentsC);
            tables.Add(table_CenterEquipments);
            tables.Add(table_ElectronicPoliceEquipments);
            tables.Add(table_ElectronicPoliceEquipmentsC);
            tables.Add(table_OtherEquipments);
            tables.Add(table_TrafficAndEventCollectionEquipments);
            tables.Add(table_TrafficAndEventCollectionEquipmentsC);
            tables.Add(table_TrafficVideoSurveillanceEquipments);
            tables.Add(table_TrafficVideoSurveillanceEquipmentsC);
            return tables;
        }


        private static void DealWithDatabase(DataTable table_ElectronicPoliceEquipments, DataTable table_ElectronicPoliceEquipmentsC, List<SpreadsheetDocumentEquipment> electronicPolices, List<SpreadsheetDocumentEquipment> electronicPolicesC)
        {
            if (electronicPolices != null && table_ElectronicPoliceEquipments != null)
            {
                var _electronicPolices = ConvertToSpreadsheetDocumentEquipments(electronicPolices);
                foreach (var row in _electronicPolices)
                {
                    var equipmentsRow = table_ElectronicPoliceEquipments.NewRow();
                    equipmentsRow["RowNum"] = table_ElectronicPoliceEquipments.Rows.Count + 1;
                    equipmentsRow["Name"] = row.Name;
                    equipmentsRow["Brand"] = row.Brand;
                    equipmentsRow["ProductType"] = row.ProductType;
                    equipmentsRow["TechnicalParameters"] = row.TechnicalParameters;
                    equipmentsRow["Unit"] = row.Unit;
                    equipmentsRow["Num"] = row.Num;
                    equipmentsRow["Price"] = row.Price;
                    equipmentsRow["SubTotal"] = row.SubTotal;
                    table_ElectronicPoliceEquipments.Rows.Add(equipmentsRow);
                }
            }
            if (electronicPolicesC != null && table_ElectronicPoliceEquipmentsC != null)
            {
                var _electronicPolicesC = ConvertToSpreadsheetDocumentEquipments(electronicPolicesC);
                foreach (var row in _electronicPolicesC)
                {
                    var equipmentsRow = table_ElectronicPoliceEquipmentsC.NewRow();
                    equipmentsRow["RowNum"] = table_ElectronicPoliceEquipmentsC.Rows.Count + 1;
                    equipmentsRow["Name"] = row.Name;
                    equipmentsRow["Brand"] = row.Brand;
                    equipmentsRow["ProductType"] = row.ProductType;
                    equipmentsRow["TechnicalParameters"] = row.TechnicalParameters;
                    equipmentsRow["Unit"] = row.Unit;
                    equipmentsRow["Num"] = row.Num;
                    equipmentsRow["Price"] = row.Price;
                    equipmentsRow["SubTotal"] = row.SubTotal;
                    table_ElectronicPoliceEquipmentsC.Rows.Add(equipmentsRow);
                }
            }
        }


        private static SpreadsheetDocumentEquipment ConvertToSpreadsheetDocumentEquipment(IEquipment equipment, double num)
        {
            var spreadsheetDocumentEquipment = new SpreadsheetDocumentEquipment();
            spreadsheetDocumentEquipment.Id = equipment.Id;
            spreadsheetDocumentEquipment.Name = equipment.Name;
            spreadsheetDocumentEquipment.Brand = equipment.Brand;
            spreadsheetDocumentEquipment.ProductType = equipment.ProductType;
            spreadsheetDocumentEquipment.TechnicalParameters = equipment.TechnicalParameters;
            spreadsheetDocumentEquipment.Unit = equipment.Unit;
            spreadsheetDocumentEquipment.Num = num;
            spreadsheetDocumentEquipment.Price = equipment.Price;
            spreadsheetDocumentEquipment.SubTotal = equipment.Price * decimal.Parse(num.ToString());

            return spreadsheetDocumentEquipment;
        }

        private static List<SpreadsheetDocumentEquipment> ConvertToSpreadsheetDocumentEquipments(List<SpreadsheetDocumentEquipment> equipments)
        {
            var spreadsheetDocumentEquipments = new List<SpreadsheetDocumentEquipment>();
            foreach (var equipment in equipments)
            {
                if (equipment != null)
                {
                    var same = spreadsheetDocumentEquipments.Where(i => i.Name == equipment.Name && i.Brand == equipment.Brand && i.Price == equipment.Price).FirstOrDefault();
                    if (same != null)
                    {
                        same.Num += equipment.Num;
                        same.SubTotal = same.Price.HasValue ? same.Price.Value * decimal.Parse(same.Num.ToString()) : 0.0m;
                    }
                    else
                    {
                        spreadsheetDocumentEquipments.Add(equipment);
                    }
                }
            }
            return spreadsheetDocumentEquipments;
        }

        public static void AddRange(this List<SpreadsheetDocumentEquipment> dictionary, List<MaterialOfEquipment> materials)
        {
            foreach (var material in materials)
            {
                dictionary.Add(ConvertToSpreadsheetDocumentEquipment((material as IEquipment), material.Num.Value));
            }
            // return dictionary;
        }
    }
}
