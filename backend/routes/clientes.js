const router = require('express').Router();
const { query } = require('../db');
const { authMiddleware, requireRol } = require('../middleware/auth');

// ── GET /api/clientes ─────────────────────────────────────
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { tipo, area } = req.query;
    const where  = [];
    const params = {};
    if (tipo) { where.push('tipo = @tipo'); params.tipo = tipo; }
    if (area) { where.push('area = @area'); params.area = area; }
    const q = 'SELECT * FROM Clientes' +
      (where.length ? ' WHERE ' + where.join(' AND ') : '') +
      ' ORDER BY razon';
    const r = await query(q, params);
    res.json(r.recordset);
  } catch (err) {
    console.error('[clientes GET /]', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// ── GET /api/clientes/:id ─────────────────────────────────
router.get('/:id', authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
  try {
    const r = await query('SELECT * FROM Clientes WHERE id = @id', { id });
    if (!r.recordset[0]) return res.status(404).json({ error: 'No encontrado' });

    const exps = await query(
      `SELECT e.id, e.numero, e.caratula, e.area, e.estado, e.prox_fecha,
              a.nombre AS abogado_nombre
       FROM Expedientes e
       LEFT JOIN Abogados a ON a.id = e.id_abogado
       WHERE e.id_cliente = @id
       ORDER BY e.creado_en DESC`,
      { id }
    );
    res.json({ ...r.recordset[0], expedientes: exps.recordset });
  } catch (err) {
    console.error('[clientes GET /:id]', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// ── POST /api/clientes (admin + socio) ────────────────────
// BUG FIX: antes no tenía restricción de rol — cualquier abogado podía crear clientes vía API
router.post('/', authMiddleware, requireRol('administrador', 'socio'), async (req, res) => {
  const { razon, tipo, area, cuit, contacto, email, tel, notas } = req.body;
  if (!razon || !razon.trim())
    return res.status(400).json({ error: 'razon es requerida' });

  try {
    const r = await query(
      `INSERT INTO Clientes (razon, tipo, area, cuit, contacto, email, tel, notas)
       OUTPUT INSERTED.*
       VALUES (@razon, @tipo, @area, @cuit, @contacto, @email, @tel, @notas)`,
      {
        razon:    razon.trim(),
        tipo:     tipo     || 'potencial',
        area:     area     || null,
        cuit:     cuit     || null,
        contacto: contacto || null,
        email:    email    || null,
        tel:      tel      || null,
        notas:    notas    || null,
      }
    );
    res.status(201).json(r.recordset[0]);
  } catch (err) {
    console.error('[clientes POST /]', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// ── PUT /api/clientes/:id (admin + socio) ─────────────────
router.put('/:id', authMiddleware, requireRol('administrador', 'socio'), async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  const { razon, tipo, area, cuit, contacto, email, tel, notas } = req.body;
  if (!razon || !razon.trim())
    return res.status(400).json({ error: 'razon es requerida' });

  try {
    const r = await query(
      `UPDATE Clientes
       SET razon=@razon, tipo=@tipo, area=@area, cuit=@cuit,
           contacto=@contacto, email=@email, tel=@tel, notas=@notas
       OUTPUT INSERTED.*
       WHERE id = @id`,
      {
        razon: razon.trim(), tipo, area: area || null,
        cuit:  cuit || null, contacto: contacto || null,
        email: email || null, tel: tel || null,
        notas: notas || null, id,
      }
    );
    if (!r.recordset[0]) return res.status(404).json({ error: 'No encontrado' });
    res.json(r.recordset[0]);
  } catch (err) {
    console.error('[clientes PUT /:id]', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// ── DELETE /api/clientes/:id (admin + socio) ─────────────
router.delete('/:id', authMiddleware, requireRol('administrador', 'socio'), async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
  try {
    await query('DELETE FROM Clientes WHERE id = @id', { id });
    res.json({ ok: true });
  } catch (err) {
    console.error('[clientes DELETE /:id]', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

module.exports = router;
