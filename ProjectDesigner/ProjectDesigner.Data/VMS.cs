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
    
    public partial class VMS
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public Nullable<decimal> Price { get; set; }
        public string Brand { get; set; }
        public Nullable<int> Type { get; set; }
        public Nullable<int> Connection { get; set; }
        public string Size { get; set; }
        public Nullable<double> Weight { get; set; }
        public Nullable<int> ModuleCount { get; set; }
        public string IconPath { get; set; }
        public string LEDModuleId { get; set; }
        public string PillarId { get; set; }
        public string FoundationId { get; set; }
        public Nullable<int> EquipmentType { get; set; }
    
        public virtual Foundation Foundation { get; set; }
        public virtual LEDModule LEDModule { get; set; }
        public virtual Pillar Pillar { get; set; }
    }
}