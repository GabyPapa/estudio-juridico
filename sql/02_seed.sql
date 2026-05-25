-- ============================================================
--  ESTUDIO JURÍDICO — Datos iniciales de ejemplo
--
--  IMPORTANTE: Este script inserta abogados, clientes y
--  expedientes de ejemplo. Los USUARIOS se crean con el
--  script Node.js:
--
--    cd backend && node scripts/seed.js
--
--  Ese script genera los hashes bcrypt correctamente.
-- ============================================================
USE EstudioJuridico;
GO

-- ── Abogados ──────────────────────────────────────────────
INSERT INTO Abogados (nombre, matricula, especialidad, email, tel, activo) VALUES
('Dr. Carlos Rodríguez',  'CAC 12.450', 'Corporativo · Societario', 'c.rodriguez@estudio.com', '+54 11 4555-0101', 1),
('Dra. Ana García',       'CAC 18.720', 'Laboral · Civil',          'a.garcia@estudio.com',    '+54 11 4555-0102', 1),
('Dr. Martín López',      'CAC 23.410', 'Comercial',                'm.lopez@estudio.com',     '+54 11 4555-0103', 1),
('Dra. Valentina Sosa',   'CAC 31.560', 'Civil · Societario',       'v.sosa@estudio.com',      '+54 11 4555-0104', 1),
('Dr. Sebastián Herrera', 'CAC 40.220', 'Laboral',                  's.herrera@estudio.com',   '+54 11 4555-0105', 0);
GO

-- ── Clientes ──────────────────────────────────────────────
INSERT INTO Clientes (razon, tipo, area, cuit, contacto, email, tel, notas) VALUES
('Inversiones del Plata S.A.',   'actual',    'Corporativo', '30-71234567-8', 'Diego Martínez', 'd.martinez@inversplata.com', '+54 11 5555-1001', 'Cliente desde 2018'),
('TecnoSur SRL',                 'actual',    'Comercial',   '30-68901234-5', 'Paula Ríos',     'p.rios@tecnosur.com',        '+54 11 5555-1002', ''),
('Juan Alejandro Vega',          'actual',    'Laboral',     '20-28456789-3', 'Juan Vega',      'jvega@gmail.com',            '+54 9 11 6666-2001','Demanda laboral activa'),
('Constructora Sur Andina S.A.', 'actual',    'Civil',       '30-80123456-2', 'Roberto Campos', 'r.campos@surandina.com',     '+54 11 5555-1003', ''),
('Global Trade Argentina SA',    'potencial', 'Corporativo', '',              'Lucía Ortega',   'lucia@globaltrade.ar',        '+54 11 7777-3001', 'Reunión inicial 15/05/2026'),
('Agro Pampa Holding SAS',       'potencial', 'Societario',  '',              'Fernando Cruz',  'f.cruz@agropampa.com',        '+54 11 7777-3002', 'Reestructuración societaria'),
('Clínica Santa Elena SA',       'actual',    'Laboral',     '30-71890234-1', 'Marta Suárez',   'm.suarez@clinicaelena.com',  '+54 11 5555-1004', ''),
('Distribuidora Norte SRL',      'potencial', 'Comercial',   '',              'Hugo Blanco',    'h.blanco@distnorte.com',     '+54 9 351 888-4001','Consulta contrato distribución');
GO

-- ── Expedientes ───────────────────────────────────────────
INSERT INTO Expedientes (numero, caratula, area, estado, id_cliente, id_abogado, juzgado, apertura, prox_fecha, notas) VALUES
('EXP-2026-001','Inversiones del Plata S.A. c/ Rivero SA s/ cobro ejecutivo',             'Comercial',   'activo',  1, 3, 'Juzgado Comercial Nº 8, CABA', '2026-01-10', '2026-08-15', 'Contestación de demanda presentada'),
('EXP-2026-002','Vega, Juan A. c/ Clínica Santa Elena SA s/ despido',                     'Laboral',     'activo',  3, 2, 'Juzgado CNAT Nº 15',           '2026-02-03', '2026-08-20', 'Peritos designados'),
('EXP-2026-003','Constructora Sur Andina s/ nulidad contrato de locación',                 'Civil',       'activo',  4, 4, 'Juzgado Civil Nº 22, CABA',    '2026-02-20', '2026-09-01', ''),
('EXP-2025-041','TecnoSur SRL s/ homologación acuerdo extrajudicial',                      'Comercial',   'cerrado', 2, 3, 'Juzgado Comercial Nº 5, CABA', '2025-08-15', NULL,         'Homologado 10/12/2025'),
('EXP-2026-004','Inversiones del Plata SA s/ constitución fideicomiso',                    'Corporativo', 'activo',  1, 1, 'IGJ',                          '2026-03-01', '2026-08-30', 'Documentación en preparación'),
('EXP-2026-005','Clínica Santa Elena SA c/ empleados s/ convenio colectivo',               'Laboral',     'activo',  7, 2, 'MTEySS',                       '2026-03-15', '2026-08-10', 'Audiencia conciliatoria'),
('EXP-2026-006','Constructora Sur Andina SA s/ daños y perjuicios',                        'Civil',       'activo',  4, 4, 'Juzgado Civil Nº 31, CABA',    '2026-04-05', '2026-09-08', ''),
('EXP-2026-007','Inversiones del Plata s/ reestructuración accionaria',                    'Societario',  'activo',  1, 1, 'IGJ / Registro Público',       '2026-04-22', '2026-08-25', 'Asamblea programada');
GO
