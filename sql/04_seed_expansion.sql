-- ============================================================
--  SEED EXPANSIÓN v2
--  Datos reales de colegios, juzgados nacionales CABA
--  y modelos de escritos / contratos
-- ============================================================
USE EstudioJuridico;
GO

-- ── Colegios de Abogados ──────────────────────────────────
INSERT INTO ColegiosAbogados (nombre, sigla, jurisdiccion, domicilio, telefono, email, web) VALUES
('Colegio Público de la Abogacía de la Capital Federal', 'CPACF', 'Ciudad Autónoma de Buenos Aires', 'Av. Corrientes 1441, CABA (C1042AAD)', '11-4379-8700', 'info@cpacf.org.ar', 'www.cpacf.org.ar'),
('Colegio de Abogados de la Provincia de Buenos Aires', 'COLPROBA', 'Provincia de Buenos Aires', 'Av. 13 Nº 821/829, La Plata (B1900TJE)', '221-439-4000', 'info@colproba.org.ar', 'www.colproba.org.ar'),
('Colegio de la Abogacía de La Plata', 'CALP', 'Departamento Judicial La Plata', 'Av. 13 Nº 821/829 2º Piso, La Plata', '221-439-4000', 'matricula@calp.org.ar', 'www.calp.org.ar'),
('Colegio de Abogados de San Isidro', 'CASI', 'Departamento Judicial San Isidro', 'Av. del Libertador 16.218, San Isidro', '11-4732-7021', 'info@casi.com.ar', 'www.casi.com.ar'),
('Colegio de Abogados de Morón', 'CAM', 'Departamento Judicial Morón', 'Av. Rivadavia 17.561, Morón', '11-4629-7752', 'info@colegioabogadosmoron.org.ar', 'www.colegioabogadosmoron.org.ar'),
('Colegio de Abogados de San Martín', 'CASM', 'Departamento Judicial San Martín', 'Av. Pte. Perón 3344 Piso 3, San Martín', '11-4724-3100', 'info@casmjudicial.com.ar', 'www.casmjudicial.com.ar'),
('Colegio de Abogados de Lomas de Zamora', 'CALZ', 'Departamento Judicial Lomas de Zamora', 'Larrañaga 341, Lomas de Zamora', '11-4292-3430', 'info@calzoficial.com.ar', 'www.calzoficial.com.ar'),
('Colegio de Abogados de Quilmes', 'CAQ', 'Departamento Judicial Quilmes', 'Mitre 564, Quilmes', '11-4253-1122', 'info@colegioabogadosquilmes.org.ar', 'www.colegioabogadosquilmes.org.ar'),
('Colegio de Abogados de Mar del Plata', 'CAMP', 'Departamento Judicial Mar del Plata', 'Bolívar 2998, Mar del Plata', '223-493-2272', 'info@camp.org.ar', 'www.camp.org.ar'),
('Colegio de Abogados de Córdoba', 'CAC', 'Provincia de Córdoba', 'Duarte Quirós 571, Córdoba Capital', '351-420-7600', 'info@colegiodabogados.org', 'www.colegiodabogados.org');
GO

-- ── Juzgados Nacionales en lo COMERCIAL (CABA) ───────────
INSERT INTO Juzgados (numero,nombre,fuero,jurisdiccion,camara,nombre_juez,calle,numero_calle,piso,cp,localidad,provincia,telefono,email) VALUES
(1,'Juzgado Nacional de 1ª Instancia en lo Comercial Nº 1','Comercial','Nacional','Cámara Nacional de Apelaciones en lo Comercial','Dr. Alberto Daniel Alemán','Av. Pte. Roque Sáenz Peña','1211','5º','C1035AAH','CABA','Buenos Aires','11-4379-2018','jncomercial1@pjn.gov.ar'),
(2,'Juzgado Nacional de 1ª Instancia en lo Comercial Nº 2','Comercial','Nacional','Cámara Nacional de Apelaciones en lo Comercial','Dr. Fernando M. Pennacca','Marcelo T. de Alvear','1840','2º','C1058AAH','CABA','Buenos Aires','11-4816-0420','jncomercial2@pjn.gov.ar'),
(3,'Juzgado Nacional de 1ª Instancia en lo Comercial Nº 3','Comercial','Nacional','Cámara Nacional de Apelaciones en lo Comercial','Dr. Jorge Silvio Sicoli','Av. Callao','635','6º','C1022AAE','CABA','Buenos Aires','11-4371-6861','jncomercial3@pjn.gov.ar'),
(4,'Juzgado Nacional de 1ª Instancia en lo Comercial Nº 4','Comercial','Nacional','Cámara Nacional de Apelaciones en lo Comercial','Dr. Héctor Hugo Vitale','Av. Pte. Roque Sáenz Peña','1211','1º','C1035AAH','CABA','Buenos Aires','11-4379-2044','jncomercial4@pjn.gov.ar'),
(5,'Juzgado Nacional de 1ª Instancia en lo Comercial Nº 5','Comercial','Nacional','Cámara Nacional de Apelaciones en lo Comercial','Dr. Fernando Miguel Durão','Av. Pte. Roque Sáenz Peña','1211','8º','C1035AAH','CABA','Buenos Aires','11-4379-2005','jncomercial5@pjn.gov.ar'),
(6,'Juzgado Nacional de 1ª Instancia en lo Comercial Nº 6','Comercial','Nacional','Cámara Nacional de Apelaciones en lo Comercial','Dra. Marta Graciela Cirulli','Av. Pte. Roque Sáenz Peña','1211','2º','C1035AAH','CABA','Buenos Aires','11-4379-2040','jncomercial6@pjn.gov.ar'),
(7,'Juzgado Nacional de 1ª Instancia en lo Comercial Nº 7','Comercial','Nacional','Cámara Nacional de Apelaciones en lo Comercial','Dr. Fernando D''Alessandro','Av. Pte. Roque Sáenz Peña','1211','2º','C1035AAH','CABA','Buenos Aires','11-4379-2041','jncomercial7@pjn.gov.ar'),
(8,'Juzgado Nacional de 1ª Instancia en lo Comercial Nº 8','Comercial','Nacional','Cámara Nacional de Apelaciones en lo Comercial','Dr. Javier Cosentino','Av. Pte. Roque Sáenz Peña','1211','7º','C1035AAH','CABA','Buenos Aires','11-4379-2009','jncomercial8@pjn.gov.ar'),
(9,'Juzgado Nacional de 1ª Instancia en lo Comercial Nº 9','Comercial','Nacional','Cámara Nacional de Apelaciones en lo Comercial','Dra. Paula M. Hualde','Marcelo T. de Alvear','1840','4º','C1058AAH','CABA','Buenos Aires','11-4819-6630','jncomercial9@pjn.gov.ar'),
(10,'Juzgado Nacional de 1ª Instancia en lo Comercial Nº 10','Comercial','Nacional','Cámara Nacional de Apelaciones en lo Comercial','Dr. Héctor Osvaldo Chomer','Av. Callao','635','PB','C1022AAE','CABA','Buenos Aires','11-4373-2229','jncomercial10@pjn.gov.ar'),
(11,'Juzgado Nacional de 1ª Instancia en lo Comercial Nº 11','Comercial','Nacional','Cámara Nacional de Apelaciones en lo Comercial','Dr. Fernando Ignacio Saravia','Av. Callao','635','5º','C1022AAE','CABA','Buenos Aires','11-4372-4315','jncomercial11@pjn.gov.ar'),
(12,'Juzgado Nacional de 1ª Instancia en lo Comercial Nº 12','Comercial','Nacional','Cámara Nacional de Apelaciones en lo Comercial','Dr. Hernán Diego Papa','Marcelo T. de Alvear','1840','2º','C1058AAH','CABA','Buenos Aires','11-4819-6871','jncomercial12@pjn.gov.ar'),
(13,'Juzgado Nacional de 1ª Instancia en lo Comercial Nº 13','Comercial','Nacional','Cámara Nacional de Apelaciones en lo Comercial','Dr. Fernando Javier Perillo','Marcelo T. de Alvear','1840','4º','C1058AAH','CABA','Buenos Aires','11-4819-6640','jncomercial13@pjn.gov.ar'),
(15,'Juzgado Nacional de 1ª Instancia en lo Comercial Nº 15','Comercial','Nacional','Cámara Nacional de Apelaciones en lo Comercial','Dr. Máximo Astorga','Av. Callao','635','3º','C1022AAE','CABA','Buenos Aires','11-4372-7459','jncomercial15@pjn.gov.ar'),
(17,'Juzgado Nacional de 1ª Instancia en lo Comercial Nº 17','Comercial','Nacional','Cámara Nacional de Apelaciones en lo Comercial','Dr. Federico Alberto Güerri','Marcelo T. de Alvear','1840','3º','C1058AAH','CABA','Buenos Aires','11-4819-6601','jncomercial17@pjn.gov.ar');
GO

-- Secretarías juzgados comerciales
INSERT INTO SecretariasJuzgado (id_juzgado,numero,nombre_secretario,telefono,telefono_int,piso,email) VALUES
(1,'Nº 1','Dr. Mariano Conde','11-4379-2065','2065','5º','jncomercial1.sec1@pjn.gov.ar'),
(1,'Nº 2','D. Juan Pablo A. Sala','11-4379-2181','2181','5º','jncomercial1.sec2@pjn.gov.ar'),
(2,'Nº 3','Dra. Mariana Grandi','11-4815-3660',NULL,'2º','jncomercial2.sec3@pjn.gov.ar'),
(2,'Nº 4','Dr. Héctor Romero','11-4813-5256',NULL,'2º','jncomercial2.sec4@pjn.gov.ar'),
(3,'Nº 5','Dr. Alejo S. Torres','11-4373-8373',NULL,'6º','jncomercial3.sec5@pjn.gov.ar'),
(3,'Nº 6','Dra. Blanca M. Gutiérrez Huertas','11-4373-1921',NULL,'6º','jncomercial3.sec6@pjn.gov.ar'),
(4,'Nº 7','Dra. Josefina Conforti','11-4379-2080','2080','1º','jncomercial4.sec7@pjn.gov.ar'),
(4,'Nº 8','Dr. Ignacio Galmarini','11-4379-2083','2083','1º','jncomercial4.sec8@pjn.gov.ar'),
(5,'Nº 9','Dra. Agustina Díaz Cordero','11-4379-2088','2088','8º','jncomercial5.sec9@pjn.gov.ar'),
(5,'Nº 10','Dra. Marina Meijide Castro','11-4379-2091','2091','8º','jncomercial5.sec10@pjn.gov.ar'),
(6,'Nº 11','Dr. Ernesto Tenuta','11-4379-2118','2118','2º','jncomercial6.sec11@pjn.gov.ar'),
(6,'Nº 12','Dr. Mariano Casanova','11-4379-2121','2121','2º','jncomercial6.sec12@pjn.gov.ar'),
(7,'Nº 13','Dr. Rodrigo Piñeiro','11-4379-2096','2096','2º','jncomercial7.sec13@pjn.gov.ar'),
(7,'Nº 14','Dr. Diego Vázquez','11-4379-2099','2043','2º','jncomercial7.sec14@pjn.gov.ar'),
(8,'Nº 15','Dra. Adriana Milovích','11-4379-2127','2127','7º','jncomercial8.sec15@pjn.gov.ar'),
(8,'Nº 16','Dra. María Gabriela Dall''Asta','11-4379-2105','2105','7º','jncomercial8.sec16@pjn.gov.ar');
GO

-- ── Juzgados Nacionales en lo CIVIL (CABA) ────────────────
INSERT INTO Juzgados (numero,nombre,fuero,jurisdiccion,camara,nombre_juez,calle,numero_calle,piso,cp,localidad,provincia,telefono,email) VALUES
(1,'Juzgado Nacional de 1ª Instancia en lo Civil Nº 1','Civil','Nacional','Cámara Nacional de Apelaciones en lo Civil','Dr. Gustavo Daniel Caramelo Díaz','Av. de los Inmigrantes','1950','4º','C1104ADO','CABA','Buenos Aires','11-4130-6361','jncivil1@pjn.gov.ar'),
(2,'Juzgado Nacional de 1ª Instancia en lo Civil Nº 2','Civil','Nacional','Cámara Nacional de Apelaciones en lo Civil','Dra. María Eugenia Nelli','Talcahuano','490','5º','C1013AAJ','CABA','Buenos Aires','11-4379-1889','jncivil2@pjn.gov.ar'),
(4,'Juzgado Nacional de 1ª Instancia en lo Civil Nº 4','Civil','Nacional','Cámara Nacional de Apelaciones en lo Civil','Vacante (subrogante)','Lavalle','1212','8º','C1048AAF','CABA','Buenos Aires','11-4379-1417','jncivil4@pjn.gov.ar'),
(7,'Juzgado Nacional de 1ª Instancia en lo Civil Nº 7','Civil','Nacional','Cámara Nacional de Apelaciones en lo Civil','Dra. Myriam Marisa Cataldi','Talcahuano','490','6º','C1013AAJ','CABA','Buenos Aires','11-4379-1850','jncivil7@pjn.gov.ar'),
(11,'Juzgado Nacional de 1ª Instancia en lo Civil Nº 11','Civil','Nacional','Cámara Nacional de Apelaciones en lo Civil','Dra. Alejandra Débora Abrevaya','Talcahuano','550','6º','C1014AAJ','CABA','Buenos Aires','11-4371-3111','jncivil11@pjn.gov.ar'),
(22,'Juzgado Nacional de 1ª Instancia en lo Civil Nº 22','Civil','Nacional','Cámara Nacional de Apelaciones en lo Civil','Vacante','Lavalle','1220','5º','C1048AAF','CABA','Buenos Aires','11-4379-1325','jncivil22@pjn.gov.ar'),
(31,'Juzgado Nacional de 1ª Instancia en lo Civil Nº 31','Civil','Nacional','Cámara Nacional de Apelaciones en lo Civil','Vacante','Av. de los Inmigrantes','1950','PB','C1104ADO','CABA','Buenos Aires','11-4130-6272','jncivil31@pjn.gov.ar');
GO

-- Secretarías juzgados civiles
INSERT INTO SecretariasJuzgado (id_juzgado,numero,nombre_secretario,telefono,piso,email)
SELECT j.id,'Única / Sec. 1','Dr. Máximo Musich','11-4130-6363','4º','jncivil1.sec@pjn.gov.ar' FROM Juzgados j WHERE j.nombre LIKE '%Civil Nº 1%' AND j.fuero='Civil';
INSERT INTO SecretariasJuzgado (id_juzgado,numero,nombre_secretario,telefono,piso,email)
SELECT j.id,'Única / Sec. 1','Dra. Mónica Alejandra Bobbio','11-4379-1891','5º','jncivil2.sec@pjn.gov.ar' FROM Juzgados j WHERE j.nombre LIKE '%Civil Nº 2%' AND j.fuero='Civil';
GO

-- ── Juzgados Nacionales del TRABAJO (CABA) ────────────────
INSERT INTO Juzgados (numero,nombre,fuero,jurisdiccion,camara,nombre_juez,calle,numero_calle,piso,cp,localidad,provincia,telefono,email) VALUES
(1,'Juzgado Nacional de 1ª Instancia del Trabajo Nº 1','Laboral','Nacional','Cámara Nacional de Apelaciones del Trabajo (CNAT)','Vacante','Av. Callao','635',NULL,'C1022AAE','CABA','Buenos Aires','11-4374-5803','jntrabajo1@pjn.gov.ar'),
(15,'Juzgado Nacional de 1ª Instancia del Trabajo Nº 15','Laboral','Nacional','Cámara Nacional de Apelaciones del Trabajo (CNAT)','Dra. Mónica Pinotti','Av. Callao','635',NULL,'C1022AAE','CABA','Buenos Aires','11-4374-5881','jntrabajo15@pjn.gov.ar'),
(39,'Juzgado Nacional de 1ª Instancia del Trabajo Nº 39','Laboral','Nacional','Cámara Nacional de Apelaciones del Trabajo (CNAT)','Dra. Mónica Pinotti','Av. Callao','635',NULL,'C1022AAE','CABA','Buenos Aires','11-4374-5882','jntrabajo39@pjn.gov.ar');
GO

-- ── Organismos administrativos ────────────────────────────
INSERT INTO Juzgados (numero,nombre,fuero,jurisdiccion,nombre_juez,calle,numero_calle,piso,cp,localidad,provincia,telefono,email) VALUES
(NULL,'Inspección General de Justicia (IGJ)','Registral','Nacional',NULL,'Av. Paseo Colón','285',NULL,'C1063ACD','CABA','Buenos Aires','11-4349-5600','igj@jus.gob.ar'),
(NULL,'Ministerio de Trabajo, Empleo y Seguridad Social (MTEySS)','Administrativo Laboral','Nacional',NULL,'Av. Leandro N. Alem','650',NULL,'C1001AAO','CABA','Buenos Aires','11-4310-5450','consultas@trabajo.gob.ar'),
(NULL,'Dirección Provincial de Personas Jurídicas de Bs. As. (DPPJ)','Registral','Provincial',NULL,'Calle 12 esq. 46',NULL,NULL,'B1900TJJ','La Plata','Buenos Aires','221-429-5100','dppj@gba.gov.ar');
GO

-- ── Categorías de modelos ─────────────────────────────────
INSERT INTO ModelosCategorias (nombre, tipo, area, descripcion, orden) VALUES
('Demandas',                    'escrito',   'Civil',       'Escritos de inicio de demandas civiles y comerciales', 1),
('Demandas Laborales',          'escrito',   'Laboral',     'Demandas y escritos del fuero laboral',                2),
('Recursos y Apelaciones',      'escrito',   NULL,          'Recursos ordinarios y apelaciones',                    3),
('Medidas Cautelares',          'escrito',   NULL,          'Solicitudes de medidas cautelares y precautorias',     4),
('Presentaciones y Oficios',    'escrito',   NULL,          'Presentaciones en general, oficios judiciales',        5),
('Locación de Inmuebles',       'contrato',  'Civil',       'Contratos de locación: departamentos, casas, galpones',6),
('Locación de Servicios y Obra','contrato',  'Comercial',   'Contratos de prestación de servicios y obra',          7),
('Contratos de Trabajo',        'contrato',  'Laboral',     'Contratos laborales: indefinido, plazo fijo, parcial', 8),
('Contratos Comerciales',       'contrato',  'Comercial',   'Contratos de distribución, franquicia, compraventa',   9);
GO
