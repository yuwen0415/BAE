//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ProjectDesigner.Data
{
    using System;
    using System.Collections.Generic;
    
    public partial class ProjectEquipment
    {
        public string Id { get; set; }
        public string EquipmentId { get; set; }
        public string Location { get; set; }
        public Nullable<int> EquipmentType { get; set; }
        public string ProjectId { get; set; }
    
        public virtual Project Project { get; set; }
    }
}
