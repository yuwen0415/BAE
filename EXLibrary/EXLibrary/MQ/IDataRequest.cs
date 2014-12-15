using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EXLibrary.MQ
{
    public interface IDataRequest
    {
        event PayloadEventHandler PayloadReceived;

        Guid Id { get; set; }

        string Binding { get; set; }

        void Connect(Guid id, string binding);

        void Response(Payload buffer);

        void Request(Guid Id, string requestMark);
    }
}
