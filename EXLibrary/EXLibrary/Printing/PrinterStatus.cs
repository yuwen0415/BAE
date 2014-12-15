using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EXLibrary.Printing
{
    [FlagsAttribute]
    public enum PrinterStatus
    {
        Ready = 0x00000000,
        Busy = 0x00000200,
        DoorOpen = 0x00400000,
        Error = 0x00000002,
        Initializing = 0x00008000,
        IOActive = 0x00000100,
        ManualFeed = 0x00000020,
        NoToner = 0x00040000,
        NotAvailable = 0x00001000,
        OffLine = 0x00000080,
        OutOfMemory = 0x00200000,
        OutputBinFull = 0x00000800,
        PagePunt = 0x00080000,
        PaperJam = 0x00000008,
        PaperOut = 0x00000010,
        PaperProblem = 0x00000040,
        Paused = 0x00000001,
        PendingDeletion = 0x00000004,
        Printing = 0x00000400,
        Processing = 0x00004000,
        TonerLow = 0x00020000,
        UserIntervention = 0x00100000,
        Waiting = 0x20000000,
        WarmingUp = 0x00010000,
        Other

    }
}
