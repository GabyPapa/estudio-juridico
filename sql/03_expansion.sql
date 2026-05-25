-- ============================================================
--  EXPANSIÓN v2 — Juzgados, Colegios, Matriculas, Modelos
-- ============================================================
USE EstudioJuridico;
GO

-- ── ColegiosAbogados ──────────────────────────────────────
CREATE TABLE ColegiosAbogados (
    id           INT IDENTITY(1,1) PRIMARY KEY,
    nombre       NVARCHAR(200) NOT NULL,
    sigla        NVARCHAR(30),
    jurisdiccion NVARCHAR(100),
    domicilio    NVARCHAR(250),
    telefono     NVARCHAR(60),
    email        NVARCHAR(150),
    web          NVARCHAR(200),
    activo       BIT NOT NULL DEFAULT 1
);
GO

-- ── Extensión de Abogados (tipo interno/externo + datos adicionales) ──
ALTER TABLE Abogados
    ADD tipo          NVARCHAR(20)  NOT NULL DEFAULT 'interno'
                          CONSTRAINT ck_Abogados_tipo CHECK (tipo IN ('interno','externo')),
        dni           NVARCHAR(20),
        fecha_nac     DATE,
        domicilio     NVARCHAR(250),
        localidad     NVARCHAR(100),
        provincia     NVARCHAR(60),
        cp            NVARCHAR(10),
        celular       NVARCHAR(50),
        notas_internas NVARCHAR(MAX);
GO

-- ── AbogadosMatriculas (1 abogado → N matrículas en distintos colegios) ──
CREATE TABLE AbogadosMatriculas (
    id               INT IDENTITY(1,1) PRIMARY KEY,
    id_abogado       INT NOT NULL REFERENCES Abogados(id)         ON DELETE CASCADE,
    id_colegio       INT NOT NULL REFERENCES ColegiosAbogados(id)  ON DELETE NO ACTION,
    tomo             NVARCHAR(20),
    folio            NVARCHAR(20),
    numero_matricula NVARCHAR(40),
    fecha_inscripcion DATE,
    estado           NVARCHAR(20) NOT NULL DEFAULT 'activa'
                         CONSTRAINT ck_Matriculas_estado CHECK (estado IN ('activa','suspendida','baja')),
    observaciones    NVARCHAR(MAX),
    CONSTRAINT uq_AbogadosColegio UNIQUE (id_abogado, id_colegio)
);
GO

-- ── Juzgados ──────────────────────────────────────────────
CREATE TABLE Juzgados (
    id              INT IDENTITY(1,1) PRIMARY KEY,
    numero          INT,
    nombre          NVARCHAR(200) NOT NULL,   -- "Juzgado Nacional en lo Comercial Nº 1"
    fuero           NVARCHAR(60)  NOT NULL,   -- Comercial, Civil, Laboral, Penal, Federal...
    jurisdiccion    NVARCHAR(60)  NOT NULL DEFAULT 'Nacional',  -- Nacional, Ciudad, Provincial
    camara          NVARCHAR(200),            -- Cámara de apelaciones a la que pertenece
    nombre_juez     NVARCHAR(120),
    calle           NVARCHAR(150),
    numero_calle    NVARCHAR(10),
    piso            NVARCHAR(20),
    oficina         NVARCHAR(20),
    cp              NVARCHAR(10),
    localidad       NVARCHAR(80) NOT NULL DEFAULT 'CABA',
    provincia       NVARCHAR(60) NOT NULL DEFAULT 'Buenos Aires',
    telefono        NVARCHAR(80),
    fax             NVARCHAR(60),
    email           NVARCHAR(150),
    lex100          NVARCHAR(200),            -- código en sistema Lex100
    horario         NVARCHAR(100),
    observaciones   NVARCHAR(MAX),
    activo          BIT NOT NULL DEFAULT 1
);
GO

-- ── SecretariasJuzgado (1 juzgado → N secretarías) ────────
CREATE TABLE SecretariasJuzgado (
    id              INT IDENTITY(1,1) PRIMARY KEY,
    id_juzgado      INT NOT NULL REFERENCES Juzgados(id) ON DELETE CASCADE,
    numero          NVARCHAR(20) NOT NULL,    -- "Nº 1", "Nº 2", "Única"
    nombre_secretario NVARCHAR(120),
    telefono        NVARCHAR(60),
    telefono_int    NVARCHAR(20),             -- interno
    piso            NVARCHAR(20),
    email           NVARCHAR(150),
    observaciones   NVARCHAR(MAX)
);
GO

-- ── ModelosCategorias ─────────────────────────────────────
CREATE TABLE ModelosCategorias (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    nombre      NVARCHAR(100) NOT NULL,
    tipo        NVARCHAR(20)  NOT NULL CONSTRAINT ck_Categorias_tipo CHECK (tipo IN ('escrito','contrato')),
    area        NVARCHAR(60),
    descripcion NVARCHAR(500),
    orden       INT NOT NULL DEFAULT 0
);
GO

-- ── Modelos (escritos y contratos) ────────────────────────
CREATE TABLE Modelos (
    id           INT IDENTITY(1,1) PRIMARY KEY,
    id_categoria INT NOT NULL REFERENCES ModelosCategorias(id),
    nombre       NVARCHAR(200) NOT NULL,
    descripcion  NVARCHAR(500),
    area         NVARCHAR(60),
    contenido    NVARCHAR(MAX) NOT NULL,      -- Texto completo con marcadores {{CAMPO}}
    variables    NVARCHAR(MAX),               -- JSON: [{"campo":"NOMBRE_ACTOR","label":"Nombre del actor","tipo":"text"}]
    version      NVARCHAR(20) NOT NULL DEFAULT '1.0',
    activo       BIT NOT NULL DEFAULT 1,
    creado_en    DATETIME2 NOT NULL DEFAULT GETDATE(),
    actualizado_en DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO

-- ── Índices ───────────────────────────────────────────────
CREATE INDEX ix_Juzgados_fuero      ON Juzgados(fuero);
CREATE INDEX ix_Juzgados_localidad  ON Juzgados(localidad);
CREATE INDEX ix_Modelos_categoria   ON Modelos(id_categoria);
CREATE INDEX ix_Modelos_area        ON Modelos(area);
CREATE INDEX ix_Matriculas_abogado  ON AbogadosMatriculas(id_abogado);
GO
