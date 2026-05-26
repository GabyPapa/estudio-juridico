-- ============================================================
--  HISTORIA DEL EXPEDIENTE — Movimientos procesales
--  Basado en la filosofía de Lex Doctor 11
--  Ejecutar DESPUES de 09_escritos_propios.sql
-- ============================================================
USE EstudioJuridico;
GO

-- Tipos de movimiento (tabla maestra configurable)
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'TiposMovimiento')
BEGIN
  CREATE TABLE TiposMovimiento (
    id       INT IDENTITY(1,1) PRIMARY KEY,
    nombre   NVARCHAR(100) NOT NULL,
    icono    NVARCHAR(50)  NOT NULL DEFAULT 'ti-file',
    color    NVARCHAR(20)  NOT NULL DEFAULT 'secondary',
    activo   BIT           NOT NULL DEFAULT 1,
    orden    INT           NOT NULL DEFAULT 0
  );

  INSERT INTO TiposMovimiento (nombre, icono, color, orden) VALUES
    -- Presentaciones propias
    ('Escrito presentado',          'ti-file-text',          'info',      1),
    ('Demanda / Reconvención',      'ti-file-plus',          'info',      2),
    ('Recurso de apelación',        'ti-arrow-up',           'warning',   3),
    ('Recurso extraordinario',      'ti-flag',               'warning',   4),
    ('Expresión de agravios',       'ti-notes',              'warning',   5),
    ('Contestación de traslado',    'ti-reply',              'info',      6),
    ('Ofrecimiento de prueba',      'ti-clipboard-list',     'info',      7),
    ('Alegato',                     'ti-blockquote',         'info',      8),
    -- Comunicaciones judiciales
    ('Cédula librada',              'ti-mail',               'secondary', 10),
    ('Cédula recibida',             'ti-mail-opened',        'secondary', 11),
    ('Oficio librado',              'ti-send',               'secondary', 12),
    ('Oficio recibido',             'ti-inbox',              'secondary', 13),
    ('Mandamiento librado',         'ti-certificate',        'secondary', 14),
    ('Exhorto',                     'ti-world',              'secondary', 15),
    -- Resoluciones judiciales
    ('Resolución / Providencia',    'ti-gavel',              'success',   20),
    ('Sentencia de primera inst.',  'ti-gavel',              'success',   21),
    ('Sentencia de Cámara',         'ti-gavel',              'success',   22),
    ('Sentencia CSJN',              'ti-gavel',              'success',   23),
    ('Auto interlocutorio',         'ti-gavel',              'secondary', 24),
    ('Traslado ordenado',           'ti-arrow-right',        'secondary', 25),
    ('Apertura a prueba',           'ti-clipboard',          'info',      26),
    -- Prueba
    ('Audiencia de prueba',         'ti-users',              'warning',   30),
    ('Audiencia preliminar',        'ti-users',              'warning',   31),
    ('Audiencia de conciliación',   'ti-handshake',          'success',   32),
    ('Absolución de posiciones',    'ti-user-question',      'warning',   33),
    ('Testimonial',                 'ti-microphone',         'secondary', 34),
    ('Pericia presentada',          'ti-report-analytics',   'secondary', 35),
    ('Informe pericial impugnado',  'ti-alert-triangle',     'danger',    36),
    ('Informe de AFIP/ANSES/otros', 'ti-building-bank',      'secondary', 37),
    -- Cautelares
    ('Medida cautelar solicitada',  'ti-lock',               'warning',   40),
    ('Embargo trabado',             'ti-lock',               'danger',    41),
    ('Inhibición anotada',          'ti-ban',                'danger',    42),
    ('Cautelar levantada',          'ti-lock-open',          'success',   43),
    -- Gestión interna
    ('Consulta al cliente',         'ti-phone',              'secondary', 50),
    ('Notificación al cliente',     'ti-message',            'secondary', 51),
    ('Pago de tasa judicial',       'ti-coin',               'secondary', 52),
    ('Gestión en tribunales',       'ti-building-courthouse','secondary', 53),
    ('Acuerdo / Transacción',       'ti-handshake',          'success',   54),
    ('Homologación',                'ti-circle-check',       'success',   55),
    ('Archivo / Clausura',          'ti-archive',            'secondary', 56),
    -- General
    ('Nota interna',                'ti-pencil',             'secondary', 60),
    ('Otro',                        'ti-dots',               'secondary', 99);
END
GO

-- Historia del expediente (movimientos)
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'HistoriaExpediente')
BEGIN
  CREATE TABLE HistoriaExpediente (
    id             INT IDENTITY(1,1) PRIMARY KEY,
    id_expediente  INT           NOT NULL REFERENCES Expedientes(id) ON DELETE CASCADE,
    fecha          DATE          NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    hora           TIME          NULL,
    id_tipo        INT           NOT NULL REFERENCES TiposMovimiento(id),
    descripcion    NVARCHAR(MAX) NOT NULL,
    fojas          NVARCHAR(20)  NULL,        -- fojas del expediente
    id_abogado     INT           NULL REFERENCES Abogados(id) ON DELETE SET NULL,
    prox_paso      NVARCHAR(500) NULL,        -- qué hay que hacer después
    prox_fecha     DATE          NULL,        -- vencimiento / próxima fecha
    importante     BIT           NOT NULL DEFAULT 0,  -- marcar como hito
    adjunto_nombre NVARCHAR(300) NULL,        -- nombre del archivo adjunto
    adjunto_ruta   NVARCHAR(500) NULL,        -- ruta en disco
    creado_en      DATETIME2     NOT NULL DEFAULT GETDATE()
  );
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='ix_Historia_exp_fecha' AND object_id=OBJECT_ID('HistoriaExpediente'))
  CREATE INDEX ix_Historia_exp_fecha ON HistoriaExpediente(id_expediente, fecha DESC);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='ix_Historia_fecha' AND object_id=OBJECT_ID('HistoriaExpediente'))
  CREATE INDEX ix_Historia_fecha ON HistoriaExpediente(fecha DESC);
GO

PRINT '11_movimientos_expediente.sql ejecutado correctamente.';
SELECT COUNT(*) AS tipos_movimiento FROM TiposMovimiento WHERE activo=1;
GO
