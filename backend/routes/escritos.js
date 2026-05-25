const router  = require('express').Router();
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const { query } = require('../db');
const { authMiddleware, requireRol } = require('../middleware/auth');

// ── Directorio de uploads ─────────────────────────────────
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'escritos');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_EXT  = ['.pdf', '.docx', '.doc', '.txt'];
const ALLOWED_MIME = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'text/plain',
];

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename:    (_req,  file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase();
    const safe = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, safe);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 30 * 1024 * 1024 },   // 30 MB
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_EXT.includes(ext) && ALLOWED_MIME.includes(file.mimetype)) return cb(null, true);
    // Algunos clientes envían text/plain para .txt — permitir si la extensión es válida
    if (ALLOWED_EXT.includes(ext)) return cb(null, true);
    cb(new Error(`Tipo de archivo no permitido. Solo: ${ALLOWED_EXT.join(', ')}`));
  },
});

// ── GET / — listar ────────────────────────────────────────
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { area, categoria, q } = req.query;
    const where = ['e.activo=1']; const p = {};
    if (area)      { where.push('e.area=@area');           p.area      = area; }
    if (categoria) { where.push('e.categoria=@categoria'); p.categoria = categoria; }
    if (q)         { where.push('(e.titulo LIKE @q OR e.tags LIKE @q OR e.descripcion LIKE @q)'); p.q = `%${q}%`; }
    const r = await query(
      `SELECT e.*, exp.caratula AS exp_caratula
       FROM EscritosPersonales e
       LEFT JOIN Expedientes exp ON exp.id = e.id_expediente
       WHERE ${where.join(' AND ')} ORDER BY e.creado_en DESC`,
      p
    );
    res.json(r.recordset);
  } catch (err) { console.error('[escritos GET]', err); res.status(500).json({ error: 'Error interno' }); }
});

// ── GET /:id — detalle ────────────────────────────────────
router.get('/:id(\\d+)', authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const r = await query(
      `SELECT e.*, exp.caratula AS exp_caratula
       FROM EscritosPersonales e
       LEFT JOIN Expedientes exp ON exp.id = e.id_expediente
       WHERE e.id=@id AND e.activo=1`, { id }
    );
    if (!r.recordset[0]) return res.status(404).json({ error: 'No encontrado' });
    res.json(r.recordset[0]);
  } catch (err) { res.status(500).json({ error: 'Error interno' }); }
});

// ── GET /file/:id — servir el archivo (con auth) ──────────
router.get('/file/:id(\\d+)', authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const r = await query('SELECT filename, mimetype, original_name FROM EscritosPersonales WHERE id=@id AND activo=1', { id });
    if (!r.recordset[0]) return res.status(404).send('Archivo no encontrado');
    const { filename, mimetype, original_name } = r.recordset[0];
    const filePath = path.join(UPLOAD_DIR, filename);
    if (!fs.existsSync(filePath)) return res.status(404).send('Archivo eliminado del disco');
    res.setHeader('Content-Type', mimetype || 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(original_name || filename)}"`);
    res.sendFile(filePath);
  } catch (err) { console.error('[escritos file]', err); res.status(500).send('Error'); }
});

// ── GET /categorias — lista de categorias en uso ──────────
router.get('/categorias', authMiddleware, async (_req, res) => {
  try {
    const r = await query('SELECT DISTINCT categoria FROM EscritosPersonales WHERE activo=1 AND categoria IS NOT NULL ORDER BY categoria');
    res.json(r.recordset.map(x => x.categoria));
  } catch { res.json([]); }
});

// ── POST /upload — subir archivo ──────────────────────────
router.post('/upload', authMiddleware, (req, res, next) => {
  upload.single('archivo')(req, res, err => {
    if (err) return res.status(400).json({ error: err.message });
    next();
  });
}, async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se recibio archivo' });
  const { titulo, area, categoria, descripcion, tags, id_expediente, notas } = req.body;
  if (!titulo?.trim()) {
    fs.unlink(req.file.path, () => {});
    return res.status(400).json({ error: 'titulo requerido' });
  }
  const ext = path.extname(req.file.originalname).toLowerCase();
  try {
    const r = await query(
      `INSERT INTO EscritosPersonales
         (titulo, area, categoria, descripcion, filename, original_name, mimetype, size_bytes, extension, tags, id_expediente, notas)
       OUTPUT INSERTED.*
       VALUES (@titulo,@area,@categoria,@descripcion,@filename,@original_name,@mimetype,@size_bytes,@extension,@tags,@id_expediente,@notas)`,
      {
        titulo:        titulo.trim(),
        area:          area         || null,
        categoria:     categoria    || null,
        descripcion:   descripcion  || null,
        filename:      req.file.filename,
        original_name: req.file.originalname,
        mimetype:      req.file.mimetype,
        size_bytes:    req.file.size,
        extension:     ext,
        tags:          tags         || null,
        id_expediente: id_expediente ? parseInt(id_expediente) : null,
        notas:         notas        || null,
      }
    );
    res.status(201).json(r.recordset[0]);
  } catch (err) {
    fs.unlink(req.file.path, () => {});
    console.error('[escritos upload]', err);
    res.status(500).json({ error: 'Error al guardar en BD' });
  }
});

// ── PUT /:id — editar metadata (no reemplaza archivo) ────
router.put('/:id', authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID invalido' });
  const { titulo, area, categoria, descripcion, tags, id_expediente, notas } = req.body;
  if (!titulo?.trim()) return res.status(400).json({ error: 'titulo requerido' });
  try {
    const r = await query(
      `UPDATE EscritosPersonales
       SET titulo=@titulo, area=@area, categoria=@categoria, descripcion=@descripcion,
           tags=@tags, id_expediente=@id_expediente, notas=@notas
       OUTPUT INSERTED.* WHERE id=@id`,
      {
        titulo:        titulo.trim(),
        area:          area        || null,
        categoria:     categoria   || null,
        descripcion:   descripcion || null,
        tags:          tags        || null,
        id_expediente: id_expediente ? parseInt(id_expediente) : null,
        notas:         notas       || null,
        id,
      }
    );
    if (!r.recordset[0]) return res.status(404).json({ error: 'No encontrado' });
    res.json(r.recordset[0]);
  } catch (err) { console.error('[escritos PUT]', err); res.status(500).json({ error: 'Error interno' }); }
});

// ── DELETE /:id — eliminar ────────────────────────────────
router.delete('/:id', authMiddleware, requireRol('administrador', 'socio'), async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID invalido' });
  try {
    const r = await query('SELECT filename FROM EscritosPersonales WHERE id=@id', { id });
    if (r.recordset[0]) {
      const filePath = path.join(UPLOAD_DIR, r.recordset[0].filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await query('UPDATE EscritosPersonales SET activo=0 WHERE id=@id', { id });
    res.json({ ok: true });
  } catch (err) { console.error('[escritos DELETE]', err); res.status(500).json({ error: 'Error interno' }); }
});

module.exports = router;
