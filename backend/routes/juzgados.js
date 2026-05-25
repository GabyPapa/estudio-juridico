const router = require('express').Router();
const { query } = require('../db');
const { authMiddleware, requireRol } = require('../middleware/auth');

const BASE_SELECT = `
  SELECT j.*,
    (SELECT COUNT(*) FROM SecretariasJuzgado s WHERE s.id_juzgado = j.id) AS total_secretarias
  FROM Juzgados j
`;

// ── GET /api/juzgados ─────────────────────────────────────
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { fuero, jurisdiccion, q } = req.query;
    const where  = [];
    const params = {};
    if (fuero)        { where.push('j.fuero = @fuero');               params.fuero        = fuero; }
    if (jurisdiccion) { where.push('j.jurisdiccion = @jurisdiccion'); params.jurisdiccion = jurisdiccion; }
    if (q)            { where.push('(j.nombre LIKE @q OR j.nombre_juez LIKE @q OR j.calle LIKE @q)'); params.q = `%${q}%`; }

    const sql = BASE_SELECT +
      (where.length ? ' WHERE ' + where.join(' AND ') : '') +
      ' ORDER BY j.fuero, j.numero';
    const r = await query(sql, params);
    res.json(r.recordset);
  } catch (err) {
    console.error('[juzgados GET /]', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// ── GET /api/juzgados/fueros ──────────────────────────────
router.get('/fueros', authMiddleware, async (req, res) => {
  try {
    const r = await query('SELECT DISTINCT fuero FROM Juzgados ORDER BY fuero');
    res.json(r.recordset.map(x => x.fuero));
  } catch (err) {
    console.error('[juzgados/fueros]', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// ── GET /api/juzgados/:id ─────────────────────────────────
router.get('/:id', authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
  try {
    const r = await query(BASE_SELECT + ' WHERE j.id = @id', { id });
    if (!r.recordset[0]) return res.status(404).json({ error: 'No encontrado' });

    const secs = await query(
      'SELECT * FROM SecretariasJuzgado WHERE id_juzgado = @id ORDER BY numero',
      { id }
    );
    res.json({ ...r.recordset[0], secretarias: secs.recordset });
  } catch (err) {
    console.error('[juzgados GET /:id]', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// ── POST /api/juzgados (admin + socio) ───────────────────
router.post('/', authMiddleware, requireRol('administrador', 'socio'), async (req, res) => {
  const { numero, nombre, fuero, jurisdiccion, camara, nombre_juez, calle, numero_calle,
          piso, oficina, cp, localidad, provincia, telefono, fax, email, horario, observaciones } = req.body;
  if (!nombre || !fuero) return res.status(400).json({ error: 'nombre y fuero son requeridos' });
  try {
    const r = await query(
      `INSERT INTO Juzgados (numero,nombre,fuero,jurisdiccion,camara,nombre_juez,calle,numero_calle,
        piso,oficina,cp,localidad,provincia,telefono,fax,email,horario,observaciones)
       OUTPUT INSERTED.*
       VALUES (@numero,@nombre,@fuero,@jurisdiccion,@camara,@nombre_juez,@calle,@numero_calle,
        @piso,@oficina,@cp,@localidad,@provincia,@telefono,@fax,@email,@horario,@observaciones)`,
      {
        numero: numero || null, nombre, fuero, jurisdiccion: jurisdiccion || 'Nacional',
        camara: camara || null, nombre_juez: nombre_juez || null,
        calle: calle || null, numero_calle: numero_calle || null,
        piso: piso || null, oficina: oficina || null, cp: cp || null,
        localidad: localidad || 'CABA', provincia: provincia || 'Buenos Aires',
        telefono: telefono || null, fax: fax || null, email: email || null,
        horario: horario || null, observaciones: observaciones || null,
      }
    );
    res.status(201).json(r.recordset[0]);
  } catch (err) {
    console.error('[juzgados POST /]', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// ── PUT /api/juzgados/:id (admin + socio) ────────────────
router.put('/:id', authMiddleware, requireRol('administrador', 'socio'), async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
  const { numero, nombre, fuero, jurisdiccion, camara, nombre_juez, calle, numero_calle,
          piso, oficina, cp, localidad, provincia, telefono, fax, email, horario, observaciones, activo } = req.body;
  try {
    const r = await query(
      `UPDATE Juzgados SET numero=@numero,nombre=@nombre,fuero=@fuero,jurisdiccion=@jurisdiccion,
        camara=@camara,nombre_juez=@nombre_juez,calle=@calle,numero_calle=@numero_calle,
        piso=@piso,oficina=@oficina,cp=@cp,localidad=@localidad,provincia=@provincia,
        telefono=@telefono,fax=@fax,email=@email,horario=@horario,observaciones=@observaciones,activo=@activo
       OUTPUT INSERTED.* WHERE id=@id`,
      {
        numero: numero || null, nombre, fuero, jurisdiccion: jurisdiccion || 'Nacional',
        camara: camara || null, nombre_juez: nombre_juez || null,
        calle: calle || null, numero_calle: numero_calle || null,
        piso: piso || null, oficina: oficina || null, cp: cp || null,
        localidad: localidad || 'CABA', provincia: provincia || 'Buenos Aires',
        telefono: telefono || null, fax: fax || null, email: email || null,
        horario: horario || null, observaciones: observaciones || null,
        activo: activo !== false ? 1 : 0, id,
      }
    );
    if (!r.recordset[0]) return res.status(404).json({ error: 'No encontrado' });
    res.json(r.recordset[0]);
  } catch (err) {
    console.error('[juzgados PUT /:id]', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// ── POST /api/juzgados/:id/secretarias ───────────────────
router.post('/:id/secretarias', authMiddleware, requireRol('administrador', 'socio'), async (req, res) => {
  const id_juzgado = parseInt(req.params.id);
  const { numero, nombre_secretario, telefono, telefono_int, piso, email, observaciones } = req.body;
  if (!numero) return res.status(400).json({ error: 'numero es requerido' });
  try {
    const r = await query(
      `INSERT INTO SecretariasJuzgado (id_juzgado,numero,nombre_secretario,telefono,telefono_int,piso,email,observaciones)
       OUTPUT INSERTED.*
       VALUES (@id_juzgado,@numero,@nombre_secretario,@telefono,@telefono_int,@piso,@email,@observaciones)`,
      {
        id_juzgado, numero,
        nombre_secretario: nombre_secretario || null,
        telefono: telefono || null, telefono_int: telefono_int || null,
        piso: piso || null, email: email || null, observaciones: observaciones || null,
      }
    );
    res.status(201).json(r.recordset[0]);
  } catch (err) {
    console.error('[juzgados POST secretarias]', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// ── PUT /api/juzgados/secretarias/:sid ───────────────────
router.put('/secretarias/:sid', authMiddleware, requireRol('administrador', 'socio'), async (req, res) => {
  const sid = parseInt(req.params.sid);
  const { numero, nombre_secretario, telefono, telefono_int, piso, email, observaciones } = req.body;
  try {
    const r = await query(
      `UPDATE SecretariasJuzgado SET numero=@numero,nombre_secretario=@nombre_secretario,
        telefono=@telefono,telefono_int=@telefono_int,piso=@piso,email=@email,observaciones=@observaciones
       OUTPUT INSERTED.* WHERE id=@sid`,
      {
        numero, nombre_secretario: nombre_secretario || null,
        telefono: telefono || null, telefono_int: telefono_int || null,
        piso: piso || null, email: email || null, observaciones: observaciones || null, sid,
      }
    );
    if (!r.recordset[0]) return res.status(404).json({ error: 'No encontrada' });
    res.json(r.recordset[0]);
  } catch (err) {
    console.error('[juzgados PUT secretaria]', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// ── DELETE /api/juzgados/:id (admin) ──────────────────────
router.delete('/:id', authMiddleware, requireRol('administrador'), async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
  try {
    await query('DELETE FROM Juzgados WHERE id = @id', { id });
    res.json({ ok: true });
  } catch (err) {
    console.error('[juzgados DELETE /:id]', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

module.exports = router;
