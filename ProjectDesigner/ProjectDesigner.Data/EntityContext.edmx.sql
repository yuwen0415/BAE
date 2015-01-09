
-- --------------------------------------------------
-- Entity Designer DDL Script for SQL Server 2005, 2008, 2012 and Azure
-- --------------------------------------------------
-- Date Created: 01/07/2015 14:45:54
-- Generated from EDMX file: D:\Programs\PrivateSpace\program\BAE\trunk\ProjectDesigner\ProjectDesigner.Data\EntityContext.edmx
-- --------------------------------------------------

SET QUOTED_IDENTIFIER OFF;
GO
USE [ProjectDesigner];
GO
IF SCHEMA_ID(N'dbo') IS NULL EXECUTE(N'CREATE SCHEMA [dbo]');
GO

-- --------------------------------------------------
-- Dropping existing FOREIGN KEY constraints
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[FK_Navigators_Navigators]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[Navigators] DROP CONSTRAINT [FK_Navigators_Navigators];
GO
IF OBJECT_ID(N'[dbo].[FK_VMS_Foundation]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[VMS] DROP CONSTRAINT [FK_VMS_Foundation];
GO
IF OBJECT_ID(N'[dbo].[FK_VMS_LEDModule]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[VMS] DROP CONSTRAINT [FK_VMS_LEDModule];
GO
IF OBJECT_ID(N'[dbo].[FK_VMS_Pillar]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[VMS] DROP CONSTRAINT [FK_VMS_Pillar];
GO

-- --------------------------------------------------
-- Dropping existing tables
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[BizModules]', 'U') IS NOT NULL
    DROP TABLE [dbo].[BizModules];
GO
IF OBJECT_ID(N'[dbo].[Files]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Files];
GO
IF OBJECT_ID(N'[dbo].[Foundation]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Foundation];
GO
IF OBJECT_ID(N'[dbo].[LEDModule]', 'U') IS NOT NULL
    DROP TABLE [dbo].[LEDModule];
GO
IF OBJECT_ID(N'[dbo].[Navigators]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Navigators];
GO
IF OBJECT_ID(N'[dbo].[Pillar]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Pillar];
GO
IF OBJECT_ID(N'[dbo].[Project]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Project];
GO
IF OBJECT_ID(N'[dbo].[ProjectEquipment]', 'U') IS NOT NULL
    DROP TABLE [dbo].[ProjectEquipment];
GO
IF OBJECT_ID(N'[dbo].[VMS]', 'U') IS NOT NULL
    DROP TABLE [dbo].[VMS];
GO

-- --------------------------------------------------
-- Creating all tables
-- --------------------------------------------------

-- Creating table 'BizModules'
CREATE TABLE [dbo].[BizModules] (
    [Id] nvarchar(64)  NOT NULL,
    [Name] nvarchar(150)  NOT NULL,
    [Description] nvarchar(500)  NULL,
    [IsProtected] bit  NOT NULL
);
GO

-- Creating table 'Files'
CREATE TABLE [dbo].[Files] (
    [Id] nvarchar(64)  NOT NULL,
    [Name] nvarchar(150)  NOT NULL,
    [Extension] nvarchar(20)  NULL,
    [FileName] nvarchar(170)  NOT NULL,
    [Tags] nvarchar(500)  NULL,
    [UploadedTime] datetime  NOT NULL,
    [Remark] nvarchar(500)  NULL
);
GO

-- Creating table 'Foundations'
CREATE TABLE [dbo].[Foundations] (
    [Id] nvarchar(64)  NOT NULL,
    [Name] nvarchar(150)  NULL,
    [Price] decimal(18,0)  NULL,
    [Size] nvarchar(50)  NULL,
    [EquipmentType] int  NULL
);
GO

-- Creating table 'LEDModules'
CREATE TABLE [dbo].[LEDModules] (
    [Id] nvarchar(64)  NOT NULL,
    [Name] nvarchar(150)  NULL,
    [Price] decimal(18,0)  NULL,
    [Standard] int  NULL,
    [Brand] nvarchar(50)  NULL,
    [Size] nvarchar(50)  NULL,
    [EquipmentType] int  NULL
);
GO

-- Creating table 'Navigators'
CREATE TABLE [dbo].[Navigators] (
    [Id] nvarchar(64)  NOT NULL,
    [Name] nvarchar(150)  NULL,
    [Parent_Id] nvarchar(64)  NULL,
    [LayoutName] nvarchar(50)  NULL,
    [WebLink] nvarchar(500)  NULL,
    [WinLink] nvarchar(500)  NULL,
    [WapLink] nvarchar(500)  NULL,
    [Parameters] nvarchar(500)  NULL,
    [SortIndex] int  NOT NULL,
    [IconFile] nvarchar(250)  NULL
);
GO

-- Creating table 'Pillars'
CREATE TABLE [dbo].[Pillars] (
    [Id] nvarchar(64)  NOT NULL,
    [Name] nvarchar(150)  NULL,
    [Price] decimal(18,0)  NULL,
    [Type] int  NULL,
    [Height] float  NULL,
    [Diameter] float  NULL,
    [Length] float  NULL,
    [EquipmentType] int  NULL
);
GO

-- Creating table 'VMS'
CREATE TABLE [dbo].[VMS] (
    [Id] nvarchar(64)  NOT NULL,
    [Name] nvarchar(150)  NULL,
    [Price] decimal(18,0)  NULL,
    [Brand] nvarchar(64)  NULL,
    [Type] int  NULL,
    [Connection] int  NULL,
    [Size] nchar(50)  NULL,
    [Weight] float  NULL,
    [ModuleCount] int  NULL,
    [IconPath] nvarchar(50)  NULL,
    [LEDModuleId] nvarchar(64)  NULL,
    [PillarId] nvarchar(64)  NULL,
    [FoundationId] nvarchar(64)  NULL,
    [EquipmentType] int  NULL
);
GO

-- Creating table 'ProjectEquipments'
CREATE TABLE [dbo].[ProjectEquipments] (
    [Id] nvarchar(64)  NOT NULL,
    [Location] nvarchar(64)  NULL,
    [EquipmentType] int  NULL,
    [ProjectId] nvarchar(64)  NULL,
    [Name] nvarchar(150)  NOT NULL,
    [Price] decimal(28,0)  NULL,
    [Brand] nvarchar(150)  NULL
);
GO

-- --------------------------------------------------
-- Creating all PRIMARY KEY constraints
-- --------------------------------------------------

-- Creating primary key on [Id] in table 'BizModules'
ALTER TABLE [dbo].[BizModules]
ADD CONSTRAINT [PK_BizModules]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Files'
ALTER TABLE [dbo].[Files]
ADD CONSTRAINT [PK_Files]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Foundations'
ALTER TABLE [dbo].[Foundations]
ADD CONSTRAINT [PK_Foundations]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'LEDModules'
ALTER TABLE [dbo].[LEDModules]
ADD CONSTRAINT [PK_LEDModules]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Navigators'
ALTER TABLE [dbo].[Navigators]
ADD CONSTRAINT [PK_Navigators]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Pillars'
ALTER TABLE [dbo].[Pillars]
ADD CONSTRAINT [PK_Pillars]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'VMS'
ALTER TABLE [dbo].[VMS]
ADD CONSTRAINT [PK_VMS]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'ProjectEquipments'
ALTER TABLE [dbo].[ProjectEquipments]
ADD CONSTRAINT [PK_ProjectEquipments]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- --------------------------------------------------
-- Creating all FOREIGN KEY constraints
-- --------------------------------------------------

-- Creating foreign key on [FoundationId] in table 'VMS'
ALTER TABLE [dbo].[VMS]
ADD CONSTRAINT [FK_VMS_Foundation]
    FOREIGN KEY ([FoundationId])
    REFERENCES [dbo].[Foundations]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_VMS_Foundation'
CREATE INDEX [IX_FK_VMS_Foundation]
ON [dbo].[VMS]
    ([FoundationId]);
GO

-- Creating foreign key on [LEDModuleId] in table 'VMS'
ALTER TABLE [dbo].[VMS]
ADD CONSTRAINT [FK_VMS_LEDModule]
    FOREIGN KEY ([LEDModuleId])
    REFERENCES [dbo].[LEDModules]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_VMS_LEDModule'
CREATE INDEX [IX_FK_VMS_LEDModule]
ON [dbo].[VMS]
    ([LEDModuleId]);
GO

-- Creating foreign key on [Parent_Id] in table 'Navigators'
ALTER TABLE [dbo].[Navigators]
ADD CONSTRAINT [FK_Navigators_Navigators]
    FOREIGN KEY ([Parent_Id])
    REFERENCES [dbo].[Navigators]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_Navigators_Navigators'
CREATE INDEX [IX_FK_Navigators_Navigators]
ON [dbo].[Navigators]
    ([Parent_Id]);
GO

-- Creating foreign key on [PillarId] in table 'VMS'
ALTER TABLE [dbo].[VMS]
ADD CONSTRAINT [FK_VMS_Pillar]
    FOREIGN KEY ([PillarId])
    REFERENCES [dbo].[Pillars]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_VMS_Pillar'
CREATE INDEX [IX_FK_VMS_Pillar]
ON [dbo].[VMS]
    ([PillarId]);
GO

-- --------------------------------------------------
-- Script has ended
-- --------------------------------------------------