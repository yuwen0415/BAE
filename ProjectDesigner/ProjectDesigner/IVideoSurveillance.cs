using ProjectDesigner.TrafficAndEventCollection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ProjectDesigner
{
    public interface IVideoSurveillance : IEquipment,ITrafficAndEventCollectionEquipment
    {
        VideoSurveillanceType VideoSurveillanceType { get; set; }
    }
}
