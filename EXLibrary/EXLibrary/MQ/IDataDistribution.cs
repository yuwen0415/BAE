using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EXLibrary.MQ
{
    public interface IDataDistribution
    {
        event PayloadEventHandler PayloadReceived;

        Guid Id
        {
            get;
            set;
        }

        string Name
        {
            get;
            set;
        }

        string Binding
        {
            get;
        }

        void Publish(Payload buffer);

        void Connect(Guid subId,string binding);

        void Disconnect(Guid subId,string binding);
    }

    public delegate void PayloadEventHandler(Payload buffer);
}
