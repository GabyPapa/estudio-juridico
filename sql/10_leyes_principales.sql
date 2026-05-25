-- ============================================================
--  LEYES PRINCIPALES — LCT, CPCCN, CPCCBA, LPA, LRT
--  Texto con articulos clave. Ejecutar despues de 09.
-- ============================================================
USE EstudioJuridico;
GO

-- Eliminar registros previos si existieran (para poder reejecutar)
DELETE FROM Leyes WHERE numero IN ('20744','17454','7425','19549','24557');
GO

-- ══════════════════════════════════════════════════════════════
-- 1. LEY DE CONTRATO DE TRABAJO — Ley 20.744 (t.o. Dto. 390/76)
--    Ultima mod.: Ley 27.742 (Bases) 08/07/2024
-- ══════════════════════════════════════════════════════════════
INSERT INTO Leyes (numero, nombre, tipo, organismo, fecha_sancion, fecha_promulgacion, fecha_vigencia,
    boletin_numero, boletin_fecha, area, resumen, texto, url_infoleg)
VALUES (
'20744',
'Ley de Contrato de Trabajo (LCT)',
'ley',
'Honorable Congreso de la Nacion',
'1974-05-13', '1974-09-11', '1974-10-21',
'23116', '1974-09-27',
'Laboral',
'Regula el contrato de trabajo y la relacion laboral entre empleadores y trabajadores. Texto ordenado por Decreto 390/76. Ultima modificacion por Ley 27.742 (Bases y Puntos de Partida para la Libertad de los Argentinos), B.O. 08/07/2024.',
'TITULO I — DISPOSICIONES GENERALES

Art. 1 — Fuentes de regulacion. El contrato de trabajo y la relacion de trabajo se rigen por la presente ley, los estatutos profesionales, los convenios colectivos de trabajo o laudos con fuerza de tales, los usos y costumbres, y los contratos individuales de trabajo.

Art. 7 — Condiciones menos favorables. Nulidad. Las partes no pueden pactar condiciones menos favorables para el trabajador que las dispuestas en normas legales o convencionales.

Art. 14 bis — CN. El trabajo en sus diversas formas gozara de la proteccion de las leyes. Proteccion contra el despido arbitrario, estabilidad del empleado publico, organizacion sindical libre y democratica.

TITULO II — DEL CONTRATO DE TRABAJO EN GENERAL

Art. 21 — Contrato de trabajo. Habra contrato de trabajo cualquiera sea su forma o denominacion, siempre que una persona fisica se obligue a realizar actos, ejecutar obras o prestar servicios a favor de otra y bajo su dependencia, durante un periodo determinado o indeterminado de tiempo, mediante el pago de una remuneracion.

Art. 23 — Presuncion de existencia. El hecho de la prestacion de servicios hace presumir la existencia de un contrato de trabajo, salvo que por las circunstancias se demostrase lo contrario.

Art. 26 — Empleador. Se considera empleador a la persona fisica o conjunto de ellas, o juridica, que requiera los servicios de un trabajador.

Art. 29 — Intermediacion e interposicion. Los trabajadores seran considerados empleados de quien utilice su prestacion, salvo que el empleador sea una empresa de servicios eventuales habilitada.

TITULO IV — DEL CONTRATO DE TRABAJO (Modalidades)

Art. 90 — Indeterminacion del plazo. El contrato de trabajo se entendera celebrado por tiempo indeterminado, salvo que su termino resulte objetivamente de las modalidades de las tareas o de la actividad, razon de empresa o exigencia del mercado.

Art. 93 — Duracion. El contrato de trabajo a plazo fijo durara hasta el vencimiento del plazo convenido, no pudiendo celebrarse por mas de cinco (5) anos.

TITULO X — DE LA SUSPENSION DE CIERTOS EFECTOS DEL CONTRATO

Art. 212 — Incapacidad. Vigente el plazo de conservacion del empleo, si del accidente o enfermedad resultase una disminucion definitiva de la capacidad laboral que le impida al trabajador realizar las tareas que cumplia, el empleador debera asignarle otras acordes con su nueva capacidad y si no contara con ellas, debera pagarle una indemnizacion igual a la prevista en el art. 247 de la LCT.

TITULO XII — DE LA EXTINCION DEL CONTRATO DE TRABAJO

Art. 231 — Plazo del preaviso. El contrato de trabajo no podra ser disuelto por voluntad de una de las partes sin previo aviso: el empleador, con 15 dias si el trabajador esta en periodo de prueba; 1 mes si no supera 5 anos de antiguedad; 2 meses si supera ese termino.

Art. 232 — Indemnizacion sustitutiva. La parte que omita el preaviso o lo otorgue de modo insuficiente debera abonar una indemnizacion sustitutiva equivalente a la remuneracion que corresponderia al trabajador durante los plazos del art. 231.

Art. 233 — Integracion del mes de despido. Cuando el despido sin justa causa se produzca sin preaviso y en fecha que no coincida con el ultimo dia del mes, la indemnizacion sustitutiva se integrara con los salarios del periodo comprendido hasta el ultimo dia del mes en que el despido se produjera.

Art. 245 — Indemnizacion por antiguedad o despido. En los casos de despido dispuesto por el empleador sin justa causa, habiendo o no mediado preaviso, este debera abonar al trabajador una indemnizacion equivalente a UN (1) mes de sueldo por cada ano de servicio o fraccion mayor de TRES (3) meses, tomando como base la mejor remuneracion mensual, normal y habitual devengada durante el ultimo ano o durante el tiempo de prestacion de servicios si este fuera menor. Dicha base no podra exceder el equivalente de TRES (3) veces el importe mensual de la suma que resulte del promedio de todas las remuneraciones previstas en el convenio colectivo de trabajo aplicable.

Art. 246 — Despido indirecto. Cuando el trabajador hiciere denuncia del contrato de trabajo fundado en justa causa, tendra derecho a las indemnizaciones previstas en el articulo 245.

Art. 247 — Fuerza mayor o falta o disminucion de trabajo. En los casos que el despido fuese motivado por fuerza mayor o por falta o disminucion de trabajo no imputable al empleador fehacientemente justificada, el trabajador tendra derecho a percibir una indemnizacion equivalente a la mitad de la prevista en el articulo 245.',
'https://servicios.infoleg.gob.ar/infolegInternet/anexos/25000-29999/25552/texact.htm'
);
GO

-- ══════════════════════════════════════════════════════════════
-- 2. CPCCN — Ley 17.454 (Codigo Procesal Civil y Comercial de la Nacion)
--    Decreto PEN 20/09/1967. BO 07/11/1967. Multiples modificaciones.
-- ══════════════════════════════════════════════════════════════
INSERT INTO Leyes (numero, nombre, tipo, organismo, fecha_sancion, fecha_promulgacion, fecha_vigencia,
    boletin_numero, boletin_fecha, area, resumen, texto, url_infoleg)
VALUES (
'17454',
'Codigo Procesal Civil y Comercial de la Nacion (CPCCN)',
'ley',
'Poder Ejecutivo Nacional',
'1967-09-20', '1967-09-20', '1968-02-01',
'21308', '1967-11-07',
'Civil',
'Regula el proceso civil y comercial ante los tribunales nacionales. Comprende competencia, actos procesales, prueba, juicios ordinario, sumarisimo y ejecutivo, medidas cautelares, recursos y ejecucion de sentencias. Multiples modificaciones posteriores.',
'LIBRO I — DISPOSICIONES GENERALES

TITULO I — ORGANOS JUDICIALES Y SUS AUXILIARES

Art. 1 — Caracter de la competencia. La competencia atribuida a los tribunales nacionales es improrrogable. Exceptuase la competencia territorial en asuntos exclusivamente patrimoniales, que podra ser prorrogada de conformidad de partes.

Art. 4 — Deber de los jueces. Toda demanda debera interponerse ante juez competente, y siempre que de la exposicion de los hechos resultare no ser de la competencia del juez ante quien se deduce, debera inhibirse de oficio.

Art. 5 — Reglas generales. La competencia se determinara por la naturaleza de las pretensiones deducidas en la demanda y no por las defensas opuestas por el demandado.

TITULO IV — PARTES

Art. 27 — Representacion de personas juridicas. Las personas de existencia ideal seran representadas en juicio por los organos o representantes que la ley o el contrato social establezca.

Art. 56 — Honorarios del defensor oficial. En los casos en que actue el defensor oficial, el juez regulara sus honorarios con arreglo a la ley arancelaria.

TITULO V — ACTOS PROCESALES

Art. 115 — Idioma. En todos los actos del proceso se utilizara el idioma nacional.

Art. 120 — Copias. De todo escrito del que deba darse traslado y de sus contestaciones, de los que tengan por objeto ofrecer prueba, promover incidentes o constituir nuevo domicilio y de los documentos con ellos agregados, deberan acompanarse tantas copias firmadas como partes intervengan.

Art. 124 — Cargo. Los escritos en los que se deduzca demanda, se contraiga litisconsorte o se formule peticion que deba notificarse personalmente o por cedula, se presentaran al tribunal en dos ejemplares. El secretario o el oficial primero pondran cargo en el original y en la copia.

Art. 155 — Notificacion personal. Las resoluciones judiciales quedan notificadas en todas las instancias los dias martes y viernes, o el siguiente dia habil si alguno de ellos fuere feriado.

Art. 172 — Procedimiento. La cedula se entregara al interesado o a persona de la casa, si aquel no se encontrare. La persona que recibiere la cedula debera firmar el acuse.

LIBRO II — PROCESOS DE CONOCIMIENTO

Art. 319 — Ambito de aplicacion del juicio ordinario. Todas las contiendas judiciales que no tuvieren senalada una tramitacion especial seran ventiladas en juicio ordinario.

Art. 330 — Forma de la demanda. La demanda debera expresar: nombre y domicilio del demandante; nombre y domicilio del demandado; la cosa demandada, designandola con toda exactitud; los hechos en que se funda, explicados claramente; el derecho expuesto sucintamente, evitando repeticiones innecesarias; la peticion en terminos claros y positivos.

Art. 334 — Documentos posteriores o desconocidos. Despues de interpuesta la demanda, no se admitiran al actor sino documentos de fecha posterior o anteriores bajo juramento de no haber tenido antes conocimiento de ellos.

Art. 338 — Traslado de la demanda. Presentada la demanda en la forma prescripta, el juez dara traslado de ella al demandado para que la conteste dentro del plazo de QUINCE (15) dias.

Art. 346 — Excepciones admisibles. Solo se admitiran como previas las siguientes excepciones: incompetencia; falta de personeria; defecto legal en el modo de proponer la demanda; litispendencia; cosa juzgada; transaccion, conciliacion y desistimiento del derecho; defensas temporarias; prescripcion; arraigo.

Art. 360 — Audiencia preliminar. A partir de la contestacion de la demanda o reconvencion, en su caso, el juez citara a las partes a una audiencia preliminar en los terminos del art. 360 (conf. reforma Ley 25.488).

LIBRO III — PROCESOS DE EJECUCION

Art. 523 — Titulos que traen aparejada ejecucion. La ejecucion puede promoverse en virtud de los siguientes titulos: instrumento publico presentado en forma; instrumento privado suscripto por el obligado; confesion de deuda liquida con juramento; cuenta aprobada; convenio homologado; credito por alquileres o arrendamientos de inmuebles; letra de cambio; factura de credito; cheque; pagare; convenio de honorarios.

Art. 545 — Sentencia de remate. Trabado el embargo, se citara al deudor de remate para que dentro del plazo de CINCO (5) dias, oponga excepciones.

LIBRO IV — PROCESOS ESPECIALES

Art. 676 — Demanda de desalojo. En los juicios de desalojo por falta de pago o por vencimiento del contrato, el demandado podra oponer excepciones dentro del plazo para contestar la demanda.

LIBRO II — MEDIDAS CAUTELARES

Art. 195 — Oportunidad y presupuestos. Las medidas cautelares podran ser solicitadas antes o despues de deducida la demanda, a menos que de la ley resultare que esta debe entablarse previamente. El juez debera apreciar la verosimilitud del derecho, el peligro en la demora y el contracautela ofrecida.

Art. 199 — Contracautela. La medida cautelar solo podra decretarse bajo la responsabilidad de la parte que la solicitare, quien debera dar contracautela suficiente.

Art. 209 — Embargo preventivo. Puede pedirse embargo preventivo: el que tenga credito en dinero o en especie contra persona de existencia visible o juridica cuando hubiere motivo para temer que los bienes del deudor se dilapidaran o fueren ocultados para impedir la ejecucion.

Art. 212 — Embargo sobre salarios. No procede el embargo sobre salarios, sueldos o remuneraciones en la cantidad que no exceda del minimo vital y movil. Solo podra embargarse hasta un veinte por ciento (20%) del excedente.

RECURSOS

Art. 242 — Resoluciones apelables. El recurso de apelacion, salvo disposicion en contrario, procede de las resoluciones definitivas, de las interlocutorias y de las providencias simples que causen gravamen que no pueda ser reparado por la sentencia definitiva.

Art. 282 — Queja por apelacion denegada. Si el juez denegare la apelacion, la parte que se considere agraviada podra recurrir directamente en queja ante la Camara, pidiendo que se le otorgue el recurso denegado.',
'https://servicios.infoleg.gob.ar/infolegInternet/anexos/15000-19999/16547/texact.htm'
);
GO

-- ══════════════════════════════════════════════════════════════
-- 3. CPCCBA — Decreto-Ley 7425/68 (Codigo Procesal Civil y Comercial Pcia. Bs As)
--    Vigente con modificaciones, ultima: Ley 15.513 (12/12/2024)
-- ══════════════════════════════════════════════════════════════
INSERT INTO Leyes (numero, nombre, tipo, organismo, fecha_sancion, fecha_promulgacion, fecha_vigencia,
    boletin_numero, boletin_fecha, area, resumen, texto, url_infoleg)
VALUES (
'7425',
'Codigo Procesal Civil y Comercial de la Provincia de Buenos Aires (CPCCBA)',
'ley',
'Gobierno de la Provincia de Buenos Aires',
'1968-10-24', '1968-10-24', '1969-01-01',
NULL, '1968-10-24',
'Civil',
'Regula el proceso civil y comercial ante los tribunales de la Provincia de Buenos Aires. Estructura similar al CPCCN con particularidades propias del fuero provincial. Ultima modificacion: Ley 15.513 de la Provincia de Buenos Aires (B.O. 12/12/2024) que modifica disposiciones sobre prueba de informe, titulos ejecutivos y alimentos.',
'LIBRO I — DISPOSICIONES GENERALES

TITULO I — ORGANOS JUDICIALES

Art. 1 — Caracter de la competencia. La competencia atribuida a los tribunales de la Provincia es improrrogable, salvo la territorial en asuntos exclusivamente patrimoniales.

Art. 5 — Reglas generales. La competencia se determinara por la naturaleza de las pretensiones deducidas en la demanda y no por las defensas opuestas. Sera competente el juez del lugar pactado para el cumplimiento de la obligacion.

Art. 6 — Reglas especiales. Es competente el juez del lugar en que deba cumplirse la obligacion (materia contractual); el del domicilio del demandado (accion personal); el del lugar de situacion del bien (derechos reales); el del ultimo domicilio conyugal (familia).

Art. 14 — Recusacion sin causa. En los juicios ordinarios y sumarios cada parte podra recusar sin expresion de causa a UNO (1) de los jueces de primera instancia. En los procesos sumarísimos y en los incidentes no se admite la recusacion sin causa.

TITULO V — ACTOS PROCESALES

Art. 57 — Copias. De todo escrito del que deba darse traslado y de sus contestaciones, de los que tengan por objeto ofrecer prueba, se deberan acompañar tantas copias firmadas como partes intervengan.

Art. 63 — Notificacion por cedula. Se notificara por cedula: la demanda y reconvencion y sus contestaciones; las providencias que dispongan apertura a prueba y designacion de fechas para absolucion de posiciones; sentencias definitivas e interlocutorias; las que dispongan intimaciones o apercibimientos.

Art. 133 — Notificacion automatica. Las resoluciones judiciales quedan notificadas los dias martes y viernes habiles. Si uno de esos dias fuere feriado, la notificacion tendra lugar el siguiente dia habil.

LIBRO II — PROCESOS DE CONOCIMIENTO

Art. 330 — Demanda. La demanda debera expresar: nombre, domicilio y datos del demandante y demandado; la cosa demandada; los hechos en que se funda; el derecho; la peticion.

Art. 338 — Traslado. Presentada la demanda, el juez dara traslado al demandado por QUINCE (15) dias en los juicios ordinarios.

Art. 344 — Excepciones previas. Dentro del plazo para contestar la demanda, el demandado podra oponer: incompetencia; falta de personeria; litispendencia; defecto legal; cosa juzgada; transaccion; prescripcion; arraigo.

Art. 360 — Apertura a prueba. Contestada la demanda, y si hubiere hechos controvertidos, el juez abrira la causa a prueba por un periodo que no exceda de CUARENTA (40) dias, salvo que el proceso fuere ordinario amplio (60 dias).

LIBRO III — PROCESOS DE EJECUCION

Art. 521 — Titulos ejecutivos. La ejecucion puede promoverse en virtud de: instrumento publico; instrumento privado; confesion de deuda; credito por alquileres; letra de cambio; pagare; cheque.

Art. 540 — Excepciones. Dentro del plazo de CINCO (5) dias de la intimacion de pago y embargo, el deudor podra oponer excepciones.

MEDIDAS CAUTELARES

Art. 195 — Requisitos. Para la procedencia de las medidas cautelares se requerira: a) verosimilitud del derecho invocado; b) peligro en la demora; c) contracautela.

Art. 226 — Inhibicion general de bienes. En todos los casos en que habiendo lugar a embargo este no pudiere hacerse efectivo por no conocerse bienes del deudor o por no cubrir estos el importe del credito reclamado, podra solicitarse la inhibicion general.

RECURSOS

Art. 242 — Apelabilidad. El recurso de apelacion procede de las resoluciones definitivas, de las interlocutorias y de las providencias simples que causen gravamen no reparable por la sentencia definitiva.

Art. 254 — Segunda instancia. Concedida la apelacion, el apelante debera fundar el recurso ante la Camara mediante la expresion de agravios dentro del plazo de DIEZ (10) dias de notificada la providencia que disponga la radicacion de los autos ante la Camara.

JUICIO SUMARIO Y SUMARISIMO

Art. 484 — Proceso sumario. En el proceso sumario rigen las disposiciones del ordinario con las siguientes modificaciones: el plazo de contestacion es de DIEZ (10) dias; no hay periodo de prueba si no existen hechos controvertidos; la expresion de agravios se presenta en la primera instancia.

PARTICULARIDADES RESPECTO DEL CPCCN

- El CPCCBA no contempla la audiencia preliminar obligatoria del art. 360 CPCCN del mismo modo.
- Los plazos de apelacion son en dias habiles judiciales.
- La Camara de Apelacion en lo Civil y Comercial de cada departamento judicial es el tribunal revisor de primera instancia.
- El STJ de la Provincia de Buenos Aires entiende en recursos extraordinarios.',
'https://normas.gba.gob.ar/ar-b/decreto-ley/1968/7425/1'
);
GO

-- ══════════════════════════════════════════════════════════════
-- 4. LPA — Ley 19.549 (Ley Nacional de Procedimiento Administrativo)
--    Sancion: 03/04/1972. BO 27/04/1972.
--    Reforma integral por Ley 27.742 (Bases), B.O. 08/07/2024
-- ══════════════════════════════════════════════════════════════
INSERT INTO Leyes (numero, nombre, tipo, organismo, fecha_sancion, fecha_promulgacion, fecha_vigencia,
    boletin_numero, boletin_fecha, area, resumen, texto, url_infoleg)
VALUES (
'19549',
'Ley Nacional de Procedimiento Administrativo (LPA)',
'ley',
'Poder Ejecutivo Nacional',
'1972-04-03', '1972-04-03', '1972-04-27',
'22411', '1972-04-27',
'Comercial',
'Regula el procedimiento ante la Administracion Publica Nacional centralizada y descentralizada. Reformada integralmente por la Ley 27.742 (Ley Bases), B.O. 08/07/2024. Reglamentada por Decreto 1759/72 (T.O. 1991 por Decreto 1883/91).',
'TITULO I — PROCEDIMIENTO ADMINISTRATIVO

Art. 1 — Ambito de aplicacion. Las normas del procedimiento que se aplicara ante la Administracion Publica Nacional centralizada y descentralizada, inclusive entes autarquicos, con excepcion de los organismos militares y de defensa y seguridad, se ajustaran a las propias de la presente ley, incluyendo el Poder Legislativo y el Poder Judicial cuando ejerzan funcion administrativa. En forma supletoria, aplicara tambien a los entes publicos no estatales y a las personas privadas cuando ejerzan potestades publicas. (Conf. reforma Ley 27.742, 2024)

Principios del procedimiento administrativo:
a) Impulsion e instruccion de oficio.
b) Celeridad, economia, sencillez y eficacia en los tramites.
c) Informalismo a favor del administrado.
d) Debido proceso adjetivo: derecho a ser oido; derecho a ofrecer y producir prueba; derecho a una decision fundada.

TITULO II — ACTO ADMINISTRATIVO

Art. 7 — Requisitos esenciales del acto administrativo. El acto administrativo debera reunir los siguientes requisitos esenciales:
a) Competencia: dictado por autoridad competente.
b) Causa: deberan sustentarse en los hechos y antecedentes que le sirvan de causa y en el derecho aplicable.
c) Objeto: el objeto debe ser cierto, licito, posible fisica y juridicamente.
d) Procedimientos: antes de su emision deben cumplirse los procedimientos esenciales y sustanciales previstos y los que resulten implicitos del ordenamiento juridico. Respeto a la tutela administrativa efectiva.
e) Motivacion: expresion de las razones que inducen a emitir el acto.
f) Finalidad: debe cumplirse con la finalidad que resulte de las normas que otorgan las facultades pertinentes.

Art. 14 — Nulidad. El acto administrativo es nulo, de nulidad absoluta e insanable en los siguientes casos:
a) cuando la voluntad de la Administracion resultare excluida por dolo, violencia o error esencial;
b) cuando fuere emitido mediando incompetencia en razon de la materia, del territorio, del tiempo o del grado;
c) cuando fuere irregular la declaracion de voluntad contenida en el acto;
d) por violacion de la ley aplicable, de las formas esenciales, o por la existencia de una finalidad distinta de la prevista en la norma que otorga las facultades.

Art. 17 — Revocacion del acto nulo. El acto administrativo afectado de nulidad absoluta se considera irregular y debe ser revocado o sustituido en sede administrativa. Una vez notificado, si hubiere generado derechos subjetivos que se esten cumpliendo, no procedera su revocacion y solo se podra obtener su declaracion de nulidad en sede judicial.

Art. 18 — Revocacion del acto regular. El acto administrativo regular del que hubieren nacido derechos subjetivos a favor de los administrados no puede ser revocado, modificado o sustituido en sede administrativa una vez notificado.

TITULO III — IMPUGNACION DEL ACTO ADMINISTRATIVO

Art. 23 — Revision en sede judicial. Los actos administrativos de alcance particular podran ser impugnados por via judicial cuando: a) revistan caracter definitivo y se hubieren agotado las instancias administrativas; b) importen la denegacion tacita del derecho pretendido; c) mediare una vía de hecho.

Art. 24 — Impugnacion de reglamentos. El acto de alcance general sera impugnable por via judicial cuando un interesado a quien el acto afecte o pueda afectar en forma cierta e inminente, hubiere formulado reclamo ante la autoridad que lo dicto.

Art. 25 — Plazos para impugnar. La accion contra el Estado o sus entes autarquicos debera deducirse dentro del plazo perentorio de NOVENTA (90) dias habiles judiciales. El plazo se computara a partir del dia siguiente al de la notificacion al interesado de la resolucion definitiva.

Art. 30 — Reclamo administrativo previo. El Estado nacional no podra ser demandado judicialmente sin previo reclamo administrativo dirigido al Ministerio o Secretaria de la Presidencia o autoridad superior de la entidad descentralizada. (Conf. reforma Ley 27.742, 2024)

Art. 31 — Plazo de resolucion del reclamo. El pronunciamiento debera efectuarse dentro de los NOVENTA (90) dias de formulado el reclamo. Si el organo administrativo no se pronunciare en el plazo indicado, el interesado requerira pronto despacho y si transcurrieren otros CUARENTA Y CINCO (45) dias, se configurara silencio de la Administracion.

RECURSOS ADMINISTRATIVOS (Decreto Reglamentario 1759/72)

- Recurso de reconsideracion: ante el mismo organo que dicto el acto. Plazo: 10 dias habiles.
- Recurso jerarquico: ante el superior jerarquico. Plazo: 15 dias habiles.
- Recurso de alzada: contra los actos definitivos de entes autarquicos. Plazo: 15 dias habiles.
- Recurso extraordinario de revision: fundado en error de hecho, documentos desconocidos, prevaricato o cohecho.',
'https://servicios.infoleg.gob.ar/infolegInternet/anexos/20000-24999/22363/texact.htm'
);
GO

-- ══════════════════════════════════════════════════════════════
-- 5. LRT — Ley 24.557 (Ley de Riesgos del Trabajo)
--    Sancion: 13/09/1995. BO 04/10/1995.
--    Modificaciones: Dec. 1278/2000; Ley 26.773 (2012); Ley 27.348 (2017)
-- ══════════════════════════════════════════════════════════════
INSERT INTO Leyes (numero, nombre, tipo, organismo, fecha_sancion, fecha_promulgacion, fecha_vigencia,
    boletin_numero, boletin_fecha, area, resumen, texto, url_infoleg)
VALUES (
'24557',
'Ley de Riesgos del Trabajo (LRT)',
'ley',
'Honorable Congreso de la Nacion',
'1995-09-13', '1995-10-03', '1995-10-04',
'28242', '1995-10-04',
'Laboral',
'Regula la prevencion de riesgos laborales, las contingencias cubiertas (accidentes de trabajo y enfermedades profesionales) y las prestaciones dinerarias y en especie a cargo de las Aseguradoras de Riesgos del Trabajo (ART). Modificada por Ley 26.773 (B.O. 26/10/2012) y Ley 27.348 (B.O. 24/02/2017). Reglamentada por Dec. 1694/2009.',
'TITULO I — OBJETIVOS Y AMBITO DE APLICACION

Art. 1 — Normativa aplicable y objetivos. La prevencion de los riesgos y la reparacion de los danos derivados del trabajo se regiran por esta LRT y sus normas reglamentarias.
Son objetivos:
a) Reducir la siniestralidad laboral mediante la prevencion de los riesgos derivados del trabajo.
b) Reparar los danos derivados de accidentes de trabajo y de enfermedades profesionales, incluyendo la rehabilitacion del trabajador damnificado.
c) Promover la recalificacion y la recolocacion de los trabajadores damnificados.
d) Promover la negociacion colectiva laboral para la mejora de las medidas de prevencion y de las prestaciones reparadoras.

Art. 2 — Ambito de aplicacion. Estan obligatoriamente incluidos en el ambito de la LRT:
a) Los funcionarios y empleados del sector publico nacional, de las provincias y sus municipios y de la CABA.
b) Los trabajadores en relacion de dependencia del sector privado.
c) Las personas obligadas a prestar un servicio de carga publica.

TITULO II — PREVENCION DE LOS RIESGOS DEL TRABAJO

Art. 4 — Obligaciones de las partes. Los empleadores y los trabajadores comprendidos en la LRT, asi como las ART, estan obligados a adoptar las medidas legalmente previstas para prevenir eficazmente los riesgos del trabajo.

TITULO III — CONTINGENCIAS Y SITUACIONES CUBIERTAS

Art. 6 — Contingencias. Se consideran accidente de trabajo a todo acontecimiento subito y violento ocurrido por el hecho o en ocasion del trabajo, o en el trayecto entre el domicilio del trabajador y el lugar de trabajo.
Se consideran enfermedades profesionales aquellas que se encuentran incluidas en el listado de enfermedades profesionales. La determinacion de una nueva enfermedad profesional se hara de conformidad con el procedimiento del art. 40 ap. 3 de la LRT.
No estan comprendidos los accidentes de trabajo y enfermedades profesionales causados por dolo del trabajador o por fuerza mayor extrana al trabajo.

Art. 7 — Incapacidad Laboral Temporaria (ILT). Existe situacion de ILT cuando el dano sufrido por el trabajador le impida temporariamente la realizacion de sus tareas habituales. La situacion de ILT cesa por: a) alta medica; b) declaracion del estado de ILP; c) transcurso de UN (1) ano desde la primera manifestacion invalidante.

Art. 8 — Incapacidad Laboral Permanente (ILP). Existe situacion de ILP cuando el dano sufrido por el trabajador le ocasione una disminucion permanente de su capacidad laborativa. La ILP sera total (ILPT) cuando la disminucion de la capacidad laborativa sea igual o superior al 66%.

TITULO IV — PRESTACIONES DINERARIAS

Art. 11 — Prestaciones dinerarias. Las prestaciones dinerarias por ILT se calculan sobre el valor mensual del ingreso base. La ILP total genera una prestacion de pago unico.

Art. 14 — Prestaciones por ILP. Producida la consolidacion juridica y medica de las lesiones, el damnificado recibira:
2. Si la incapacidad fuere permanente parcial, y el porcentaje de incapacidad fuere igual o inferior al cincuenta por ciento (50%), la prestacion sera de pago unico. Si fuere superior al cincuenta por ciento (50%) e inferior al sesenta y seis por ciento (66%), el damnificado podra optar entre una renta periodica o un pago unico.

Art. 15 — Prestaciones por ILPT. La ILP total genera una renta periodica o pago unico, a opcion del damnificado.

Art. 17 — Prestaciones por gran invalidez. Cuando el damnificado en situacion de ILPT necesite la asistencia continua de otra persona para realizar los actos elementales de su vida, recibira ademas una prestacion de pago mensual equivalente a la remuneracion prevista en el CCT para la categoria de peón general.

Art. 18 — Muerte del damnificado. Los derechohabientes del trabajador fallecido recibiran una renta periodica o un pago unico, a opcion de ellos.

TITULO VI — GESTION DE LAS PRESTACIONES

Art. 26 — Aseguradoras de Riesgos del Trabajo. Las ART son entidades de derecho privado, previamente autorizadas por la Superintendencia de Riesgos del Trabajo. Los empleadores podran auto-asegurarse si acreditan solvencia economica-financiera.

TITULO IX — RESPONSABILIDAD CIVIL DEL EMPLEADOR

Art. 39 — Responsabilidad civil. Las prestaciones de la LRT eximen al empleador de toda responsabilidad civil, salvo que el dano se deba a dolo del empleador o de sus dependientes. La CSJN en Aquino (Fallos 327:3753, 2004) declaro inconstitucional este articulo en cuanto impide la accion por derecho comun cuando hay culpa del empleador.

TITULO VII — COMISIONES MEDICAS

Art. 21 — Comisiones medicas. Las comisiones medicas y la Comision Medica Central son organismos que determinan: a) la naturaleza laboral del accidente o la enfermedad profesional; b) el caracter y el grado de la incapacidad; c) el contenido y alcances de las prestaciones en especie.

REFORMA LEY 26.773 (2012): Eleva los pisos indemnizatorios. Establece que las prestaciones de la LRT no son acumulables con las del derecho civil. El damnificado o sus derechohabientes podran iniciar la accion civil o reclamar las prestaciones de la LRT, pero no podran optar por ambas vias en forma simultanea.

REFORMA LEY 27.348 (2017): Establece el agotamiento obligatorio de la instancia ante las Comisiones Medicas como instancia previa y obligatoria antes de iniciar cualquier accion judicial.',
'https://servicios.infoleg.gob.ar/infolegInternet/anexos/25000-29999/27971/texact.htm'
);
GO

PRINT 'Script 10_leyes_principales.sql ejecutado correctamente.';
SELECT numero, nombre, area, LEFT(resumen,60) AS resumen_corto FROM Leyes
WHERE numero IN ('20744','17454','7425','19549','24557')
ORDER BY area, numero;
GO
