﻿//------------------------------------------------------------------------------
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
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class EntityContext : DbContext
    {
        public EntityContext()
            : base("name=EntityContext")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public DbSet<BizModules> BizModules { get; set; }
        public DbSet<Files> Files { get; set; }
        public DbSet<Navigator> Navigators { get; set; }
        public DbSet<ProjectEquipment> ProjectEquipment { get; set; }
        public DbSet<Project> Project { get; set; }
        public DbSet<Foundation> Foundation { get; set; }
        public DbSet<LEDModule> LEDModule { get; set; }
        public DbSet<Pillar> Pillar { get; set; }
        public DbSet<VMS> VMS { get; set; }
    }
}