const router = require('express').Router();
const { query, sql } = require('../db');
const { authMiddleware, requireRol } = require('../middleware/auth');

const BASE_SELECT = `
  SELECT e.*,
    c.razon        AS cliente_razon,
    c.email        AS cliente_email,
    c.tel          AS cliente_tel,
    c.contacto     AS cliente_contacto,
    a.nombre       AS abogado_nombre,
    a.matricula    AS abogado_matricula,
    a.especialidad AS abogado_especialidad
  FROM Expedientes e
  LEFT JOIN Clientes c ON c.id = e.id_cliente
  LEFT JOIN Abogados a ON a.id = e.id_abogado
`;

// ── GET /api/expedientes ──────────────────────────────────
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { area, estado, id_abogado } = req.query;
    const where  = [];
    const params = {};

    // BUG FIX: abogados solo ven sus propios expedientes en GET lista Y en GET por id
    if (req.user.rol === 'abogado' && req.user.id_abogado) {
      where.push('e.id_abogado = @id_abogado');
      params.id_abogado = req.user.id_abogado;
    } else if (id_abogado) {
      where.push('e.id_abogado = @id_abogado');
      params.id_abogado = parseInt(id_abogado);
    }
    if (area)   { where.push('e.area = @area');     params.area   = area;   }
    if (estado) { where.push('e.estado = @estado'); params.estado = estado; }

    const q = BASE_SELECT +
      (where.length ? ' WHERE ' + where.join(' AND ') : '') +
      ' ORDER BY e.creado_en DESC';

    const r = await query(q, params);
    res.json(r.recordset);
  } catch (err) {
    console.error('[expedientes GET /]', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// ── GET /api/expedientes/:id ──────────────────────────────
router.get('/:id', authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const where  = ['e.id = @id'];
    const params = { id };

    // BUG FIX: abogados no pueden ver el detalle de expedientes ajenos por ID directo
    if (req.user.rol === 'abogado' && req.user.id_abogado) {
      where.push('e.id_abogado = @id_abogado');
      params.id_abogado = req.user.id_abogado;
    }

    const r = await query(BASE_SELECT + ' WHERE ' + where.join(' AND '), params);
    if (!r.recordset[0]) return res.status(404).json({ error: 'No encontrado' });

    const m = await query(
      `SELECT mv.*, u.nombre AS usuario_nombre
       FROM MovimientosExpediente mv
       LEFT JOIN Usuarios u ON u.id = mv.id_usuario
       WHERE mv.id_expediente = @id
       ORDER BY mv.fecha DESC`,
      { id }
    );
    res.json({ ...r.recordset[0], movimientos: m.recordset });
  } catch (err) {
    console.error('[expedientes GET /:id]', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// ── POST /api/expedientes ─────────────────────────────────
router.post('/', authMiddleware, async (req, res) => {
  const { caratula, area, estado, id_cliente, id_abogado, juzgado, apertura, prox_fecha, notas } = req.body;
  if (!caratula || !area)
    return res.status(400).json({ error: 'caratula y area son requeridos' });

  try {
    // BUG FIX: número correlativo seguro usando MAX con transacción para evitar race condition
    const pool = await require('../db').getPool();
    const transaction = new (require('mssql').Transaction)(pool);
    await transaction.begin();

    let numero;
    let insertedId;
    try {
      const anio = new Date().getFullYear();
      const cntReq = transaction.request();
      cntReq.input('prefix', `EXP-${anio}-%`);
      const cntRes = await cntReq.query(
        `SELECT ISNULL(MAX(CAST(RIGHT(numero, 3) AS INT)), 0) + 1 AS siguiente
         FROM Expedientes WITH (UPDLOCK)
         WHERE numero LIKE @prefix`
      );
      const siguiente = cntRes.recordset[0].siguiente;
      numero = `EXP-${anio}-${String(siguiente).padStart(3, '0')}`;

      const insReq = transaction.request();
      insReq.input('numero',     numero);
      insReq.input('caratula',   caratula);
      insReq.input('area',       area);
      insReq.input('estado',     estado     || 'activo');
      insReq.input('id_cliente', id_cliente ? parseInt(id_cliente) : null);
      insReq.input('id_abogado', id_abogado ? parseInt(id_abogado) : null);
      insReq.input('juzgado',    juzgado    || null);
      insReq.input('apertura',   apertura   || null);
      insReq.input('prox_fecha', prox_fecha || null);
      insReq.input('notas',      notas      || null);
      const insRes = await insReq.query(
        `INSERT INTO Expedientes (numero,caratula,area,estado,id_cliente,id_abogado,juzgado,apertura,prox_fecha,notas)
         OUTPUT INSERTED.id
         VALUES (@numero,@caratula,@area,@estado,@id_cliente,@id_abogado,@juzgado,@apertura,@prox_fecha,@notas)`
      );
      insertedId = insRes.recordset[0].id;
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }

    // Log de creación (fuera de la transacción — no crítico)
    await query(
      `INSERT INTO MovimientosExpediente (id_expediente, descripcion, id_usuario)
       VALUES (@id_exp, @desc, @id_usr)`,
      { id_exp: insertedId, desc: 'Expediente creado', id_usr: req.user.id }
    ).catch(e => console.warn('[expedientes POST] Movimiento no registrado:', e.message));

    const created = await query(BASE_SELECT + ' WHERE e.id = @id', { id: insertedId });
    res.status(201).json(created.recordset[0]);
  } catch (err) {
    console.error('[expedientes POST]', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// ── PUT /api/expedientes/:id ──────────────────────────────
router.put('/:id', authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  const { caratula, area, estado, id_cliente, id_abogado, juzgado, apertura, prox_fecha, notas } = req.body;
  if (!caratula || !area)
    return res.status(400).json({ error: 'caratula y area son requeridos' });

  try {
    // BUG FIX: abogados solo pueden editar sus propios expedientes
    const prevQ  = req.user.rol === 'abogado' && req.user.id_abogado
      ? 'SELECT estado FROM Expedientes WHERE id = @id AND id_abogado = @id_abogado'
      : 'SELECT estado FROM Expedientes WHERE id = @id';
    const prevP  = req.user.rol === 'abogado' && req.user.id_abogado
      ? { id, id_abogado: req.user.id_abogado }
      : { id };
    const prev = await query(prevQ, prevP);
    if (!prev.recordset[0]) return res.status(404).json({ error: 'No encontrado o sin permiso' });
    const prevEstado = prev.recordset[0].estado;

    await query(
      `UPDATE Expedientes
       SET caratula=@caratula, area=@area, estado=@estado,
           id_cliente=@id_cliente, id_abogado=@id_abogado,
           juzgado=@juzgado, apertura=@apertura, prox_fecha=@prox_fecha, notas=@notas
       WHERE id=@id`,
      {
        caratula, area,
        estado:     estado     || 'activo',
        id_cliente: id_cliente ? parseInt(id_cliente) : null,
        id_abogado: id_abogado ? parseInt(id_abogado) : null,
        juzgado:    juzgado    || null,
        apertura:   apertura   || null,
        prox_fecha: prox_fecha || null,
        notas:      notas      || null,
        id,
      }
    );

    if (estado && estado !== prevEstado) {
      await query(
        `INSERT INTO MovimientosExpediente (id_expediente, descripcion, id_usuario)
         VALUES (@id_exp, @desc, @id_usr)`,
        { id_exp: id, desc: `Estado cambiado: ${prevEstado} → ${estado}`, id_usr: req.user.id }
      ).catch(e => console.warn('[expedientes PUT] Movimiento no registrado:', e.message));
    }

    const updated = await query(BASE_SELECT + ' WHERE e.id = @id', { id });
    res.json(updated.recordset[0]);
  } catch (err) {
    console.error('[expedientes PUT /:id]', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// ── POST /api/expedientes/:id/movimientos ─────────────────
router.post('/:id/movimientos', authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  const { descripcion } = req.body;
  if (!descripcion || !descripcion.trim())
    return res.status(400).json({ error: 'descripcion requerida' });

  try {
    await query(
      `INSERT INTO MovimientosExpediente (id_expediente, descripcion, id_usuario)
       VALUES (@id_exp, @desc, @id_usr)`,
      { id_exp: id, desc: descripcion.trim(), id_usr: req.user.id }
    );
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error('[expedientes POST movimientos]', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// ── DELETE /api/expedientes/:id (admin + socio) ───────────
router.delete('/:id', authMiddleware, requireRol('administrador', 'socio'), async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    // AlertasEnviadas se borra por CASCADE (ver schema)
    await query('DELETE FROM Expedientes WHERE id=@id', { id });
    res.json({ ok: true });
  } catch (err) {
    console.error('[expedientes DELETE /:id]', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

module.exports = router;
