using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EXLibrary.File
{
    public interface IOfficeFile : IDocumentFile
    {
        string Version { get; }

        bool IsInstall { get; }

        string InstallPath { get; }

        Dictionary<String, String> DocumentSummaryInformation { get; }

        Dictionary<String, String> SummaryInformation { get; }
    }
}
