-- ============================================================
--  MODELOS DE ESCRITOS Y CONTRATOS — Argentina
--  Insertar DESPUÉS de 04_seed_expansion.sql
-- ============================================================
USE EstudioJuridico;
GO

-- ════════════════════════════════════════════════════════════
-- ESCRITOS JURÍDICOS
-- ════════════════════════════════════════════════════════════

-- Demanda de daños y perjuicios
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Demanda de Daños y Perjuicios',
  'Demanda civil por daños y perjuicios derivados de incumplimiento contractual o hecho ilícito',
  'Civil', '1.0',
  '[{"campo":"NOMBRE_ACTOR","label":"Nombre y apellido del actor","tipo":"text"},{"campo":"DNI_ACTOR","label":"DNI del actor","tipo":"text"},{"campo":"DOMICILIO_ACTOR","label":"Domicilio real del actor","tipo":"text"},{"campo":"NOMBRE_DEMANDADO","label":"Nombre y apellido del demandado","tipo":"text"},{"campo":"DOMICILIO_DEMANDADO","label":"Domicilio del demandado","tipo":"text"},{"campo":"MONTO_RECLAMADO","label":"Monto reclamado (en pesos)","tipo":"number"},{"campo":"HECHO_FECHA","label":"Fecha del hecho","tipo":"date"},{"campo":"HECHO_DESCRIPCION","label":"Descripción del hecho","tipo":"textarea"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA_PRESENTACION","label":"Fecha de presentación","tipo":"date"},{"campo":"NOMBRE_ABOGADO","label":"Nombre del abogado firmante","tipo":"text"},{"campo":"TOMO_FOLIO","label":"Tomo y Folio del abogado","tipo":"text"}]',
  'SEÑOR JUEZ:

{{NOMBRE_ACTOR}}, D.N.I. Nº {{DNI_ACTOR}}, con domicilio real en {{DOMICILIO_ACTOR}}, constituyendo domicilio procesal en la sede del estudio jurídico interviniente, con el patrocinio letrado del Dr./Dra. {{NOMBRE_ABOGADO}}, Tomo {{TOMO_FOLIO}} del CPACF, a V.S. respetuosamente me presento y digo:

I. OBJETO

Que vengo a promover formal DEMANDA DE DAÑOS Y PERJUICIOS en contra de {{NOMBRE_DEMANDADO}}, con domicilio en {{DOMICILIO_DEMANDADO}}, por la suma de PESOS {{MONTO_RECLAMADO}} ($ {{MONTO_RECLAMADO}}), o lo que en más o en menos resulte de la prueba a producirse, con más los intereses, costas y costos del proceso.

II. HECHOS

Con fecha {{HECHO_FECHA}}, {{HECHO_DESCRIPCION}}

Como consecuencia directa de los hechos relatados, mi mandante ha sufrido los daños y perjuicios que a continuación se detallan, los cuales deberán ser reparados integralmente por la parte demandada conforme los artículos 1708 y concordantes del Código Civil y Comercial de la Nación.

III. DAÑOS RECLAMADOS

a) Daño material/emergente: Comprende los gastos efectivamente incurridos y la pérdida de bienes patrimoniales como consecuencia directa del hecho dañoso.

b) Daño moral: El sufrimiento, padecimiento y angustia espiritual causados por el accionar de la demandada, estimado en la suma que V.S. considere equitativa conforme las circunstancias del caso.

c) Lucro cesante: Las ganancias legítimamente frustradas como consecuencia del hecho dañoso.

IV. DERECHO

Fundo la presente demanda en lo dispuesto por los artículos 1708, 1716, 1717, 1726, 1737, 1738, 1739, 1740, 1741 y concordantes del Código Civil y Comercial de la Nación; arts. 330 y concordantes del CPCCN.

V. PRUEBA

A) Documental: Se acompañan los documentos detallados en el primer otrosí.

B) Informativa: Líbrese oficio a los organismos y entidades que oportunamente se indicarán.

C) Pericial: Se ofrecerá la prueba pericial correspondiente en la oportunidad procesal pertinente.

D) Testimonial: Se citará a declarar a los testigos que se indicarán al momento de ofrecer prueba.

VI. MEDIDA CAUTELAR

En caso de resultar necesario para garantizar el cumplimiento de la sentencia, se solicitará la adopción de las medidas cautelares pertinentes.

VII. PETITORIO

Por todo lo expuesto a V.S. solicito:

1°) Me tenga por presentado, por parte y por constituido el domicilio procesal.
2°) Corra traslado de la presente demanda al demandado {{NOMBRE_DEMANDADO}} por el plazo que corresponda.
3°) En su oportunidad, se dicte sentencia haciendo lugar a la demanda en todas sus partes, con expresa imposición de costas.

Proveer de conformidad,
SERÁ JUSTICIA.

{{CIUDAD}}, {{FECHA_PRESENTACION}}

______________________________
{{NOMBRE_ABOGADO}}
T. {{TOMO_FOLIO}} CPACF'
FROM ModelosCategorias c WHERE c.nombre='Demandas';
GO

-- Demanda laboral por despido
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Demanda Laboral por Despido Incausado',
  'Demanda ante el Juzgado Nacional del Trabajo por despido sin justa causa. Art. 245 LCT.',
  'Laboral', '1.0',
  '[{"campo":"NOMBRE_ACTOR","label":"Nombre y apellido del trabajador","tipo":"text"},{"campo":"DNI_ACTOR","label":"DNI del trabajador","tipo":"text"},{"campo":"DOMICILIO_ACTOR","label":"Domicilio del trabajador","tipo":"text"},{"campo":"NOMBRE_EMPLEADORA","label":"Razón social de la empleadora","tipo":"text"},{"campo":"DOMICILIO_EMPLEADORA","label":"Domicilio de la empleadora","tipo":"text"},{"campo":"CUIT_EMPLEADORA","label":"CUIT de la empleadora","tipo":"text"},{"campo":"FECHA_INGRESO","label":"Fecha de ingreso","tipo":"date"},{"campo":"FECHA_EGRESO","label":"Fecha de despido","tipo":"date"},{"campo":"CATEGORIA","label":"Categoría / puesto","tipo":"text"},{"campo":"REMUNERACION","label":"Mejor remuneración mensual normal y habitual","tipo":"number"},{"campo":"NOMBRE_ABOGADO","label":"Nombre del abogado","tipo":"text"},{"campo":"TOMO_FOLIO","label":"Tomo y Folio CPACF","tipo":"text"}]',
  'SEÑOR JUEZ NACIONAL DEL TRABAJO:

{{NOMBRE_ACTOR}}, D.N.I. Nº {{DNI_ACTOR}}, con domicilio real en {{DOMICILIO_ACTOR}}, constituyendo domicilio procesal en la sede del estudio jurídico interviniente, con el patrocinio letrado del Dr./Dra. {{NOMBRE_ABOGADO}}, T. {{TOMO_FOLIO}} C.P.A.C.F., a V.S. respetuosamente me presento y digo:

I. OBJETO

Que vengo a interponer formal DEMANDA LABORAL en contra de {{NOMBRE_EMPLEADORA}}, CUIT Nº {{CUIT_EMPLEADORA}}, con domicilio en {{DOMICILIO_EMPLEADORA}}, por los rubros e importes que a continuación se detallan.

II. RELACIÓN LABORAL

El actor ingresó a trabajar para la demandada en fecha {{FECHA_INGRESO}}, desempeñándose en el cargo de {{CATEGORIA}}, percibiendo una remuneración mensual, normal y habitual de $ {{REMUNERACION}}.

III. DISTRACTO

Con fecha {{FECHA_EGRESO}}, la demandada dispuso el despido del actor sin expresión de causa alguna, resultando tal conducta inequívocamente notificada.

IV. RUBROS RECLAMADOS

a) Indemnización por despido (art. 245 LCT): Un (1) mes de la mejor remuneración mensual normal y habitual por cada año de servicio o fracción mayor de tres meses, tomando como base la suma de $ {{REMUNERACION}}.

b) Preaviso (art. 231/232 LCT): Según la antigüedad del trabajador.

c) Integración del mes de despido (art. 233 LCT): Por los días que resten hasta la finalización del mes en que operó el despido.

d) SAC proporcional (art. 123 LCT).

e) Vacaciones no gozadas proporcionales (art. 156 LCT).

f) Multa art. 80 LCT: Por falta de entrega de certificación laboral.

g) Multa art. 132 bis LCT: De corresponder, por retención indebida de aportes y contribuciones.

h) Intereses: Conforme las tasas aplicables en el fuero del trabajo.

V. DERECHO

Arts. 231, 232, 233, 245, 123, 156 y conc. de la Ley de Contrato de Trabajo Nº 20.744 y sus modificatorias. Arts. 65 y conc. de la Ley Nº 18.345 (Procedimiento Laboral).

VI. PRUEBA

A) Documental: Se acompañan los recibos de haberes, telegramas y demás documentación pertinente.
B) Informativa: A la AFIP, ANSES, Obra Social, y demás organismos que se indiquen.
C) Pericial contable: Para determinar la remuneración real percibida y los rubros adeudados.
D) Testimonial: Los testigos que se individualizarán en su oportunidad.

VII. PETITORIO

Por todo lo expuesto solicito:

1°) Se me tenga por presentado, por parte y por constituido el domicilio.
2°) Se corra traslado de la presente demanda a la demandada.
3°) Oportunamente se dicte sentencia condenando a la demandada al pago de los rubros reclamados, con más intereses y costas.

SERÁ JUSTICIA.'
FROM ModelosCategorias c WHERE c.nombre='Demandas Laborales';
GO

-- Recurso de apelación
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Recurso de Apelación',
  'Interposición de recurso de apelación contra resolución o sentencia de primera instancia',
  NULL, '1.0',
  '[{"campo":"CARATULA","label":"Carátula del expediente","tipo":"text"},{"campo":"NUMERO_EXPTE","label":"Número de expediente","tipo":"text"},{"campo":"NOMBRE_APELANTE","label":"Nombre del apelante","tipo":"text"},{"campo":"CARACTER","label":"Carácter (actora/demandada)","tipo":"text"},{"campo":"FECHA_RESOLUCION","label":"Fecha de la resolución apelada","tipo":"date"},{"campo":"FUNDAMENTO","label":"Fundamento breve del recurso","tipo":"textarea"},{"campo":"NOMBRE_ABOGADO","label":"Nombre del abogado","tipo":"text"},{"campo":"TOMO_FOLIO","label":"Tomo y Folio","tipo":"text"}]',
  'SEÑOR JUEZ:

{{NOMBRE_APELANTE}}, en los autos caratulados "{{CARATULA}}", Expte. Nº {{NUMERO_EXPTE}}, en mi carácter de parte {{CARACTER}}, con el patrocinio del Dr./Dra. {{NOMBRE_ABOGADO}}, T. {{TOMO_FOLIO}} C.P.A.C.F., a V.S. respetuosamente digo:

I. OBJETO

Que vengo en legal tiempo y forma a INTERPONER RECURSO DE APELACIÓN contra la resolución de fecha {{FECHA_RESOLUCION}}, que me fuera notificada, por resultar la misma agraviante para mi parte.

II. AGRAVIOS (en síntesis)

{{FUNDAMENTO}}

Los fundamentos completos serán desarrollados ante la Alzada al momento de expresar agravios, conforme lo previsto por el artículo 265 del Código Procesal Civil y Comercial de la Nación.

III. PETITORIO

Por lo expuesto, solicito:

1°) Se tenga por interpuesto en legal tiempo y forma el presente recurso de apelación.
2°) Se eleven los autos a la Cámara de Apelaciones correspondiente.
3°) Oportunamente, la Alzada revoque o modifique la resolución apelada, con costas.

PROVEER DE CONFORMIDAD,
SERÁ JUSTICIA.'
FROM ModelosCategorias c WHERE c.nombre='Recursos y Apelaciones';
GO

-- Oficio judicial
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Oficio Judicial',
  'Solicitud de libramiento de oficio a organismos, entidades bancarias o empresas',
  NULL, '1.0',
  '[{"campo":"DESTINATARIO","label":"Organismo/entidad destinataria","tipo":"text"},{"campo":"DOMICILIO_DEST","label":"Domicilio del destinatario","tipo":"text"},{"campo":"CARATULA","label":"Carátula del expediente","tipo":"text"},{"campo":"NUMERO_EXPTE","label":"Número de expediente","tipo":"text"},{"campo":"OBJETO_OFICIO","label":"Objeto del oficio (información solicitada)","tipo":"textarea"},{"campo":"PLAZO","label":"Plazo para responder (días)","tipo":"number"},{"campo":"NOMBRE_SOLICITANTE","label":"Nombre de la parte solicitante","tipo":"text"},{"campo":"NOMBRE_ABOGADO","label":"Nombre del abogado","tipo":"text"},{"campo":"TOMO_FOLIO","label":"Tomo y Folio","tipo":"text"}]',
  'SEÑOR JUEZ:

{{NOMBRE_SOLICITANTE}}, en los autos "{{CARATULA}}", Expte. Nº {{NUMERO_EXPTE}}, con el patrocinio del Dr./Dra. {{NOMBRE_ABOGADO}}, T. {{TOMO_FOLIO}} C.P.A.C.F., a V.S. respetuosamente solicito:

OBJETO

Que se sirva librar OFICIO a {{DESTINATARIO}}, con domicilio en {{DOMICILIO_DEST}}, a fin de que en el plazo de {{PLAZO}} días hábiles informe:

{{OBJETO_OFICIO}}

Se solicita que el organismo/entidad destinataria responda con carácter de URGENTE, teniendo en cuenta las constancias del expediente de referencia.

DERECHO

Art. 400 y concordantes del Código Procesal Civil y Comercial de la Nación.

PETITORIO

1°) Se tenga por solicitado el libramiento del presente oficio.
2°) Se libre el oficio en los términos expuestos.

PROVEER DE CONFORMIDAD,
SERÁ JUSTICIA.'
FROM ModelosCategorias c WHERE c.nombre='Presentaciones y Oficios';
GO

-- Solicitud de medida cautelar
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Solicitud de Medida Cautelar — Embargo Preventivo',
  'Solicitud de embargo preventivo sobre bienes del demandado como medida asegurativa',
  NULL, '1.0',
  '[{"campo":"NOMBRE_SOLICITANTE","label":"Nombre del solicitante","tipo":"text"},{"campo":"NOMBRE_CAUTELADO","label":"Nombre del cautelado","tipo":"text"},{"campo":"MONTO_CAUTELAR","label":"Monto de la cautelar","tipo":"number"},{"campo":"BIENES_A_EMBARGAR","label":"Bienes a embargar","tipo":"textarea"},{"campo":"VEROSIMILITUD","label":"Verosimilitud del derecho (fundamento)","tipo":"textarea"},{"campo":"NOMBRE_ABOGADO","label":"Nombre del abogado","tipo":"text"},{"campo":"TOMO_FOLIO","label":"Tomo y Folio","tipo":"text"}]',
  'SEÑOR JUEZ:

{{NOMBRE_SOLICITANTE}}, con el patrocinio del Dr./Dra. {{NOMBRE_ABOGADO}}, T. {{TOMO_FOLIO}} C.P.A.C.F., a V.S. respetuosamente solicito:

I. OBJETO

Que se dicte MEDIDA CAUTELAR DE EMBARGO PREVENTIVO sobre los bienes de {{NOMBRE_CAUTELADO}}, hasta cubrir la suma de PESOS {{MONTO_CAUTELAR}} ($ {{MONTO_CAUTELAR}}), con más un 30% para responder a intereses, costas y costos del proceso.

II. VEROSIMILITUD DEL DERECHO (fumus boni iuris)

{{VEROSIMILITUD}}

III. PELIGRO EN LA DEMORA (periculum in mora)

El peligro en la demora resulta manifiesto, toda vez que sin la adopción de esta medida, la parte solicitante vería frustrado el cobro del crédito que persigue, ante la posibilidad de que el demandado enajene o disipe sus bienes durante el curso del proceso.

IV. BIENES A EMBARGAR

Se solicita el embargo sobre: {{BIENES_A_EMBARGAR}}

V. CONTRACAUTELA

Se ofrece como contracautela la caución juratoria prevista en el art. 199 del CPCCN.

VI. DERECHO

Arts. 195, 199, 209 y concordantes del Código Procesal Civil y Comercial de la Nación.

VII. PETITORIO

1°) Se decrete la medida cautelar de embargo preventivo solicitada.
2°) Se libre el mandamiento de embargo correspondiente.

PROVEER DE CONFORMIDAD,
SERÁ JUSTICIA.'
FROM ModelosCategorias c WHERE c.nombre='Medidas Cautelares';
GO

-- ════════════════════════════════════════════════════════════
-- CONTRATOS
-- ════════════════════════════════════════════════════════════

-- Locación de departamento
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Contrato de Locación — Departamento',
  'Contrato de locación de inmueble destinado a vivienda familiar (Ley 27.551)',
  'Civil', '1.0',
  '[{"campo":"LOCADOR_NOMBRE","label":"Nombre completo del locador","tipo":"text"},{"campo":"LOCADOR_DNI","label":"DNI del locador","tipo":"text"},{"campo":"LOCADOR_DOMICILIO","label":"Domicilio del locador","tipo":"text"},{"campo":"LOCATARIO_NOMBRE","label":"Nombre completo del locatario","tipo":"text"},{"campo":"LOCATARIO_DNI","label":"DNI del locatario","tipo":"text"},{"campo":"LOCATARIO_DOMICILIO","label":"Domicilio real del locatario","tipo":"text"},{"campo":"INMUEBLE_DIRECCION","label":"Dirección del inmueble","tipo":"text"},{"campo":"INMUEBLE_DESC","label":"Descripción del inmueble (piso, depto, sup.)","tipo":"text"},{"campo":"FECHA_INICIO","label":"Fecha de inicio","tipo":"date"},{"campo":"PLAZO_MESES","label":"Plazo en meses","tipo":"number"},{"campo":"ALQUILER_INICIAL","label":"Alquiler mensual inicial (pesos)","tipo":"number"},{"campo":"GARANTIA_NOMBRE","label":"Nombre del garante","tipo":"text"},{"campo":"GARANTIA_DNI","label":"DNI del garante","tipo":"text"},{"campo":"CIUDAD","label":"Ciudad de celebración","tipo":"text"},{"campo":"FECHA_FIRMA","label":"Fecha de firma","tipo":"date"}]',
  'CONTRATO DE LOCACIÓN

En la ciudad de {{CIUDAD}}, a los {{FECHA_FIRMA}}, entre:

LOCADOR: {{LOCADOR_NOMBRE}}, D.N.I. Nº {{LOCADOR_DNI}}, con domicilio en {{LOCADOR_DOMICILIO}}, en adelante "el LOCADOR"; y

LOCATARIO: {{LOCATARIO_NOMBRE}}, D.N.I. Nº {{LOCATARIO_DNI}}, con domicilio en {{LOCATARIO_DOMICILIO}}, en adelante "el LOCATARIO";

acuerdan celebrar el presente CONTRATO DE LOCACIÓN, sujeto a las siguientes cláusulas y condiciones:

PRIMERA: OBJETO. El LOCADOR da en locación al LOCATARIO el inmueble ubicado en {{INMUEBLE_DIRECCION}}, consistente en {{INMUEBLE_DESC}} (en adelante "el inmueble"), exclusivamente para uso de vivienda familiar del LOCATARIO.

SEGUNDA: PLAZO. La locación se pacta por el plazo de {{PLAZO_MESES}} ({{PLAZO_MESES}}) meses, a partir del día {{FECHA_INICIO}}, fecha en la que el LOCATARIO tomará posesión del inmueble. El plazo mínimo de locación es de tres (3) años conforme el art. 1198 del Código Civil y Comercial de la Nación y la Ley Nº 27.551.

TERCERA: PRECIO. El LOCATARIO abonará en concepto de alquiler la suma de PESOS {{ALQUILER_INICIAL}} ($ {{ALQUILER_INICIAL}}) mensuales durante el primer período. El precio se actualizará anualmente conforme el Índice para Contratos de Locación (ICL) publicado por el Banco Central de la República Argentina, de conformidad con lo establecido por la Ley Nº 27.551 y sus modificatorias.

CUARTA: FORMA DE PAGO. El alquiler será abonado por mes adelantado, entre los días 1 y 5 de cada mes, mediante transferencia bancaria a la cuenta que el LOCADOR indique o en el domicilio de éste último.

QUINTA: DEPÓSITO EN GARANTÍA. El LOCATARIO entrega en este acto al LOCADOR la suma equivalente a un (1) mes de alquiler en concepto de depósito en garantía, el que será devuelto al término de la locación, previa verificación del estado del inmueble y deducción de los importes adeudados si los hubiere.

SEXTA: ESTADO DEL INMUEBLE. El LOCATARIO declara recibir el inmueble en perfecto estado de conservación y mantenimiento, obligándose a devolverlo en igual estado al vencimiento del contrato. Se acompaña al presente inventario del estado del inmueble.

SÉPTIMA: GASTOS Y SERVICIOS. El LOCATARIO estará a su cargo los gastos ordinarios del inmueble: expensas ordinarias, servicios de gas, electricidad, teléfono, internet y todo servicio que utilice. Las expensas extraordinarias y los impuestos inmobiliarios estarán a cargo del LOCADOR.

OCTAVA: DESTINO. El inmueble solo podrá ser utilizado para vivienda familiar del LOCATARIO. Se prohíbe expresamente su subarrendamiento total o parcial sin previa conformidad escrita del LOCADOR.

NOVENA: RESCISIÓN ANTICIPADA. El LOCATARIO podrá rescindir anticipadamente el contrato transcurridos los primeros seis (6) meses, debiendo notificar con una antelación mínima de treinta (30) días. Si la rescisión opera antes del primer año, deberá abonar al LOCADOR una indemnización equivalente a un mes y medio (1,5) de alquiler. Si opera con posterioridad, la indemnización será de un (1) mes de alquiler (art. 1221 CCyCN).

DÉCIMA: GARANTÍA. Actúa como garante solidario {{GARANTIA_NOMBRE}}, D.N.I. Nº {{GARANTIA_DNI}}, quien se constituye en fiador solidario, liso y llano, principal pagador de las obligaciones del LOCATARIO, renunciando al beneficio de excusión y división.

DÉCIMA PRIMERA: RENOVACIÓN. Vencido el plazo contractual, si el LOCATARIO permanece en el inmueble y el LOCADOR no solicita su desalojo, la locación se considerará renovada en forma automática por períodos iguales, en los mismos términos y condiciones.

DÉCIMA SEGUNDA: JURISDICCIÓN. Las partes se someten a la jurisdicción de los Tribunales Ordinarios de la ciudad de {{CIUDAD}}, renunciando a cualquier otro fuero o jurisdicción que pudiere corresponderles.

En prueba de conformidad se firman dos (2) ejemplares de un mismo tenor y a un solo efecto, en el lugar y fecha indicados al comienzo.

LOCADOR:                          LOCATARIO:
{{LOCADOR_NOMBRE}}                {{LOCATARIO_NOMBRE}}
D.N.I.: {{LOCADOR_DNI}}          D.N.I.: {{LOCATARIO_DNI}}

GARANTE:
{{GARANTIA_NOMBRE}}
D.N.I.: {{GARANTIA_DNI}}'
FROM ModelosCategorias c WHERE c.nombre='Locación de Inmuebles';
GO

-- Contrato de trabajo por tiempo indeterminado
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Contrato de Trabajo por Tiempo Indeterminado',
  'Contrato de trabajo permanente bajo Ley de Contrato de Trabajo Nº 20.744',
  'Laboral', '1.0',
  '[{"campo":"EMPLEADOR_RAZON","label":"Razón social del empleador","tipo":"text"},{"campo":"EMPLEADOR_CUIT","label":"CUIT del empleador","tipo":"text"},{"campo":"EMPLEADOR_DOMICILIO","label":"Domicilio laboral","tipo":"text"},{"campo":"EMPLEADO_NOMBRE","label":"Nombre completo del empleado","tipo":"text"},{"campo":"EMPLEADO_DNI","label":"DNI del empleado","tipo":"text"},{"campo":"EMPLEADO_DOMICILIO","label":"Domicilio real del empleado","tipo":"text"},{"campo":"CATEGORIA","label":"Categoría / puesto de trabajo","tipo":"text"},{"campo":"CONVENIO","label":"Convenio colectivo aplicable","tipo":"text"},{"campo":"FECHA_INICIO","label":"Fecha de inicio","tipo":"date"},{"campo":"REMUNERACION","label":"Remuneración mensual bruta","tipo":"number"},{"campo":"JORNADA","label":"Jornada laboral (horas/día)","tipo":"number"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA_FIRMA","label":"Fecha de firma","tipo":"date"}]',
  'CONTRATO DE TRABAJO POR TIEMPO INDETERMINADO

En {{CIUDAD}}, a {{FECHA_FIRMA}}, entre:

EMPLEADOR: {{EMPLEADOR_RAZON}}, CUIT Nº {{EMPLEADOR_CUIT}}, con domicilio en {{EMPLEADOR_DOMICILIO}}, representada en este acto por sus representantes legales, en adelante "la EMPRESA";

EMPLEADO: {{EMPLEADO_NOMBRE}}, D.N.I. Nº {{EMPLEADO_DNI}}, con domicilio real en {{EMPLEADO_DOMICILIO}}, en adelante "el TRABAJADOR";

se celebra el presente CONTRATO DE TRABAJO POR TIEMPO INDETERMINADO, en los términos de la Ley Nº 20.744 (LCT) y sus modificatorias, bajo las siguientes condiciones:

PRIMERA: FECHA DE INGRESO. El presente contrato entrará en vigencia a partir del día {{FECHA_INICIO}}, siendo esa la fecha de ingreso del TRABAJADOR a los efectos de la LCT.

SEGUNDA: PERÍODO DE PRUEBA. Los primeros tres (3) meses constituirán el período de prueba previsto en el art. 92 bis de la LCT, durante el cual cualquiera de las partes podrá disolver el contrato sin expresión de causa y sin derecho a indemnización.

TERCERA: CATEGORÍA Y TAREAS. El TRABAJADOR se desempeñará en la categoría de {{CATEGORIA}}, conforme el Convenio Colectivo de Trabajo aplicable: {{CONVENIO}}. Las tareas podrán ser modificadas por la EMPRESA dentro de los límites del art. 66 de la LCT (ius variandi).

CUARTA: REMUNERACIÓN. El TRABAJADOR percibirá una remuneración mensual bruta de PESOS {{REMUNERACION}} ($ {{REMUNERACION}}), la que será liquidada mensualmente conforme las normas legales y convencionales aplicables. La remuneración incluye todos los rubros salariales ordinarios. Se actualizará conforme los incrementos del CCT aplicable y las disposiciones legales.

QUINTA: JORNADA. La jornada laboral será de {{JORNADA}} horas diarias, en el horario que fije la EMPRESA, respetando los límites legales de la Ley Nº 11.544 y el art. 196 y ss. de la LCT.

SEXTA: LUGAR DE TRABAJO. Las tareas se desarrollarán en {{EMPLEADOR_DOMICILIO}}, o en el lugar que la EMPRESA determine dentro de los límites legales.

SÉPTIMA: LICENCIAS. El TRABAJADOR gozará de todas las licencias ordinarias y especiales establecidas en la LCT y el convenio aplicable (vacaciones anuales, licencias por enfermedad, accidente, matrimonio, nacimiento, duelo, etc.).

OCTAVA: CONFIDENCIALIDAD. El TRABAJADOR se obliga a guardar estricta confidencialidad sobre toda información, datos, procesos, metodologías, clientes y demás aspectos de la actividad de la EMPRESA, tanto durante la vigencia del contrato como con posterioridad a su extinción.

NOVENA: EXTINCIÓN. El contrato se extinguirá por las causas previstas en la LCT: despido con causa, despido sin causa —con el pago de las indemnizaciones legales (arts. 231, 232, 233, 245 LCT)—, renuncia, mutuo acuerdo (art. 241 LCT) o jubilación del trabajador.

DÉCIMA: LEGISLACIÓN APLICABLE. El presente contrato se rige por la Ley de Contrato de Trabajo Nº 20.744 y sus modificatorias, el Convenio Colectivo de Trabajo aplicable y demás normativa laboral vigente.

DÉCIMA PRIMERA: JURISDICCIÓN. Para cualquier controversia derivada del presente contrato, las partes se someten a la competencia de la Justicia Nacional del Trabajo de la Ciudad Autónoma de Buenos Aires.

De conformidad, firman dos (2) ejemplares de un mismo tenor.

EMPLEADOR:                        TRABAJADOR:
{{EMPLEADOR_RAZON}}               {{EMPLEADO_NOMBRE}}
CUIT: {{EMPLEADOR_CUIT}}          D.N.I.: {{EMPLEADO_DNI}}'
FROM ModelosCategorias c WHERE c.nombre='Contratos de Trabajo';
GO

-- Contrato a plazo fijo
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Contrato de Trabajo a Plazo Fijo',
  'Contrato de trabajo a plazo fijo (art. 93 LCT). Máximo 5 años.',
  'Laboral', '1.0',
  '[{"campo":"EMPLEADOR_RAZON","label":"Razón social del empleador","tipo":"text"},{"campo":"EMPLEADOR_CUIT","label":"CUIT del empleador","tipo":"text"},{"campo":"EMPLEADO_NOMBRE","label":"Nombre completo del empleado","tipo":"text"},{"campo":"EMPLEADO_DNI","label":"DNI del empleado","tipo":"text"},{"campo":"CATEGORIA","label":"Categoría / puesto","tipo":"text"},{"campo":"FECHA_INICIO","label":"Fecha de inicio","tipo":"date"},{"campo":"FECHA_VENCIMIENTO","label":"Fecha de vencimiento","tipo":"date"},{"campo":"MOTIVO_PLAZO","label":"Motivo justificante del plazo fijo","tipo":"textarea"},{"campo":"REMUNERACION","label":"Remuneración mensual bruta","tipo":"number"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA_FIRMA","label":"Fecha de firma","tipo":"date"}]',
  'CONTRATO DE TRABAJO A PLAZO FIJO

En {{CIUDAD}}, a {{FECHA_FIRMA}}, entre {{EMPLEADOR_RAZON}} (CUIT {{EMPLEADOR_CUIT}}) y {{EMPLEADO_NOMBRE}} (D.N.I. {{EMPLEADO_DNI}}), se celebra el presente contrato de trabajo a plazo fijo en los términos del art. 93 de la Ley Nº 20.744 (LCT).

PRIMERA: PLAZO Y JUSTIFICACIÓN. El contrato tendrá vigencia desde el {{FECHA_INICIO}} hasta el {{FECHA_VENCIMIENTO}}. La contratación a plazo se justifica en la siguiente circunstancia objetiva que así lo requiere: {{MOTIVO_PLAZO}}

SEGUNDA: CATEGORÍA Y REMUNERACIÓN. El trabajador se desempeñará como {{CATEGORIA}}, percibiendo una remuneración mensual bruta de $ {{REMUNERACION}}.

TERCERA: PREAVISO. Cuando el plazo pactado sea superior a un (1) mes, las partes deberán preavisar la extinción con una antelación no menor de un (1) mes ni mayor de dos (2) meses respecto del vencimiento del plazo (art. 94 LCT). En caso de omisión, el contrato se considerará renovado por tiempo indeterminado.

CUARTA: INDEMNIZACIÓN AL VENCIMIENTO. Si el contrato venciere sin renovación, el trabajador tendrá derecho a percibir una indemnización del 50% de la prevista en el art. 245 de la LCT (art. 95 párr. 2 LCT).

QUINTA: Rigen en todo lo demás las disposiciones de la Ley de Contrato de Trabajo.

______________________________      ______________________________
         EMPLEADOR                           TRABAJADOR'
FROM ModelosCategorias c WHERE c.nombre='Contratos de Trabajo';
GO

-- Contrato de locación de servicios
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Contrato de Locación de Servicios',
  'Contrato de prestación de servicios profesionales o técnicos. Relación civil/comercial.',
  'Comercial', '1.0',
  '[{"campo":"COMITENTE_NOMBRE","label":"Nombre/razón social del comitente","tipo":"text"},{"campo":"COMITENTE_CUIT","label":"CUIT del comitente","tipo":"text"},{"campo":"PRESTADOR_NOMBRE","label":"Nombre del prestador","tipo":"text"},{"campo":"PRESTADOR_CUIT","label":"CUIT/CUIL del prestador","tipo":"text"},{"campo":"DESCRIPCION_SERVICIO","label":"Descripción detallada del servicio","tipo":"textarea"},{"campo":"PRECIO","label":"Precio total o mensual del servicio","tipo":"number"},{"campo":"PERIODICIDAD","label":"Periodicidad de pago (mensual/por entrega/etc.)","tipo":"text"},{"campo":"PLAZO_MESES","label":"Plazo del contrato (meses)","tipo":"number"},{"campo":"FECHA_INICIO","label":"Fecha de inicio","tipo":"date"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA_FIRMA","label":"Fecha de firma","tipo":"date"}]',
  'CONTRATO DE LOCACIÓN DE SERVICIOS

En {{CIUDAD}}, a {{FECHA_FIRMA}}, entre:

COMITENTE: {{COMITENTE_NOMBRE}}, CUIT Nº {{COMITENTE_CUIT}}, en adelante "el COMITENTE"; y

PRESTADOR: {{PRESTADOR_NOMBRE}}, CUIT/CUIL Nº {{PRESTADOR_CUIT}}, en adelante "el PRESTADOR";

acuerdan celebrar el presente CONTRATO DE LOCACIÓN DE SERVICIOS, conforme los arts. 1251 y siguientes del Código Civil y Comercial de la Nación, bajo las siguientes condiciones:

PRIMERA: OBJETO. El PRESTADOR se obliga a prestar al COMITENTE los siguientes servicios: {{DESCRIPCION_SERVICIO}}

SEGUNDA: PLAZO. El presente contrato tendrá una duración de {{PLAZO_MESES}} meses a partir del {{FECHA_INICIO}}, pudiendo ser renovado por mutuo acuerdo escrito de las partes.

TERCERA: PRECIO Y FORMA DE PAGO. El COMITENTE abonará al PRESTADOR la suma de PESOS {{PRECIO}} ($ {{PRECIO}}) en forma {{PERIODICIDAD}}, contra factura o recibo correspondiente.

CUARTA: INDEPENDENCIA. El PRESTADOR actuará con total independencia técnica y organizativa, sin subordinación jerárquica hacia el COMITENTE. No existe entre las partes relación laboral alguna en los términos de la LCT.

QUINTA: RESPONSABILIDADES. El PRESTADOR es responsable por la calidad del servicio prestado y deberá contar con los recursos humanos y materiales necesarios para su cumplimiento.

SEXTA: CONFIDENCIALIDAD. El PRESTADOR se compromete a mantener estricta reserva sobre la información del COMITENTE a la que acceda en razón del presente contrato.

SÉPTIMA: RESCISIÓN. Cualquiera de las partes podrá rescindir el presente contrato con un preaviso de treinta (30) días corridos. En caso de incumplimiento grave, la parte afectada podrá rescindir de inmediato con derecho a reclamar los daños correspondientes.

OCTAVA: JURISDICCIÓN. Las partes se someten a los tribunales de {{CIUDAD}}.

Firman dos (2) ejemplares:

COMITENTE:                        PRESTADOR:
{{COMITENTE_NOMBRE}}              {{PRESTADOR_NOMBRE}}
CUIT: {{COMITENTE_CUIT}}          CUIT: {{PRESTADOR_CUIT}}'
FROM ModelosCategorias c WHERE c.nombre='Locación de Servicios y Obra';
GO

-- Contrato de locación de galpón
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Contrato de Locación — Galpón / Local Comercial',
  'Contrato de locación de inmueble con destino comercial, industrial o de depósito (Ley 27.551)',
  'Civil', '1.0',
  '[{"campo":"LOCADOR_NOMBRE","label":"Nombre del locador","tipo":"text"},{"campo":"LOCADOR_DNI","label":"DNI/CUIT del locador","tipo":"text"},{"campo":"LOCATARIO_NOMBRE","label":"Nombre/razón social del locatario","tipo":"text"},{"campo":"LOCATARIO_CUIT","label":"CUIT del locatario","tipo":"text"},{"campo":"INMUEBLE_DIRECCION","label":"Dirección del inmueble","tipo":"text"},{"campo":"INMUEBLE_DESC","label":"Descripción (superficie, características)","tipo":"text"},{"campo":"DESTINO","label":"Destino del inmueble","tipo":"text"},{"campo":"FECHA_INICIO","label":"Fecha de inicio","tipo":"date"},{"campo":"PLAZO_MESES","label":"Plazo en meses","tipo":"number"},{"campo":"ALQUILER_INICIAL","label":"Alquiler mensual inicial","tipo":"number"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA_FIRMA","label":"Fecha de firma","tipo":"date"}]',
  'CONTRATO DE LOCACIÓN DE INMUEBLE CON DESTINO COMERCIAL

En {{CIUDAD}}, a {{FECHA_FIRMA}}, entre {{LOCADOR_NOMBRE}} (DNI/CUIT {{LOCADOR_DNI}}) como LOCADOR, y {{LOCATARIO_NOMBRE}} (CUIT {{LOCATARIO_CUIT}}) como LOCATARIO, se conviene:

PRIMERA: El LOCADOR da en locación el inmueble sito en {{INMUEBLE_DIRECCION}}, consistente en {{INMUEBLE_DESC}}, para ser destinado exclusivamente a {{DESTINO}}.

SEGUNDA: PLAZO. El contrato regirá desde el {{FECHA_INICIO}} por {{PLAZO_MESES}} meses. Para locaciones con destino distinto a vivienda el plazo mínimo es de tres (3) años (art. 1198 CCyCN y Ley 27.551).

TERCERA: PRECIO. El LOCATARIO abonará $ {{ALQUILER_INICIAL}} mensuales durante el primer año, actualizándose anualmente por ICL (BCRA).

CUARTA: EXPENSAS E IMPUESTOS. Las expensas ordinarias serán a cargo del LOCATARIO. Las extraordinarias e impuesto inmobiliario, a cargo del LOCADOR.

QUINTA: OBRAS Y MEJORAS. El LOCATARIO no podrá realizar obras sin previa autorización escrita del LOCADOR. Las mejoras quedarán en beneficio del inmueble sin derecho a reembolso, salvo pacto en contrario.

SEXTA: SUBARRENDAMIENTO. Queda expresamente prohibido el subarrendamiento o cesión del contrato sin conformidad escrita del LOCADOR.

SÉPTIMA: RESTANTES CLÁUSULAS. En todo lo no previsto rigen los arts. 1187 y ss. del CCyCN y la Ley Nº 27.551.

LOCADOR:                          LOCATARIO:
{{LOCADOR_NOMBRE}}                {{LOCATARIO_NOMBRE}}'
FROM ModelosCategorias c WHERE c.nombre='Locación de Inmuebles';
GO

PRINT 'Modelos y datos insertados correctamente.'
GO

-- Contrato de trabajo a tiempo parcial
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Contrato de Trabajo a Tiempo Parcial',
  'Jornada reducida no superior al 2/3 de la jornada habitual. Art. 92 ter LCT.',
  'Laboral', '1.0',
  '[{"campo":"EMPLEADOR_RAZON","label":"Razón social del empleador","tipo":"text"},{"campo":"EMPLEADO_NOMBRE","label":"Nombre del empleado","tipo":"text"},{"campo":"EMPLEADO_DNI","label":"DNI del empleado","tipo":"text"},{"campo":"CATEGORIA","label":"Categoría / puesto","tipo":"text"},{"campo":"HORAS_SEMANA","label":"Horas semanales pactadas","tipo":"number"},{"campo":"DIAS_TRABAJO","label":"Días de trabajo","tipo":"text"},{"campo":"HORARIO","label":"Horario","tipo":"text"},{"campo":"REMUNERACION","label":"Remuneración mensual proporcional","tipo":"number"},{"campo":"FECHA_INICIO","label":"Fecha de inicio","tipo":"date"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA_FIRMA","label":"Fecha de firma","tipo":"date"}]',
  'CONTRATO DE TRABAJO A TIEMPO PARCIAL

En {{CIUDAD}}, a {{FECHA_FIRMA}}, entre {{EMPLEADOR_RAZON}} (en adelante "la EMPRESA") y {{EMPLEADO_NOMBRE}}, D.N.I. {{EMPLEADO_DNI}} (en adelante "el TRABAJADOR"), se celebra el presente contrato conforme el art. 92 ter de la Ley Nº 20.744 (LCT).

PRIMERA: El TRABAJADOR prestará servicios en la categoría de {{CATEGORIA}} en una jornada reducida de {{HORAS_SEMANA}} horas semanales, distribuidas los días {{DIAS_TRABAJO}}, en el horario de {{HORARIO}}.

La jornada pactada no supera los dos tercios (2/3) de la jornada habitual de la actividad, de conformidad con el art. 92 ter LCT.

SEGUNDA: El TRABAJADOR percibirá una remuneración mensual proporcional de PESOS {{REMUNERACION}} ($ {{REMUNERACION}}), que representa la proporción correspondiente a su jornada reducida respecto de la jornada completa.

TERCERA: Los aportes y contribuciones a la seguridad social se realizarán sobre la remuneración efectivamente percibida.

CUARTA: El TRABAJADOR no podrá cumplir horas extraordinarias salvo casos de excepción previstos en el art. 89 LCT, en cuyo caso se liquidarán conforme las normas aplicables.

QUINTA: En todo lo no previsto rigen las disposiciones de la LCT y el convenio colectivo aplicable.

En prueba de conformidad se firman dos (2) ejemplares:

EMPRESA:                          TRABAJADOR:
{{EMPLEADOR_RAZON}}               {{EMPLEADO_NOMBRE}}'
FROM ModelosCategorias c WHERE c.nombre='Contratos de Trabajo';
GO

-- Contrato de trabajo eventual
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Contrato de Trabajo Eventual',
  'Contrato para cubrir necesidades extraordinarias o transitorias. Arts. 99/100 LCT.',
  'Laboral', '1.0',
  '[{"campo":"EMPLEADOR_RAZON","label":"Razón social del empleador","tipo":"text"},{"campo":"EMPLEADO_NOMBRE","label":"Nombre del trabajador eventual","tipo":"text"},{"campo":"EMPLEADO_DNI","label":"DNI","tipo":"text"},{"campo":"CATEGORIA","label":"Categoría / tareas","tipo":"text"},{"campo":"CAUSA_EVENTUAL","label":"Causa que justifica la eventualidad","tipo":"textarea"},{"campo":"REMUNERACION","label":"Remuneración diaria/mensual","tipo":"number"},{"campo":"FECHA_INICIO","label":"Fecha de inicio","tipo":"date"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA_FIRMA","label":"Fecha de firma","tipo":"date"}]',
  'CONTRATO DE TRABAJO EVENTUAL

En {{CIUDAD}}, a {{FECHA_FIRMA}}, entre {{EMPLEADOR_RAZON}} (en adelante "la EMPRESA") y {{EMPLEADO_NOMBRE}}, D.N.I. {{EMPLEADO_DNI}}, se celebra el presente conforme arts. 99 y 100 de la LCT.

PRIMERA: CAUSA. La contratación eventual se justifica en la siguiente situación extraordinaria o transitoria: {{CAUSA_EVENTUAL}}

SEGUNDA: TAREAS. El trabajador se desempeñará en la categoría de {{CATEGORIA}} hasta que cese la causa que originó la contratación, sin que pueda fijarse de antemano la duración de la prestación.

TERCERA: REMUNERACIÓN. Percibirá $ {{REMUNERACION}} por la jornada/período pactado.

CUARTA: EXTINCIÓN. El contrato se extinguirá automáticamente cuando se cumpla la obra, la tarea o la exigencia extraordinaria prevista, sin derecho a indemnización por despido, salvo que mediare una relación de trabajo de plazo indeterminado que lo configure (art. 99, última parte, LCT).

QUINTA: La EMPRESA comunicará al trabajador con la anticipación prevista en la LCT la fecha en que cesará la causa que motivó la contratación.

EMPRESA:                          TRABAJADOR:
{{EMPLEADOR_RAZON}}               {{EMPLEADO_NOMBRE}}'
FROM ModelosCategorias c WHERE c.nombre='Contratos de Trabajo';
GO

-- Locación de obra
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Contrato de Locación de Obra',
  'Contrato donde el locador se obliga a entregar una obra determinada (resultado). Art. 1251 CCyCN.',
  'Comercial', '1.0',
  '[{"campo":"COMITENTE_NOMBRE","label":"Nombre/razón social del comitente","tipo":"text"},{"campo":"COMITENTE_CUIT","label":"CUIT del comitente","tipo":"text"},{"campo":"LOCADOR_OBRA_NOMBRE","label":"Nombre del constructor/locador","tipo":"text"},{"campo":"LOCADOR_OBRA_CUIT","label":"CUIT del locador","tipo":"text"},{"campo":"DESCRIPCION_OBRA","label":"Descripción detallada de la obra","tipo":"textarea"},{"campo":"LUGAR_OBRA","label":"Lugar de ejecución","tipo":"text"},{"campo":"PRECIO_OBRA","label":"Precio total de la obra","tipo":"number"},{"campo":"FORMA_PAGO","label":"Forma de pago","tipo":"textarea"},{"campo":"PLAZO_DIAS","label":"Plazo de ejecución (días)","tipo":"number"},{"campo":"CIUDAD","label":"Ciudad","tipo":"text"},{"campo":"FECHA_FIRMA","label":"Fecha de firma","tipo":"date"}]',
  'CONTRATO DE LOCACIÓN DE OBRA

En {{CIUDAD}}, a {{FECHA_FIRMA}}, entre:

COMITENTE: {{COMITENTE_NOMBRE}}, CUIT {{COMITENTE_CUIT}}, en adelante "el COMITENTE"; y

CONSTRUCTOR / LOCADOR: {{LOCADOR_OBRA_NOMBRE}}, CUIT {{LOCADOR_OBRA_CUIT}}, en adelante "el LOCADOR";

acuerdan celebrar el presente CONTRATO DE LOCACIÓN DE OBRA, conforme los arts. 1251 y ss. del CCyCN:

PRIMERA: OBJETO. El LOCADOR se obliga a ejecutar y entregar al COMITENTE la siguiente obra: {{DESCRIPCION_OBRA}}

SEGUNDA: LUGAR. Los trabajos se realizarán en {{LUGAR_OBRA}}.

TERCERA: PRECIO. El precio total de la obra es de PESOS {{PRECIO_OBRA}} ($ {{PRECIO_OBRA}}). La forma de pago será: {{FORMA_PAGO}}

CUARTA: PLAZO. La obra deberá completarse dentro de los {{PLAZO_DIAS}} días corridos contados desde la fecha del presente contrato. La mora en la entrega generará, a favor del COMITENTE, una penalidad equivalente al uno por ciento (1%) del precio total por cada día de demora.

QUINTA: MATERIALES. Salvo estipulación en contrario, los materiales serán provistos por el LOCADOR, quien garantiza su calidad y adecuación a las reglas del arte. El riesgo de pérdida es soportado por el LOCADOR hasta la entrega y aceptación de la obra (arts. 1268 y 1269 CCyCN).

SEXTA: RESPONSABILIDAD POR RUINA. El LOCADOR responde por la ruina total o parcial de la obra durante el plazo de diez (10) años (art. 1273 CCyCN).

S�PTIMA: INSPECCIÓN. El COMITENTE o su representante podrán inspeccionar la obra en cualquier momento, sin interferir en la ejecución.

OCTAVA: SUBCONTRATACIÓN. El LOCADOR no podrá subcontratar la ejecución total de la obra sin conformidad escrita del COMITENTE.

NOVENA: RECEPCIÓN. La obra se recibirá mediante acta de recepción. Si el COMITENTE no formula observaciones dentro de los diez (10) días de la entrega, se considerará aceptada (art. 1271 CCyCN).

COMITENTE:                        LOCADOR DE OBRA:
{{COMITENTE_NOMBRE}}              {{LOCADOR_OBRA_NOMBRE}}'
FROM ModelosCategorias c WHERE c.nombre='Locación de Servicios y Obra';
GO

-- Demanda ejecutiva
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Demanda Ejecutiva — Cobro de Pagaré / Cheque',
  'Proceso ejecutivo para cobro de título de crédito (pagaré, cheque rechazado). Arts. 520 y ss. CPCCN.',
  'Comercial', '1.0',
  '[{"campo":"NOMBRE_ACTOR","label":"Nombre del actor/ejecutante","tipo":"text"},{"campo":"DNI_ACTOR","label":"DNI/CUIT del actor","tipo":"text"},{"campo":"NOMBRE_DEMANDADO","label":"Nombre del ejecutado","tipo":"text"},{"campo":"DOMICILIO_DEMANDADO","label":"Domicilio del ejecutado","tipo":"text"},{"campo":"TITULO","label":"Tipo de título (pagaré/cheque)","tipo":"text"},{"campo":"MONTO","label":"Monto del título","tipo":"number"},{"campo":"FECHA_TITULO","label":"Fecha del título","tipo":"date"},{"campo":"NOMBRE_ABOGADO","label":"Nombre del abogado","tipo":"text"},{"campo":"TOMO_FOLIO","label":"Tomo y Folio","tipo":"text"}]',
  'SEÑOR JUEZ:

{{NOMBRE_ACTOR}}, D.N.I./CUIT Nº {{DNI_ACTOR}}, con el patrocinio del Dr./Dra. {{NOMBRE_ABOGADO}}, T. {{TOMO_FOLIO}} C.P.A.C.F., a V.S. respetuosamente digo:

I. OBJETO

Que vengo a promover DEMANDA EJECUTIVA contra {{NOMBRE_DEMANDADO}}, con domicilio en {{DOMICILIO_DEMANDADO}}, por la suma de PESOS {{MONTO}} ($ {{MONTO}}), con más intereses y costas.

II. TÍTULO EJECUTIVO

Acompaño {{TITULO}} de fecha {{FECHA_TITULO}} por la suma indicada, título que reúne todos los requisitos del art. 518 del CPCCN para traer aparejada ejecución.

III. MANDAMIENTO DE INTIMACIÓN Y EMBARGO

Solicito se libre mandamiento de intimación de pago y embargo sobre bienes del ejecutado en la forma prevista por los arts. 531 y ss. del CPCCN.

IV. DERECHO

Arts. 518, 520, 524 y ss. del CPCCN; arts. 100 y ss. del Decreto-Ley 5965/63 (pagaré) / art. 38 Ley 24.452 (cheque).

V. PETITORIO

1°) Se me tenga por presentado y por parte.
2°) Se libre mandamiento de intimación de pago y embargo.
3°) En su oportunidad, se dicte sentencia de trance y remate con costas.

SERÁ JUSTICIA.'
FROM ModelosCategorias c WHERE c.nombre='Demandas';
GO

-- Presentación escrito ordinario / memorial
INSERT INTO Modelos (id_categoria, nombre, descripcion, area, version, variables, contenido)
SELECT c.id,
  'Presentación Espontánea / Memorial',
  'Escrito de presentación espontánea, memoria o petición en expediente en curso',
  NULL, '1.0',
  '[{"campo":"CARATULA","label":"Carátula del expediente","tipo":"text"},{"campo":"NUMERO_EXPTE","label":"Número de expediente","tipo":"text"},{"campo":"NOMBRE_PRESENTANTE","label":"Nombre del presentante","tipo":"text"},{"campo":"CARACTER","label":"Carácter (actora/demandada/tercero)","tipo":"text"},{"campo":"OBJETO_PRESENTACION","label":"Objeto de la presentación","tipo":"textarea"},{"campo":"NOMBRE_ABOGADO","label":"Nombre del abogado","tipo":"text"},{"campo":"TOMO_FOLIO","label":"Tomo y Folio","tipo":"text"}]',
  'SEÑOR JUEZ:

{{NOMBRE_PRESENTANTE}}, parte {{CARACTER}} en autos "{{CARATULA}}", Expte. Nº {{NUMERO_EXPTE}}, con el patrocinio del Dr./Dra. {{NOMBRE_ABOGADO}}, T. {{TOMO_FOLIO}} C.P.A.C.F., a V.S. respetuosamente digo:

OBJETO

{{OBJETO_PRESENTACION}}

PETITORIO

Por lo expuesto, solicito a V.S. se provea de conformidad a lo solicitado.

PROVEER DE CONFORMIDAD,
SERÁ JUSTICIA.'
FROM ModelosCategorias c WHERE c.nombre='Presentaciones y Oficios';
GO

PRINT 'Modelos adicionales insertados correctamente.'
GO
