using EXLibrary.Office.Word;
using Microsoft.Office.Interop.Word;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;

namespace EXLibrary.File.WordFile
{
    public class WordDocumentFileManagement : OfficeFileManagementBase, IFileManagement
    {
        WordActivator _WordApplication;
        WordActivator WordApplication
        {
            get
            {
                if (_WordApplication == null)
                {
                    _WordApplication = new WordActivator();
                }
                return _WordApplication;
            }
        }

        public WordDocumentFileManagement(IOfficeFile file)
            : base(file)
        {

        }

        public void Close()
        {
            //WordApplication.Instance.Quit();
        }

        public void Open()
        {
            //try
            //{
            //    object nullobj = Missing.Value;
            //    object ofalse = false;
            //    object ofile = this.File.FullName;
            //    Document doc = WordApplication.Instance.Documents.Open(
            //                                    ref ofile, ref nullobj, true,
            //                                    ref nullobj, ref nullobj, ref nullobj,
            //                                    ref nullobj, ref nullobj, ref nullobj,
            //                                    ref nullobj, ref nullobj, ref nullobj,
            //                                    ref nullobj, ref nullobj, ref nullobj,
            //                                    ref nullobj);
            //    this.OfficeFile.Content = doc.Content.Text.Trim();
            //    doc.Close(ref ofalse, ref nullobj, ref nullobj);
            //}
            //catch (Exception ex)
            //{
            //    this.OfficeFile.Content = string.Empty;
            //    this.Close();
            //}
        }


        public void SaveAs()
        {
            string newfilename = this.OfficeFile.FullName.Replace(".doc", ".txt");
            object o_nullobject = System.Reflection.Missing.Value;
            object o_newfilename = newfilename;
            object o_format = WdSaveFormat.wdFormatText;
            object o_encoding = Microsoft.Office.Core.MsoEncoding.msoEncodingUTF8;
            object o_endings = WdLineEndingType.wdCRLF;
            WordApplication.Instance.ActiveDocument.SaveAs(ref o_newfilename, ref o_format, ref o_nullobject,
            ref o_nullobject, ref o_nullobject, ref o_nullobject, ref o_nullobject, ref o_nullobject, ref o_nullobject,
            ref o_nullobject, ref o_nullobject, ref o_encoding, ref o_nullobject,
            ref o_nullobject, ref o_endings, ref o_nullobject);
        }

    }
}
