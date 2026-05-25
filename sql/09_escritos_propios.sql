-- ============================================================
--  ESCRITOS PROPIOS — almacenamiento de documentos generados
--  Ejecutar DESPUES de 08_nuevos_modulos.sql
-- ============================================================
USE EstudioJuridico;
GO

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'EscritosPersonales')
BEGIN
  CREATE TABLE EscritosPersonales (
    id             INT IDENTITY(1,1) PRIMARY KEY,
    titulo         NVARCHAR(400)  NOT NULL,
    area           NVARCHAR(60),
    categoria      NVARCHAR(100),
    descripcion    NVARCHAR(MAX),
    filename       NVARCHAR(300)  NOT NULL,     -- nombre en disco
    original_name  NVARCHAR(300),               -- nombre original del archivo
    mimetype       NVARCHAR(100),
    size_bytes     INT,
    extension      NVARCHAR(10),
    tags           NVARCHAR(500),
    id_expediente  INT REFERENCES Expedientes(id) ON DELETE SET NULL,
    notas          NVARCHAR(MAX),
    activo         BIT            NOT NULL DEFAULT 1,
    creado_en      DATETIME2      NOT NULL DEFAULT GETDATE()
  );
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='ix_EscritosPersonales_area' AND object_id=OBJECT_ID('EscritosPersonales'))
    CREATE INDEX ix_EscritosPersonales_area  ON EscritosPersonales(area);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='ix_EscritosPersonales_cat'  AND object_id=OBJECT_ID('EscritosPersonales'))
    CREATE INDEX ix_EscritosPersonales_cat   ON EscritosPersonales(categoria);
GO

PRINT '09_escritos_propios.sql ejecutado OK.';
SELECT COUNT(*) AS escritos_cargados FROM EscritosPersonales;
GO
