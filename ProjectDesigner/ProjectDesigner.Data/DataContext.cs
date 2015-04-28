using EBA.Data;
using EXLibrary.Serialization;
using ProjectDesigner.ElectronicPolice;
using ProjectDesigner.Foundation;
using ProjectDesigner.Pillar;
using ProjectDesigner.Project;
using ProjectDesigner.TrafficAndEventCollection;
using ProjectDesigner.TrafficVideoSurveillance;
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

            this.LEDModules = new EntityRepository<LEDModule, ILEDModule>(this.EntityContext.LEDModule);

            this.Foundations = new EntityRepository<Foundation, IFoundation>(this.EntityContext.Foundation);

            this.Pillars = new EntityRepository<Pillar, IPillar>(this.EntityContext.Pillar);

            this.Files = new EntityRepository<File, IFile>(this.EntityContext.Files);

            this.Projects = new EntityRepository<Project, IProject>(this.EntityContext.Project);

            this.ProjectEquipments = new EntityRepository<ProjectEquipment, IProjectEquipment>(this.EntityContext.ProjectEquipment);

            this.VideoSurveillances = new EntityRepository<VideoSurveillance, IVideoSurveillance>(this.EntityContext.VideoSurveillance);

            this.TrafficVideoSurveillances = new EntityRepository<TrafficVideoSurveillance, ITrafficVideoSurveillance>(this.EntityContext.TrafficVideoSurveillance);

            this.ElectronicPolices = new EntityRepository<ElectronicPolice, IElectronicPolice>(this.EntityContext.ElectronicPolice);

            this.TrafficAndEventCollections = new EntityRepository<TrafficAndEventCollection, ITrafficAndEventCollection>(this.EntityContext.TrafficAndEventCollection);

            this.Coils = new EntityRepository<Coil, ICoil>(this.EntityContext.Coil);

            this.Geomagnetics = new EntityRepository<Geomagnetic, IGeomagnetic>(this.EntityContext.Geomagnetic);

            this.RFIDs = new EntityRepository<RFID, IRFID>(this.EntityContext.RFID);

            this.Microwaves = new EntityRepository<Microwave, IMicrowave>(this.EntityContext.Microwave);

            this.AccessorialMaterials = new EntityRepository<AccessorialMaterial, IEquipment>(this.EntityContext.AccessorialMaterial);

            this.ConstructionMaterials = new EntityRepository<ConstructionMaterial, IEquipment>(this.EntityContext.ConstructionMaterial);

            this.Materials = new EntityRepository<Material, IMaterial>(this.EntityContext.Material);

            this.CenterEquipments = new EntityRepository<CenterEquipment, ICenterEquipment>(this.EntityContext.CenterEquipment);
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


        public IRepository<IProject> Projects
        {
            get;
            set;
        }


        public IRepository<IProjectEquipment> ProjectEquipments
        {
            get;
            set;
        }


        public IRepository<ITrafficVideoSurveillance> TrafficVideoSurveillances
        {
            get;
            set;
        }


        public IRepository<IElectronicPolice> ElectronicPolices
        {
            get;
            set;
        }


        public IRepository<IVideoSurveillance> VideoSurveillances
        {
            get;
            set;
        }


        public IRepository<ITrafficAndEventCollection> TrafficAndEventCollections
        {
            get;
            set;
        }


        public IRepository<ICoil> Coils
        {
            get;
            set;
        }

        public IRepository<IGeomagnetic> Geomagnetics
        {
            get;
            set;
        }

        public IRepository<IMicrowave> Microwaves
        {
            get;
            set;
        }

        public IRepository<IRFID> RFIDs
        {
            get;
            set;
        }


        public IRepository<IEquipment> AccessorialMaterials
        {
            get;
            set;
        }


        public IRepository<IEquipment> ConstructionMaterials
        {
            get;
            set;
        }


        public IRepository<IMaterial> Materials
        {
            get;
            set;
        }


        public IRepository<ICenterEquipment> CenterEquipments
        {
            get;
            set;
        }
    }

    partial class Coil : ICoil
    {
        TrafficAndEventCollectionEquipmentType ITrafficAndEventCollectionEquipment.Type
        {
            get
            {
                return (TrafficAndEventCollectionEquipmentType)this.Type;
            }
            set
            {
                this.Type = (int)value;
            }
        }


        EquipmentType _EquipmentType = EquipmentType.TrafficAndEventCollection;
        public EquipmentType EquipmentType
        {
            get
            {
                return _EquipmentType;
            }
            set
            {
                _EquipmentType = value;
            }
        }

    }

    partial class Geomagnetic : IGeomagnetic
    {
        TrafficAndEventCollectionEquipmentType ITrafficAndEventCollectionEquipment.Type
        {
            get
            {
                return (TrafficAndEventCollectionEquipmentType)this.Type;
            }
            set
            {
                this.Type = (int)value;
            }
        }


        EquipmentType _EquipmentType = EquipmentType.TrafficAndEventCollection;
        public EquipmentType EquipmentType
        {
            get
            {
                return _EquipmentType;
            }
            set
            {
                _EquipmentType = value;
            }
        }

    }

    partial class Microwave : IMicrowave
    {
        TrafficAndEventCollectionEquipmentType ITrafficAndEventCollectionEquipment.Type
        {
            get
            {
                return (TrafficAndEventCollectionEquipmentType)this.Type;
            }
            set
            {
                this.Type = (int)value;
            }
        }


        EquipmentType _EquipmentType = EquipmentType.TrafficAndEventCollection;
        public EquipmentType EquipmentType
        {
            get
            {
                return _EquipmentType;
            }
            set
            {
                _EquipmentType = value;
            }
        }

    }

    partial class RFID : IRFID
    {
        TrafficAndEventCollectionEquipmentType ITrafficAndEventCollectionEquipment.Type
        {
            get
            {
                return (TrafficAndEventCollectionEquipmentType)this.Type;
            }
            set
            {
                this.Type = (int)value;
            }
        }


        EquipmentType _EquipmentType = EquipmentType.TrafficAndEventCollection;
        public EquipmentType EquipmentType
        {
            get
            {
                return _EquipmentType;
            }
            set
            {
                _EquipmentType = value;
            }
        }

    }

    partial class Navigator : INavigator
    {

        ICollection<INavigator> INavigator.ChildNavigators
        {
            get
            {

                return new EntityCollection<Navigator, INavigator>(this.Navigators1);
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

        private ISerializer Serializer = new JsonSerializer();

        List<MaterialOfEquipment> IVMS.AccessorialMaterials
        {
            get
            {
                if (string.IsNullOrEmpty(this.AccessorialMaterials))
                    return new List<MaterialOfEquipment>();
                else
                    return Serializer.Deserialize<List<MaterialOfEquipment>>(this.AccessorialMaterials);

            }
            set
            {
                this.AccessorialMaterials = Serializer.Serialize<List<MaterialOfEquipment>>(value);
            }
        }

        List<MaterialOfEquipment> IVMS.ConstructionMaterials
        {
            get
            {
                if (string.IsNullOrEmpty(this.ConstructionMaterials))
                    return new List<MaterialOfEquipment>();
                else
                    return Serializer.Deserialize<List<MaterialOfEquipment>>(this.ConstructionMaterials);

            }
            set
            {
                this.ConstructionMaterials = Serializer.Serialize<List<MaterialOfEquipment>>(value);
            }
        }


        //double? IVMS.ModuleCount
        //{
        //    get
        //    {
        //        if (!this.ModuleCount.HasValue)
        //            return 0.0f;
        //        else
        //            return this.ModuleCount;
        //    }
        //    set
        //    {
        //        throw new NotImplementedException();
        //    }
        //}
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


        EquipmentType IEquipment.EquipmentType
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

    }

    partial class TrafficVideoSurveillance : ITrafficVideoSurveillance
    {
        Connection ITrafficVideoSurveillance.Connection
        {
            get
            {
                return (Connection)this.Connection;
            }
            set
            {
                this.Connection = (int)value;
            }
        }

        IFoundation ITrafficVideoSurveillance.Foundation
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

        IPillar ITrafficVideoSurveillance.Pillar
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

        TrafficVideoSurveillanceType ITrafficVideoSurveillance.Type
        {
            get
            {
                return (TrafficVideoSurveillanceType)this.Type;
            }
            set
            {
                this.Type = (int)value;
            }
        }

        EquipmentType _EquipmentType = EquipmentType.TrafficVideoSurveillance;
        public EquipmentType EquipmentType
        {
            get
            {
                return _EquipmentType;
            }
            set
            {
                _EquipmentType = value;
            }
        }


        IVideoSurveillance ITrafficVideoSurveillance.VideoSurveillance
        {
            get
            {
                return this.VideoSurveillance;
            }
            set
            {
                this.VideoSurveillance = value as VideoSurveillance;
            }
        }
        private ISerializer Serializer = new JsonSerializer();

        List<MaterialOfEquipment> ITrafficVideoSurveillance.AccessorialMaterials
        {
            get
            {
                if (string.IsNullOrEmpty(this.AccessorialMaterials))
                    return new List<MaterialOfEquipment>();
                else
                    return Serializer.Deserialize<List<MaterialOfEquipment>>(this.AccessorialMaterials);

            }
            set
            {
                this.AccessorialMaterials = Serializer.Serialize<List<MaterialOfEquipment>>(value);
            }
        }

        List<MaterialOfEquipment> ITrafficVideoSurveillance.ConstructionMaterials
        {
            get
            {
                if (string.IsNullOrEmpty(this.ConstructionMaterials))
                    return new List<MaterialOfEquipment>();
                else
                    return Serializer.Deserialize<List<MaterialOfEquipment>>(this.ConstructionMaterials);

            }
            set
            {
                this.ConstructionMaterials = Serializer.Serialize<List<MaterialOfEquipment>>(value);
            }
        }

    }

    partial class VideoSurveillance : IVideoSurveillance
    {

        EquipmentType _EquipmentType = EquipmentType.TrafficVideoSurveillance;
        public EquipmentType EquipmentType
        {
            get
            {
                return _EquipmentType;
            }
            set
            {
                _EquipmentType = value;
            }
        }

        VideoSurveillanceType IVideoSurveillance.VideoSurveillanceType
        {
            get
            {
                return (VideoSurveillanceType)this.Type;
            }
            set
            {
                this.Type = (int)value;
            }
        }

        TrafficAndEventCollectionEquipmentType ITrafficAndEventCollectionEquipment.Type
        {
            get
            {
                return (TrafficAndEventCollectionEquipmentType)this.Type;
            }
            set
            {
                this.Type = (int)value;
            }
        }
    }

    partial class ElectronicPolice : IElectronicPolice
    {
        private ISerializer Serializer = new JsonSerializer();
        ElectronicPoliceType IElectronicPolice.Type
        {
            get
            {
                return (ElectronicPoliceType)this.Type;
            }
            set
            {
                this.Type = (int)value;
            }
        }

        Connection IElectronicPolice.Connection
        {
            get
            {
                return (Connection)this.Connection;
            }
            set
            {
                this.Connection = (int)value;
            }
        }

        IFoundation IElectronicPolice.Foundation
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

        IPillar IElectronicPolice.Pillar
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



        EquipmentType _EquipmentType = EquipmentType.ElectronicPolice;
        public EquipmentType EquipmentType
        {
            get
            {
                return _EquipmentType;
            }
            set
            {
                _EquipmentType = value;
            }
        }


        IVideoSurveillance IElectronicPolice.VideoSurveillance
        {
            get
            {
                return this.VideoSurveillance;
            }
            set
            {
                this.VideoSurveillance = value as VideoSurveillance;
            }
        }


        List<MaterialOfEquipment> IElectronicPolice.AccessorialMaterials
        {
            get
            {
                if (string.IsNullOrEmpty(this.AccessorialMaterials))
                    return new List<MaterialOfEquipment>();
                else
                    return Serializer.Deserialize<List<MaterialOfEquipment>>(this.AccessorialMaterials);

            }
            set
            {
                this.AccessorialMaterials = Serializer.Serialize<List<MaterialOfEquipment>>(value);
            }
        }

        List<MaterialOfEquipment> IElectronicPolice.ConstructionMaterials
        {
            get
            {
                if (string.IsNullOrEmpty(this.ConstructionMaterials))
                    return new List<MaterialOfEquipment>();
                else
                    return Serializer.Deserialize<List<MaterialOfEquipment>>(this.ConstructionMaterials);

            }
            set
            {
                this.ConstructionMaterials = Serializer.Serialize<List<MaterialOfEquipment>>(value);
            }
        }
    }

    partial class TrafficAndEventCollection : ITrafficAndEventCollection
    {
        DataContext DataContext = new DataContext();

        TrafficAndEventCollectionType ITrafficAndEventCollection.Type
        {
            get
            {
                return (TrafficAndEventCollectionType)this.Type;
            }
            set
            {
                this.Type = (int)value;
            }
        }

        Connection ITrafficAndEventCollection.Connection
        {
            get
            {
                return (Connection)this.Connection;
            }
            set
            {
                this.Connection = (int)value;
            }
        }


        IFoundation ITrafficAndEventCollection.Foundation
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

        IPillar ITrafficAndEventCollection.Pillar
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


        EquipmentType _EquipmentType = EquipmentType.ElectronicPolice;
        public EquipmentType EquipmentType
        {
            get
            {
                return _EquipmentType;
            }
            set
            {
                _EquipmentType = value;
            }
        }

        ITrafficAndEventCollectionEquipment _TrafficAndEventCollectionEquipment;
        public ITrafficAndEventCollectionEquipment TrafficAndEventCollectionEquipment
        {
            get
            {
                if (string.IsNullOrEmpty(this.TrafficAndEventCollectionEquipmentId))
                {
                    this._TrafficAndEventCollectionEquipment = DataContext.Geomagnetics.NewEntity();
                }
                else
                {
                    switch (this.TrafficAndEventCollectionEquipmentType)
                    {
                        case 0:
                            _TrafficAndEventCollectionEquipment = DataContext.Geomagnetics.AsQuerybale
                                                                                          .Where(i => i.Id == this.TrafficAndEventCollectionEquipmentId)
                                                                                          .FirstOrDefault()
                                                                                          as IGeomagnetic;
                            break;
                        case 1:
                            _TrafficAndEventCollectionEquipment = DataContext.Coils.AsQuerybale
                                                                                          .Where(i => i.Id == this.TrafficAndEventCollectionEquipmentId)
                                                                                          .FirstOrDefault()
                                                                                          as ICoil;
                            break;
                        case 2:
                            _TrafficAndEventCollectionEquipment = DataContext.VideoSurveillances.AsQuerybale
                                                                                          .Where(i => i.Id == this.TrafficAndEventCollectionEquipmentId)
                                                                                          .FirstOrDefault()
                                                                                          as IVideoSurveillance;
                            break;
                        case 3:
                            _TrafficAndEventCollectionEquipment = DataContext.RFIDs.AsQuerybale
                                                                                          .Where(i => i.Id == this.TrafficAndEventCollectionEquipmentId)
                                                                                          .FirstOrDefault()
                                                                                          as IRFID;
                            break;
                        case 4:
                            _TrafficAndEventCollectionEquipment = DataContext.Microwaves.AsQuerybale
                                                                                          .Where(i => i.Id == this.TrafficAndEventCollectionEquipmentId)
                                                                                          .FirstOrDefault()
                                                                                          as IMicrowave;
                            break;

                    }
                }
                return _TrafficAndEventCollectionEquipment;
            }
            set
            {
                this._TrafficAndEventCollectionEquipment = value;
                if (value != null)
                    this.TrafficAndEventCollectionEquipmentId = value.Id;

            }
        }

        private ISerializer Serializer = new JsonSerializer();

        List<MaterialOfEquipment> ITrafficAndEventCollection.AccessorialMaterials
        {
            get
            {
                if (string.IsNullOrEmpty(this.AccessorialMaterials))
                    return new List<MaterialOfEquipment>();
                else
                    return Serializer.Deserialize<List<MaterialOfEquipment>>(this.AccessorialMaterials);

            }
            set
            {
                this.AccessorialMaterials = Serializer.Serialize<List<MaterialOfEquipment>>(value);
            }
        }

        List<MaterialOfEquipment> ITrafficAndEventCollection.ConstructionMaterials
        {
            get
            {
                if (string.IsNullOrEmpty(this.ConstructionMaterials))
                    return new List<MaterialOfEquipment>();
                else
                    return Serializer.Deserialize<List<MaterialOfEquipment>>(this.ConstructionMaterials);

            }
            set
            {
                this.ConstructionMaterials = Serializer.Serialize<List<MaterialOfEquipment>>(value);
            }
        }


        TrafficAndEventCollectionEquipmentType ITrafficAndEventCollection.TrafficAndEventCollectionEquipmentType
        {
            get
            {
                return (TrafficAndEventCollectionEquipmentType)this.TrafficAndEventCollectionEquipmentType;
            }
            set
            {
                this.TrafficAndEventCollectionEquipmentType = (int)value;
            }
        }
    }

    partial class AccessorialMaterial : IEquipment
    {
        EquipmentType _EquipmentType = EquipmentType.AccessorialMaterial;
        public EquipmentType EquipmentType
        {
            get
            {
                return _EquipmentType;
            }
            set
            {
                _EquipmentType = value;
            }
        }
    }

    partial class ConstructionMaterial : IEquipment
    {
        EquipmentType _EquipmentType = EquipmentType.ConstructionMaterial;
        public EquipmentType EquipmentType
        {
            get
            {
                return _EquipmentType;
            }
            set
            {
                _EquipmentType = value;
            }
        }
    }

    partial class Material : IMaterial
    {
        EquipmentType IEquipment.EquipmentType
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
    }

    partial class CenterEquipment : ICenterEquipment
    {

        EquipmentType IEquipment.EquipmentType
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
    }


}
