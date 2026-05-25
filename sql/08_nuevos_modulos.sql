-- ============================================================
--  NUEVOS MODULOS: Areas, Contrapartes, Doctrina,
--  Jurisprudencia, Leyes
--  Ejecutar DESPUES de 07_modelos_ampliados.sql
-- ============================================================
USE EstudioJuridico;
GO

-- ── Areas del estudio (configurable) ────────────────────────
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'AreasEstudio')
BEGIN
  CREATE TABLE AreasEstudio (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    nombre      NVARCHAR(100) NOT NULL,
    icon        NVARCHAR(50)  NOT NULL DEFAULT 'ti-books',
    color       NVARCHAR(20)  NOT NULL DEFAULT 'info',
    descripcion NVARCHAR(500),
    activo      BIT           NOT NULL DEFAULT 1,
    orden       INT           NOT NULL DEFAULT 0,
    creado_en   DATETIME2     NOT NULL DEFAULT GETDATE(),
    CONSTRAINT uq_AreasEstudio_nombre UNIQUE (nombre)
  );
END
GO

-- Seed areas por defecto
INSERT INTO AreasEstudio (nombre, icon, color, descripcion, orden)
SELECT nombre, icon, color, descripcion, orden FROM (VALUES
  ('Corporativo',  'ti-building-skyscraper', 'info',      'M&A, contratos corporativos, gobierno corporativo, financiamiento estructurado y compliance.', 1),
  ('Societario',   'ti-users',               'success',   'Constitucion y reorganizacion de sociedades, estatutos, asambleas, directorio y registros IGJ.', 2),
  ('Comercial',    'ti-briefcase',           'warning',   'Contratos comerciales, distribucion, franquicias, concursos, quiebras y cobro ejecutivo.', 3),
  ('Civil',        'ti-scale',               'secondary', 'Contratos civiles, responsabilidad civil, sucesiones, inmobiliario y daños y perjuicios.', 4),
  ('Laboral',      'ti-id-badge-2',          'danger',    'Relaciones laborales, despidos, convenios colectivos, seguridad social y litigios CNAT.', 5)
) AS src(nombre, icon, color, descripcion, orden)
WHERE NOT EXISTS (SELECT 1 FROM AreasEstudio a WHERE a.nombre = src.nombre);
GO

-- ── Contrapartes ────────────────────────────────────────────
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'Contrapartes')
BEGIN
  CREATE TABLE Contrapartes (
    id                  INT IDENTITY(1,1) PRIMARY KEY,
    tipo                NVARCHAR(20)  NOT NULL DEFAULT 'fisica'
                          CONSTRAINT ck_Contrapartes_tipo CHECK (tipo IN ('fisica','juridica')),
    nombre              NVARCHAR(200) NOT NULL,
    razon_social        NVARCHAR(200),
    dni                 NVARCHAR(20),
    cuit                NVARCHAR(20),
    email               NVARCHAR(150),
    tel                 NVARCHAR(50),
    celular             NVARCHAR(50),
    domicilio           NVARCHAR(300),
    localidad           NVARCHAR(100),
    provincia           NVARCHAR(100) DEFAULT 'Buenos Aires',
    cp                  NVARCHAR(10),
    abogado_contraparte NVARCHAR(200),
    mat_abogado         NVARCHAR(100),
    rol_procesal        NVARCHAR(100),
    area                NVARCHAR(60),
    observaciones       NVARCHAR(MAX),
    notas_internas      NVARCHAR(MAX),
    activo              BIT           NOT NULL DEFAULT 1,
    creado_en           DATETIME2     NOT NULL DEFAULT GETDATE()
  );
END
GO

-- Relacion Contrapartes <-> Expedientes
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'ContraprtesExpedientes')
BEGIN
  CREATE TABLE ContraprtesExpedientes (
    id_contraparte INT NOT NULL REFERENCES Contrapartes(id) ON DELETE CASCADE,
    id_expediente  INT NOT NULL REFERENCES Expedientes(id)  ON DELETE CASCADE,
    PRIMARY KEY (id_contraparte, id_expediente)
  );
END
GO

-- ── Doctrina ─────────────────────────────────────────────────
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'Doctrina')
BEGIN
  CREATE TABLE Doctrina (
    id                INT IDENTITY(1,1) PRIMARY KEY,
    titulo            NVARCHAR(500) NOT NULL,
    autor             NVARCHAR(200),
    coautores         NVARCHAR(500),
    fuente            NVARCHAR(100),
    publicacion       NVARCHAR(300),
    fecha_publicacion DATE,
    area              NVARCHAR(60),
    resumen           NVARCHAR(MAX),
    contenido         NVARCHAR(MAX),
    voces             NVARCHAR(500),
    url               NVARCHAR(500),
    activo            BIT           NOT NULL DEFAULT 1,
    creado_en         DATETIME2     NOT NULL DEFAULT GETDATE()
  );
END
GO

-- ── Jurisprudencia ───────────────────────────────────────────
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'Jurisprudencia')
BEGIN
  CREATE TABLE Jurisprudencia (
    id           INT IDENTITY(1,1) PRIMARY KEY,
    caratula     NVARCHAR(500) NOT NULL,
    tribunal     NVARCHAR(200),
    sala         NVARCHAR(50),
    fecha_fallo  DATE,
    area         NVARCHAR(60),
    tema         NVARCHAR(300),
    voces        NVARCHAR(500),
    resumen      NVARCHAR(MAX),
    texto        NVARCHAR(MAX),
    cita         NVARCHAR(300),
    publicado_en NVARCHAR(200),
    url          NVARCHAR(500),
    activo       BIT           NOT NULL DEFAULT 1,
    creado_en    DATETIME2     NOT NULL DEFAULT GETDATE()
  );
END
GO

-- ── Leyes ────────────────────────────────────────────────────
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'Leyes')
BEGIN
  CREATE TABLE Leyes (
    id                  INT IDENTITY(1,1) PRIMARY KEY,
    numero              NVARCHAR(30)  NOT NULL,
    nombre              NVARCHAR(400) NOT NULL,
    tipo                NVARCHAR(50)  DEFAULT 'ley'
                          CONSTRAINT ck_Leyes_tipo CHECK (tipo IN ('ley','decreto','resolucion','disposicion','ordenanza','convenio')),
    organismo           NVARCHAR(100),
    fecha_sancion       DATE,
    fecha_promulgacion  DATE,
    fecha_vigencia      DATE,
    boletin_numero      NVARCHAR(50),
    boletin_fecha       DATE,
    area                NVARCHAR(60),
    resumen             NVARCHAR(MAX),
    texto               NVARCHAR(MAX),
    url_infoleg         NVARCHAR(500),
    activo              BIT           NOT NULL DEFAULT 1,
    creado_en           DATETIME2     NOT NULL DEFAULT GETDATE()
  );
END
GO

-- Indices
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='ix_Contrapartes_tipo'    AND object_id=OBJECT_ID('Contrapartes'))
    CREATE INDEX ix_Contrapartes_tipo    ON Contrapartes(tipo);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='ix_Contrapartes_nombre'  AND object_id=OBJECT_ID('Contrapartes'))
    CREATE INDEX ix_Contrapartes_nombre  ON Contrapartes(nombre);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='ix_Doctrina_area'        AND object_id=OBJECT_ID('Doctrina'))
    CREATE INDEX ix_Doctrina_area        ON Doctrina(area);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='ix_Doctrina_autor'       AND object_id=OBJECT_ID('Doctrina'))
    CREATE INDEX ix_Doctrina_autor       ON Doctrina(autor);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='ix_Jurisprudencia_area'  AND object_id=OBJECT_ID('Jurisprudencia'))
    CREATE INDEX ix_Jurisprudencia_area  ON Jurisprudencia(area);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='ix_Jurisprudencia_fecha' AND object_id=OBJECT_ID('Jurisprudencia'))
    CREATE INDEX ix_Jurisprudencia_fecha ON Jurisprudencia(fecha_fallo);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='ix_Leyes_tipo'           AND object_id=OBJECT_ID('Leyes'))
    CREATE INDEX ix_Leyes_tipo           ON Leyes(tipo);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='ix_Leyes_area'           AND object_id=OBJECT_ID('Leyes'))
    CREATE INDEX ix_Leyes_area           ON Leyes(area);
GO

-- Seed doctrina
INSERT INTO Doctrina (titulo, autor, fuente, publicacion, fecha_publicacion, area, resumen, voces)
SELECT titulo, autor, fuente, publicacion, fecha_publicacion, area, resumen, voces FROM (VALUES
  ('El despido discriminatorio en el derecho argentino', 'Cornaglia, Ricardo J.', 'LL', 'La Ley', '2023-06-01', 'Laboral',
   'Analisis de la Ley 23.592 aplicada al ambito laboral y los criterios jurisprudenciales de la CSJN.',
   'despido discriminatorio, Ley 23592, reinstalacion, nulidad'),
  ('La responsabilidad civil en el Codigo Civil y Comercial', 'Picasso, Sebastian', 'LL', 'La Ley', '2022-03-01', 'Civil',
   'Estudio sistematico del regimen de responsabilidad civil en el CCyCN y sus diferencias con el codigo derogado.',
   'responsabilidad civil, dano, CCyCN, antijuridicidad'),
  ('Contrato de locacion: reforma de la Ley 27.551', 'Kiper, Claudio M.', 'JA', 'Jurisprudencia Argentina', '2021-08-01', 'Civil',
   'Comentario a la reforma del regimen locativo. Plazo minimo, actualizacion ICL y proteccion del locatario.',
   'locacion, alquiler, Ley 27551, ICL, plazo minimo'),
  ('Sociedades por Acciones Simplificadas: aspectos practicos', 'Veron, Alberto Victor', 'ED', 'El Derecho', '2022-11-01', 'Societario',
   'Analisis de la Ley 27.349. Constitucion, administracion y disolucion de las SAS.',
   'SAS, Ley 27349, sociedad unipersonal, registro electronico'),
  ('La mediacion obligatoria en el proceso civil', 'Highton, Elena I.', 'LL', 'La Ley', '2023-01-01', 'Civil',
   'Estudio del funcionamiento de la mediacion prejudicial obligatoria conforme la Ley 26.589.',
   'mediacion, Ley 26589, proceso civil, acuerdo homologado')
) AS src(titulo, autor, fuente, publicacion, fecha_publicacion, area, resumen, voces)
WHERE NOT EXISTS (SELECT 1 FROM Doctrina d WHERE d.titulo = src.titulo);
GO

-- Seed jurisprudencia
INSERT INTO Jurisprudencia (caratula, tribunal, sala, fecha_fallo, area, tema, resumen, cita, publicado_en, voces)
SELECT caratula, tribunal, sala, fecha_fallo, area, tema, resumen, cita, publicado_en, voces FROM (VALUES
  ('Recurso de hecho deducido por la actora en la causa Pellicori, Liliana Silvia c/ Colegio Publico de Abogados de la Capital Federal s/ amparo',
   'CSJN', NULL, '2011-10-15', 'Laboral', 'Discriminacion laboral. Carga de la prueba.',
   'La CSJN establece que en materia de discriminacion laboral basta con que el trabajador aporte indicios razonables para invertir la carga probatoria hacia el empleador.',
   'Fallos 334:1387', 'Fallos CSJN',
   'discriminacion, carga prueba, Ley 23592, trabajador, indicios'),
  ('Aquino, Isacio c/ Cargo Servicios Industriales SA s/ accidentes ley 9688',
   'CSJN', NULL, '2004-09-21', 'Laboral', 'Accidente de trabajo. Inconstitucionalidad art. 39 LRT.',
   'La CSJN declaro la inconstitucionalidad del art. 39 de la LRT en cuanto impedia al trabajador accidentado demandar por el derecho comun.',
   'Fallos 327:3753', 'Fallos CSJN',
   'accidente trabajo, LRT, derecho comun, inconstitucionalidad'),
  ('Camacho Acosta, Maximino c/ Grafi Graf SRL y otros s/ danos y perjuicios',
   'CSJN', NULL, '1997-08-07', 'Civil', 'Medida cautelar innovativa. Protesis.',
   'La CSJN hizo lugar a una medida cautelar innovativa ordenando colocar una protesis al actor antes de la sentencia, por el peligro en la demora.',
   'Fallos 320:1633', 'Fallos CSJN',
   'cautelar innovativa, peligro demora, protesis, urgencia'),
  ('Giroldi, Horacio David y otro s/ recurso de casacion — causa 32/93',
   'CSJN', NULL, '1995-04-07', 'Civil', 'Tratados internacionales. Jerarquia constitucional.',
   'La CSJN establece la obligatoriedad de la jurisprudencia de la Corte IDH como guia de interpretacion de los Tratados de DDHH incorporados por art. 75 inc. 22 CN.',
   'Fallos 318:514', 'Fallos CSJN',
   'tratados internacionales, CADH, Corte IDH, jerarquia constitucional')
) AS src(caratula, tribunal, sala, fecha_fallo, area, tema, resumen, cita, publicado_en, voces)
WHERE NOT EXISTS (SELECT 1 FROM Jurisprudencia j WHERE j.caratula = src.caratula);
GO

-- Seed leyes
INSERT INTO Leyes (numero, nombre, tipo, organismo, fecha_sancion, fecha_vigencia, area, resumen, url_infoleg)
SELECT numero, nombre, tipo, organismo, fecha_sancion, fecha_vigencia, area, resumen, url_infoleg FROM (VALUES
  ('20744', 'Ley de Contrato de Trabajo (LCT)', 'ley', 'Honorable Congreso de la Nacion', '1974-09-11', '1974-10-21', 'Laboral',
   'Regula el contrato de trabajo, derechos y obligaciones de trabajadores y empleadores. Texto ordenado por Decreto 390/76.',
   'https://www.infoleg.gob.ar/infolegInternet/anexos/25000-29999/25552/texact.htm'),
  ('19550', 'Ley General de Sociedades', 'ley', 'Honorable Congreso de la Nacion', '1972-04-03', '1972-11-03', 'Societario',
   'Regula las sociedades comerciales: SRL, SA, SAS, sociedades de hecho. Modificada por Ley 26.994 (CCyCN).',
   'https://www.infoleg.gob.ar/infolegInternet/anexos/25000-29999/25553/texact.htm'),
  ('26994', 'Codigo Civil y Comercial de la Nacion', 'ley', 'Honorable Congreso de la Nacion', '2014-10-01', '2015-08-01', 'Civil',
   'Unifica el Codigo Civil y el Codigo de Comercio. Regula personas, familia, contratos, obligaciones, derechos reales y sucesiones.',
   'https://www.infoleg.gob.ar/infolegInternet/anexos/235000-239999/235975/texact.htm'),
  ('27551', 'Ley de Alquileres', 'ley', 'Honorable Congreso de la Nacion', '2020-06-11', '2020-07-01', 'Civil',
   'Reforma el regimen de locaciones urbanas. Establece plazo minimo de 3 anos, actualizacion anual por ICL y restricciones al desalojo.',
   'https://www.infoleg.gob.ar/infolegInternet/anexos/340000-344999/340384/norma.htm'),
  ('26485', 'Proteccion Integral de las Mujeres', 'ley', 'Honorable Congreso de la Nacion', '2009-03-11', '2009-04-14', 'Civil',
   'Ley de proteccion contra la violencia de genero. Define tipos de violencia, medidas cautelares y mecanismos de proteccion.',
   'https://www.infoleg.gob.ar/infolegInternet/anexos/150000-154999/152155/norma.htm'),
  ('24522', 'Ley de Concursos y Quiebras', 'ley', 'Honorable Congreso de la Nacion', '1995-07-07', '1995-08-09', 'Comercial',
   'Regula el concurso preventivo y la quiebra de personas humanas y juridicas. Acuerdos preventivos extrajudiciales.',
   'https://www.infoleg.gob.ar/infolegInternet/anexos/0-4999/116/texact.htm')
) AS src(numero, nombre, tipo, organismo, fecha_sancion, fecha_vigencia, area, resumen, url_infoleg)
WHERE NOT EXISTS (SELECT 1 FROM Leyes l WHERE l.numero = src.numero);
GO

PRINT 'Script 08_nuevos_modulos.sql ejecutado correctamente.';
SELECT 'AreasEstudio'    AS tabla, COUNT(*) AS registros FROM AreasEstudio   UNION ALL
SELECT 'Contrapartes',    COUNT(*) FROM Contrapartes   UNION ALL
SELECT 'Doctrina',        COUNT(*) FROM Doctrina        UNION ALL
SELECT 'Jurisprudencia',  COUNT(*) FROM Jurisprudencia  UNION ALL
SELECT 'Leyes',           COUNT(*) FROM Leyes;
GO

-- ── ConfiguracionSistema (clave-valor para settings del sistema) ─
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'ConfiguracionSistema')
BEGIN
  CREATE TABLE ConfiguracionSistema (
    clave         NVARCHAR(100)  NOT NULL PRIMARY KEY,
    valor         NVARCHAR(MAX),
    descripcion   NVARCHAR(300),
    actualizado_en DATETIME2     NOT NULL DEFAULT GETDATE()
  );
  INSERT INTO ConfiguracionSistema (clave, descripcion) VALUES
    ('ANTHROPIC_API_KEY',  'API Key de Anthropic para el modulo Investigacion IA (console.anthropic.com)');
END
GO
