-- ============================================================
--  ESTUDIO JURÍDICO — Esquema SQL Server
--  Ejecutar una sola vez en SQL Server 2019+ o Azure SQL
-- ============================================================

USE master;
GO
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'EstudioJuridico')
    CREATE DATABASE EstudioJuridico
        COLLATE Modern_Spanish_CI_AI;
GO
USE EstudioJuridico;
GO

-- ── Abogados ──────────────────────────────────────────────
CREATE TABLE Abogados (
    id           INT IDENTITY(1,1) PRIMARY KEY,
    nombre       NVARCHAR(120) NOT NULL,
    matricula    NVARCHAR(60),
    especialidad NVARCHAR(200),
    email        NVARCHAR(150),
    tel          NVARCHAR(50),
    activo       BIT           NOT NULL DEFAULT 1,
    creado_en    DATETIME2     NOT NULL DEFAULT GETDATE()
);
GO

-- ── Usuarios del sistema ───────────────────────────────────
CREATE TABLE Usuarios (
    id            INT IDENTITY(1,1) PRIMARY KEY,
    nombre        NVARCHAR(120) NOT NULL,
    email         NVARCHAR(150) NOT NULL,
    password_hash NVARCHAR(255) NOT NULL,
    rol           NVARCHAR(20)  NOT NULL
        CONSTRAINT ck_Usuarios_rol CHECK (rol IN ('socio','abogado','administrador')),
    id_abogado    INT           NULL REFERENCES Abogados(id) ON DELETE SET NULL,
    activo        BIT           NOT NULL DEFAULT 1,
    creado_en     DATETIME2     NOT NULL DEFAULT GETDATE(),
    CONSTRAINT uq_Usuarios_email UNIQUE (email)
);
GO

-- ── Clientes ──────────────────────────────────────────────
CREATE TABLE Clientes (
    id        INT IDENTITY(1,1) PRIMARY KEY,
    razon     NVARCHAR(200) NOT NULL,
    tipo      NVARCHAR(20)  NOT NULL
        CONSTRAINT ck_Clientes_tipo CHECK (tipo IN ('actual','potencial')),
    area      NVARCHAR(60),
    cuit      NVARCHAR(20),
    contacto  NVARCHAR(100),
    email     NVARCHAR(150),
    tel       NVARCHAR(50),
    notas     NVARCHAR(MAX),
    creado_en DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO

-- ── Expedientes ───────────────────────────────────────────
CREATE TABLE Expedientes (
    id             INT IDENTITY(1,1) PRIMARY KEY,
    numero         NVARCHAR(40)  NOT NULL,
    caratula       NVARCHAR(600) NOT NULL,
    area           NVARCHAR(60)  NOT NULL,
    estado         NVARCHAR(20)  NOT NULL DEFAULT 'activo'
        CONSTRAINT ck_Expedientes_estado CHECK (estado IN ('activo','cerrado','suspendido')),
    id_cliente     INT  NULL REFERENCES Clientes(id)  ON DELETE SET NULL,
    id_abogado     INT  NULL REFERENCES Abogados(id)  ON DELETE SET NULL,
    juzgado        NVARCHAR(250),
    apertura       DATE,
    prox_fecha     DATE,
    notas          NVARCHAR(MAX),
    creado_en      DATETIME2 NOT NULL DEFAULT GETDATE(),
    actualizado_en DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT uq_Expedientes_numero UNIQUE (numero)
);
GO

-- ── Movimientos / bitácora de expedientes ─────────────────
CREATE TABLE MovimientosExpediente (
    id            INT IDENTITY(1,1) PRIMARY KEY,
    id_expediente INT           NOT NULL
        REFERENCES Expedientes(id) ON DELETE CASCADE,
    descripcion   NVARCHAR(600) NOT NULL,
    id_usuario    INT           NULL REFERENCES Usuarios(id) ON DELETE SET NULL,
    fecha         DATETIME2     NOT NULL DEFAULT GETDATE()
);
GO

-- ── Alertas enviadas ──────────────────────────────────────
-- BUG FIX: ON DELETE CASCADE faltaba — causaba FK error al eliminar expedientes
CREATE TABLE AlertasEnviadas (
    id               INT IDENTITY(1,1) PRIMARY KEY,
    id_expediente    INT NOT NULL
        REFERENCES Expedientes(id) ON DELETE CASCADE,
    dias_anticipacion INT,
    enviado_en        DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO

-- ── Trigger: actualiza actualizado_en en cada UPDATE ──────
CREATE TRIGGER trg_Expedientes_ActualizadoEn
ON Expedientes AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Expedientes
    SET    actualizado_en = GETDATE()
    WHERE  id IN (SELECT id FROM inserted);
END;
GO

-- ── Índices de rendimiento ────────────────────────────────
CREATE INDEX ix_Expedientes_estado     ON Expedientes(estado);
CREATE INDEX ix_Expedientes_area       ON Expedientes(area);
CREATE INDEX ix_Expedientes_prox_fecha ON Expedientes(prox_fecha) WHERE prox_fecha IS NOT NULL;
CREATE INDEX ix_Expedientes_id_abogado ON Expedientes(id_abogado);
CREATE INDEX ix_AlertasEnviadas_fecha  ON AlertasEnviadas(enviado_en);
GO
