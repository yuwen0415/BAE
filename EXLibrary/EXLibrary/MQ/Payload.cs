using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace EXLibrary.MQ
{
    [DataContract]
    public class Payload
    {
        [DataMember]
        public Guid Source
        {
            get;
            set;
        }
        [DataMember]
        public string Name
        {
            get;
            set;
        }
        [DataMember]
        public string Content
        {
            get;
            set;
        }
    }
}
