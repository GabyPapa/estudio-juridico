const router  = require('express').Router({ mergeParams: true });
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const { query } = require('../db');
const { authMiddleware } = require('../middleware/auth');

// ── Uploads ───────────────────────────────────────────────
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'historia');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename:    (_req,  file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 30 * 1024 * 1024 } });

// ── Tipos de movimiento ───────────────────────────────────
router.get('/tipos', authMiddleware, async (_req, res) => {
  try {
    const r = await query('SELECT * FROM TiposMovimiento WHERE activo=1 ORDER BY orden, nombre');
    res.json(r.recordset);
  } catch { res.json([]); }
});

// ── Movimientos de un expediente ──────────────────────────
// GET /api/expedientes/:id/historia
router.get('/', authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
  try {
    const r = await query(
      `SELECT h.*, t.nombre AS tipo_nombre, t.icono AS tipo_icono, t.color AS tipo_color,
              a.nombre AS abogado_nombre
       FROM HistoriaExpediente h
       JOIN TiposMovimiento t ON t.id = h.id_tipo
       LEFT JOIN Abogados a   ON a.id = h.id_abogado
       WHERE h.id_expediente = @id
       ORDER BY h.fecha DESC, h.creado_en DESC`,
      { id }
    );
    res.json(r.recordset);
  } catch (err) { console.error('[historia GET]', err); res.status(500).json({ error: 'Error interno' }); }
});

// POST /api/expedientes/:id/historia  (con adjunto opcional)
router.post('/', authMiddleware, (req, res, next) => {
  upload.single('adjunto')(req, res, err => {
    if (err) return res.status(400).json({ error: err.message });
    next();
  });
}, async (req, res) => {
  const id_expediente = parseInt(req.params.id);
  if (isNaN(id_expediente)) return res.status(400).json({ error: 'ID inválido' });
  const { fecha, hora, id_tipo, descripcion, fojas, id_abogado, prox_paso, prox_fecha, importante } = req.body;
  if (!descripcion?.trim()) return res.status(400).json({ error: 'descripcion requerida' });
  if (!id_tipo)             return res.status(400).json({ error: 'tipo requerido' });
  try {
    const r = await query(
      `INSERT INTO HistoriaExpediente
         (id_expediente, fecha, hora, id_tipo, descripcion, fojas, id_abogado,
          prox_paso, prox_fecha, importante, adjunto_nombre, adjunto_ruta)
       OUTPUT INSERTED.*
       VALUES (@id_expediente, @fecha, @hora, @id_tipo, @descripcion, @fojas, @id_abogado,
               @prox_paso, @prox_fecha, @importante, @adjunto_nombre, @adjunto_ruta)`,
      {
        id_expediente,
        fecha:         fecha || new Date().toISOString().slice(0,10),
        hora:          hora || null,
        id_tipo:       parseInt(id_tipo),
        descripcion:   descripcion.trim(),
        fojas:         fojas || null,
        id_abogado:    id_abogado ? parseInt(id_abogado) : null,
        prox_paso:     prox_paso || null,
        prox_fecha:    prox_fecha || null,
        importante:    importante === 'true' || importante === true ? 1 : 0,
        adjunto_nombre: req.file ? req.file.originalname : null,
        adjunto_ruta:   req.file ? req.file.filename     : null,
      }
    );
    // Si hay prox_fecha, actualizar en el expediente principal
    if (prox_fecha) {
      await query('UPDATE Expedientes SET prox_fecha=@f WHERE id=@id', { f: prox_fecha, id: id_expediente });
    }
    res.status(201).json(r.recordset[0]);
  } catch (err) {
    if (req.file) fs.unlink(req.file.path, ()=>{});
    console.error('[historia POST]', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// PUT /api/expedientes/:id/historia/:mid — editar movimiento
router.put('/:mid', authMiddleware, async (req, res) => {
  const mid = parseInt(req.params.mid);
  if (isNaN(mid)) return res.status(400).json({ error: 'ID inválido' });
  const { fecha, hora, id_tipo, descripcion, fojas, id_abogado, prox_paso, prox_fecha, importante } = req.body;
  try {
    const r = await query(
      `UPDATE HistoriaExpediente
       SET fecha=@fecha, hora=@hora, id_tipo=@id_tipo, descripcion=@descripcion,
           fojas=@fojas, id_abogado=@id_abogado, prox_paso=@prox_paso,
           prox_fecha=@prox_fecha, importante=@importante
       OUTPUT INSERTED.* WHERE id=@mid`,
      {
        fecha, hora: hora||null, id_tipo: parseInt(id_tipo), descripcion: descripcion?.trim()||'',
        fojas: fojas||null, id_abogado: id_abogado?parseInt(id_abogado):null,
        prox_paso: prox_paso||null, prox_fecha: prox_fecha||null,
        importante: importante?1:0, mid
      }
    );
    if (!r.recordset[0]) return res.status(404).json({ error: 'No encontrado' });
    res.json(r.recordset[0]);
  } catch (err) { res.status(500).json({ error: 'Error interno' }); }
});

// DELETE /api/expedientes/:id/historia/:mid
router.delete('/:mid', authMiddleware, async (req, res) => {
  const mid = parseInt(req.params.mid);
  if (isNaN(mid)) return res.status(400).json({ error: 'ID inválido' });
  try {
    const r = await query('SELECT adjunto_ruta FROM HistoriaExpediente WHERE id=@mid', { mid });
    if (r.recordset[0]?.adjunto_ruta) {
      const fp = path.join(UPLOAD_DIR, r.recordset[0].adjunto_ruta);
      if (fs.existsSync(fp)) fs.unlinkSync(fp);
    }
    await query('DELETE FROM HistoriaExpediente WHERE id=@mid', { mid });
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: 'Error interno' }); }
});

// GET adjunto de un movimiento
router.get('/:mid/adjunto', authMiddleware, async (req, res) => {
  const mid = parseInt(req.params.mid);
  try {
    const r = await query('SELECT adjunto_ruta, adjunto_nombre FROM HistoriaExpediente WHERE id=@mid', { mid });
    const row = r.recordset[0];
    if (!row?.adjunto_ruta) return res.status(404).send('Sin adjunto');
    const fp = path.join(UPLOAD_DIR, row.adjunto_ruta);
    if (!fs.existsSync(fp)) return res.status(404).send('Archivo no encontrado');
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(row.adjunto_nombre)}"`);
    res.sendFile(fp);
  } catch { res.status(500).send('Error'); }
});

module.exports = router;
