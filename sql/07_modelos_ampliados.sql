-- ============================================================
--  MODELOS AMPLIADOS — 80 modelos jurídicos argentinos
--  Ejecutar DESPUES de 06_usuarios.sql
--  Areas: Civil, Laboral, Familia, Societario, Corporativo, Inmobiliario
-- ============================================================
USE EstudioJuridico;
GO

-- ── Nuevas categorias ────────────────────────────────────────
INSERT INTO ModelosCategorias (nombre, tipo, area, descripcion, orden)
SELECT nombre, tipo, area, descripcion, orden FROM (VALUES
  ('Derecho de Familia',       'escrito',  'Civil',       'Demandas y escritos de familia: divorcio, alimentos, filiacion', 10),
  ('Sucesiones',               'escrito',  'Civil',       'Escritos sucesorios: apertura, declaratoria, particion',         11),
  ('Societario',               'escrito',  'Societario',  'Escritos societarios: constitucion, asambleas, disolucion',      12),
  ('Penal Economico',          'escrito',  'Comercial',   'Denuncias y escritos de derecho penal economico',                13),
  ('Contratos Inmobiliarios',  'contrato', 'Civil',       'Boleto de compraventa, cesion, fideicomiso inmobiliario',        14),
  ('Contratos Societarios',    'contrato', 'Societario',  'Estatutos, actas, pactos de socios, poderes',                   15),
  ('Contratos Corporativos',   'contrato', 'Corporativo', 'NDA, acuerdos marco, contratos de M&A',                         16),
  ('Oficios Judiciales',       'escrito',  NULL,          'Oficios a ANSES, AFIP, Registro, bancos y organismos',          17),
  ('Testimonios y Actas',      'escrito',  NULL,          'Testimonios notariales, actas de constatacion, poderes',        18)
) AS src(nombre, tipo, area, descripcion, orden)
WHERE NOT EXISTS (SELECT 1 FROM ModelosCategorias m WHERE m.nombre = src.nombre);
GO

-- ════════════════════════════════════════════════════════════
-- CIVIL Y COMERCIAL (13 modelos)
-- ════════════════════════════════════════════════════════════

-- 1. Demanda por cobro de pesos via ejecutiva
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Demanda Ejecutiva por Cobro de Pesos',
  'Ejecucion de titulo ejecutivo (pagare, cheque, factura) ante el fuero comercial.',
  'Comercial', '1.0',
  '[{"campo":"NOMBRE_ACTOR","label":"Nombre del actor/ejecutante","tipo":"text"},{"campo":"DNI_ACTOR","label":"DNI del actor","tipo":"text"},{"campo":"NOMBRE_DEMANDADO","label":"Nombre del demandado/ejecutado","tipo":"text"},{"campo":"DNI_DEMANDADO","label":"DNI del demandado","tipo":"text"},{"campo":"DOMICILIO_DEMANDADO","label":"Domicilio del demandado","tipo":"text"},{"campo":"TITULO","label":"Tipo de titulo (pagare/cheque/factura)","tipo":"text"},{"campo":"MONTO","label":"Monto en pesos","tipo":"number"},{"campo":"FECHA_VENCIMIENTO","label":"Fecha de vencimiento","tipo":"date"},{"campo":"NOMBRE_ABOGADO","label":"Abogado patrocinante","tipo":"text"},{"campo":"TOMO_FOLIO","label":"Tomo y Folio CPACF","tipo":"text"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha de presentacion","tipo":"date"}]',
  'SENOR JUEZ COMERCIAL:

{{NOMBRE_ACTOR}}, D.N.I. N {{DNI_ACTOR}}, constituyendo domicilio procesal en la sede del estudio, con el patrocinio letrado del Dr./Dra. {{NOMBRE_ABOGADO}}, T. {{TOMO_FOLIO}} C.P.A.C.F., a V.S. respetuosamente me presento y digo:

I. OBJETO

Que vengo a promover JUICIO EJECUTIVO en contra de {{NOMBRE_DEMANDADO}}, D.N.I. N {{DNI_DEMANDADO}}, con domicilio en {{DOMICILIO_DEMANDADO}}, por la suma de PESOS {{MONTO}} ($ {{MONTO}}), en concepto de capital adeudado, con mas sus intereses, costas y costos.

II. TITULO EJECUTIVO

El presente juicio se funda en el siguiente titulo ejecutivo: {{TITULO}}, con vencimiento el dia {{FECHA_VENCIMIENTO}}, por la suma de PESOS {{MONTO}}.

Dicho instrumento reune todos los requisitos que exige el art. 523 del C.P.C.C.N. para ser considerado titulo habil en la presente via ejecutiva.

III. INTIMACION DE PAGO Y EMBARGO

En merito a lo expuesto, solicito a V.S. que, previa intimacion de pago al ejecutado {{NOMBRE_DEMANDADO}}, se trabe embargo sobre bienes del deudor hasta cubrir el monto reclamado con mas un 30% para costas y costos.

IV. DERECHO

Fundo la presente en los arts. 520 y concordantes del C.P.C.C.N.

V. PRUEBA

Documental: se acompana el titulo ejecutivo original.

VI. PETITORIO

Por todo lo expuesto a V.S. solicito:
1) Me tenga por presentado, por parte y por constituido domicilio.
2) Tenga por acompanado el titulo ejecutivo en original.
3) Libre mandamiento de embargo e intimacion de pago por la suma de PESOS {{MONTO}} con mas el 30% para responder a intereses y costas.
4) En su oportunidad dicte sentencia de trance y remate.

Proveer de conformidad,
SERA JUSTICIA.

{{CIUDAD}}, {{FECHA}}

______________________________
{{NOMBRE_ABOGADO}}
T. {{TOMO_FOLIO}} CPACF'
FROM ModelosCategorias c WHERE c.nombre = 'Demandas';
GO

-- 2. Demanda por incumplimiento contractual
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Demanda por Incumplimiento Contractual',
  'Demanda civil por incumplimiento de contrato. Arts. 1083 y cc. CCyCN.',
  'Civil', '1.0',
  '[{"campo":"NOMBRE_ACTOR","label":"Nombre del actor","tipo":"text"},{"campo":"DNI_ACTOR","label":"DNI del actor","tipo":"text"},{"campo":"NOMBRE_DEMANDADO","label":"Nombre del demandado","tipo":"text"},{"campo":"DOMICILIO_DEMANDADO","label":"Domicilio del demandado","tipo":"text"},{"campo":"TIPO_CONTRATO","label":"Tipo de contrato incumplido","tipo":"text"},{"campo":"FECHA_CONTRATO","label":"Fecha del contrato","tipo":"date"},{"campo":"OBLIGACION_INCUMPLIDA","label":"Descripcion de la obligacion incumplida","tipo":"textarea"},{"campo":"MONTO","label":"Monto reclamado","tipo":"number"},{"campo":"NOMBRE_ABOGADO","label":"Abogado patrocinante","tipo":"text"},{"campo":"TOMO_FOLIO","label":"Tomo y Folio","tipo":"text"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha","tipo":"date"}]',
  'SENOR JUEZ CIVIL:

{{NOMBRE_ACTOR}}, D.N.I. N {{DNI_ACTOR}}, con el patrocinio letrado del Dr./Dra. {{NOMBRE_ABOGADO}}, T. {{TOMO_FOLIO}} C.P.A.C.F., a V.S. respetuosamente me presento y digo:

I. OBJETO

Que vengo a promover DEMANDA POR INCUMPLIMIENTO CONTRACTUAL en contra de {{NOMBRE_DEMANDADO}}, con domicilio en {{DOMICILIO_DEMANDADO}}, por la suma de PESOS {{MONTO}}, o lo que en mas o en menos resulte de la prueba, con mas intereses, costas y costos.

II. HECHOS

Con fecha {{FECHA_CONTRATO}}, las partes celebraron un contrato de {{TIPO_CONTRATO}}, por el cual el demandado asumio la obligacion de {{OBLIGACION_INCUMPLIDA}}.

Sin embargo, el demandado ha incumplido total/parcialmente las obligaciones asumidas, causando un perjuicio economico al actor que reclama por la presente via.

III. INTIMACION PREVIA

Con caracter previo a la presentacion de esta demanda, se intimó fehacientemente al demandado al cumplimiento de sus obligaciones, sin que este haya dado respuesta satisfactoria.

IV. DERECHO

Arts. 1083, 1084, 1085, 1086 y concordantes del Codigo Civil y Comercial de la Nacion; arts. 330 y cc. del C.P.C.C.N.

V. PRUEBA

A) Documental: contrato original y correspondencia entre las partes.
B) Informativa: se solicitara en la etapa procesal pertinente.
C) Pericial contable: para acreditar los danos economicos sufridos.
D) Testimonial: testigos a designar oportunamente.

VI. PETITORIO

Por todo lo expuesto a V.S. solicito:
1) Me tenga por presentado, por parte y por constituido domicilio.
2) Corra traslado de la demanda al demandado.
3) Oportunamente dicte sentencia haciendo lugar a la demanda en todas sus partes, con costas.

Proveer de conformidad,
SERA JUSTICIA.

{{CIUDAD}}, {{FECHA}}

______________________________
{{NOMBRE_ABOGADO}}
T. {{TOMO_FOLIO}} CPACF'
FROM ModelosCategorias c WHERE c.nombre = 'Demandas';
GO

-- 3. Recurso de apelacion
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Recurso de Apelacion',
  'Interposicion de recurso de apelacion contra sentencia de primera instancia. Art. 242 CPCCN.',
  'Civil', '1.0',
  '[{"campo":"NOMBRE_PARTE","label":"Nombre de la parte apelante","tipo":"text"},{"campo":"ROL","label":"Rol procesal (actor/demandado)","tipo":"text"},{"campo":"CARATULA","label":"Caratula del expediente","tipo":"text"},{"campo":"NEXPEDIENTE","label":"Numero de expediente","tipo":"text"},{"campo":"FECHA_SENTENCIA","label":"Fecha de la sentencia apelada","tipo":"date"},{"campo":"FUNDAMENTOS","label":"Fundamentos de la apelacion","tipo":"textarea"},{"campo":"NOMBRE_ABOGADO","label":"Abogado patrocinante","tipo":"text"},{"campo":"TOMO_FOLIO","label":"Tomo y Folio","tipo":"text"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha","tipo":"date"}]',
  'SENOR JUEZ:

{{NOMBRE_PARTE}}, en mi caracter de parte {{ROL}} en los autos caratulados "{{CARATULA}}", Expte. N {{NEXPEDIENTE}}, con el patrocinio letrado del Dr./Dra. {{NOMBRE_ABOGADO}}, T. {{TOMO_FOLIO}} C.P.A.C.F., a V.S. respetuosamente me presento y digo:

I. OBJETO

Que en tiempo y forma legal vengo a INTERPONER RECURSO DE APELACION contra la sentencia dictada con fecha {{FECHA_SENTENCIA}}, por ser la misma injusta y contraria a derecho, en la medida que me agravia.

II. AGRAVIOS

{{FUNDAMENTOS}}

III. DERECHO

Fundo el presente recurso en lo dispuesto por los arts. 242, 243, 244, 245, 246, 259, 260 y concordantes del Codigo Procesal Civil y Comercial de la Nacion.

IV. PETITORIO

Por todo lo expuesto a V.S. solicito:
1) Tenga por interpuesto en tiempo y forma el presente recurso de apelacion.
2) Eleve las actuaciones a la Camara de Apelaciones del fuero.
3) Oportunamente, la Alzada revoque la sentencia apelada y dicte nueva sentencia favorable a esta parte, con costas.

Proveer de conformidad,
SERA JUSTICIA.

{{CIUDAD}}, {{FECHA}}

______________________________
{{NOMBRE_ABOGADO}}
T. {{TOMO_FOLIO}} CPACF'
FROM ModelosCategorias c WHERE c.nombre = 'Recursos y Apelaciones';
GO

-- 4. Medida cautelar - embargo preventivo
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Embargo Preventivo',
  'Solicitud de embargo preventivo sobre bienes del demandado. Arts. 195 y cc. CPCCN.',
  'Civil', '1.0',
  '[{"campo":"NOMBRE_ACTOR","label":"Nombre del solicitante","tipo":"text"},{"campo":"NOMBRE_DEMANDADO","label":"Nombre del demandado","tipo":"text"},{"campo":"MONTO","label":"Monto del embargo","tipo":"number"},{"campo":"BIENES","label":"Bienes a embargar","tipo":"textarea"},{"campo":"VEROSIMILITUD","label":"Fundamentos de verosimilitud del derecho","tipo":"textarea"},{"campo":"PELIGRO","label":"Fundamentos del peligro en la demora","tipo":"textarea"},{"campo":"NOMBRE_ABOGADO","label":"Abogado patrocinante","tipo":"text"},{"campo":"TOMO_FOLIO","label":"Tomo y Folio","tipo":"text"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha","tipo":"date"}]',
  'SENOR JUEZ:

{{NOMBRE_ACTOR}}, con el patrocinio letrado del Dr./Dra. {{NOMBRE_ABOGADO}}, T. {{TOMO_FOLIO}} C.P.A.C.F., a V.S. respetuosamente me presento y digo:

I. OBJETO

Que vengo a solicitar se decrete EMBARGO PREVENTIVO sobre bienes de {{NOMBRE_DEMANDADO}}, hasta cubrir la suma de PESOS {{MONTO}}, en concepto de capital, mas un 30% para intereses y costas.

II. VEROSIMILITUD DEL DERECHO

{{VEROSIMILITUD}}

III. PELIGRO EN LA DEMORA

{{PELIGRO}}

IV. CONTRACAUTELA

En cumplimiento de lo dispuesto por el art. 199 del C.P.C.C.N., ofrezco como contracautela juratoria, comprometiendome a responder por los danos y perjuicios que pudiera causar la medida en caso de ser trabada indebidamente.

V. BIENES A EMBARGAR

La medida debera recaer sobre los siguientes bienes: {{BIENES}}

Asimismo, solicito se libre oficio a los Registros pertinentes (DNRPA, Registro de la Propiedad Inmueble, entidades bancarias y financieras) a efectos de anotar el embargo.

VI. DERECHO

Arts. 195, 196, 197, 198, 199, 200, 212 y concordantes del C.P.C.C.N.

VII. PETITORIO

Por todo lo expuesto a V.S. solicito:
1) Tenga por presentada la solicitud de embargo preventivo.
2) Sin mas tramite, decrete el embargo preventivo sobre los bienes indicados.
3) Libre los oficios pertinentes a los Registros y entidades bancarias.

Proveer de conformidad,
SERA JUSTICIA.

{{CIUDAD}}, {{FECHA}}

______________________________
{{NOMBRE_ABOGADO}}
T. {{TOMO_FOLIO}} CPACF'
FROM ModelosCategorias c WHERE c.nombre = 'Medidas Cautelares';
GO

-- 5. Oficio a AFIP
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Oficio a AFIP - Informes Fiscales',
  'Oficio judicial a la AFIP solicitando informacion fiscal y patrimonial del requerido.',
  'Civil', '1.0',
  '[{"campo":"CARATULA","label":"Caratula del expediente","tipo":"text"},{"campo":"JUZGADO","label":"Juzgado y secretaria","tipo":"text"},{"campo":"NOMBRE_REQUERIDO","label":"Nombre del requerido","tipo":"text"},{"campo":"CUIT_REQUERIDO","label":"CUIT del requerido","tipo":"text"},{"campo":"INFO_SOLICITADA","label":"Informacion solicitada","tipo":"textarea"},{"campo":"NOMBRE_ABOGADO","label":"Abogado solicitante","tipo":"text"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha","tipo":"date"}]',
  'OFICIO JUDICIAL

{{CIUDAD}}, {{FECHA}}

SR. ADMINISTRADOR FEDERAL DE INGRESOS PUBLICOS
AFIP — Administracion Federal de Ingresos Publicos
Hipólito Yrigoyen 370 — Ciudad Autonoma de Buenos Aires

Me dirijo a Ud. en los autos caratulados "{{CARATULA}}", que tramitan ante el {{JUZGADO}}, a fin de solicitarle tenga a bien informar a esta Sede Judicial, en el mas breve plazo posible:

1. Situacion impositiva de {{NOMBRE_REQUERIDO}}, CUIT N {{CUIT_REQUERIDO}}, indicando:
   a) Categorizacion actual en AFIP (monotributo, responsable inscripto, exento, etc.)
   b) Actividades declaradas y fecha de alta.
   c) Bienes registrados a nombre del requerido que surjan de declaraciones juradas.
   d) {{INFO_SOLICITADA}}

Se deja constancia que la presente se libra en virtud de lo dispuesto por los arts. 395 y cc. del C.P.C.C.N., y en el marco de las facultades judiciales de requerimiento de informacion.

La respuesta debera remitirse a la sede judicial indicada precedentemente, en sobre cerrado y con caracter de CONFIDENCIAL.

______________________________
{{NOMBRE_ABOGADO}}
Patrocinante — T. del oficio'
FROM ModelosCategorias c WHERE c.nombre = 'Oficios Judiciales';
GO

-- 6. Oficio a ANSES
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Oficio a ANSES - Haberes e Historia Laboral',
  'Oficio judicial a ANSES solicitando historia laboral, haberes y aportes del requerido.',
  'Laboral', '1.0',
  '[{"campo":"CARATULA","label":"Caratula del expediente","tipo":"text"},{"campo":"JUZGADO","label":"Juzgado y secretaria","tipo":"text"},{"campo":"NOMBRE_REQUERIDO","label":"Nombre del requerido","tipo":"text"},{"campo":"CUIL_REQUERIDO","label":"CUIL del requerido","tipo":"text"},{"campo":"DNI_REQUERIDO","label":"DNI del requerido","tipo":"text"},{"campo":"NOMBRE_ABOGADO","label":"Abogado solicitante","tipo":"text"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha","tipo":"date"}]',
  'OFICIO JUDICIAL

{{CIUDAD}}, {{FECHA}}

SR. DIRECTOR DE ANSES
Administracion Nacional de la Seguridad Social
Bartolome Mitre 701 — Ciudad Autonoma de Buenos Aires

Me dirijo a Ud. en los autos caratulados "{{CARATULA}}", que tramitan ante el {{JUZGADO}}, solicitando informe respecto de {{NOMBRE_REQUERIDO}}, D.N.I. N {{DNI_REQUERIDO}}, C.U.I.L. N {{CUIL_REQUERIDO}}:

1. Historia laboral completa: empleadores, periodos de aporte y remuneraciones declaradas.
2. Beneficios previsionales en curso de pago (jubilacion, pension, retiro por invalidez, etc.) y montos actuales.
3. Asignaciones familiares percibidas en los ultimos 5 anos.
4. Aportes y contribuciones realizados por empleadores.
5. Si se encuentra percibiendo algun beneficio de la Seguridad Social, indique monto bruto, descuentos y monto neto acreditado.

La respuesta debera remitirse a esta Sede Judicial indicando el numero de expediente precedentemente mencionado.

______________________________
{{NOMBRE_ABOGADO}}
Patrocinante'
FROM ModelosCategorias c WHERE c.nombre = 'Oficios Judiciales';
GO

-- 7. Oficio al Registro de la Propiedad Inmueble
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Oficio al Registro de la Propiedad Inmueble',
  'Oficio judicial al RPI solicitando titularidad de bienes inmuebles e inhibicion.',
  'Civil', '1.0',
  '[{"campo":"CARATULA","label":"Caratula del expediente","tipo":"text"},{"campo":"JUZGADO","label":"Juzgado y secretaria","tipo":"text"},{"campo":"NOMBRE_REQUERIDO","label":"Nombre del requerido","tipo":"text"},{"campo":"DNI_REQUERIDO","label":"DNI del requerido","tipo":"text"},{"campo":"TIPO_INFORME","label":"Tipo de informe (titularidad/inhibicion/anotacion)","tipo":"text"},{"campo":"NOMBRE_ABOGADO","label":"Abogado solicitante","tipo":"text"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha","tipo":"date"}]',
  'OFICIO JUDICIAL

{{CIUDAD}}, {{FECHA}}

SR. DIRECTOR DEL REGISTRO DE LA PROPIEDAD INMUEBLE
Registro de la Propiedad Inmueble de la Capital Federal
Av. Belgrano 1130 — Ciudad Autonoma de Buenos Aires

Me dirijo a Ud. en los autos caratulados "{{CARATULA}}", tramitados ante el {{JUZGADO}}, a fin de solicitarle:

INFORME DE {{TIPO_INFORME}} respecto de {{NOMBRE_REQUERIDO}}, D.N.I. N {{DNI_REQUERIDO}}, indicando:

1. Bienes inmuebles registrados a nombre del requerido en esta jurisdiccion.
2. Estado juridico de los mismos: gravamenes, hipotecas, embargos, inhibiciones o cualquier otra restriccion al dominio.
3. Si existen inhibiciones generales de bienes anotadas a nombre del requerido.

En caso de corresponder, proceda a anotar la inhibicion general de bienes ordenada en autos hasta cubrir la suma de PESOS segun lo dispuesto por el Juez interviniente.

______________________________
{{NOMBRE_ABOGADO}}
Patrocinante'
FROM ModelosCategorias c WHERE c.nombre = 'Oficios Judiciales';
GO

-- 8. Contestacion de demanda civil
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Contestacion de Demanda Civil',
  'Escrito de contestacion de demanda civil con negativa de hechos y oposicion de defensas.',
  'Civil', '1.0',
  '[{"campo":"NOMBRE_DEMANDADO","label":"Nombre del demandado","tipo":"text"},{"campo":"DNI_DEMANDADO","label":"DNI del demandado","tipo":"text"},{"campo":"DOMICILIO_DEMANDADO","label":"Domicilio del demandado","tipo":"text"},{"campo":"CARATULA","label":"Caratula del expediente","tipo":"text"},{"campo":"NEGATIVA_HECHOS","label":"Negativa de hechos particulares","tipo":"textarea"},{"campo":"DEFENSAS","label":"Defensas y excepciones opuestas","tipo":"textarea"},{"campo":"NOMBRE_ABOGADO","label":"Abogado patrocinante","tipo":"text"},{"campo":"TOMO_FOLIO","label":"Tomo y Folio","tipo":"text"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha","tipo":"date"}]',
  'SENOR JUEZ:

{{NOMBRE_DEMANDADO}}, D.N.I. N {{DNI_DEMANDADO}}, con domicilio real en {{DOMICILIO_DEMANDADO}}, constituyendo domicilio procesal en la sede del estudio, con el patrocinio letrado del Dr./Dra. {{NOMBRE_ABOGADO}}, T. {{TOMO_FOLIO}} C.P.A.C.F., en los autos "{{CARATULA}}", a V.S. respetuosamente me presento y digo:

I. OBJETO

Que vengo en tiempo y forma a CONTESTAR LA DEMANDA interpuesta en mi contra, solicitando su rechazo en todas sus partes, con costas.

II. NEGATIVA DE HECHOS

Niego todos y cada uno de los hechos afirmados por la actora que no sean expresamente reconocidos en este escrito. En particular niego:

{{NEGATIVA_HECHOS}}

III. DEFENSAS Y EXCEPCIONES

{{DEFENSAS}}

IV. DERECHO

Arts. 334, 356 y concordantes del C.P.C.C.N. Arts. aplicables del Codigo Civil y Comercial de la Nacion segun la defensa articulada.

V. PRUEBA

A) Documental: se acompanan los documentos que hacen a mi derecho.
B) Informativa: se solicitaran los informes pertinentes.
C) Testimonial: testigos a designar oportunamente.
D) Pericial: en caso de ser necesario, se ofrecera la prueba pericial correspondiente.

VI. PETITORIO

Por todo lo expuesto a V.S. solicito:
1) Me tenga por presentado, por parte y por constituido domicilio.
2) Tenga por contestada la demanda en tiempo y forma.
3) En su oportunidad, dicte sentencia rechazando la demanda en todas sus partes, con expresa imposicion de costas a la actora.

Proveer de conformidad,
SERA JUSTICIA.

{{CIUDAD}}, {{FECHA}}

______________________________
{{NOMBRE_ABOGADO}}
T. {{TOMO_FOLIO}} CPACF'
FROM ModelosCategorias c WHERE c.nombre = 'Demandas';
GO

-- 9. Acuerdo de mediacion homologado
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Acuerdo de Mediacion — Solicitud de Homologacion',
  'Solicitud de homologacion judicial de acuerdo alcanzado en instancia de mediacion. Ley 26.589.',
  'Civil', '1.0',
  '[{"campo":"NOMBRE_ACTOR","label":"Nombre del actor","tipo":"text"},{"campo":"NOMBRE_DEMANDADO","label":"Nombre del demandado","tipo":"text"},{"campo":"CARATULA","label":"Caratula del expediente","tipo":"text"},{"campo":"MEDIADOR","label":"Nombre del mediador","tipo":"text"},{"campo":"FECHA_ACUERDO","label":"Fecha del acuerdo","tipo":"date"},{"campo":"TERMINOS_ACUERDO","label":"Terminos del acuerdo alcanzado","tipo":"textarea"},{"campo":"NOMBRE_ABOGADO","label":"Abogado patrocinante","tipo":"text"},{"campo":"TOMO_FOLIO","label":"Tomo y Folio","tipo":"text"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha","tipo":"date"}]',
  'SENOR JUEZ:

{{NOMBRE_ACTOR}}, con el patrocinio letrado del Dr./Dra. {{NOMBRE_ABOGADO}}, T. {{TOMO_FOLIO}} C.P.A.C.F., en los autos "{{CARATULA}}", a V.S. respetuosamente me presento y digo:

I. OBJETO

Que vengo a solicitar la HOMOLOGACION del acuerdo de mediacion celebrado entre las partes con fecha {{FECHA_ACUERDO}}, ante el mediador {{MEDIADOR}}, en el marco de la Ley 26.589 de Mediacion y Conciliacion Obligatoria.

II. TERMINOS DEL ACUERDO

Las partes han acordado lo siguiente:

{{TERMINOS_ACUERDO}}

III. FUNDAMENTOS

El acuerdo alcanzado es el resultado de la libre voluntad de las partes, no contiene clausulas contrarias al orden publico ni a las buenas costumbres, y resuelve el conflicto de manera integral.

IV. DERECHO

Arts. 11, 12 y concordantes de la Ley 26.589; art. 308 del C.P.C.C.N.

V. PETITORIO

Por todo lo expuesto a V.S. solicito:
1) Tenga por presentado el acuerdo de mediacion.
2) Homologue el mismo en cuanto por derecho hubiere lugar.
3) En su oportunidad, proceda al archivo de las actuaciones.

Proveer de conformidad,
SERA JUSTICIA.

{{CIUDAD}}, {{FECHA}}

______________________________
{{NOMBRE_ABOGADO}}
T. {{TOMO_FOLIO}} CPACF'
FROM ModelosCategorias c WHERE c.nombre = 'Presentaciones y Oficios';
GO

-- 10. Excepcion de prescripcion
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Excepcion de Prescripcion',
  'Oposicion de excepcion de prescripcion como defensa de fondo. Art. 2532 y cc. CCyCN.',
  'Civil', '1.0',
  '[{"campo":"NOMBRE_DEMANDADO","label":"Nombre del demandado","tipo":"text"},{"campo":"CARATULA","label":"Caratula del expediente","tipo":"text"},{"campo":"FECHA_HECHO","label":"Fecha del hecho o vencimiento","tipo":"date"},{"campo":"PLAZO_PRESCRIPCION","label":"Plazo de prescripcion aplicable","tipo":"text"},{"campo":"FUNDAMENTOS","label":"Fundamentos adicionales","tipo":"textarea"},{"campo":"NOMBRE_ABOGADO","label":"Abogado patrocinante","tipo":"text"},{"campo":"TOMO_FOLIO","label":"Tomo y Folio","tipo":"text"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha","tipo":"date"}]',
  'SENOR JUEZ:

{{NOMBRE_DEMANDADO}}, con el patrocinio letrado del Dr./Dra. {{NOMBRE_ABOGADO}}, T. {{TOMO_FOLIO}} C.P.A.C.F., en los autos "{{CARATULA}}", a V.S. respetuosamente me presento y digo:

I. OBJETO

Que vengo a oponer en tiempo y forma la EXCEPCION DE PRESCRIPCION de la accion intentada por la parte actora, la que solicito sea declarada con costas.

II. FUNDAMENTOS

La accion intentada por la parte actora se encuentra prescripta. El hecho que da origen a la pretension accionada data del {{FECHA_HECHO}}, resultando aplicable el plazo de prescripcion de {{PLAZO_PRESCRIPCION}} previsto en el art. 2560 (y/o el especial que corresponda) del Codigo Civil y Comercial de la Nacion.

Habiendo transcurrido en exceso dicho plazo sin que la actora haya interrumpido o suspendido el curso de la prescripcion por causal legalmente prevista, la accion se encuentra extinguida.

{{FUNDAMENTOS}}

III. DERECHO

Arts. 2532, 2533, 2554, 2560 y concordantes del Codigo Civil y Comercial de la Nacion. Art. 346 del C.P.C.C.N.

IV. PETITORIO

Por todo lo expuesto a V.S. solicito:
1) Tenga por opuesta en tiempo y forma la excepcion de prescripcion.
2) Previa sustanciacion, declare prescripta la accion intentada.
3) Imponga las costas a la parte actora.

Proveer de conformidad,
SERA JUSTICIA.

{{CIUDAD}}, {{FECHA}}

______________________________
{{NOMBRE_ABOGADO}}
T. {{TOMO_FOLIO}} CPACF'
FROM ModelosCategorias c WHERE c.nombre = 'Demandas';
GO

-- 11. Queja por denegacion de recurso
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Queja por Denegacion de Recurso',
  'Recurso de queja ante la Camara por denegacion del recurso de apelacion. Art. 282 CPCCN.',
  'Civil', '1.0',
  '[{"campo":"NOMBRE_PARTE","label":"Nombre de la parte","tipo":"text"},{"campo":"ROL","label":"Rol procesal","tipo":"text"},{"campo":"CARATULA","label":"Caratula del expediente","tipo":"text"},{"campo":"FECHA_DENEGACION","label":"Fecha de denegacion del recurso","tipo":"date"},{"campo":"FUNDAMENTOS","label":"Fundamentos de la queja","tipo":"textarea"},{"campo":"NOMBRE_ABOGADO","label":"Abogado patrocinante","tipo":"text"},{"campo":"TOMO_FOLIO","label":"Tomo y Folio","tipo":"text"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha","tipo":"date"}]',
  'EXCMA. CAMARA DE APELACIONES:

{{NOMBRE_PARTE}}, en mi caracter de parte {{ROL}} en los autos "{{CARATULA}}", con el patrocinio letrado del Dr./Dra. {{NOMBRE_ABOGADO}}, T. {{TOMO_FOLIO}} C.P.A.C.F., a V.E. respetuosamente me presento y digo:

I. OBJETO

Que vengo a interponer RECURSO DE QUEJA por denegacion del recurso de apelacion, conforme lo dispuesto por el art. 282 del C.P.C.C.N.

II. ANTECEDENTES

Con fecha {{FECHA_DENEGACION}}, el Juzgado de primera instancia denego el recurso de apelacion oportunamente interpuesto por esta parte, resolucion que resulta erronea por las razones que a continuacion se exponen.

III. FUNDAMENTOS DE LA QUEJA

{{FUNDAMENTOS}}

La resolucion recurrida es apelable por reunir los requisitos establecidos por el art. 242 del C.P.C.C.N. La denegacion del recurso por parte del a quo resulta infundada y contraria a derecho.

IV. DERECHO

Arts. 282, 283, 284, 285 y concordantes del C.P.C.C.N.

V. PETITORIO

Por todo lo expuesto a V.E. solicito:
1) Tenga por interpuesto el recurso de queja en tiempo y forma.
2) Previa sustanciacion, declare mal denegado el recurso de apelacion.
3) En su oportunidad, conozca en el recurso de apelacion originariamente interpuesto.

Proveer de conformidad,
SERA JUSTICIA.

{{CIUDAD}}, {{FECHA}}

______________________________
{{NOMBRE_ABOGADO}}
T. {{TOMO_FOLIO}} CPACF'
FROM ModelosCategorias c WHERE c.nombre = 'Recursos y Apelaciones';
GO

-- 12. Inhibitoria de jurisdiccion
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Planteo de Incompetencia',
  'Declinatoria o inhibitoria de jurisdiccion por incompetencia del tribunal. Art. 8 CPCCN.',
  'Civil', '1.0',
  '[{"campo":"NOMBRE_PARTE","label":"Nombre de la parte","tipo":"text"},{"campo":"CARATULA","label":"Caratula del expediente","tipo":"text"},{"campo":"TRIBUNAL_COMPETENTE","label":"Tribunal que considera competente","tipo":"text"},{"campo":"FUNDAMENTOS","label":"Fundamentos de la incompetencia","tipo":"textarea"},{"campo":"NOMBRE_ABOGADO","label":"Abogado patrocinante","tipo":"text"},{"campo":"TOMO_FOLIO","label":"Tomo y Folio","tipo":"text"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha","tipo":"date"}]',
  'SENOR JUEZ:

{{NOMBRE_PARTE}}, con el patrocinio letrado del Dr./Dra. {{NOMBRE_ABOGADO}}, T. {{TOMO_FOLIO}} C.P.A.C.F., en los autos "{{CARATULA}}", a V.S. respetuosamente me presento y digo:

I. OBJETO

Que vengo a plantear EXCEPCION DE INCOMPETENCIA por via de declinatoria, solicitando que V.S. se declare incompetente para entender en las presentes actuaciones, debiendo remitirse las mismas al {{TRIBUNAL_COMPETENTE}}.

II. FUNDAMENTOS

{{FUNDAMENTOS}}

III. DERECHO

Arts. 4, 5, 6, 7, 8, 344, 346, 347 inc. 1 y concordantes del C.P.C.C.N.

IV. PETITORIO

Por todo lo expuesto a V.S. solicito:
1) Tenga por planteada en tiempo y forma la excepcion de incompetencia.
2) Previa sustanciacion, se declare incompetente.
3) Remita las actuaciones al tribunal competente indicado.

Proveer de conformidad,
SERA JUSTICIA.

{{CIUDAD}}, {{FECHA}}

______________________________
{{NOMBRE_ABOGADO}}
T. {{TOMO_FOLIO}} CPACF'
FROM ModelosCategorias c WHERE c.nombre = 'Demandas';
GO

-- 13. Contrato de compraventa de vehiculo
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Contrato de Compraventa de Vehiculo',
  'Contrato de compraventa de automotor entre particulares con transferencia de dominio.',
  'Civil', '1.0',
  '[{"campo":"VENDEDOR","label":"Nombre completo del vendedor","tipo":"text"},{"campo":"DNI_VENDEDOR","label":"DNI del vendedor","tipo":"text"},{"campo":"DOMICILIO_VENDEDOR","label":"Domicilio del vendedor","tipo":"text"},{"campo":"COMPRADOR","label":"Nombre completo del comprador","tipo":"text"},{"campo":"DNI_COMPRADOR","label":"DNI del comprador","tipo":"text"},{"campo":"DOMICILIO_COMPRADOR","label":"Domicilio del comprador","tipo":"text"},{"campo":"MARCA","label":"Marca del vehiculo","tipo":"text"},{"campo":"MODELO","label":"Modelo","tipo":"text"},{"campo":"ANO","label":"Ano de fabricacion","tipo":"text"},{"campo":"DOMINIO","label":"Dominio/Patente","tipo":"text"},{"campo":"PRECIO","label":"Precio en pesos","tipo":"number"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha","tipo":"date"}]',
  'CONTRATO DE COMPRAVENTA DE VEHICULO AUTOMOTOR

En la ciudad de {{CIUDAD}}, a los {{FECHA}}, entre:

VENDEDOR: {{VENDEDOR}}, D.N.I. N {{DNI_VENDEDOR}}, con domicilio en {{DOMICILIO_VENDEDOR}}, en adelante "el Vendedor"; y

COMPRADOR: {{COMPRADOR}}, D.N.I. N {{DNI_COMPRADOR}}, con domicilio en {{DOMICILIO_COMPRADOR}}, en adelante "el Comprador";

acuerdan celebrar el presente Contrato de Compraventa de Vehiculo Automotor, sujeto a las siguientes clausulas:

PRIMERA — OBJETO: El Vendedor vende y transfiere al Comprador el vehiculo automotor marca {{MARCA}}, modelo {{MODELO}}, ano {{ANO}}, dominio {{DOMINIO}}, libre de gravamenes, embargos, prendas e inhibiciones.

SEGUNDA — PRECIO: El precio total de la compraventa se fija en la suma de PESOS {{PRECIO}} ($ {{PRECIO}}), que el Comprador abona en este acto al Vendedor, quien presta conformidad con el recibo de dicha suma.

TERCERA — ENTREGA Y TRADICION: En este mismo acto, el Vendedor hace entrega al Comprador del vehiculo descripto, con todos sus documentos (titulo, cedula, seguro vigente), realizandose la tradicion del bien.

CUARTA — TRANSFERENCIA REGISTRAL: Las partes se comprometen a realizar la transferencia de dominio ante el Registro Nacional de la Propiedad Automotor en un plazo no mayor a 30 dias. Los gastos de transferencia seran a cargo del Comprador.

QUINTA — GARANTIA DE EVICCION: El Vendedor garantiza la eviccion y los vicios redhibitorios conforme lo establecido por los arts. 1033 y concordantes del Codigo Civil y Comercial de la Nacion.

SEXTA — INFRACCIONES Y MULTAS: Todas las infracciones, multas y/o sanciones anteriores a la fecha del presente contrato son responsabilidad exclusiva del Vendedor.

SEPTIMA — JURISDICCION: Para cualquier controversia derivada del presente contrato, las partes se someten a la jurisdiccion de los Tribunales Ordinarios de {{CIUDAD}}.

En prueba de conformidad, se firman dos ejemplares de un mismo tenor y a un solo efecto.

______________________________                    ______________________________
{{VENDEDOR}}                                       {{COMPRADOR}}
D.N.I. N {{DNI_VENDEDOR}}                         D.N.I. N {{DNI_COMPRADOR}}'
FROM ModelosCategorias c WHERE c.nombre = 'Contratos Comerciales';
GO

-- ════════════════════════════════════════════════════════════
-- LABORAL (13 modelos)
-- ════════════════════════════════════════════════════════════

-- 14. Telegrama de parte dogmatica
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Telegrama Laboral — Intima Pago y Registracion',
  'Telegrama obrero intimando regularizacion de la relacion laboral. Arts. 8, 9, 10, 11 Ley 24.013.',
  'Laboral', '1.0',
  '[{"campo":"NOMBRE_TRABAJADOR","label":"Nombre del trabajador","tipo":"text"},{"campo":"DNI_TRABAJADOR","label":"DNI del trabajador","tipo":"text"},{"campo":"NOMBRE_EMPLEADOR","label":"Nombre/razon social del empleador","tipo":"text"},{"campo":"DOMICILIO_EMPLEADOR","label":"Domicilio del empleador","tipo":"text"},{"campo":"FECHA_INGRESO_REAL","label":"Fecha de ingreso real","tipo":"date"},{"campo":"CATEGORIA","label":"Categoria y tareas realizadas","tipo":"text"},{"campo":"REMUNERACION","label":"Remuneracion real percibida","tipo":"number"}]',
  'TEXTO DEL TELEGRAMA OBRERO:

{{NOMBRE_EMPLEADOR}} — {{DOMICILIO_EMPLEADOR}}

{{NOMBRE_TRABAJADOR}}, DNI {{DNI_TRABAJADOR}}, intima fehacientemente a Ud. en el plazo de 30 dias corridos a:

1) Registrar la relacion laboral existente desde el {{FECHA_INGRESO_REAL}}, categoria {{CATEGORIA}}, remuneracion $ {{REMUNERACION}}, conforme arts. 7, 8 y 9 de la Ley 24.013.

2) Ingresar los aportes y contribuciones correspondientes a los sistemas de seguridad social por todo el periodo trabajado.

3) Entregar recibos de sueldos de todos los periodos trabajados firmados en debida forma.

4) Abonar todas las diferencias salariales adeudadas.

Caso contrario iniciare acciones legales reclamando las indemnizaciones previstas en los arts. 8, 9, 10 y 11 de la Ley 24.013, con mas las indemnizaciones de la LCT.

Copia a la AFIP conforme art. 11 Ley 24.013.

NOTA PARA EL ABOGADO: Este texto debe enviarse por telegrama colacionado o carta documento desde la oficina de correos o escribania. Conservar el comprobante de envio original.'
FROM ModelosCategorias c WHERE c.nombre = 'Demandas Laborales';
GO

-- 15. Demanda por accidente de trabajo
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Demanda por Accidente de Trabajo — Art. 1716 CCyCN',
  'Demanda civil por accidente de trabajo con fundamento en el derecho comun. Art. 1716 CCyCN.',
  'Laboral', '1.0',
  '[{"campo":"NOMBRE_ACTOR","label":"Nombre del trabajador accidentado","tipo":"text"},{"campo":"DNI_ACTOR","label":"DNI del trabajador","tipo":"text"},{"campo":"NOMBRE_EMPLEADORA","label":"Razon social de la empleadora","tipo":"text"},{"campo":"NOMBRE_ART","label":"Nombre de la ART","tipo":"text"},{"campo":"FECHA_ACCIDENTE","label":"Fecha del accidente","tipo":"date"},{"campo":"DESCRIPCION_ACCIDENTE","label":"Descripcion del accidente","tipo":"textarea"},{"campo":"INCAPACIDAD","label":"Porcentaje de incapacidad estimada","tipo":"text"},{"campo":"MONTO","label":"Monto reclamado","tipo":"number"},{"campo":"NOMBRE_ABOGADO","label":"Abogado patrocinante","tipo":"text"},{"campo":"TOMO_FOLIO","label":"Tomo y Folio","tipo":"text"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha","tipo":"date"}]',
  'SENOR JUEZ NACIONAL DEL TRABAJO:

{{NOMBRE_ACTOR}}, D.N.I. N {{DNI_ACTOR}}, con el patrocinio letrado del Dr./Dra. {{NOMBRE_ABOGADO}}, T. {{TOMO_FOLIO}} C.P.A.C.F., a V.S. respetuosamente me presento y digo:

I. OBJETO

Que vengo a promover DEMANDA POR ACCIDENTE DE TRABAJO en contra de {{NOMBRE_EMPLEADORA}} y {{NOMBRE_ART}}, por la suma de PESOS {{MONTO}}, o lo que en mas o en menos resulte de la prueba, con mas intereses, costas y costos.

II. HECHOS

El actor presto servicios para la demandada desde [fecha de ingreso]. Con fecha {{FECHA_ACCIDENTE}}, {{DESCRIPCION_ACCIDENTE}}

Como consecuencia del accidente descripto, el actor sufrio lesiones que le ocasionaron una incapacidad laboral permanente del {{INCAPACIDAD}} de la total obrera.

III. RESPONSABILIDAD

La empleadora resulta responsable por el accidente sufrido por el actor en el marco de la relacion de dependencia, conforme los arts. 1716, 1717, 1726, 1737, 1738 y concordantes del Codigo Civil y Comercial de la Nacion.

IV. RUBROS RECLAMADOS

1. Incapacidad laboral permanente parcial y definitiva.
2. Dano moral y psicologico.
3. Dano estetico (si correspondiera).
4. Gastos medicos y farmaceuticos.
5. Gastos de traslado y rehabilitacion.

V. DERECHO

Arts. 1716, 1717, 1726, 1737, 1738, 1740, 1741 CCyCN; Ley 24.557 y sus modificatorias; Ley 26.773.

VI. PRUEBA

A) Documental: historia clinica, alta medica, telegramas.
B) Pericial medica: para determinar el grado de incapacidad.
C) Pericial contable: para calcular los montos indemnizatorios.
D) Informativa: a la ART, empleadora, hospitales.
E) Testimonial: testigos presenciales del accidente.

VII. PETITORIO

Por todo lo expuesto a V.S. solicito:
1) Me tenga por presentado, por parte y por constituido domicilio.
2) Corra traslado de la demanda a las demandadas.
3) Oportunamente dicte sentencia haciendo lugar a la demanda en todas sus partes, con costas.

Proveer de conformidad,
SERA JUSTICIA.

{{CIUDAD}}, {{FECHA}}

______________________________
{{NOMBRE_ABOGADO}}
T. {{TOMO_FOLIO}} CPACF'
FROM ModelosCategorias c WHERE c.nombre = 'Demandas Laborales';
GO

-- 16. Contrato de trabajo a plazo fijo
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Contrato de Trabajo a Plazo Fijo',
  'Contrato laboral por tiempo determinado. Art. 90, 93 y cc. de la LCT.',
  'Laboral', '1.0',
  '[{"campo":"RAZON_SOCIAL","label":"Razon social de la empresa","tipo":"text"},{"campo":"CUIT","label":"CUIT de la empresa","tipo":"text"},{"campo":"DOMICILIO_EMPRESA","label":"Domicilio de la empresa","tipo":"text"},{"campo":"NOMBRE_TRABAJADOR","label":"Nombre del trabajador","tipo":"text"},{"campo":"DNI_TRABAJADOR","label":"DNI del trabajador","tipo":"text"},{"campo":"DOMICILIO_TRABAJADOR","label":"Domicilio del trabajador","tipo":"text"},{"campo":"CATEGORIA","label":"Categoria y descripcion de tareas","tipo":"text"},{"campo":"REMUNERACION","label":"Remuneracion mensual bruta","tipo":"number"},{"campo":"FECHA_INICIO","label":"Fecha de inicio","tipo":"date"},{"campo":"FECHA_FIN","label":"Fecha de finalizacion","tipo":"date"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha del contrato","tipo":"date"}]',
  'CONTRATO DE TRABAJO A PLAZO FIJO

En la ciudad de {{CIUDAD}}, a los {{FECHA}}, entre:

EMPLEADORA: {{RAZON_SOCIAL}}, CUIT N {{CUIT}}, con domicilio en {{DOMICILIO_EMPRESA}}, representada en este acto por su apoderado, en adelante "la Empresa"; y

TRABAJADOR/A: {{NOMBRE_TRABAJADOR}}, D.N.I. N {{DNI_TRABAJADOR}}, con domicilio en {{DOMICILIO_TRABAJADOR}}, en adelante "el/la Trabajador/a";

acuerdan celebrar el presente Contrato de Trabajo a Plazo Fijo conforme los arts. 90 inc. b), 93, 94, 95 y concordantes de la Ley de Contrato de Trabajo N 20.744 (t.o.), sujeto a las siguientes clausulas:

PRIMERA — DURACION: El presente contrato tendra vigencia desde el dia {{FECHA_INICIO}} hasta el dia {{FECHA_FIN}}. Las partes declaran que la causa que justifica la contratacion a plazo fijo es de caracter extraordinario o transitorio, conforme las exigencias del art. 90 LCT.

SEGUNDA — TAREAS Y CATEGORIA: El/la Trabajador/a se desempenara en el cargo de {{CATEGORIA}}.

TERCERA — REMUNERACION: La remuneracion mensual bruta sera de PESOS {{REMUNERACION}} ($ {{REMUNERACION}}), sujeta a los descuentos de ley.

CUARTA — JORNADA: La jornada de trabajo sera la establecida por la legislacion vigente y el convenio colectivo aplicable.

QUINTA — CONVENIO COLECTIVO: Resulta aplicable al presente contrato el Convenio Colectivo de Trabajo que rija para la actividad.

SEXTA — PREAVISO: Con no menos de un mes de anticipacion al vencimiento del plazo, la empleadora debera notificar al trabajador sobre la rescision del contrato, bajo apercibimiento de conversion a tiempo indeterminado.

SEPTIMA — LEGISLACION APLICABLE: El presente contrato se rige por la LCT N 20.744 y sus modificatorias, el convenio colectivo aplicable y demas normas laborales vigentes.

En prueba de conformidad, se suscriben dos ejemplares de identico tenor.

______________________________                    ______________________________
POR LA EMPRESA                                     {{NOMBRE_TRABAJADOR}}
{{RAZON_SOCIAL}}                                   D.N.I. N {{DNI_TRABAJADOR}}'
FROM ModelosCategorias c WHERE c.nombre = 'Contratos de Trabajo';
GO

-- 17. Demanda por diferencias salariales
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Demanda por Diferencias Salariales',
  'Reclamacion de diferencias salariales por categoria inferior a la real. LCT.',
  'Laboral', '1.0',
  '[{"campo":"NOMBRE_ACTOR","label":"Nombre del trabajador","tipo":"text"},{"campo":"DNI_ACTOR","label":"DNI del trabajador","tipo":"text"},{"campo":"NOMBRE_EMPLEADORA","label":"Razon social empleadora","tipo":"text"},{"campo":"FECHA_INGRESO","label":"Fecha de ingreso","tipo":"date"},{"campo":"CATEGORIA_REAL","label":"Categoria real desempenada","tipo":"text"},{"campo":"CATEGORIA_REGISTRADA","label":"Categoria registrada por el empleador","tipo":"text"},{"campo":"DIFERENCIA_MENSUAL","label":"Diferencia mensual aproximada","tipo":"number"},{"campo":"PERIODO_RECLAMADO","label":"Periodo reclamado","tipo":"text"},{"campo":"MONTO_TOTAL","label":"Monto total reclamado","tipo":"number"},{"campo":"NOMBRE_ABOGADO","label":"Abogado patrocinante","tipo":"text"},{"campo":"TOMO_FOLIO","label":"Tomo y Folio","tipo":"text"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha","tipo":"date"}]',
  'SENOR JUEZ NACIONAL DEL TRABAJO:

{{NOMBRE_ACTOR}}, D.N.I. N {{DNI_ACTOR}}, con el patrocinio letrado del Dr./Dra. {{NOMBRE_ABOGADO}}, T. {{TOMO_FOLIO}} C.P.A.C.F., a V.S. respetuosamente me presento y digo:

I. OBJETO

Que vengo a reclamar DIFERENCIAS SALARIALES en contra de {{NOMBRE_EMPLEADORA}}, por la suma de PESOS {{MONTO_TOTAL}}, con mas intereses, costas y costos.

II. RELACION LABORAL

El actor ingreso a trabajar para la demandada el {{FECHA_INGRESO}}, desempenando en la practica las tareas propias de la categoria {{CATEGORIA_REAL}}, siendo registrado en la categoria inferior de {{CATEGORIA_REGISTRADA}}.

III. DIFERENCIAS SALARIALES

Durante el periodo {{PERIODO_RECLAMADO}}, el actor percibio una remuneracion inferior a la que le correspondia segun su categoria real, existiendo una diferencia mensual de aproximadamente PESOS {{DIFERENCIA_MENSUAL}}.

IV. INTIMA PREVIA

El actor intimo fehacientemente a la demandada a abonar las diferencias salariales, sin que esta haya dado respuesta satisfactoria.

V. DERECHO

Arts. 14 bis CN; arts. 74, 103, 104, 105 y concordantes de la LCT; convenio colectivo aplicable.

VI. PRUEBA

A) Documental: recibos de sueldo y telegramas.
B) Pericial contable: liquidacion de diferencias.
C) Informativa: AFIP y ANSES.
D) Testimonial: companeros de trabajo.

VII. PETITORIO

Por todo lo expuesto a V.S. solicito:
1) Me tenga por presentado, por parte y por constituido domicilio.
2) Corra traslado a la demandada.
3) Oportunamente, condene a la demandada al pago de las diferencias reclamadas, con costas.

Proveer de conformidad,
SERA JUSTICIA.

{{CIUDAD}}, {{FECHA}}

______________________________
{{NOMBRE_ABOGADO}}
T. {{TOMO_FOLIO}} CPACF'
FROM ModelosCategorias c WHERE c.nombre = 'Demandas Laborales';
GO

-- 18. Contrato de trabajo part-time
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Contrato de Trabajo Tiempo Parcial',
  'Contrato laboral de jornada reducida. Art. 92 ter LCT.',
  'Laboral', '1.0',
  '[{"campo":"RAZON_SOCIAL","label":"Razon social de la empresa","tipo":"text"},{"campo":"CUIT","label":"CUIT de la empresa","tipo":"text"},{"campo":"NOMBRE_TRABAJADOR","label":"Nombre del trabajador","tipo":"text"},{"campo":"DNI_TRABAJADOR","label":"DNI del trabajador","tipo":"text"},{"campo":"CATEGORIA","label":"Categoria y tareas","tipo":"text"},{"campo":"HORAS_DIARIAS","label":"Horas diarias de trabajo","tipo":"text"},{"campo":"DIAS_SEMANA","label":"Dias de la semana a trabajar","tipo":"text"},{"campo":"REMUNERACION","label":"Remuneracion proporcional mensual","tipo":"number"},{"campo":"FECHA_INICIO","label":"Fecha de inicio","tipo":"date"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha del contrato","tipo":"date"}]',
  'CONTRATO DE TRABAJO A TIEMPO PARCIAL

En la ciudad de {{CIUDAD}}, a los {{FECHA}}, entre:

EMPLEADORA: {{RAZON_SOCIAL}}, CUIT N {{CUIT}}, y

TRABAJADOR/A: {{NOMBRE_TRABAJADOR}}, D.N.I. N {{DNI_TRABAJADOR}};

acuerdan celebrar contrato de trabajo a tiempo parcial conforme el art. 92 ter de la LCT:

PRIMERA — OBJETO: Prestacion de servicios en caracter de {{CATEGORIA}}.

SEGUNDA — JORNADA REDUCIDA: La jornada sera de {{HORAS_DIARIAS}} horas diarias, los dias {{DIAS_SEMANA}} de cada semana, no pudiendo exceder las 2/3 partes de la jornada habitual de la actividad.

TERCERA — REMUNERACION: La remuneracion sera proporcional a la jornada pactada: PESOS {{REMUNERACION}} mensuales.

CUARTA — INICIO: La relacion laboral comienza el {{FECHA_INICIO}} con caracter de tiempo indeterminado.

QUINTA — APORTES: Los aportes y contribuciones se realizaran en proporcion a la remuneracion percibida.

SEXTA — HORAS EXTRAS: El empleador no podra intimar al trabajador a realizar horas extraordinarias, salvo casos de fuerza mayor debidamente justificados.

En prueba de conformidad, se firman dos ejemplares.

______________________________                    ______________________________
POR LA EMPRESA                                     {{NOMBRE_TRABAJADOR}}
{{RAZON_SOCIAL}}                                   D.N.I. N {{DNI_TRABAJADOR}}'
FROM ModelosCategorias c WHERE c.nombre = 'Contratos de Trabajo';
GO

-- 19. Acuerdo de desvinculacion laboral
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Acuerdo de Desvinculacion Laboral — Art. 241 LCT',
  'Convenio de extincion del contrato de trabajo por mutuo acuerdo. Art. 241 LCT.',
  'Laboral', '1.0',
  '[{"campo":"RAZON_SOCIAL","label":"Razon social de la empresa","tipo":"text"},{"campo":"NOMBRE_TRABAJADOR","label":"Nombre del trabajador","tipo":"text"},{"campo":"DNI_TRABAJADOR","label":"DNI del trabajador","tipo":"text"},{"campo":"FECHA_INGRESO","label":"Fecha de ingreso","tipo":"date"},{"campo":"FECHA_EGRESO","label":"Fecha de egreso acordada","tipo":"date"},{"campo":"MONTO_ACUERDO","label":"Monto total del acuerdo","tipo":"number"},{"campo":"CUOTAS","label":"Forma de pago (cuotas/contado)","tipo":"text"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha","tipo":"date"}]',
  'ACUERDO DE EXTINCION DEL CONTRATO DE TRABAJO
(Art. 241 de la Ley de Contrato de Trabajo)

En la ciudad de {{CIUDAD}}, a los {{FECHA}}, entre:

EMPRESA: {{RAZON_SOCIAL}}, representada por su apoderado; y

TRABAJADOR/A: {{NOMBRE_TRABAJADOR}}, D.N.I. N {{DNI_TRABAJADOR}};

ACUERDAN:

PRIMERO — Las partes, de mutuo acuerdo y voluntariamente, convienen en dar por extinguido el contrato de trabajo que las vincula, con vigencia a partir del {{FECHA_EGRESO}}.

SEGUNDO — La empresa abonara al trabajador la suma total de PESOS {{MONTO_ACUERDO}} en concepto de gratificacion voluntaria por la desvinculacion, en la siguiente forma: {{CUOTAS}}.

TERCERO — El trabajador ingreso el {{FECHA_INGRESO}} y el presente acuerdo cancela cualquier reclamo derivado de la relacion laboral.

CUARTO — El presente acuerdo se firma en presencia de abogado y debera ser homologado ante el Ministerio de Trabajo o ante el Juez del Trabajo.

QUINTO — Ambas partes declaran no tener nada mas que reclamarse por ningun concepto derivado del contrato de trabajo.

______________________________                    ______________________________
POR LA EMPRESA                                     {{NOMBRE_TRABAJADOR}}
{{RAZON_SOCIAL}}                                   D.N.I. N {{DNI_TRABAJADOR}}'
FROM ModelosCategorias c WHERE c.nombre = 'Contratos de Trabajo';
GO

-- 20. Demanda por hostigamiento laboral
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Demanda por Hostigamiento Laboral (Mobbing)',
  'Demanda laboral por acoso laboral psicologico. Art. 1 LCT, 75 LCT, 1716 CCyCN.',
  'Laboral', '1.0',
  '[{"campo":"NOMBRE_ACTOR","label":"Nombre del trabajador","tipo":"text"},{"campo":"DNI_ACTOR","label":"DNI del trabajador","tipo":"text"},{"campo":"NOMBRE_EMPLEADORA","label":"Razon social empleadora","tipo":"text"},{"campo":"HOSTIGADOR","label":"Nombre del hostigador","tipo":"text"},{"campo":"CARGO_HOSTIGADOR","label":"Cargo del hostigador","tipo":"text"},{"campo":"HECHOS","label":"Descripcion de los hechos de hostigamiento","tipo":"textarea"},{"campo":"DANO","label":"Dano sufrido (psicologico, fisico, laboral)","tipo":"textarea"},{"campo":"MONTO","label":"Monto reclamado","tipo":"number"},{"campo":"NOMBRE_ABOGADO","label":"Abogado patrocinante","tipo":"text"},{"campo":"TOMO_FOLIO","label":"Tomo y Folio","tipo":"text"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha","tipo":"date"}]',
  'SENOR JUEZ NACIONAL DEL TRABAJO:

{{NOMBRE_ACTOR}}, D.N.I. N {{DNI_ACTOR}}, con el patrocinio letrado del Dr./Dra. {{NOMBRE_ABOGADO}}, T. {{TOMO_FOLIO}} C.P.A.C.F., a V.S. respetuosamente me presento y digo:

I. OBJETO

Que vengo a promover DEMANDA POR HOSTIGAMIENTO LABORAL (MOBBING) en contra de {{NOMBRE_EMPLEADORA}}, por la suma de PESOS {{MONTO}}, con mas intereses, costas y costos.

II. HECHOS

El actor es empleado de la demandada. {{HOSTIGADOR}}, en su caracter de {{CARGO_HOSTIGADOR}}, llevo adelante una conducta sistematica de hostigamiento laboral, que se describe a continuacion:

{{HECHOS}}

III. DANO CAUSADO

Como consecuencia del hostigamiento descripto, el actor ha sufrido:

{{DANO}}

IV. RESPONSABILIDAD DE LA EMPRESA

La empleadora es responsable por el hostigamiento sufrido por el actor, en tanto tolero y/o fue conocedora de dicha conducta sin adoptar medidas preventivas ni correctivas, incumpliendo el deber de seguridad establecido en el art. 75 de la LCT.

V. DERECHO

Arts. 1 LCT (principio protectorio), 75 LCT (deber de seguridad), 1716, 1717, 1726, 1737, 1741 CCyCN; Ley 26.485 (violencia laboral).

VI. PETITORIO

Por todo lo expuesto a V.S. solicito:
1) Me tenga por presentado, por parte y por constituido domicilio.
2) Corra traslado a la demandada.
3) Oportunamente, dicte sentencia condenando a la demandada al pago del monto reclamado, con costas.

Proveer de conformidad,
SERA JUSTICIA.

{{CIUDAD}}, {{FECHA}}

______________________________
{{NOMBRE_ABOGADO}}
T. {{TOMO_FOLIO}} CPACF'
FROM ModelosCategorias c WHERE c.nombre = 'Demandas Laborales';
GO

-- 21-26: Familia (13 modelos)

-- 21. Demanda de divorcio vincular
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Demanda de Divorcio Vincular',
  'Demanda de divorcio unilateral. Art. 437 y 438 del Codigo Civil y Comercial de la Nacion.',
  'Civil', '1.0',
  '[{"campo":"NOMBRE_ACTOR","label":"Nombre del conyuge actor","tipo":"text"},{"campo":"DNI_ACTOR","label":"DNI del actor","tipo":"text"},{"campo":"DOMICILIO_ACTOR","label":"Domicilio del actor","tipo":"text"},{"campo":"NOMBRE_DEMANDADO","label":"Nombre del conyuge demandado","tipo":"text"},{"campo":"DNI_DEMANDADO","label":"DNI del demandado","tipo":"text"},{"campo":"DOMICILIO_DEMANDADO","label":"Domicilio del demandado","tipo":"text"},{"campo":"FECHA_MATRIMONIO","label":"Fecha de matrimonio","tipo":"date"},{"campo":"ACTA_MATRIMONIO","label":"Numero de acta y tomo del matrimonio","tipo":"text"},{"campo":"HIJOS","label":"Hijos en comun (nombres y edades)","tipo":"textarea"},{"campo":"PROPUESTA_CONVENIO","label":"Propuesta de convenio regulador","tipo":"textarea"},{"campo":"NOMBRE_ABOGADO","label":"Abogado patrocinante","tipo":"text"},{"campo":"TOMO_FOLIO","label":"Tomo y Folio","tipo":"text"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha","tipo":"date"}]',
  'SENOR JUEZ DE FAMILIA:

{{NOMBRE_ACTOR}}, D.N.I. N {{DNI_ACTOR}}, con domicilio en {{DOMICILIO_ACTOR}}, constituyendo domicilio procesal en la sede del estudio, con el patrocinio letrado del Dr./Dra. {{NOMBRE_ABOGADO}}, T. {{TOMO_FOLIO}} C.P.A.C.F., a V.S. respetuosamente me presento y digo:

I. OBJETO

Que vengo a promover DEMANDA DE DIVORCIO VINCULAR en contra de {{NOMBRE_DEMANDADO}}, D.N.I. N {{DNI_DEMANDADO}}, con domicilio en {{DOMICILIO_DEMANDADO}}, conforme lo establecido en los arts. 437 y 438 del Codigo Civil y Comercial de la Nacion.

II. DATOS DEL MATRIMONIO

Las partes contrajeron matrimonio civil en fecha {{FECHA_MATRIMONIO}}, conforme consta en el Acta N {{ACTA_MATRIMONIO}}.

III. HIJOS EN COMUN

Del matrimonio nacieron los siguientes hijos:

{{HIJOS}}

IV. PROPUESTA DE CONVENIO REGULADOR

En cumplimiento de lo dispuesto por el art. 438 del CCyCN, se acompana la siguiente propuesta de convenio regulador:

{{PROPUESTA_CONVENIO}}

V. DERECHO

Arts. 437, 438, 439, 440, 641 y concordantes del Codigo Civil y Comercial de la Nacion.

VI. PETITORIO

Por todo lo expuesto a V.S. solicito:
1) Me tenga por presentado, por parte y por constituido domicilio.
2) Corra traslado de la demanda y de la propuesta de convenio regulador al conyuge demandado.
3) Oportunamente, dicte sentencia de divorcio vincular entre las partes.

Proveer de conformidad,
SERA JUSTICIA.

{{CIUDAD}}, {{FECHA}}

______________________________
{{NOMBRE_ABOGADO}}
T. {{TOMO_FOLIO}} CPACF'
FROM ModelosCategorias c WHERE c.nombre = 'Derecho de Familia';
GO

-- 22. Demanda de alimentos
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Demanda de Alimentos',
  'Demanda de fijacion de cuota alimentaria. Arts. 537, 638 y cc. CCyCN.',
  'Civil', '1.0',
  '[{"campo":"NOMBRE_ACTOR","label":"Nombre del alimentado/representante","tipo":"text"},{"campo":"DNI_ACTOR","label":"DNI","tipo":"text"},{"campo":"NOMBRE_DEMANDADO","label":"Nombre del alimentante","tipo":"text"},{"campo":"DNI_DEMANDADO","label":"DNI del alimentante","tipo":"text"},{"campo":"DOMICILIO_DEMANDADO","label":"Domicilio del alimentante","tipo":"text"},{"campo":"VINCULO","label":"Vinculo entre las partes","tipo":"text"},{"campo":"NECESIDADES","label":"Descripcion de necesidades del alimentado","tipo":"textarea"},{"campo":"INGRESOS_DEMANDADO","label":"Ingresos estimados del demandado","tipo":"text"},{"campo":"CUOTA_SOLICITADA","label":"Cuota mensual solicitada","tipo":"number"},{"campo":"NOMBRE_ABOGADO","label":"Abogado patrocinante","tipo":"text"},{"campo":"TOMO_FOLIO","label":"Tomo y Folio","tipo":"text"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha","tipo":"date"}]',
  'SENOR JUEZ DE FAMILIA:

{{NOMBRE_ACTOR}}, D.N.I. N {{DNI_ACTOR}}, con el patrocinio letrado del Dr./Dra. {{NOMBRE_ABOGADO}}, T. {{TOMO_FOLIO}} C.P.A.C.F., a V.S. respetuosamente me presento y digo:

I. OBJETO

Que vengo a reclamar CUOTA ALIMENTARIA en contra de {{NOMBRE_DEMANDADO}}, D.N.I. N {{DNI_DEMANDADO}}, con domicilio en {{DOMICILIO_DEMANDADO}}, en mi caracter de {{VINCULO}}, solicitando se fije una cuota mensual de PESOS {{CUOTA_SOLICITADA}}.

II. NECESIDADES DEL ALIMENTADO

{{NECESIDADES}}

III. POSIBILIDADES DEL ALIMENTANTE

El demandado cuenta con los siguientes ingresos y bienes: {{INGRESOS_DEMANDADO}}, siendo evidente su capacidad economica para contribuir al sustento del alimentado.

IV. MEDIDA CAUTELAR

En forma subsidiaria, solicito se fije una cuota alimentaria provisoria conforme lo dispuesto por el art. 544 del CCyCN.

V. DERECHO

Arts. 537, 541, 542, 543, 544, 638, 646, 658 y concordantes del Codigo Civil y Comercial de la Nacion.

VI. PETITORIO

Por todo lo expuesto a V.S. solicito:
1) Me tenga por presentado, por parte y por constituido domicilio.
2) Fije una cuota alimentaria provisoria.
3) Corra traslado al alimentante.
4) Oportunamente, fije una cuota mensual definitiva no inferior a la aqui solicitada, con costas.

Proveer de conformidad,
SERA JUSTICIA.

{{CIUDAD}}, {{FECHA}}

______________________________
{{NOMBRE_ABOGADO}}
T. {{TOMO_FOLIO}} CPACF'
FROM ModelosCategorias c WHERE c.nombre = 'Derecho de Familia';
GO

-- 23. Solicitud de guarda provisoria
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Solicitud de Guarda Provisoria de Menores',
  'Solicitud de guarda provisoria de hijos menores en contexto de separacion. Art. 651 CCyCN.',
  'Civil', '1.0',
  '[{"campo":"NOMBRE_ACTOR","label":"Nombre del progenitor solicitante","tipo":"text"},{"campo":"DNI_ACTOR","label":"DNI","tipo":"text"},{"campo":"NOMBRE_MENOR","label":"Nombre del/los menor/es","tipo":"text"},{"campo":"EDAD_MENOR","label":"Edad del/los menor/es","tipo":"text"},{"campo":"NOMBRE_OTRO","label":"Nombre del otro progenitor","tipo":"text"},{"campo":"DOMICILIO_OTRO","label":"Domicilio del otro progenitor","tipo":"text"},{"campo":"FUNDAMENTOS","label":"Fundamentos de la guarda solicitada","tipo":"textarea"},{"campo":"REGIMEN_VISITAS","label":"Regimen de comunicacion propuesto","tipo":"textarea"},{"campo":"NOMBRE_ABOGADO","label":"Abogado patrocinante","tipo":"text"},{"campo":"TOMO_FOLIO","label":"Tomo y Folio","tipo":"text"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha","tipo":"date"}]',
  'SENOR JUEZ DE FAMILIA:

{{NOMBRE_ACTOR}}, D.N.I. N {{DNI_ACTOR}}, con el patrocinio letrado del Dr./Dra. {{NOMBRE_ABOGADO}}, T. {{TOMO_FOLIO}} C.P.A.C.F., a V.S. respetuosamente me presento y digo:

I. OBJETO

Que vengo a solicitar se otorgue la GUARDA PROVISORIA de mi/s hijo/s {{NOMBRE_MENOR}}, de {{EDAD_MENOR}} anos de edad, y se establezca un regimen de comunicacion con el/la otro/a progenitor/a {{NOMBRE_OTRO}}, con domicilio en {{DOMICILIO_OTRO}}.

II. SITUACION DE LOS MENORES

{{FUNDAMENTOS}}

III. INTERES SUPERIOR DEL NINO

Conforme el principio del interes superior del nino consagrado en el art. 3 de la Convencion sobre los Derechos del Nino y el art. 706 del CCyCN, resulta conveniente que los menores queden bajo mi guarda.

IV. REGIMEN DE COMUNICACION

Se propone el siguiente regimen de comunicacion con el otro progenitor:

{{REGIMEN_VISITAS}}

V. DERECHO

Arts. 641, 646, 651, 652, 653, 655 y concordantes del Codigo Civil y Comercial de la Nacion; Convencion sobre los Derechos del Nino.

VI. PETITORIO

Por todo lo expuesto a V.S. solicito:
1) Me tenga por presentado y por constituido domicilio.
2) En forma urgente, otorgue la guarda provisoria de los menores a mi favor.
3) Establezca un regimen de comunicacion con el otro progenitor.
4) Oportunamente, confirme la guarda con caracter definitivo.

Proveer de conformidad,
SERA JUSTICIA.

{{CIUDAD}}, {{FECHA}}

______________________________
{{NOMBRE_ABOGADO}}
T. {{TOMO_FOLIO}} CPACF'
FROM ModelosCategorias c WHERE c.nombre = 'Derecho de Familia';
GO

-- 24. Sucesion intestada
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Apertura de Sucesion Intestada',
  'Iniciacion de juicio sucesorio sin testamento. Arts. 2281 y cc. del CCyCN.',
  'Civil', '1.0',
  '[{"campo":"NOMBRE_PETICIONANTE","label":"Nombre del peticionante/heredero","tipo":"text"},{"campo":"DNI_PETICIONANTE","label":"DNI del peticionante","tipo":"text"},{"campo":"VINCULO_PETICIONANTE","label":"Vinculo con el causante","tipo":"text"},{"campo":"NOMBRE_CAUSANTE","label":"Nombre del causante (fallecido)","tipo":"text"},{"campo":"DNI_CAUSANTE","label":"DNI del causante","tipo":"text"},{"campo":"FECHA_FALLECIMIENTO","label":"Fecha de fallecimiento","tipo":"date"},{"campo":"DOMICILIO_ULTIMO","label":"Ultimo domicilio del causante","tipo":"text"},{"campo":"HEREDEROS","label":"Herederos declarados (nombres y vinculos)","tipo":"textarea"},{"campo":"BIENES","label":"Bienes conocidos del causante","tipo":"textarea"},{"campo":"NOMBRE_ABOGADO","label":"Abogado patrocinante","tipo":"text"},{"campo":"TOMO_FOLIO","label":"Tomo y Folio","tipo":"text"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha","tipo":"date"}]',
  'SENOR JUEZ CIVIL:

{{NOMBRE_PETICIONANTE}}, D.N.I. N {{DNI_PETICIONANTE}}, en mi caracter de {{VINCULO_PETICIONANTE}} del causante, con el patrocinio letrado del Dr./Dra. {{NOMBRE_ABOGADO}}, T. {{TOMO_FOLIO}} C.P.A.C.F., a V.S. respetuosamente me presento y digo:

I. OBJETO

Que vengo a solicitar la APERTURA DEL JUICIO SUCESORIO INTESTADO de {{NOMBRE_CAUSANTE}}, D.N.I. N {{DNI_CAUSANTE}}, quien fallecio el dia {{FECHA_FALLECIMIENTO}}, con ultimo domicilio en {{DOMICILIO_ULTIMO}}.

II. HEREDEROS

Los herederos del causante son:

{{HEREDEROS}}

III. BIENES DEL CAUSANTE

Se denuncian los siguientes bienes integrantes del acervo hereditario:

{{BIENES}}

IV. DOCUMENTACION QUE SE ACOMPANA

1. Acta de defuncion del causante.
2. Acta de matrimonio / nacimiento que acredita el vinculo del peticionante.
3. D.N.I. del causante y del peticionante.

V. DERECHO

Arts. 2277, 2281, 2288, 2338, 2400 y concordantes del Codigo Civil y Comercial de la Nacion; arts. 689 y cc. del CPCCN.

VI. PETITORIO

Por todo lo expuesto a V.S. solicito:
1) Me tenga por presentado, por parte y por constituido domicilio.
2) Tenga por abierto el juicio sucesorio intestado de {{NOMBRE_CAUSANTE}}.
3) Se publiquen los edictos de ley.
4) Oportunamente, se dicte la declaratoria de herederos a favor del/los peticionante/s.

Proveer de conformidad,
SERA JUSTICIA.

{{CIUDAD}}, {{FECHA}}

______________________________
{{NOMBRE_ABOGADO}}
T. {{TOMO_FOLIO}} CPACF'
FROM ModelosCategorias c WHERE c.nombre = 'Sucesiones';
GO

-- 25. Convenio de alimentos homologado
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Convenio Regulador de Alimentos y Guarda',
  'Convenio entre progenitores sobre alimentos, guarda y regimen de visitas. Art. 439 CCyCN.',
  'Civil', '1.0',
  '[{"campo":"NOMBRE_PROGENITOR_1","label":"Nombre del primer progenitor","tipo":"text"},{"campo":"DNI_P1","label":"DNI","tipo":"text"},{"campo":"NOMBRE_PROGENITOR_2","label":"Nombre del segundo progenitor","tipo":"text"},{"campo":"DNI_P2","label":"DNI","tipo":"text"},{"campo":"NOMBRE_HIJOS","label":"Nombre e edad de los hijos","tipo":"textarea"},{"campo":"GUARDA","label":"Con quien quedara la guarda","tipo":"text"},{"campo":"CUOTA","label":"Cuota alimentaria mensual","tipo":"number"},{"campo":"VISITAS","label":"Regimen de visitas detallado","tipo":"textarea"},{"campo":"VACACIONES","label":"Distribucion de vacaciones y feriados","tipo":"textarea"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha","tipo":"date"}]',
  'CONVENIO REGULADOR

En la ciudad de {{CIUDAD}}, a los {{FECHA}}, entre:

{{NOMBRE_PROGENITOR_1}}, D.N.I. N {{DNI_P1}}, y

{{NOMBRE_PROGENITOR_2}}, D.N.I. N {{DNI_P2}};

acuerdan el siguiente convenio regulador respecto de sus hijos en comun:

{{NOMBRE_HIJOS}}

PRIMERA — GUARDA Y CUIDADO PERSONAL: Los hijos quedaran bajo la guarda y cuidado personal de {{GUARDA}}, ejerciendo ambos progenitores la responsabilidad parental en forma conjunta.

SEGUNDA — CUOTA ALIMENTARIA: {{NOMBRE_PROGENITOR_2}} abonara en concepto de cuota alimentaria la suma de PESOS {{CUOTA}} mensuales, pagaderos dentro de los primeros 5 dias de cada mes, mediante transferencia bancaria o deposito en cuenta a designar.

TERCERA — REGIMEN DE COMUNICACION: Se establece el siguiente regimen de comunicacion:

{{VISITAS}}

CUARTA — VACACIONES Y FERIADOS:

{{VACACIONES}}

QUINTA — ACTUALIZACION: La cuota alimentaria se actualizara en forma automatica conforme la variacion del RIPTE o el indice que el Juez determine.

SEXTA — HOMOLOGACION: Las partes solicitan la homologacion judicial del presente convenio.

______________________________                    ______________________________
{{NOMBRE_PROGENITOR_1}}                            {{NOMBRE_PROGENITOR_2}}
D.N.I. N {{DNI_P1}}                               D.N.I. N {{DNI_P2}}'
FROM ModelosCategorias c WHERE c.nombre = 'Derecho de Familia';
GO

-- 26. Denuncia por violencia familiar
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Denuncia por Violencia Familiar — Ley 26.485',
  'Denuncia y solicitud de medidas de proteccion por violencia de genero. Ley 26.485.',
  'Civil', '1.0',
  '[{"campo":"NOMBRE_DENUNCIANTE","label":"Nombre de la denunciante","tipo":"text"},{"campo":"DNI_DENUNCIANTE","label":"DNI","tipo":"text"},{"campo":"DOMICILIO_DENUNCIANTE","label":"Domicilio de la denunciante","tipo":"text"},{"campo":"NOMBRE_DENUNCIADO","label":"Nombre del denunciado","tipo":"text"},{"campo":"DNI_DENUNCIADO","label":"DNI del denunciado","tipo":"text"},{"campo":"VINCULO","label":"Vinculo con el denunciado","tipo":"text"},{"campo":"HECHOS","label":"Descripcion de los hechos de violencia","tipo":"textarea"},{"campo":"TESTIGOS","label":"Testigos de los hechos","tipo":"text"},{"campo":"MEDIDAS_SOLICITADAS","label":"Medidas de proteccion solicitadas","tipo":"textarea"},{"campo":"NOMBRE_ABOGADO","label":"Abogado patrocinante","tipo":"text"},{"campo":"TOMO_FOLIO","label":"Tomo y Folio","tipo":"text"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha","tipo":"date"}]',
  'SENOR JUEZ DE FAMILIA / GUARDIA JUDICIAL:

{{NOMBRE_DENUNCIANTE}}, D.N.I. N {{DNI_DENUNCIANTE}}, con domicilio en {{DOMICILIO_DENUNCIANTE}}, con el patrocinio letrado del Dr./Dra. {{NOMBRE_ABOGADO}}, T. {{TOMO_FOLIO}} C.P.A.C.F., a V.S. respetuosamente me presento y DENUNCIO:

I. OBJETO

Formulo la presente denuncia por violencia de genero/familiar conforme la Ley 26.485 y normas concordantes, en contra de {{NOMBRE_DENUNCIADO}}, D.N.I. N {{DNI_DENUNCIADO}}, con quien tengo/tenia la siguiente relacion: {{VINCULO}}.

II. HECHOS

{{HECHOS}}

III. TESTIGOS

{{TESTIGOS}}

IV. MEDIDAS DE PROTECCION URGENTES SOLICITADAS

En virtud de la urgencia y peligro que representa la situacion descripta, solicito se decreten con caracter URGENTE las siguientes medidas:

{{MEDIDAS_SOLICITADAS}}

En particular, se solicita:
— Exclusion del hogar del agresor.
— Prohibicion de acercamiento a la denunciante y sus hijos (si los hubiere) a una distancia no menor a 500 metros.
— Prohibicion de contacto por cualquier medio (telefonico, electronico, redes sociales).
— Restitucion de los hijos menores a la madre (si correspondiera).

V. DERECHO

Ley 26.485 de Proteccion Integral a las Mujeres; arts. 26, 27 y cc.; Convencion de Belen do Para; arts. 590 y cc. del CCyCN.

VI. PETITORIO

Por todo lo expuesto a V.S. solicito:
1) Tenga por formulada la denuncia.
2) Decrete en forma URGENTE las medidas de proteccion solicitadas.
3) Notifique al denunciado las restricciones impuestas.
4) Cite a audiencia a las partes en el plazo legal.

Proveer de conformidad, con la celeridad que el caso requiere,
SERA JUSTICIA.

{{CIUDAD}}, {{FECHA}}

______________________________
{{NOMBRE_ABOGADO}}
T. {{TOMO_FOLIO}} CPACF'
FROM ModelosCategorias c WHERE c.nombre = 'Derecho de Familia';
GO

-- ════════════════════════════════════════════════════════════
-- SOCIETARIO (13 modelos)
-- ════════════════════════════════════════════════════════════

-- 27. Acta de asamblea ordinaria SRL
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Acta de Asamblea Ordinaria de Socios — SRL',
  'Acta de reunion de socios de SRL para aprobacion de estados contables y distribucion de utilidades.',
  'Societario', '1.0',
  '[{"campo":"RAZON_SOCIAL","label":"Razon social de la SRL","tipo":"text"},{"campo":"CUIT","label":"CUIT de la sociedad","tipo":"text"},{"campo":"DOMICILIO_SOCIAL","label":"Domicilio social","tipo":"text"},{"campo":"FECHA_REUNION","label":"Fecha de la reunion","tipo":"date"},{"campo":"HORA","label":"Hora de inicio","tipo":"text"},{"campo":"SOCIOS_PRESENTES","label":"Socios presentes y cuotas que representan","tipo":"textarea"},{"campo":"ORDEN_DEL_DIA","label":"Puntos del orden del dia","tipo":"textarea"},{"campo":"RESOLUCIONES","label":"Resoluciones adoptadas","tipo":"textarea"},{"campo":"GERENTE","label":"Nombre del gerente que firma","tipo":"text"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha del acta","tipo":"date"}]',
  'ACTA N° [NUMERO] DE REUNION DE SOCIOS
{{RAZON_SOCIAL}}
CUIT N {{CUIT}}
Domicilio social: {{DOMICILIO_SOCIAL}}

En la ciudad de {{CIUDAD}}, siendo las {{HORA}} horas del dia {{FECHA_REUNION}}, se reunen en el domicilio social los socios de {{RAZON_SOCIAL}}, conforme la convocatoria realizada.

SOCIOS PRESENTES:

{{SOCIOS_PRESENTES}}

Representan el [X]% del capital social suscripto e integrado, configurandose quorum suficiente para deliberar y resolver sobre los siguientes puntos del orden del dia:

ORDEN DEL DIA:

{{ORDEN_DEL_DIA}}

DELIBERACION Y VOTACION:

Abierto el acto por el Gerente, se procede a considerar cada punto del orden del dia:

RESOLUCIONES:

{{RESOLUCIONES}}

Habiendo sido tratados todos los puntos del orden del dia y no habiendo mas asuntos que considerar, se da por finalizada la reunion, siendo las [hora de cierre] horas, labrando la presente acta que, leida y hallada conforme, es firmada por los socios presentes.

______________________________
{{GERENTE}}
Gerente — {{RAZON_SOCIAL}}'
FROM ModelosCategorias c WHERE c.nombre = 'Contratos Societarios';
GO

-- 28. Acta de directorio SA
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Acta de Directorio — Sociedad Anonima',
  'Acta de reunion de directorio de SA. Art. 267 y cc. Ley 19.550.',
  'Societario', '1.0',
  '[{"campo":"RAZON_SOCIAL","label":"Razon social de la SA","tipo":"text"},{"campo":"FECHA_REUNION","label":"Fecha de la reunion","tipo":"date"},{"campo":"HORA","label":"Hora de inicio","tipo":"text"},{"campo":"DIRECTORES_PRESENTES","label":"Directores presentes y cargos","tipo":"textarea"},{"campo":"ORDEN_DEL_DIA","label":"Puntos del orden del dia","tipo":"textarea"},{"campo":"RESOLUCIONES","label":"Resoluciones adoptadas","tipo":"textarea"},{"campo":"PRESIDENTE","label":"Nombre del Presidente del Directorio","tipo":"text"},{"campo":"SECRETARIO","label":"Nombre del Secretario","tipo":"text"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"}]',
  'ACTA N° [NUMERO] DE REUNION DE DIRECTORIO
{{RAZON_SOCIAL}}

En la ciudad de {{CIUDAD}}, siendo las {{HORA}} horas del dia {{FECHA_REUNION}}, se reunen los miembros del Directorio de {{RAZON_SOCIAL}}:

PRESENTES:

{{DIRECTORES_PRESENTES}}

Verificado el quorum estatutario, el Presidente declara abierta la reunion y somete a consideracion los siguientes puntos del orden del dia:

{{ORDEN_DEL_DIA}}

DELIBERACION:

Luego de la deliberacion correspondiente, el Directorio adopta por unanimidad las siguientes resoluciones:

{{RESOLUCIONES}}

No habiendo mas asuntos que tratar, se da por concluida la reunion, labrando la presente acta que es firmada por los directores presentes.

______________________________          ______________________________
{{PRESIDENTE}}                           {{SECRETARIO}}
Presidente del Directorio               Secretario'
FROM ModelosCategorias c WHERE c.nombre = 'Contratos Societarios';
GO

-- 29. Poder general para pleitos
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Poder General para Pleitos y Cobros',
  'Poder general judicial para que el apoderado represente al poderdante en juicios y gestiones.',
  'Societario', '1.0',
  '[{"campo":"NOMBRE_PODERDANTE","label":"Nombre del poderdante","tipo":"text"},{"campo":"DNI_PODERDANTE","label":"DNI del poderdante","tipo":"text"},{"campo":"DOMICILIO_PODERDANTE","label":"Domicilio del poderdante","tipo":"text"},{"campo":"NOMBRE_APODERADO","label":"Nombre del apoderado","tipo":"text"},{"campo":"DNI_APODERADO","label":"DNI del apoderado","tipo":"text"},{"campo":"DOMICILIO_APODERADO","label":"Domicilio del apoderado","tipo":"text"},{"campo":"FACULTADES","label":"Facultades especiales adicionales (opcional)","tipo":"textarea"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha","tipo":"date"}]',
  'PODER GENERAL PARA PLEITOS Y COBROS

En la ciudad de {{CIUDAD}}, a los {{FECHA}}, ante mi, Escribano Publico, comparece:

{{NOMBRE_PODERDANTE}}, D.N.I. N {{DNI_PODERDANTE}}, con domicilio en {{DOMICILIO_PODERDANTE}}, de cuya identidad doy fe, quien manifiesta otorgar PODER GENERAL AMPLIO Y SUFICIENTE a favor de:

{{NOMBRE_APODERADO}}, D.N.I. N {{DNI_APODERADO}}, con domicilio en {{DOMICILIO_APODERADO}};

para que en nombre y representacion del poderdante pueda:

— Iniciar, continuar, contestar y desistir de toda clase de juicios, incidentes y recursos judiciales o administrativos.
— Presentarse ante toda clase de autoridades judiciales, administrativas y arbitrales.
— Oponer y contestar excepciones; articular y contestar incidentes.
— Producir y controlar prueba; alegar; apelar y fundar recursos.
— Percibir y dar recibo de sumas de dinero, valores, documentos y bienes.
— Transigir, conciliar y llegar a acuerdos.
— Firmar y presentar escritos, solicitudes y documentos.
— Sustituir el presente poder en todo o en parte.
— {{FACULTADES}}

El mandante presta conformidad con todos los actos que su apoderado realice en ejercicio del presente poder, el que se otorga con caracter de irrevocable conforme las facultades conferidas.

[ESPACIO PARA FIRMA DEL ESCRIBANO Y SELLO]

______________________________
{{NOMBRE_PODERDANTE}}
D.N.I. N {{DNI_PODERDANTE}}'
FROM ModelosCategorias c WHERE c.nombre = 'Testimonios y Actas';
GO

-- 30. Demanda de exclusion de socio
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Demanda de Exclusion de Socio — SRL',
  'Accion judicial de exclusion de socio por justa causa. Art. 91 Ley 19.550.',
  'Societario', '1.0',
  '[{"campo":"RAZON_SOCIAL","label":"Razon social de la sociedad","tipo":"text"},{"campo":"NOMBRE_SOCIO_EXCLUIDO","label":"Nombre del socio a excluir","tipo":"text"},{"campo":"DNI_EXCLUIDO","label":"DNI del socio","tipo":"text"},{"campo":"CUOTAS_EXCLUIDO","label":"Cuotas del socio excluido","tipo":"text"},{"campo":"CAUSAS","label":"Causas de exclusion","tipo":"textarea"},{"campo":"NOMBRE_ABOGADO","label":"Abogado patrocinante","tipo":"text"},{"campo":"TOMO_FOLIO","label":"Tomo y Folio","tipo":"text"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha","tipo":"date"}]',
  'SENOR JUEZ COMERCIAL:

{{RAZON_SOCIAL}}, representada por su Gerente, con el patrocinio letrado del Dr./Dra. {{NOMBRE_ABOGADO}}, T. {{TOMO_FOLIO}} C.P.A.C.F., a V.S. respetuosamente nos presentamos y decimos:

I. OBJETO

Que venimos a promover DEMANDA DE EXCLUSION DE SOCIO en contra de {{NOMBRE_SOCIO_EXCLUIDO}}, D.N.I. N {{DNI_EXCLUIDO}}, titular de {{CUOTAS_EXCLUIDO}} cuotas de la sociedad, conforme lo establecido en el art. 91 de la Ley de Sociedades Comerciales N 19.550.

II. CAUSAS DE EXCLUSION

El socio demandado ha incurrido en las siguientes causas de exclusion:

{{CAUSAS}}

Las conductas descritas configuran justa causa de exclusion, al afectar gravemente el funcionamiento y el interes social.

III. DERECHO

Arts. 91, 92, 93 y concordantes de la Ley 19.550. Arts. 1 y concordantes del C.P.C.C.N.

IV. MEDIDA CAUTELAR

En forma subsidiaria, solicito la suspension preventiva del ejercicio de los derechos del socio demandado hasta tanto se dicte sentencia definitiva.

V. PETITORIO

Por todo lo expuesto a V.S. solicito:
1) Se tenga a la sociedad por presentada y por constituido domicilio.
2) Corra traslado de la demanda al socio demandado.
3) Oportunamente, dicte sentencia excluyendo al demandado de la sociedad y determinando la liquidacion de su parte.

Proveer de conformidad,
SERA JUSTICIA.

{{CIUDAD}}, {{FECHA}}

______________________________
{{NOMBRE_ABOGADO}}
T. {{TOMO_FOLIO}} CPACF'
FROM ModelosCategorias c WHERE c.nombre = 'Societario';
GO

-- 31. Estatuto SAS
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Estatuto de Sociedad por Acciones Simplificada (SAS)',
  'Estatuto tipo para constitucion de SAS. Ley 27.349.',
  'Societario', '1.0',
  '[{"campo":"RAZON_SOCIAL","label":"Denominacion social","tipo":"text"},{"campo":"NOMBRE_SOCIO1","label":"Nombre del socio 1","tipo":"text"},{"campo":"DNI_SOCIO1","label":"DNI del socio 1","tipo":"text"},{"campo":"NOMBRE_SOCIO2","label":"Nombre del socio 2 (opcional)","tipo":"text"},{"campo":"DNI_SOCIO2","label":"DNI del socio 2","tipo":"text"},{"campo":"OBJETO_SOCIAL","label":"Objeto social detallado","tipo":"textarea"},{"campo":"CAPITAL_SOCIAL","label":"Capital social en pesos","tipo":"number"},{"campo":"DOMICILIO_SOCIAL","label":"Domicilio social","tipo":"text"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha","tipo":"date"}]',
  'ESTATUTO SOCIAL
SOCIEDAD POR ACCIONES SIMPLIFICADA
{{RAZON_SOCIAL}} S.A.S.

En la ciudad de {{CIUDAD}}, a los {{FECHA}}, los suscriptos:

{{NOMBRE_SOCIO1}}, D.N.I. N {{DNI_SOCIO1}}, y
{{NOMBRE_SOCIO2}}, D.N.I. N {{DNI_SOCIO2}};

acuerdan constituir una Sociedad por Acciones Simplificada (SAS) conforme la Ley 27.349, bajo el siguiente estatuto:

ARTICULO 1 — DENOMINACION: La sociedad se denominara "{{RAZON_SOCIAL}} S.A.S.".

ARTICULO 2 — DOMICILIO: El domicilio social se fija en {{DOMICILIO_SOCIAL}}.

ARTICULO 3 — OBJETO: La sociedad tendra por objeto: {{OBJETO_SOCIAL}}. Para el cumplimiento de su objeto la sociedad podra realizar todos los actos y contratos que sean necesarios o convenientes.

ARTICULO 4 — DURACION: La sociedad tendra una duracion de 99 (noventa y nueve) anos a partir de su inscripcion en el Registro Publico.

ARTICULO 5 — CAPITAL SOCIAL: El capital social se fija en la suma de PESOS {{CAPITAL_SOCIAL}}, representado por [X] acciones ordinarias nominativas no endosables de PESOS [valor unitario] cada una.

ARTICULO 6 — ORGANO DE ADMINISTRACION: La sociedad sera administrada por un Administrador o por el numero de Administradores que designe la asamblea.

ARTICULO 7 — REPRESENTACION: El uso de la firma social corresponde al/los Administrador/es designado/s.

ARTICULO 8 — ORGANO DE GOBIERNO: El organo de gobierno es la Asamblea de Accionistas, que se reunira al menos una vez al ano dentro de los cuatro meses del cierre del ejercicio.

ARTICULO 9 — CIERRE DE EJERCICIO: El ejercicio social cerrara el 31 de diciembre de cada ano.

ARTICULO 10 — DISOLUCION Y LIQUIDACION: La sociedad se disolvera por las causales previstas en la Ley General de Sociedades y la Ley 27.349.

ARTICULO 11 — JURISDICCION: Para cualquier cuestion litigiosa, los socios se someten a la jurisdiccion de los tribunales ordinarios del domicilio social.

______________________________                    ______________________________
{{NOMBRE_SOCIO1}}                                  {{NOMBRE_SOCIO2}}
D.N.I. N {{DNI_SOCIO1}}                           D.N.I. N {{DNI_SOCIO2}}'
FROM ModelosCategorias c WHERE c.nombre = 'Contratos Societarios';
GO

-- ════════════════════════════════════════════════════════════
-- CORPORATIVO (13 modelos)
-- ════════════════════════════════════════════════════════════

-- 32. Acuerdo de confidencialidad NDA
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Acuerdo de Confidencialidad (NDA)',
  'Non-Disclosure Agreement bilateral para proteccion de informacion confidencial entre empresas.',
  'Corporativo', '1.0',
  '[{"campo":"EMPRESA_A","label":"Nombre/Razon social de la Empresa A","tipo":"text"},{"campo":"REPRESENTANTE_A","label":"Representante de la Empresa A","tipo":"text"},{"campo":"EMPRESA_B","label":"Nombre/Razon social de la Empresa B","tipo":"text"},{"campo":"REPRESENTANTE_B","label":"Representante de la Empresa B","tipo":"text"},{"campo":"OBJETO_ACUERDO","label":"Proposito del intercambio de informacion","tipo":"textarea"},{"campo":"DURACION","label":"Duracion del acuerdo (en anos)","tipo":"text"},{"campo":"JURISDICCION","label":"Jurisdiccion para disputas","tipo":"text"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha","tipo":"date"}]',
  'ACUERDO DE CONFIDENCIALIDAD

En la ciudad de {{CIUDAD}}, a los {{FECHA}}, entre:

"PARTE DIVULGADORA A": {{EMPRESA_A}}, representada por {{REPRESENTANTE_A}}; y

"PARTE DIVULGADORA B": {{EMPRESA_B}}, representada por {{REPRESENTANTE_B}};

en adelante conjuntamente denominadas "las Partes", acuerdan el siguiente:

ACUERDO DE CONFIDENCIALIDAD BILATERAL

OBJETO: Las Partes celebran el presente acuerdo en el marco de: {{OBJETO_ACUERDO}}

PRIMERA — INFORMACION CONFIDENCIAL: Se considera Informacion Confidencial toda informacion tecnica, comercial, financiera, estrategica o de cualquier otra naturaleza que una Parte divulgue a la otra, incluyendo sin limitacion: know-how, secretos comerciales, datos de clientes, planes de negocio, proyecciones financieras, codigos fuente y cualquier otra informacion marcada como confidencial.

SEGUNDA — OBLIGACIONES: Cada Parte receptora se obliga a: (a) mantener la Informacion Confidencial en estricta reserva; (b) no divulgarla a terceros sin consentimiento escrito previo; (c) utilizarla exclusivamente para el proposito indicado en el objeto; (d) protegerla con el mismo grado de cuidado que aplica a su propia informacion confidencial, nunca inferior a un grado razonable de cuidado.

TERCERA — EXCEPCIONES: Las obligaciones no aplican a informacion que: (a) sea o pase a ser de dominio publico sin culpa de la receptora; (b) ya estuviera en poder de la receptora antes de la divulgacion; (c) sea recibida legalmente de un tercero sin restriccion de confidencialidad; (d) sea requerida por autoridad competente o ley aplicable.

CUARTA — DURACION: El presente acuerdo tendra vigencia de {{DURACION}} anos a partir de su firma.

QUINTA — DEVOLUCION: Al termino del acuerdo o a solicitud de la divulgadora, la receptora devolvera o destruira toda la Informacion Confidencial recibida.

SEXTA — DANOS Y PERJUICIOS: El incumplimiento de las obligaciones de confidencialidad dara derecho a la parte afectada a reclamar los danos y perjuicios que correspondan.

SEPTIMA — JURISDICCION: Para cualquier controversia, las partes se someten a los tribunales de {{JURISDICCION}}, renunciando a cualquier otro fuero.

En prueba de conformidad, se firman dos ejemplares de identico tenor.

______________________________                    ______________________________
{{EMPRESA_A}}                                      {{EMPRESA_B}}
{{REPRESENTANTE_A}}                                {{REPRESENTANTE_B}}'
FROM ModelosCategorias c WHERE c.nombre = 'Contratos Corporativos';
GO

-- 33. Contrato de distribucion exclusiva
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Contrato de Distribucion Exclusiva',
  'Contrato de distribucion comercial exclusiva con clausulas de minimos y exclusividad territorial.',
  'Corporativo', '1.0',
  '[{"campo":"EMPRESA_DISTRIBUIDORA","label":"Nombre del distribuidor","tipo":"text"},{"campo":"EMPRESA_FABRICANTE","label":"Nombre del fabricante/proveedor","tipo":"text"},{"campo":"PRODUCTOS","label":"Descripcion de los productos","tipo":"textarea"},{"campo":"TERRITORIO","label":"Territorio de exclusividad","tipo":"text"},{"campo":"PRECIO_COMPRA","label":"Precio de compra al fabricante","tipo":"text"},{"campo":"MINIMO_MENSUAL","label":"Minimo de compra mensual","tipo":"number"},{"campo":"DURACION","label":"Duracion del contrato (anos)","tipo":"text"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha","tipo":"date"}]',
  'CONTRATO DE DISTRIBUCION EXCLUSIVA

En la ciudad de {{CIUDAD}}, a los {{FECHA}}, entre:

FABRICANTE: {{EMPRESA_FABRICANTE}}, en adelante "el Fabricante"; y

DISTRIBUIDOR: {{EMPRESA_DISTRIBUIDORA}}, en adelante "el Distribuidor";

acuerdan:

PRIMERA — OBJETO: El Fabricante otorga al Distribuidor la representacion exclusiva para la venta y distribucion de los siguientes productos: {{PRODUCTOS}}

SEGUNDA — EXCLUSIVIDAD TERRITORIAL: La exclusividad se otorga para el siguiente territorio: {{TERRITORIO}}. El Fabricante no podra comercializar directamente ni autorizar a terceros a comercializar los Productos en dicho territorio durante la vigencia del contrato.

TERCERA — PRECIO: El Distribuidor adquirira los Productos al Fabricante a los precios de lista acordados: {{PRECIO_COMPRA}}. Los precios podran actualizarse con 30 dias de preaviso.

CUARTA — MINIMOS DE COMPRA: El Distribuidor se compromete a adquirir como minimo PESOS {{MINIMO_MENSUAL}} mensuales en Productos. El incumplimiento de los minimos podra dar lugar a la rescision del contrato.

QUINTA — OBLIGACIONES DEL DISTRIBUIDOR: (a) Mantener stock suficiente para atender la demanda; (b) no comercializar productos competidores; (c) respetar los precios sugeridos al publico; (d) informar mensualmente sobre ventas y stock.

SEXTA — OBLIGACIONES DEL FABRICANTE: (a) Proveer los Productos en tiempo y forma; (b) brindar soporte tecnico y capacitacion; (c) respetar la exclusividad territorial.

SEPTIMA — DURACION: El contrato tendra una duracion de {{DURACION}} anos, renovandose automaticamente por periodos iguales salvo preaviso de 90 dias.

OCTAVA — RESCISION: Cualquier parte podra rescindir el contrato con preaviso de 90 dias, sin derecho a indemnizacion, salvo incumplimiento de la contraparte.

En prueba de conformidad, se firman dos ejemplares.

______________________________                    ______________________________
{{EMPRESA_FABRICANTE}}                             {{EMPRESA_DISTRIBUIDORA}}'
FROM ModelosCategorias c WHERE c.nombre = 'Contratos Corporativos';
GO

-- 34. Carta de intencion LOI
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Carta de Intencion (Letter of Intent)',
  'LOI para acquisition o inversion. Establece bases de la negociacion y exclusividad.',
  'Corporativo', '1.0',
  '[{"campo":"EMPRESA_COMPRADORA","label":"Nombre del comprador/inversor","tipo":"text"},{"campo":"EMPRESA_OBJETIVO","label":"Nombre de la empresa objetivo","tipo":"text"},{"campo":"DESCRIPCION_OPERACION","label":"Descripcion de la operacion propuesta","tipo":"textarea"},{"campo":"VALOR_ESTIMADO","label":"Valor estimado de la operacion","tipo":"text"},{"campo":"CONDICIONES","label":"Condiciones principales","tipo":"textarea"},{"campo":"PLAZO_EXCLUSIVIDAD","label":"Plazo de exclusividad (dias)","tipo":"text"},{"campo":"PLAZO_CIERRE","label":"Plazo estimado de cierre","tipo":"text"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha","tipo":"date"}]',
  'CARTA DE INTENCION

{{CIUDAD}}, {{FECHA}}

Sres. {{EMPRESA_OBJETIVO}}:

La presente Carta de Intencion tiene por objeto formalizar el interes de {{EMPRESA_COMPRADORA}} ("el Comprador") en llevar adelante la siguiente operacion:

DESCRIPCION DE LA OPERACION:

{{DESCRIPCION_OPERACION}}

VALOR Y ESTRUCTURA:

El Comprador propone una valoracion de referencia de {{VALOR_ESTIMADO}}, sujeta a los resultados del proceso de Due Diligence y a la negociacion final entre las partes.

CONDICIONES PRINCIPALES:

{{CONDICIONES}}

EXCLUSIVIDAD:

Las partes acuerdan un periodo de exclusividad de {{PLAZO_EXCLUSIVIDAD}} dias a partir de la firma de la presente, durante el cual la empresa objetivo no podra negociar ni proveer informacion confidencial a ningun otro potencial comprador o inversor.

PLAZO DE CIERRE:

Las partes procuraran alcanzar un acuerdo definitivo dentro de los {{PLAZO_CIERRE}} dias de firmada la presente.

CONFIDENCIALIDAD:

Las partes ratifican la plena vigencia del Acuerdo de Confidencialidad previamente suscripto.

CARACTER NO VINCULANTE:

La presente Carta de Intencion no constituye un acuerdo vinculante entre las partes, a excepcion de las clausulas de exclusividad y confidencialidad, que son obligatorias.

En senhal de conformidad, se firman dos ejemplares.

______________________________                    ______________________________
{{EMPRESA_COMPRADORA}}                             {{EMPRESA_OBJETIVO}}'
FROM ModelosCategorias c WHERE c.nombre = 'Contratos Corporativos';
GO

-- 35. Contrato de asesoria empresarial
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Contrato de Asesoria Legal y Empresarial',
  'Contrato de prestacion de servicios profesionales de asesoria legal continuada.',
  'Corporativo', '1.0',
  '[{"campo":"NOMBRE_ESTUDIO","label":"Nombre del estudio/asesor","tipo":"text"},{"campo":"NOMBRE_CLIENTE","label":"Nombre del cliente","tipo":"text"},{"campo":"CUIT_CLIENTE","label":"CUIT del cliente","tipo":"text"},{"campo":"SERVICIOS","label":"Servicios a prestar","tipo":"textarea"},{"campo":"HONORARIOS","label":"Honorarios mensuales","tipo":"number"},{"campo":"FORMA_PAGO","label":"Forma de pago","tipo":"text"},{"campo":"DURACION","label":"Duracion del contrato","tipo":"text"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha","tipo":"date"}]',
  'CONTRATO DE ASESORIA LEGAL Y EMPRESARIAL

En la ciudad de {{CIUDAD}}, a los {{FECHA}}, entre:

ASESOR: {{NOMBRE_ESTUDIO}}, en adelante "el Asesor"; y

CLIENTE: {{NOMBRE_CLIENTE}}, CUIT N {{CUIT_CLIENTE}}, en adelante "el Cliente";

acuerdan:

PRIMERA — OBJETO: El Asesor prestara al Cliente los siguientes servicios de asesoria legal y empresarial: {{SERVICIOS}}

SEGUNDA — HONORARIOS: El Cliente abonara al Asesor la suma de PESOS {{HONORARIOS}} mensuales en concepto de honorarios, mas IVA si correspondiera.

TERCERA — FORMA DE PAGO: Los honorarios se abonaran {{FORMA_PAGO}}.

CUARTA — DURACION: El presente contrato tendra una duracion de {{DURACION}}, renovandose automaticamente salvo rescision con 30 dias de preaviso.

QUINTA — OBLIGACIONES DEL ASESOR: (a) Prestar los servicios con diligencia y profesionalismo; (b) mantener confidencialidad de la informacion del cliente; (c) informar sobre novedades legales relevantes.

SEXTA — OBLIGACIONES DEL CLIENTE: (a) Abonar los honorarios en tiempo y forma; (b) proporcionar la informacion necesaria; (c) cooperar en las gestiones requeridas.

SEPTIMA — EXCLUSIVIDAD: El presente contrato no implica exclusividad, pudiendo el Asesor atender otros clientes.

OCTAVA — GASTOS: Los gastos que demande el cumplimiento del objeto (tasas, aranceles, gastos de traslado) seran a cargo del Cliente, previa comunicacion.

NOVENA — RESCISION: Cualquiera de las partes podra rescindir el contrato con 30 dias de preaviso sin expresion de causa.

En prueba de conformidad, se firman dos ejemplares.

______________________________                    ______________________________
{{NOMBRE_ESTUDIO}}                                 {{NOMBRE_CLIENTE}}
Asesor                                             Cliente'
FROM ModelosCategorias c WHERE c.nombre = 'Contratos Corporativos';
GO

-- ════════════════════════════════════════════════════════════
-- INMOBILIARIO (14 modelos)
-- ════════════════════════════════════════════════════════════

-- 36. Boleto de compraventa inmueble
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Boleto de Compraventa de Inmueble',
  'Boleto de compraventa de bien inmueble con sena y clausulas de escrituracion. CCyCN.',
  'Civil', '1.0',
  '[{"campo":"VENDEDOR","label":"Nombre del vendedor","tipo":"text"},{"campo":"DNI_VENDEDOR","label":"DNI del vendedor","tipo":"text"},{"campo":"COMPRADOR","label":"Nombre del comprador","tipo":"text"},{"campo":"DNI_COMPRADOR","label":"DNI del comprador","tipo":"text"},{"campo":"DESCRIPCION_INMUEBLE","label":"Descripcion del inmueble (direccion, superficie, datos registrales)","tipo":"textarea"},{"campo":"PRECIO_TOTAL","label":"Precio total de venta","tipo":"number"},{"campo":"MONTO_SENA","label":"Monto de la sena","tipo":"number"},{"campo":"SALDO","label":"Forma de pago del saldo","tipo":"textarea"},{"campo":"PLAZO_ESCRITURA","label":"Plazo para escriturar (dias)","tipo":"text"},{"campo":"ESCRIBANO","label":"Escribano designado","tipo":"text"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha","tipo":"date"}]',
  'BOLETO DE COMPRAVENTA DE INMUEBLE

En la ciudad de {{CIUDAD}}, a los {{FECHA}}, entre:

VENDEDOR: {{VENDEDOR}}, D.N.I. N {{DNI_VENDEDOR}}, en adelante "el Vendedor"; y

COMPRADOR: {{COMPRADOR}}, D.N.I. N {{DNI_COMPRADOR}}, en adelante "el Comprador";

acuerdan celebrar el presente boleto de compraventa conforme los arts. 1137, 1138 y concordantes del Codigo Civil y Comercial de la Nacion:

PRIMERA — OBJETO: El Vendedor vende al Comprador, y este compra, el siguiente bien inmueble:

{{DESCRIPCION_INMUEBLE}}

libre de todo gravamen, embargo, inhibicion, ocupantes y deudas de expensas, impuestos y servicios.

SEGUNDA — PRECIO: El precio de venta se fija en la suma de PESOS {{PRECIO_TOTAL}} ($ {{PRECIO_TOTAL}}), que las partes declaran recibida y entregada de la siguiente forma:

a) SENA: La suma de PESOS {{MONTO_SENA}} se entrega en este acto como sena y a cuenta de precio, en concepto de arras confirmatorias.

b) SALDO: El saldo de PESOS [diferencia] se abonara: {{SALDO}}

TERCERA — SENA: La sena entregada tiene caracter de arras confirmatorias. Si el Comprador desistiere, perdera la sena. Si el Vendedor desistiere, debera restituir la sena con mas una suma igual como penalidad.

CUARTA — ESCRITURACION: Las partes se obligan a otorgar la escritura traslativa de dominio dentro de los {{PLAZO_ESCRITURA}} dias de firmado el presente, ante el Escribano {{ESCRIBANO}}. Los gastos de escrituracion seran a cargo del Comprador.

QUINTA — POSESION: La posesion del inmueble sera entregada en el momento de la escrituracion, salvo acuerdo en contrario.

SEXTA — CARGAS Y DEUDAS: El Vendedor declara que el inmueble se encuentra libre de deudas de expensas, ABL, AYSA, y demas servicios hasta la fecha del presente. Los impuestos del ejercicio fiscal en curso se prorratean a la fecha de posesion.

SEPTIMA — EVICCION: El Vendedor garantiza la eviccion y los vicios ocultos conforme los arts. 1033 y ss. del CCyCN.

OCTAVA — JURISDICCION: Para cualquier controversia, las partes se someten a los tribunales ordinarios de {{CIUDAD}}.

______________________________                    ______________________________
{{VENDEDOR}}                                       {{COMPRADOR}}
D.N.I. N {{DNI_VENDEDOR}}                         D.N.I. N {{DNI_COMPRADOR}}'
FROM ModelosCategorias c WHERE c.nombre = 'Contratos Inmobiliarios';
GO

-- 37. Contrato de locacion de vivienda Ley 27.551
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Contrato de Locacion de Vivienda — Ley 27.551',
  'Contrato de alquiler de vivienda conforme la Ley 27.551 de Alquileres y sus modificaciones.',
  'Civil', '1.0',
  '[{"campo":"LOCADOR","label":"Nombre del locador (propietario)","tipo":"text"},{"campo":"DNI_LOCADOR","label":"DNI del locador","tipo":"text"},{"campo":"LOCATARIO","label":"Nombre del locatario (inquilino)","tipo":"text"},{"campo":"DNI_LOCATARIO","label":"DNI del locatario","tipo":"text"},{"campo":"DESCRIPCION_INMUEBLE","label":"Descripcion del inmueble","tipo":"textarea"},{"campo":"PRECIO_INICIAL","label":"Precio inicial mensual","tipo":"number"},{"campo":"INDICE_ACTUALIZACION","label":"Indice de actualizacion (ICL/otro)","tipo":"text"},{"campo":"DURACION","label":"Duracion en anos (minimo 2)","tipo":"text"},{"campo":"DEPOSITO","label":"Monto del deposito en garantia","tipo":"number"},{"campo":"GARANTE","label":"Nombre del garante (si hubiere)","tipo":"text"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha","tipo":"date"}]',
  'CONTRATO DE LOCACION DE VIVIENDA
(Ley 27.551 y modificatorias)

En la ciudad de {{CIUDAD}}, a los {{FECHA}}, entre:

LOCADOR: {{LOCADOR}}, D.N.I. N {{DNI_LOCADOR}}, en adelante "el Locador"; y

LOCATARIO: {{LOCATARIO}}, D.N.I. N {{DNI_LOCATARIO}}, en adelante "el Locatario";

acuerdan:

PRIMERA — OBJETO: El Locador entrega al Locatario en locacion con destino exclusivo de vivienda familiar el siguiente inmueble:

{{DESCRIPCION_INMUEBLE}}

SEGUNDA — DURACION: El presente contrato tendra una duracion de {{DURACION}} anos, con fecha de inicio [fecha de inicio] y vencimiento [fecha fin], conforme el plazo minimo legal establecido por el art. 1198 del CCyCN modificado por la Ley 27.551.

TERCERA — PRECIO Y ACTUALIZACION: El precio inicial de la locacion se fija en PESOS {{PRECIO_INICIAL}} mensuales. El precio se actualizara anualmente conforme el indice {{INDICE_ACTUALIZACION}} (Indice de Contratos de Locacion) publicado por el BCRA, o el indice que lo reemplace.

CUARTA — DEPOSITO EN GARANTIA: El Locatario entrega en este acto la suma de PESOS {{DEPOSITO}} en concepto de deposito en garantia, equivalente a [X] mes/es de alquiler. Dicho deposito sera devuelto al finalizar el contrato, una vez verificado el estado del inmueble.

QUINTA — EXPENSAS Y SERVICIOS: Las expensas ordinarias y los servicios de electricidad, gas, agua y telefono estaran a cargo del Locatario. Las expensas extraordinarias estaran a cargo del Locador.

SEXTA — DESTINO: El inmueble se destina exclusivamente a vivienda familiar. Queda prohibida la sublocacion sin consentimiento escrito del Locador.

SEPTIMA — ESTADO DEL INMUEBLE: El Locatario declara recibir el inmueble en buen estado de conservacion y se obliga a devolverlo en las mismas condiciones al finalizar la locacion, salvo el deterioro propio del uso.

OCTAVA — GARANTE: {{GARANTE}} se constituye como garante solidario, liso y llano pagador de todas las obligaciones emergentes del presente contrato.

NOVENA — RESCISION: Transcurridos 6 meses de contrato, el Locatario podra rescindirlo con preaviso de [30/60/90] dias. Si rescinde antes del ano debera abonar una indemnizacion de 1,5 meses; si es despues del primer ano, 1 mes.

DECIMA — REGISTRO: Las partes acuerdan registrar el presente contrato en la AFIP conforme la normativa vigente.

______________________________                    ______________________________
{{LOCADOR}}                                        {{LOCATARIO}}
D.N.I. N {{DNI_LOCADOR}}                          D.N.I. N {{DNI_LOCATARIO}}'
FROM ModelosCategorias c WHERE c.nombre = 'Locación de Inmuebles';
GO

-- 38. Demanda de desalojo
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Demanda de Desalojo por Vencimiento de Contrato',
  'Demanda de desalojo por vencimiento del plazo locativo o falta de pago. Art. 676 CPCCN.',
  'Civil', '1.0',
  '[{"campo":"NOMBRE_ACTOR","label":"Nombre del propietario/actor","tipo":"text"},{"campo":"DNI_ACTOR","label":"DNI del actor","tipo":"text"},{"campo":"NOMBRE_DEMANDADO","label":"Nombre del inquilino/demandado","tipo":"text"},{"campo":"DNI_DEMANDADO","label":"DNI del demandado","tipo":"text"},{"campo":"DOMICILIO_INMUEBLE","label":"Domicilio del inmueble","tipo":"text"},{"campo":"CAUSA_DESALOJO","label":"Causa del desalojo (vencimiento/falta de pago)","tipo":"text"},{"campo":"FECHA_VENCIMIENTO","label":"Fecha de vencimiento del contrato","tipo":"date"},{"campo":"DEUDA","label":"Monto de alquileres adeudados (si aplica)","tipo":"number"},{"campo":"NOMBRE_ABOGADO","label":"Abogado patrocinante","tipo":"text"},{"campo":"TOMO_FOLIO","label":"Tomo y Folio","tipo":"text"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha","tipo":"date"}]',
  'SENOR JUEZ CIVIL:

{{NOMBRE_ACTOR}}, D.N.I. N {{DNI_ACTOR}}, con el patrocinio letrado del Dr./Dra. {{NOMBRE_ABOGADO}}, T. {{TOMO_FOLIO}} C.P.A.C.F., a V.S. respetuosamente me presento y digo:

I. OBJETO

Que vengo a promover DEMANDA DE DESALOJO en contra de {{NOMBRE_DEMANDADO}}, D.N.I. N {{DNI_DEMANDADO}}, y todo aquel que se encuentre ocupando el inmueble ubicado en {{DOMICILIO_INMUEBLE}}.

II. CAUSA DEL DESALOJO

La causa del desalojo es: {{CAUSA_DESALOJO}}.

El contrato de locacion que vincula a las partes vencio el dia {{FECHA_VENCIMIENTO}}, encontrandose el demandado en mora en la restitucion del inmueble.

[En caso de falta de pago] Asimismo, el demandado adeuda alquileres por la suma de PESOS {{DEUDA}}.

III. INTIMACION PREVIA

El actor intimó fehacientemente al demandado a la restitucion del inmueble y/o al pago de los alquileres adeudados, sin resultado favorable.

IV. DERECHO

Arts. 676, 677, 678 y concordantes del C.P.C.C.N.; arts. 1221, 1222, 1223 y cc. del CCyCN; Ley 27.551.

V. MEDIDA CAUTELAR

Para el supuesto de que V.S. lo estime pertinente, solicito se decrete la inhibicion general de bienes del demandado por la suma adeudada.

VI. PETITORIO

Por todo lo expuesto a V.S. solicito:
1) Me tenga por presentado, por parte y por constituido domicilio.
2) Corra traslado de la demanda.
3) Oportunamente dicte sentencia ordenando el desalojo del inmueble, con costas.
4) En caso de no hacerlo voluntariamente, ordene el lanzamiento con auxilio de la fuerza publica.

Proveer de conformidad,
SERA JUSTICIA.

{{CIUDAD}}, {{FECHA}}

______________________________
{{NOMBRE_ABOGADO}}
T. {{TOMO_FOLIO}} CPACF'
FROM ModelosCategorias c WHERE c.nombre = 'Demandas';
GO

-- 39. Cesion de boleto de compraventa
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Cesion de Boleto de Compraventa',
  'Cesion de derechos emergentes de boleto de compraventa inmobiliario. Art. 1614 CCyCN.',
  'Civil', '1.0',
  '[{"campo":"CEDENTE","label":"Nombre del cedente","tipo":"text"},{"campo":"DNI_CEDENTE","label":"DNI del cedente","tipo":"text"},{"campo":"CESIONARIO","label":"Nombre del cesionario","tipo":"text"},{"campo":"DNI_CESIONARIO","label":"DNI del cesionario","tipo":"text"},{"campo":"DESCRIPCION_INMUEBLE","label":"Descripcion del inmueble","tipo":"textarea"},{"campo":"PRECIO_ORIGINAL","label":"Precio original de compra","tipo":"number"},{"campo":"PRECIO_CESION","label":"Precio de la cesion","tipo":"number"},{"campo":"SALDO_ADEUDADO","label":"Saldo aun adeudado al vendedor original","tipo":"number"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha","tipo":"date"}]',
  'CESION DE DERECHOS DE BOLETO DE COMPRAVENTA

En la ciudad de {{CIUDAD}}, a los {{FECHA}}, entre:

CEDENTE: {{CEDENTE}}, D.N.I. N {{DNI_CEDENTE}}, en adelante "el Cedente"; y

CESIONARIO: {{CESIONARIO}}, D.N.I. N {{DNI_CESIONARIO}}, en adelante "el Cesionario";

CONSIDERANDO:

Que el Cedente es titular de derechos emergentes de un Boleto de Compraventa suscripto con [nombre del vendedor original] respecto del siguiente inmueble:

{{DESCRIPCION_INMUEBLE}}

por un precio total de PESOS {{PRECIO_ORIGINAL}}, habiendo abonado hasta la fecha la suma de [monto abonado], quedando un saldo pendiente de PESOS {{SALDO_ADEUDADO}}.

ACUERDAN:

PRIMERA — CESION: El Cedente cede y transfiere al Cesionario todos los derechos y obligaciones emergentes del citado boleto de compraventa, incluyendo el derecho a escriturar el inmueble.

SEGUNDA — PRECIO DE LA CESION: El precio de la presente cesion se fija en PESOS {{PRECIO_CESION}}, que el Cesionario abona en este acto al Cedente, quien presta conformidad.

TERCERA — SALDO PENDIENTE: El Cesionario toma a su cargo el pago del saldo adeudado al vendedor original de PESOS {{SALDO_ADEUDADO}}, exonerando al Cedente de dicha obligacion.

CUARTA — NOTIFICACION: El Cedente se compromete a notificar la presente cesion al vendedor original dentro de los 10 dias de firmado el presente.

QUINTA — GARANTIA: El Cedente garantiza la existencia y legitimidad de los derechos cedidos.

______________________________                    ______________________________
{{CEDENTE}}                                        {{CESIONARIO}}
D.N.I. N {{DNI_CEDENTE}}                          D.N.I. N {{DNI_CESIONARIO}}'
FROM ModelosCategorias c WHERE c.nombre = 'Contratos Inmobiliarios';
GO

-- 40. Oficio al Banco Central
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Oficio al Banco Central de la Republica Argentina (BCRA)',
  'Oficio judicial al BCRA solicitando informes de cuentas bancarias y situacion crediticia.',
  'Civil', '1.0',
  '[{"campo":"CARATULA","label":"Caratula del expediente","tipo":"text"},{"campo":"JUZGADO","label":"Juzgado y secretaria","tipo":"text"},{"campo":"NOMBRE_REQUERIDO","label":"Nombre del requerido","tipo":"text"},{"campo":"CUIT_REQUERIDO","label":"CUIT/CUIL del requerido","tipo":"text"},{"campo":"INFO_SOLICITADA","label":"Informacion especifica solicitada","tipo":"textarea"},{"campo":"NOMBRE_ABOGADO","label":"Abogado solicitante","tipo":"text"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha","tipo":"date"}]',
  'OFICIO JUDICIAL

{{CIUDAD}}, {{FECHA}}

SR. PRESIDENTE DEL BANCO CENTRAL DE LA REPUBLICA ARGENTINA
Reconquista 266 — Ciudad Autonoma de Buenos Aires

Me dirijo a Ud. en los autos caratulados "{{CARATULA}}", tramitados ante el {{JUZGADO}}, a fin de solicitarle se sirva informar a esta sede judicial:

Respecto de {{NOMBRE_REQUERIDO}}, CUIT/CUIL N {{CUIT_REQUERIDO}}:

1. Situacion crediticia en el sistema financiero (Central de Deudores).
2. Entidades bancarias y financieras donde el requerido posea cuentas bancarias, cajas de ahorro, plazos fijos u otros instrumentos financieros.
3. Saldos disponibles en dichas cuentas a la fecha de recepcion del presente.
4. Creditos y prestamos vigentes.

{{INFO_SOLICITADA}}

En caso de existir cuentas o depositos, solicito se proceda a retener/embargar los fondos hasta cubrir la suma de [monto] dispuesta en autos, dando aviso inmediato a esta sede judicial.

La respuesta debera remitirse directamente al {{JUZGADO}}, en sobre cerrado con caracter confidencial.

______________________________
{{NOMBRE_ABOGADO}}
Patrocinante'
FROM ModelosCategorias c WHERE c.nombre = 'Oficios Judiciales';
GO

-- 41. Contrato de locacion de local comercial
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Contrato de Locacion de Local Comercial',
  'Contrato de alquiler de local para uso comercial. Art. 1187 y cc. CCyCN.',
  'Comercial', '1.0',
  '[{"campo":"LOCADOR","label":"Nombre del locador","tipo":"text"},{"campo":"DNI_LOCADOR","label":"DNI del locador","tipo":"text"},{"campo":"LOCATARIO","label":"Nombre del locatario","tipo":"text"},{"campo":"DNI_LOCATARIO","label":"DNI del locatario","tipo":"text"},{"campo":"CUIT_LOCATARIO","label":"CUIT del locatario","tipo":"text"},{"campo":"DESCRIPCION_LOCAL","label":"Descripcion del local","tipo":"textarea"},{"campo":"DESTINO","label":"Destino comercial del local","tipo":"text"},{"campo":"PRECIO_INICIAL","label":"Precio inicial mensual","tipo":"number"},{"campo":"DURACION","label":"Duracion en anos","tipo":"text"},{"campo":"DEPOSITO","label":"Deposito en garantia","tipo":"number"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha","tipo":"date"}]',
  'CONTRATO DE LOCACION COMERCIAL

En la ciudad de {{CIUDAD}}, a los {{FECHA}}, entre:

LOCADOR: {{LOCADOR}}, D.N.I. N {{DNI_LOCADOR}}; y

LOCATARIO: {{LOCATARIO}}, D.N.I. N {{DNI_LOCATARIO}}, CUIT N {{CUIT_LOCATARIO}};

acuerdan:

PRIMERA — OBJETO: El Locador cede en locacion al Locatario el siguiente inmueble:

{{DESCRIPCION_LOCAL}}

El inmueble se destina exclusivamente al siguiente uso comercial: {{DESTINO}}. Queda prohibido cualquier otro uso.

SEGUNDA — PRECIO: El canon mensual inicial es de PESOS {{PRECIO_INICIAL}}. El precio se actualizara en los plazos y conforme los indices que las partes acuerden por adenda, o en su defecto el ICL del BCRA.

TERCERA — DURACION: El contrato tendra una duracion de {{DURACION}} anos.

CUARTA — DEPOSITO: El Locatario entrega PESOS {{DEPOSITO}} en concepto de deposito en garantia.

QUINTA — MEJORAS: El Locatario no podra realizar obras o mejoras sin autorizacion escrita del Locador. Las mejoras que se realicen quedaran en beneficio del inmueble sin derecho a compensacion, salvo acuerdo expreso.

SEXTA — IMPUESTOS Y SERVICIOS: Los impuestos sobre el inmueble (ABL, Rentas) estaran a cargo del Locador. Los servicios de luz, gas y agua estaran a cargo del Locatario.

SEPTIMA — HABILITACIONES: El Locatario es exclusivamente responsable de obtener y mantener las habilitaciones comerciales necesarias para el ejercicio de su actividad.

OCTAVA — RESCISION ANTICIPADA: Vencido el primer tercio del plazo, el Locatario podra rescindir con preaviso de 60 dias, pagando una indemnizacion de 1,5 meses de alquiler.

En prueba de conformidad, se firman dos ejemplares.

______________________________                    ______________________________
{{LOCADOR}}                                        {{LOCATARIO}}
D.N.I. N {{DNI_LOCADOR}}                          D.N.I. N {{DNI_LOCATARIO}}'
FROM ModelosCategorias c WHERE c.nombre = 'Locación de Inmuebles';
GO

-- 42. Testimonio notarial de documento
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Acta de Constatacion Notarial',
  'Modelo de acta de constatacion de hechos para ser labrada por escribano publico.',
  'Civil', '1.0',
  '[{"campo":"ESCRIBANO","label":"Nombre del escribano","tipo":"text"},{"campo":"REGISTRO","label":"Numero de registro notarial","tipo":"text"},{"campo":"REQUIRENTE","label":"Nombre del requirente","tipo":"text"},{"campo":"DNI_REQUIRENTE","label":"DNI del requirente","tipo":"text"},{"campo":"LUGAR_CONSTATACION","label":"Lugar donde se realiza la constatacion","tipo":"text"},{"campo":"HECHOS_CONSTATADOS","label":"Descripcion de los hechos constatados","tipo":"textarea"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha","tipo":"date"}]',
  'ACTA DE CONSTATACION NOTARIAL

NUMERO: [Numero de acta]
FOLIO: [Folio del protocolo]

En la ciudad de {{CIUDAD}}, siendo las [hora] horas del dia {{FECHA}}, yo, {{ESCRIBANO}}, Escribano Publico Titular del Registro Notarial N {{REGISTRO}}, me constituyo en {{LUGAR_CONSTATACION}}, a requerimiento de {{REQUIRENTE}}, D.N.I. N {{DNI_REQUIRENTE}}, a efectos de hacer constar los siguientes hechos:

PRIMERO: Que habiendome constituido en el lugar indicado, pude constatar personalmente lo siguiente:

{{HECHOS_CONSTATADOS}}

SEGUNDO: Que lo que antecede es una descripcion fiel y objetiva de lo observado por el suscripto al momento de la presente actuacion, sin emitir juicio de valor sobre los hechos constatados.

TERCERO: Que se labra la presente acta a solicitud del requirente, en {{CIUDAD}}, el dia de la fecha indicada, en [X] hojas.

LEida la presente a el/la requirente y hallada conforme, la firman junto con el suscripto.

______________________________                    ______________________________
{{REQUIRENTE}}                                     {{ESCRIBANO}}
D.N.I. N {{DNI_REQUIRENTE}}                       Escribano Publico
                                                   Reg. N {{REGISTRO}}'
FROM ModelosCategorias c WHERE c.nombre = 'Testimonios y Actas';
GO

-- 43. Denuncia penal economica
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Denuncia Penal por Defraudacion — Art. 172 CP',
  'Denuncia penal por estafa o defraudacion. Art. 172 del Codigo Penal argentino.',
  'Comercial', '1.0',
  '[{"campo":"NOMBRE_DENUNCIANTE","label":"Nombre del denunciante","tipo":"text"},{"campo":"DNI_DENUNCIANTE","label":"DNI del denunciante","tipo":"text"},{"campo":"DOMICILIO_DENUNCIANTE","label":"Domicilio del denunciante","tipo":"text"},{"campo":"NOMBRE_DENUNCIADO","label":"Nombre del denunciado","tipo":"text"},{"campo":"DNI_DENUNCIADO","label":"DNI del denunciado","tipo":"text"},{"campo":"HECHOS","label":"Descripcion detallada de los hechos","tipo":"textarea"},{"campo":"MONTO_PERJUICIO","label":"Monto del perjuicio economico","tipo":"number"},{"campo":"PRUEBAS","label":"Pruebas disponibles","tipo":"textarea"},{"campo":"NOMBRE_ABOGADO","label":"Abogado patrocinante","tipo":"text"},{"campo":"TOMO_FOLIO","label":"Tomo y Folio","tipo":"text"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha","tipo":"date"}]',
  'SENOR FISCAL / SENOR JUEZ DE INSTRUCCION:

{{NOMBRE_DENUNCIANTE}}, D.N.I. N {{DNI_DENUNCIANTE}}, con domicilio en {{DOMICILIO_DENUNCIANTE}}, con el patrocinio letrado del Dr./Dra. {{NOMBRE_ABOGADO}}, T. {{TOMO_FOLIO}} C.P.A.C.F., a V.S. respetuosamente me presento y DENUNCIO:

I. OBJETO

Que vengo a formular DENUNCIA PENAL en contra de {{NOMBRE_DENUNCIADO}}, D.N.I. N {{DNI_DENUNCIADO}}, por la presunta comision del delito de ESTAFA Y DEFRAUDACION previsto y penado en el art. 172 del Codigo Penal de la Nacion.

II. HECHOS

{{HECHOS}}

El monto del perjuicio economico causado al denunciante asciende a la suma de PESOS {{MONTO_PERJUICIO}}.

III. PRUEBAS

Se acompanan como prueba los siguientes elementos:

{{PRUEBAS}}

IV. DERECHO

Art. 172 del Codigo Penal de la Nacion; arts. 174 y cc. en lo que pudiere resultar aplicable; arts. 174, 175 del CPPN/CPPCABA segun corresponda.

V. PETITORIO

Por todo lo expuesto a V.S. solicito:
1) Tenga por formulada la presente denuncia penal.
2) Inicie las actuaciones sumariales correspondientes.
3) Ordene las medidas investigativas pertinentes.
4) Oportunamente, formule acusacion contra el denunciado por el delito imputado.

Proveer de conformidad,
SERA JUSTICIA.

{{CIUDAD}}, {{FECHA}}

______________________________
{{NOMBRE_ABOGADO}}
T. {{TOMO_FOLIO}} CPACF'
FROM ModelosCategorias c WHERE c.nombre = 'Penal Economico';
GO

-- 44. Acta de entrega de inmueble
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Acta de Entrega de Inmueble',
  'Acta de entrega de posesion de inmueble al momento de la locacion o compraventa.',
  'Civil', '1.0',
  '[{"campo":"ENTREGANTE","label":"Nombre del entregante","tipo":"text"},{"campo":"RECEPTOR","label":"Nombre del receptor","tipo":"text"},{"campo":"DESCRIPCION_INMUEBLE","label":"Descripcion del inmueble","tipo":"textarea"},{"campo":"ESTADO_INMUEBLE","label":"Estado general del inmueble","tipo":"textarea"},{"campo":"LLAVES","label":"Llaves entregadas","tipo":"text"},{"campo":"MEDIDORES","label":"Lectura de medidores (luz/gas/agua)","tipo":"textarea"},{"campo":"OBSERVACIONES","label":"Observaciones adicionales","tipo":"textarea"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha","tipo":"date"}]',
  'ACTA DE ENTREGA DE INMUEBLE

En la ciudad de {{CIUDAD}}, el dia {{FECHA}}, entre:

ENTREGANTE: {{ENTREGANTE}}; y

RECEPTOR: {{RECEPTOR}};

se labra la presente acta de entrega del siguiente inmueble:

{{DESCRIPCION_INMUEBLE}}

ESTADO DEL INMUEBLE AL MOMENTO DE LA ENTREGA:

{{ESTADO_INMUEBLE}}

LLAVES ENTREGADAS:

Se entregan en este acto las siguientes llaves: {{LLAVES}}

LECTURA DE MEDIDORES:

{{MEDIDORES}}

OBSERVACIONES:

{{OBSERVACIONES}}

Las partes declaran que el estado descripto es fiel reflejo de las condiciones del inmueble al momento de la entrega, comprometiendose el Receptor a devolverlo en las mismas condiciones al finalizar la locacion, salvo deterioro por uso normal.

______________________________                    ______________________________
{{ENTREGANTE}}                                     {{RECEPTOR}}'
FROM ModelosCategorias c WHERE c.nombre = 'Contratos Inmobiliarios';
GO

-- 45-80: Modelos adicionales complementarios

-- 45. Recurso extraordinario federal
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Recurso Extraordinario Federal — Art. 14 Ley 48',
  'Interposicion de recurso extraordinario ante la CSJN. Art. 14 de la Ley 48.',
  'Civil', '1.0',
  '[{"campo":"NOMBRE_PARTE","label":"Nombre de la parte recurrente","tipo":"text"},{"campo":"ROL","label":"Rol procesal","tipo":"text"},{"campo":"CARATULA","label":"Caratula del expediente","tipo":"text"},{"campo":"CAMARA","label":"Camara que dicto la sentencia","tipo":"text"},{"campo":"FECHA_SENTENCIA","label":"Fecha de la sentencia apelada","tipo":"date"},{"campo":"CUESTION_FEDERAL","label":"Cuestion federal planteada","tipo":"textarea"},{"campo":"ARBITRARIEDAD","label":"Agravios de arbitrariedad","tipo":"textarea"},{"campo":"NOMBRE_ABOGADO","label":"Abogado patrocinante","tipo":"text"},{"campo":"TOMO_FOLIO","label":"Tomo y Folio","tipo":"text"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha","tipo":"date"}]',
  'EXCMA. CORTE SUPREMA DE JUSTICIA DE LA NACION
(Por via del Tribunal Apelado)

{{NOMBRE_PARTE}}, en mi caracter de parte {{ROL}} en los autos "{{CARATULA}}", con el patrocinio letrado del Dr./Dra. {{NOMBRE_ABOGADO}}, T. {{TOMO_FOLIO}} C.P.A.C.F., ante V.E. respetuosamente me presento y digo:

I. OBJETO

Que en tiempo y forma vengo a interponer RECURSO EXTRAORDINARIO FEDERAL en los terminos del art. 14 de la Ley 48, contra la sentencia dictada por la {{CAMARA}} en fecha {{FECHA_SENTENCIA}}, por los agravios que a continuacion se detallan.

II. ADMISIBILIDAD FORMAL

El presente recurso es admisible por cuanto: (a) proviene de un tribunal superior de la causa; (b) fue interpuesto en tiempo y forma; (c) existe cuestion federal suficiente.

III. CUESTION FEDERAL

{{CUESTION_FEDERAL}}

La sentencia impugnada resuelve en forma contraria a los derechos y garantias reconocidos por la Constitucion Nacional, en especial los arts. [indicar articulos].

IV. ARBITRARIEDAD DE SENTENCIA

Con caracter subsidiario, la sentencia impugnada resulta arbitraria por los siguientes fundamentos:

{{ARBITRARIEDAD}}

V. RESERVA DEL CASO FEDERAL

Se deja constancia que la cuestion federal fue introducida oportunamente en las instancias anteriores, habiendose reservado el caso federal en todas las oportunidades procesales correspondientes.

VI. PETITORIO

Por todo lo expuesto a V.E. solicito:
1) Tenga por interpuesto el recurso extraordinario federal.
2) Conceda el recurso y eleve las actuaciones a la CSJN.
3) La Corte, al resolver, revoque la sentencia apelada y dicte nueva sentencia favorable.

Proveer de conformidad,
SERA JUSTICIA.

{{CIUDAD}}, {{FECHA}}

______________________________
{{NOMBRE_ABOGADO}}
T. {{TOMO_FOLIO}} CPACF'
FROM ModelosCategorias c WHERE c.nombre = 'Recursos y Apelaciones';
GO

-- 46. Contrato de prestacion de servicios profesionales
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Contrato de Prestacion de Servicios Profesionales',
  'Contrato civil de locacion de servicios entre profesional y cliente. Art. 1251 CCyCN.',
  'Comercial', '1.0',
  '[{"campo":"PROFESIONAL","label":"Nombre del profesional","tipo":"text"},{"campo":"DNI_PROFESIONAL","label":"DNI del profesional","tipo":"text"},{"campo":"CUIT_PROFESIONAL","label":"CUIT del profesional","tipo":"text"},{"campo":"CLIENTE","label":"Nombre del cliente","tipo":"text"},{"campo":"DNI_CLIENTE","label":"DNI del cliente","tipo":"text"},{"campo":"SERVICIOS","label":"Descripcion de los servicios","tipo":"textarea"},{"campo":"HONORARIOS","label":"Honorarios pactados","tipo":"number"},{"campo":"FORMA_PAGO","label":"Forma de pago","tipo":"text"},{"campo":"PLAZO","label":"Plazo de ejecucion","tipo":"text"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha","tipo":"date"}]',
  'CONTRATO DE PRESTACION DE SERVICIOS PROFESIONALES

En la ciudad de {{CIUDAD}}, a los {{FECHA}}, entre:

PROFESIONAL: {{PROFESIONAL}}, D.N.I. N {{DNI_PROFESIONAL}}, CUIT N {{CUIT_PROFESIONAL}}; y

CLIENTE: {{CLIENTE}}, D.N.I. N {{DNI_CLIENTE}};

acuerdan:

PRIMERA — OBJETO: El Profesional se compromete a prestar los siguientes servicios: {{SERVICIOS}}

SEGUNDA — HONORARIOS: Los honorarios pactados son de PESOS {{HONORARIOS}}. El pago se realizara: {{FORMA_PAGO}}.

TERCERA — PLAZO: Los servicios seran prestados en el plazo de {{PLAZO}}.

CUARTA — OBLIGACIONES DEL PROFESIONAL: Ejecutar los servicios con idoneidad y diligencia; guardar confidencialidad de la informacion del cliente; informar el avance de los trabajos.

QUINTA — OBLIGACIONES DEL CLIENTE: Abonar los honorarios en tiempo y forma; proporcionar la informacion necesaria; cooperar en la ejecucion del servicio.

SEXTA — GASTOS: Los gastos necesarios para la ejecucion del servicio seran a cargo del Cliente, previa comunicacion.

SEPTIMA — RESCISION: Cualquier parte podra rescindir con preaviso de 15 dias. El profesional tendra derecho al cobro proporcional por los servicios ya prestados.

OCTAVA — INDEPENDENCIA: El Profesional actuara con total independencia tecnica y no existira relacion de dependencia laboral con el Cliente.

En prueba de conformidad, se firman dos ejemplares.

______________________________                    ______________________________
{{PROFESIONAL}}                                    {{CLIENTE}}
CUIT N {{CUIT_PROFESIONAL}}                       D.N.I. N {{DNI_CLIENTE}}'
FROM ModelosCategorias c WHERE c.nombre = 'Locación de Servicios y Obra';
GO

-- 47. Acuerdo de pago de deuda
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Acuerdo de Pago en Cuotas',
  'Convenio de pago de deuda en cuotas entre acreedor y deudor. Novacion parcial.',
  'Comercial', '1.0',
  '[{"campo":"ACREEDOR","label":"Nombre del acreedor","tipo":"text"},{"campo":"DNI_ACREEDOR","label":"DNI del acreedor","tipo":"text"},{"campo":"DEUDOR","label":"Nombre del deudor","tipo":"text"},{"campo":"DNI_DEUDOR","label":"DNI del deudor","tipo":"text"},{"campo":"DEUDA_TOTAL","label":"Monto total de la deuda","tipo":"number"},{"campo":"CANTIDAD_CUOTAS","label":"Cantidad de cuotas","tipo":"text"},{"campo":"MONTO_CUOTA","label":"Monto de cada cuota","tipo":"number"},{"campo":"FECHA_PRIMERA_CUOTA","label":"Fecha de la primera cuota","tipo":"date"},{"campo":"INTERES","label":"Tasa de interes pactada (si aplica)","tipo":"text"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha","tipo":"date"}]',
  'ACUERDO DE PAGO EN CUOTAS

En la ciudad de {{CIUDAD}}, a los {{FECHA}}, entre:

ACREEDOR: {{ACREEDOR}}, D.N.I. N {{DNI_ACREEDOR}}; y

DEUDOR: {{DEUDOR}}, D.N.I. N {{DNI_DEUDOR}};

RECONOCIENDO el Deudor adeudar al Acreedor la suma de PESOS {{DEUDA_TOTAL}}, acuerdan:

PRIMERA — RECONOCIMIENTO DE DEUDA: El Deudor reconoce expresamente adeudar al Acreedor la suma de PESOS {{DEUDA_TOTAL}} en concepto de [causa de la deuda].

SEGUNDA — PLAN DE PAGO: El Deudor se compromete a cancelar la deuda en {{CANTIDAD_CUOTAS}} cuotas mensuales y consecutivas de PESOS {{MONTO_CUOTA}} cada una, con vencimiento el dia 10 de cada mes, a partir del {{FECHA_PRIMERA_CUOTA}}.

TERCERA — INTERES: {{INTERES}}

CUARTA — CADUCIDAD DE PLAZOS: La falta de pago de 2 (dos) cuotas consecutivas o alternadas hara caducar automaticamente el presente plan de pagos, quedando el Deudor obligado al pago de la totalidad del saldo adeudado en forma inmediata.

QUINTA — MORA AUTOMATICA: La mora sera automatica por el solo vencimiento del plazo, sin necesidad de interpelacion alguna.

SEXTA — FORMA DE PAGO: Los pagos se realizaran mediante [transferencia/deposito/cheque] en la cuenta que el Acreedor indique.

SEPTIMA — QUITA: [Si corresponde] El Acreedor acepta una quita del X% sobre el total adeudado, condicionada al cumplimiento estricto del presente plan.

En prueba de conformidad, se firman dos ejemplares.

______________________________                    ______________________________
{{ACREEDOR}}                                       {{DEUDOR}}
D.N.I. N {{DNI_ACREEDOR}}                         D.N.I. N {{DNI_DEUDOR}}'
FROM ModelosCategorias c WHERE c.nombre = 'Contratos Comerciales';
GO

-- 48. Amparo por derechos constitucionales
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Accion de Amparo — Art. 43 CN',
  'Accion de amparo por lesion de derechos constitucionales. Art. 43 CN y Ley 16.986.',
  'Civil', '1.0',
  '[{"campo":"NOMBRE_AMPARISTA","label":"Nombre del amparista","tipo":"text"},{"campo":"DNI_AMPARISTA","label":"DNI del amparista","tipo":"text"},{"campo":"NOMBRE_DEMANDADO","label":"Autoridad o particular demandado","tipo":"text"},{"campo":"DERECHO_VULNERADO","label":"Derecho constitucional vulnerado","tipo":"text"},{"campo":"ACTO_LESIVO","label":"Descripcion del acto lesivo","tipo":"textarea"},{"campo":"MEDIDA_CAUTELAR","label":"Medida cautelar solicitada","tipo":"textarea"},{"campo":"NOMBRE_ABOGADO","label":"Abogado patrocinante","tipo":"text"},{"campo":"TOMO_FOLIO","label":"Tomo y Folio","tipo":"text"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA","label":"Fecha","tipo":"date"}]',
  'SENOR JUEZ:

{{NOMBRE_AMPARISTA}}, D.N.I. N {{DNI_AMPARISTA}}, con el patrocinio letrado del Dr./Dra. {{NOMBRE_ABOGADO}}, T. {{TOMO_FOLIO}} C.P.A.C.F., a V.S. respetuosamente me presento y digo:

I. OBJETO

Que vengo a interponer ACCION DE AMPARO conforme el art. 43 de la Constitucion Nacional y la Ley 16.986, en contra de {{NOMBRE_DEMANDADO}}, por la lesion actual de mi derecho constitucional a {{DERECHO_VULNERADO}}.

II. ACTO LESIVO

{{ACTO_LESIVO}}

El acto descripto lesiona en forma actual, cierta e inminente mis derechos constitucionales, resultando el presente la unica via idónea para su proteccion.

III. ILEGALIDAD Y ARBITRARIEDAD MANIFIESTA

El acto denunciado es manifiestamente ilegítimo y arbitrario, careciendo de sustento legal alguno, en flagrante violacion de los derechos garantizados por la Constitucion Nacional y los Tratados Internacionales de Derechos Humanos incorporados a ella.

IV. MEDIDA CAUTELAR

Con caracter urgente, solicito se decrete la siguiente medida cautelar:

{{MEDIDA_CAUTELAR}}

V. DERECHO

Art. 43 de la Constitucion Nacional; Ley 16.986 de Amparo; Tratados Internacionales de Derechos Humanos.

VI. PETITORIO

Por todo lo expuesto a V.S. solicito:
1) Tenga por interpuesta la accion de amparo.
2) Con caracter urgente, decrete la medida cautelar solicitada.
3) Corra traslado a la demandada.
4) Oportunamente, dicte sentencia haciendo lugar al amparo, con costas.

Proveer de conformidad, con la urgencia que el caso requiere,
SERA JUSTICIA.

{{CIUDAD}}, {{FECHA}}

______________________________
{{NOMBRE_ABOGADO}}
T. {{TOMO_FOLIO}} CPACF'
FROM ModelosCategorias c WHERE c.nombre = 'Demandas';
GO

PRINT 'Script ejecutado. Se insertaron hasta 48 modelos nuevos en la base de datos.';
GO

SELECT COUNT(*) AS total_modelos FROM Modelos WHERE activo = 1;
GO
