using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Packaging;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace EXLibrary.Office.Excel.XLSX
{
    public class SpreadsheetDocument
    {
        private Package Package
        {
            get;
            set;
        }

        private Workbook Workbook
        {
            get;
            set;
        }

        public IDictionary<int, List<string>> Content = new Dictionary<int, List<string>>();

        public void LoadFile(string path)
        {
            if (string.IsNullOrWhiteSpace(path))
            {
                throw new ArgumentNullException("fileName");
            }

            if (System.IO.File.Exists(path) == false)
            {
                throw new FileNotFoundException("你所需要的报表" + path + "不存在！");
            }

            if (path == null)
            {
                throw new FileNotFoundException("你所需要的报表" + path + "不存在！");
            }

            var buffer = System.IO.File.ReadAllBytes(path);
            var stream = new MemoryStream();
            stream.Write(buffer, 0, buffer.Length);

            this.Package = Package.Open(stream, FileMode.Open);

            this.Workbook = new Workbook();

            this.Workbook.WorkbookPart = Package.GetPart(new Uri("/xl/workbook.xml", UriKind.Relative));
            this.Workbook.WorkbookXml = XDocumentHelper.Load(this.Workbook.WorkbookPart.GetStream(FileMode.Open), LoadOptions.PreserveWhitespace);

            #region Theme

            var themeXml = Package.GetXDocument("/xl/theme/theme1.xml").Root;
            this.Workbook.Theme = themeXml.GetAttributeValue("name");

            #endregion

            #region Styles

            var numberFormats = NumberFormat.GetNumberFormat();
            var styleIndex = new List<NumberFormat>();

            var stylesXml = Package.GetXDocument("/xl/styles.xml").Root;

            foreach (var numFmt in stylesXml.Elements(Namespaces.Main + "numFmts").Elements(Namespaces.Main + "numFmt"))
            {
                var numberFormat = new NumberFormat
                {
                    ID = numFmt.GetAttributeValue("numFmtId"),
                    FormatCode = numFmt.GetAttributeValue("formatCode"),
                    IsPredefined = false
                };

                numberFormats.Add(numberFormat.ID, numberFormat);
            }

            foreach (var xf in stylesXml.Elements(Namespaces.Main + "cellXfs").Elements(Namespaces.Main + "xf"))
            {
                styleIndex.Add(numberFormats[xf.GetAttributeValue("numFmtId")]);
            }

            #endregion

            #region SharedStringsPart

            this.Workbook.SharedStringsPart = this.Package.GetPartByUri("/xl/sharedStrings.xml");

            if (this.Workbook.SharedStringsPart != null)
            {
                this.Workbook.SharedStringsXml = XDocumentHelper.Load(this.Workbook.SharedStringsPart.GetStream());
                var i = 0;
                foreach (var si in this.Workbook.SharedStringsXml.Root.Elements(Namespaces.Main + "si"))
                {
                    var stringItem = new StringItem
                    {
                        Index = i,
                        Element = si
                    };
                    i++;
                    this.Workbook.SharedStrings.Add(stringItem);
                }
            }

            #endregion

            #region WorksheetsPart

            foreach (var sheet in this.Workbook.WorkbookXml.Root.Elements(Namespaces.Main + "sheets").Elements(Namespaces.Main + "sheet"))
            {
                var worksheet = new Worksheet();
                worksheet.Workbook = this.Workbook;
                worksheet.Name = sheet.Attribute("name").Value;

                var worksheetRelId = sheet.Attribute(Namespaces.Relationship + "id").Value;
                var uri = "/xl/" + this.Workbook.WorkbookPart.GetRelationship(worksheetRelId).TargetUri;

                worksheet.Part = this.Package.GetPart(new Uri(uri, UriKind.Relative));

                worksheet.Xml = XDocument.Load(worksheet.Part.GetStream(), LoadOptions.PreserveWhitespace);

                var worksheetXml = worksheet.Xml.Root;


                var dimension = worksheetXml.Element(Namespaces.Main + "dimension");
                var maxColumn = 1;
                if (dimension != null)
                {
                    var range = new Range(dimension.Attribute("ref").Value);

                    maxColumn = range.EndCol;

                    worksheet.MaxColumn = maxColumn;
                }


                #region ColumnHeader
                foreach (var col in worksheetXml.Elements(Namespaces.Main + "cols").Elements(Namespaces.Main + "col"))
                {
                    var header = new ColumnHeader
                    {
                        Index = int.Parse(col.GetAttributeValue("min")),
                        Width = decimal.Parse(col.GetAttributeValue("width"))
                    };

                    worksheet.ColumnHeaders[header.Index] = header;
                }
                #endregion

                #region Rows
                foreach (var r in worksheetXml.Elements(Namespaces.Main + "sheetData").Elements(Namespaces.Main + "row"))
                {
                    var row = new Row()
                    {
                        MaxColumn = maxColumn
                    };

                    var rowIndex = int.Parse(r.GetAttributeValue("r"));

                    var h = r.GetAttributeValue("ht");
                    if (string.IsNullOrWhiteSpace(h) == false)
                    {
                        row.Height = decimal.Parse(h);
                    }

                    row.CustomHeight = r.GetAttributeValue("customHeight");
                    row.DyDescent = r.GetAttributeValue(Namespaces.X14ac + "dyDescent");

                    foreach (var c in r.Elements(Namespaces.Main + "c"))
                    {
                        var cell = new Cell();
                        cell.Worksheet = worksheet;

                        cell.NumberFormat = numberFormats["0"]; //default style index

                        cell.DataType = c.GetAttributeValue("t");//DataType

                        var v = c.Element(Namespaces.Main + "v");

                        //REF:18.18.11 ST_CellType
                        if (cell.DataType == "s")//sharedStrings
                        {
                            if (v != null)
                            {
                                var stringItem = this.Workbook.SharedStrings[int.Parse(v.Value)];
                                cell.Text = stringItem.AllText;
                                cell.Value = v.Value;
                                cell.StringItem = stringItem;

                            }
                        }
                        //else if (cell.CellType == "b")//boolean
                        //{
                        //    //TODO:

                        //}
                        //else if (cell.CellType == "d")//date
                        //{
                        //}
                        else if (cell.DataType == "inlineStr")//Inline String
                        {
                            cell.Text = c.Elements(Namespaces.Main + "is").Elements(Namespaces.Main + "t").Select(i => i.Value).FirstOrDefault();
                        }
                        //else if (cell.CellType == "n")//Number
                        //{
                        //}
                        else if (cell.DataType == "str")//String
                        {
                            var f = c.Element(Namespaces.Main + "f");
                            if (f != null)
                            {
                                cell.Formula = new Formula(f.Value);
                            }

                            cell.Text = c.Value;
                            cell.Value = c.Value;
                        }
                        else if (cell.DataType == "e") //error
                        {
                            var f = c.Element(Namespaces.Main + "f");
                            if (f != null)
                            {
                                cell.Formula = new Formula(f.Value);
                            }

                            cell.Text = c.Value;
                            cell.Value = c.Value;
                        }
                        else
                        {
                            if (v != null)
                            {
                                cell.Value = v.Value;
                                cell.Text = v.Value;
                            }
                        }


                        cell.StyleIndex = c.GetAttributeValue("s");//Style Index

                        if (string.IsNullOrWhiteSpace(cell.StyleIndex) == false)
                        {
                            cell.NumberFormat = styleIndex[int.Parse(cell.StyleIndex)];
                        }


                        var range = new Range(c.Attribute("r").Value);

                        row[range.StartCol] = cell;


                        if (!Content.Keys.Contains(rowIndex))
                        {
                            Content[rowIndex] = new List<string>();
                        }
                        if (!string.IsNullOrWhiteSpace(cell.Text))
                        {
                            Content[rowIndex].Add(cell.Text);
                        }
                    }


                    worksheet.Rows[rowIndex] = row;
                }


                #endregion

                #region MergeCells
                foreach (var mergeCell in worksheetXml.Elements(Namespaces.Main + "mergeCells").Elements(Namespaces.Main + "mergeCell"))
                {
                    var range = new Range(mergeCell.GetAttributeValue("ref"));

                    var cell = worksheet.Rows[range.StartRow][range.StartCol];
                    if (cell != null)
                    {
                        cell.RowSpans = range.EndRow - range.StartRow + 1;
                        cell.ColSpans = range.EndCol - range.StartCol + 1;
                    }


                }
                #endregion

                this.Workbook.Worksheets.Add(worksheet);
            }

            #endregion

        }
    }
}
