const router = require('express').Router();
const { query } = require('../db');
const { authMiddleware, requireRol } = require('../middleware/auth');

// ── GET /api/abogados ─────────────────────────────────────
router.get('/', authMiddleware, async (req, res) => {
  try {
    const r = await query(
      `SELECT a.*,
         (SELECT COUNT(*) FROM Expedientes e
          WHERE e.id_abogado = a.id AND e.estado = 'activo') AS exp_activos
       FROM Abogados a
       ORDER BY a.nombre`
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
    const r = await query('SELECT * FROM Abogados WHERE id = @id', { id });
    if (!r.recordset[0]) return res.status(404).json({ error: 'No encontrado' });

    const exps = await query(
      `SELECT e.id, e.numero, e.caratula, e.area, e.estado, e.prox_fecha,
              c.razon AS cliente_razon
       FROM Expedientes e
       LEFT JOIN Clientes c ON c.id = e.id_cliente
       WHERE e.id_abogado = @id
       ORDER BY e.creado_en DESC`,
      { id }
    );
    res.json({ ...r.recordset[0], expedientes: exps.recordset });
  } catch (err) {
    console.error('[abogados GET /:id]', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// ── POST /api/abogados (admin + socio) ────────────────────
router.post('/', authMiddleware, requireRol('administrador', 'socio'), async (req, res) => {
  const { nombre, matricula, especialidad, email, tel, activo } = req.body;
  if (!nombre || !nombre.trim())
    return res.status(400).json({ error: 'nombre es requerido' });

  try {
    const r = await query(
      `INSERT INTO Abogados (nombre, matricula, especialidad, email, tel, activo)
       OUTPUT INSERTED.*
       VALUES (@nombre, @matricula, @especialidad, @email, @tel, @activo)`,
      {
        nombre:       nombre.trim(),
        matricula:    matricula    || null,
        especialidad: especialidad || null,
        email:        email        || null,
        tel:          tel          || null,
        activo:       activo !== false ? 1 : 0,
      }
    );
    res.status(201).json(r.recordset[0]);
  } catch (err) {
    console.error('[abogados POST /]', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// ── PUT /api/abogados/:id (admin + socio) ─────────────────
router.put('/:id', authMiddleware, requireRol('administrador', 'socio'), async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  const { nombre, matricula, especialidad, email, tel, activo } = req.body;
  if (!nombre || !nombre.trim())
    return res.status(400).json({ error: 'nombre es requerido' });

  try {
    const r = await query(
      `UPDATE Abogados
       SET nombre=@nombre, matricula=@matricula, especialidad=@especialidad,
           email=@email, tel=@tel, activo=@activo
       OUTPUT INSERTED.*
       WHERE id = @id`,
      {
        nombre:       nombre.trim(),
        matricula:    matricula    || null,
        especialidad: especialidad || null,
        email:        email        || null,
        tel:          tel          || null,
        activo:       activo ? 1 : 0,
        id,
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
