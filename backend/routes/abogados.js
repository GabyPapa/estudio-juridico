const router = require('express').Router();
const { query } = require('../db');
const { authMiddleware, requireRol } = require('../middleware/auth');

const CAMPOS_EXTRA = 'tipo,dni,fecha_nac,domicilio,localidad,provincia,cp,celular,notas_internas';

// ── GET /api/abogados ─────────────────────────────────────
router.get('/', authMiddleware, async (req, res) => {
  try {
    const r = await query(
      `SELECT a.*,
         ISNULL(a.tipo,'interno') AS tipo,
         (SELECT COUNT(*) FROM Expedientes e WHERE e.id_abogado=a.id AND e.estado='activo') AS exp_activos
       FROM Abogados a ORDER BY a.tipo, a.nombre`
    );
    res.json(r.recordset);
  } catch (err) {
    console.error('[abogados GET /]', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// ── GET /api/abogados/:id ─────────────────────────────────
router.get('/:id', authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
  try {
    const r = await query('SELECT * FROM Abogados WHERE id=@id', { id });
    if (!r.recordset[0]) return res.status(404).json({ error: 'No encontrado' });
    const exps = await query(
      `SELECT e.id,e.numero,e.caratula,e.area,e.estado,e.prox_fecha,c.razon AS cliente_razon
       FROM Expedientes e LEFT JOIN Clientes c ON c.id=e.id_cliente
       WHERE e.id_abogado=@id ORDER BY e.creado_en DESC`, { id }
    );
    const mats = await query(
      `SELECT am.*,c.nombre AS colegio_nombre,c.sigla AS colegio_sigla
       FROM AbogadosMatriculas am JOIN ColegiosAbogados c ON c.id=am.id_colegio
       WHERE am.id_abogado=@id ORDER BY am.fecha_inscripcion`, { id }
    );
    res.json({ ...r.recordset[0], expedientes: exps.recordset, matriculas: mats.recordset });
  } catch (err) {
    console.error('[abogados GET /:id]', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// ── POST /api/abogados ────────────────────────────────────
router.post('/', authMiddleware, requireRol('administrador', 'socio'), async (req, res) => {
  const { nombre,tipo,matricula,especialidad,email,tel,activo,
          dni,fecha_nac,domicilio,localidad,provincia,cp,celular,notas_internas } = req.body;
  if (!nombre?.trim()) return res.status(400).json({ error: 'nombre requerido' });
  try {
    const r = await query(
      `INSERT INTO Abogados (nombre,tipo,matricula,especialidad,email,tel,activo,
         dni,fecha_nac,domicilio,localidad,provincia,cp,celular,notas_internas)
       OUTPUT INSERTED.*
       VALUES (@nombre,@tipo,@matricula,@especialidad,@email,@tel,@activo,
         @dni,@fecha_nac,@domicilio,@localidad,@provincia,@cp,@celular,@notas_internas)`,
      {
        nombre:nombre.trim(), tipo:tipo||'interno',
        matricula:matricula||null, especialidad:especialidad||null,
        email:email||null, tel:tel||null, activo:activo!==false?1:0,
        dni:dni||null, fecha_nac:fecha_nac||null, domicilio:domicilio||null,
        localidad:localidad||null, provincia:provincia||null, cp:cp||null,
        celular:celular||null, notas_internas:notas_internas||null,
      }
    );
    res.status(201).json(r.recordset[0]);
  } catch (err) {
    console.error('[abogados POST /]', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// ── PUT /api/abogados/:id ─────────────────────────────────
router.put('/:id', authMiddleware, requireRol('administrador', 'socio'), async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
  const { nombre,tipo,matricula,especialidad,email,tel,activo,
          dni,fecha_nac,domicilio,localidad,provincia,cp,celular,notas_internas } = req.body;
  if (!nombre?.trim()) return res.status(400).json({ error: 'nombre requerido' });
  try {
    const r = await query(
      `UPDATE Abogados SET nombre=@nombre,tipo=@tipo,matricula=@matricula,especialidad=@especialidad,
        email=@email,tel=@tel,activo=@activo,dni=@dni,fecha_nac=@fecha_nac,domicilio=@domicilio,
        localidad=@localidad,provincia=@provincia,cp=@cp,celular=@celular,notas_internas=@notas_internas
       OUTPUT INSERTED.* WHERE id=@id`,
      {
        nombre:nombre.trim(), tipo:tipo||'interno',
        matricula:matricula||null, especialidad:especialidad||null,
        email:email||null, tel:tel||null, activo:activo!==false?1:0,
        dni:dni||null, fecha_nac:fecha_nac||null, domicilio:domicilio||null,
        localidad:localidad||null, provincia:provincia||null, cp:cp||null,
        celular:celular||null, notas_internas:notas_internas||null, id,
      }
    );
    if (!r.recordset[0]) return res.status(404).json({ error: 'No encontrado' });
    res.json(r.recordset[0]);
  } catch (err) {
    console.error('[abogados PUT /:id]', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

module.exports = router;
