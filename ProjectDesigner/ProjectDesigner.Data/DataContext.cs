using EBA.Data;
using EXLibrary.Serialization;
using ProjectDesigner.Foundation;
using ProjectDesigner.Pillar;
using ProjectDesigner.Project;
using ProjectDesigner.VMS;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace ProjectDesigner.Data
{
    public class DataContext : IDataContext
    {
        EntityContext EntityContext { get; set; }

        public DataContext()
        {
            this.EntityContext = new EntityContext();

            this.Navigators = new EntityRepository<Navigator, INavigator>(this.EntityContext.Navigators);

            this.VMSs = new EntityRepository<VMS, IVMS>(this.EntityContext.VMS);

            this.LEDModules = new EntityRepository<LEDModule, ILEDModule>(this.EntityContext.LEDModules);

            this.Foundations = new EntityRepository<Foundation, IFoundation>(this.EntityContext.Foundations);

            this.Pillars = new EntityRepository<Pillar, IPillar>(this.EntityContext.Pillars);

            this.Files = new EntityRepository<File, IFile>(this.EntityContext.Files);

            this.Projects = new EntityRepository<Project, IProject>(this.EntityContext.Projects);

            this.ProjectEquipments = new EntityRepository<ProjectEquipment, IProjectEquipment>(this.EntityContext.ProjectEquipments);
        }

        public IRepository<INavigator> Navigators
        {
            get;
            set;
        }

        System.Data.Common.DbTransaction _transaction;

        public void BeginTransaction()
        {
            if (this.EntityContext.Connection.State != System.Data.ConnectionState.Open)
            {
                this.EntityContext.Connection.Open();
            }

            this._transaction = this.EntityContext.Connection.BeginTransaction();
        }

        public void CommitTransaction()
        {
            if (this._transaction == null)
                throw new InvalidOperationException("The transaction has not been begined");
            else
            {
                this._transaction.Commit();
                this.OnSubmittedChanges();
            }
        }

        public void EndTransaction()
        {
            if (this._transaction != null)
            {
                this._transaction.Dispose();
                this._transaction = null;
            }
        }

        public void RollbackTransaction()
        {
            if (this._transaction.Connection != null)
            {
                this._transaction.Rollback();
            }
        }

        public void SubmitChanges()
        {
            try
            {
                this.EntityContext.SaveChanges();
                if (this._transaction == null)
                {
                    this.OnSubmittedChanges();
                }
            }
            catch (OptimisticConcurrencyException ex)
            {
                throw new DBConcurrencyException("", ex);
            }
        }

        void OnSubmittedChanges()
        {
            if (this.SubmittedChanges != null)
            {
                this.SubmittedChanges(this, EventArgs.Empty);
            }
        }

        public event EventHandler SubmittedChanges;

        public IRepository<ProjectDesigner.VMS.IVMS> VMSs
        {
            get;
            set;
        }


        public IRepository<ILEDModule> LEDModules
        {
            get;
            set;
        }

        public IRepository<IFoundation> Foundations
        {
            get;
            set;
        }

        public IRepository<IPillar> Pillars
        {
            get;
            set;
        }

        public IRepository<IFile> Files
        {
            get;
            set;
        }


        public IRepository<ProjectDesigner.Project.IProject> Projects
        {
            get;
            set;
        }


        public IRepository<IProjectEquipment> ProjectEquipments
        {
            get;
            set;
        }
    }

    partial class Navigator : INavigator
    {

        ICollection<INavigator> INavigator.ChildNavigators
        {
            get
            {

                return new EntityCollection<Navigator, INavigator>(this.ChildNavigators);
            }
        }

        INavigator INavigator.Parent
        {
            get
            {
                return this.Parent;
            }
            set
            {
                if (value == null)
                {
                    this.Parent_Id = null;
                    this.Parent = null;
                }
                else
                {
                    this.Parent = (Navigator)value;
                }
            }
        }
    }

    partial class Foundation : IFoundation
    {

        Size IFoundation.Size
        {
            get
            {
                if (this.Size == null)
                    return null;
                var size = this.Size.Split(',');
                return new Size
                {
                    X = float.Parse(size[0]),
                    Y = float.Parse(size[1]),
                    Z = float.Parse(size[2])
                };
            }
            set
            {
                if (value == null)
                    this.Size = null;
                else
                    this.Size = value.X + "," + value.Y + "," + value.Z;
            }
        }


        EquipmentType IEquipment.EquipmentType
        {
            get
            {
                if (this.EquipmentType == null)
                {
                    return 0;
                }
                return (EquipmentType)this.EquipmentType;
            }
            set
            {
                this.EquipmentType = (int)value;
            }
        }
    }

    partial class Pillar : IPillar
    {
        PillarType? IPillar.Type
        {
            get
            {
                if (this.Type == null)
                    return null;
                return (PillarType)this.Type;
            }
            set
            {
                if (value == null)
                    this.Type = null;
                else
                    this.Type = (int)value;
            }
        }


        EquipmentType IEquipment.EquipmentType
        {
            get
            {
                if (this.EquipmentType == null)
                {
                    return 0;
                }
                return (EquipmentType)this.EquipmentType;
            }
            set
            {
                this.EquipmentType = (int)value;
            }
        }
    }

    partial class LEDModule : ILEDModule
    {
        LedStandard? ILEDModule.Standard
        {
            get
            {
                if (this.Standard == null)
                    return null;
                return (LedStandard)this.Standard;
            }
            set
            {
                if (value == null)
                    this.Standard = null;
                else
                    this.Standard = (int)value;
            }
        }

        ModuleSize ILEDModule.Size
        {
            get
            {
                if (this.Size == null)
                    return null;
                else
                {
                    var size = this.Size.Split(',');
                    return new ModuleSize
                    {
                        Length = float.Parse(size[0]),
                        Width = float.Parse(size[1])
                    };
                }
            }
            set
            {
                if (value == null)
                    this.Size = null;
                else
                    this.Size = value.Length + "," + value.Width;
            }
        }


        EquipmentType IEquipment.EquipmentType
        {
            get
            {
                if (this.EquipmentType == null)
                {
                    return 0;
                }
                return (EquipmentType)this.EquipmentType;
            }
            set
            {
                this.EquipmentType = (int)value;
            }
        }
    }

    partial class VMS : IVMS
    {
        VMSType? IVMS.Type
        {
            get
            {
                if (this.Type == null)
                {
                    return null;
                }
                return (VMSType)this.Type;
            }
            set
            {
                if (value == null)
                    this.Type = null;
                else
                    this.Type = (int)value;
            }
        }

        Connection? IVMS.Connection
        {
            get
            {
                if (this.Connection == null)
                    return null;
                return (Connection)this.Connection;
            }
            set
            {
                if (value == null)
                    this.Connection = null;
                else
                    this.Connection = (int)value;
            }
        }


        IFoundation IVMS.Foundation
        {
            get
            {
                return this.Foundation;
            }
            set
            {
                this.Foundation = value as Foundation;
            }
        }

        IPillar IVMS.Pillar
        {
            get
            {
                return this.Pillar;
            }
            set
            {
                this.Pillar = value as Pillar;
            }
        }

        ILEDModule IVMS.LEDModule
        {
            get
            {
                return this.LEDModule;
            }
            set
            {
                this.LEDModule = value as LEDModule;
            }
        }


        ModuleSize IVMS.Size
        {
            get
            {
                if (this.Size == null)
                    return null;
                else
                {
                    var size = this.Size.Split(',');
                    return new ModuleSize
                    {
                        Length = float.Parse(size[0]),
                        Width = float.Parse(size[1])
                    };
                }
            }
            set
            {
                if (value == null)
                    this.Size = null;
                else
                    this.Size = value.Length + "," + value.Width;
            }
        }


        EquipmentType IEquipment.EquipmentType
        {
            get
            {
                if (this.EquipmentType == null)
                {
                    return 0;
                }
                return (EquipmentType)this.EquipmentType;
            }
            set
            {
                this.EquipmentType = (int)value;
            }
        }
    }

    partial class File : IFile
    {

    }

    partial class Project : IProject
    {
       // private ISerializer Serializer = new JsonSerializer();

        //List<IProjectEquipment> IProject.Equipments
        //{
        //    get
        //    {
        //        if (this.Equipments != null)
        //        {
        //            return Serializer.Deserialize<List<IProjectEquipment>>(this.Equipments);
        //        }
        //        return null;
        //    }
        //    set
        //    {
        //        this.Equipments = Serializer.Serialize<List<IProjectEquipment>>(value);
        //    }
        //}
    }

    partial class ProjectEquipment : IProjectEquipment
    {
        Location IProjectEquipment.Location
        {
            get
            {
                if (string.IsNullOrEmpty(this.Location))
                    return null;
                else
                {
                    var location = this.Location.Split(',');
                    return new Location { Longitude = float.Parse(location[0]), Latitude = float.Parse(location[1]) };
                }
            }
            set
            {
                if (value == null)
                    this.Location = string.Empty;
                else
                    this.Location = value.Longitude + "," + value.Latitude;
            }
        }


        EquipmentType IProjectEquipment.EquipmentType
        {
            get
            {
                return (EquipmentType)this.EquipmentType;
            }
            set
            {
                this.EquipmentType = (int)value;
            }
        }



        double? IProjectEquipment.Price
        {
            get
            {
                if (this.Price == null)
                {
                    return 0.0;
                }
                return this.Price;
            }
            set
            {
                this.Price = value;
            }
        }
    }
}
