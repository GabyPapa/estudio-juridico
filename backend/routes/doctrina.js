const router = require('express').Router();
const { query } = require('../db');
const { authMiddleware, requireRol } = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { area, fuente, q } = req.query;
    const where = ['d.activo=1']; const params = {};
    if (area)   { where.push('d.area=@area');    params.area   = area; }
    if (fuente) { where.push('d.fuente=@fuente'); params.fuente = fuente; }
    if (q)      { where.push('(d.titulo LIKE @q OR d.autor LIKE @q OR d.voces LIKE @q)'); params.q=`%${q}%`; }
    const r = await query('SELECT * FROM Doctrina d WHERE '+where.join(' AND ')+' ORDER BY d.creado_en DESC', params);
    res.json(r.recordset);
  } catch (err) { console.error('[doctrina GET]', err); res.status(500).json({ error: 'Error interno' }); }
});

router.get('/:id', authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID invalido' });
  try {
    const r = await query('SELECT * FROM Doctrina WHERE id=@id AND activo=1', { id });
    if (!r.recordset[0]) return res.status(404).json({ error: 'No encontrado' });
    res.json(r.recordset[0]);
  } catch (err) { console.error('[doctrina GET/:id]', err); res.status(500).json({ error: 'Error interno' }); }
});

router.post('/', authMiddleware, async (req, res) => {
  const { titulo,autor,coautores,fuente,publicacion,fecha_publicacion,area,resumen,contenido,voces,url } = req.body;
  if (!titulo?.trim()) return res.status(400).json({ error: 'titulo requerido' });
  try {
    const r = await query(
      `INSERT INTO Doctrina (titulo,autor,coautores,fuente,publicacion,fecha_publicacion,area,resumen,contenido,voces,url)
       OUTPUT INSERTED.*
       VALUES (@titulo,@autor,@coautores,@fuente,@publicacion,@fecha_publicacion,@area,@resumen,@contenido,@voces,@url)`,
      { titulo:titulo.trim(), autor:autor||null, coautores:coautores||null, fuente:fuente||null,
        publicacion:publicacion||null, fecha_publicacion:fecha_publicacion||null, area:area||null,
        resumen:resumen||null, contenido:contenido||null, voces:voces||null, url:url||null }
    );
    res.status(201).json(r.recordset[0]);
  } catch (err) { console.error('[doctrina POST]', err); res.status(500).json({ error: 'Error interno' }); }
});

router.put('/:id', authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID invalido' });
  const { titulo,autor,coautores,fuente,publicacion,fecha_publicacion,area,resumen,contenido,voces,url } = req.body;
  try {
    const r = await query(
      `UPDATE Doctrina SET titulo=@titulo,autor=@autor,coautores=@coautores,fuente=@fuente,
        publicacion=@publicacion,fecha_publicacion=@fecha_publicacion,area=@area,
        resumen=@resumen,contenido=@contenido,voces=@voces,url=@url
       OUTPUT INSERTED.* WHERE id=@id`,
      { titulo:titulo?.trim()||'', autor:autor||null, coautores:coautores||null, fuente:fuente||null,
        publicacion:publicacion||null, fecha_publicacion:fecha_publicacion||null, area:area||null,
        resumen:resumen||null, contenido:contenido||null, voces:voces||null, url:url||null, id }
    );
    if (!r.recordset[0]) return res.status(404).json({ error: 'No encontrado' });
    res.json(r.recordset[0]);
  } catch (err) { console.error('[doctrina PUT]', err); res.status(500).json({ error: 'Error interno' }); }
});

router.delete('/:id', authMiddleware, requireRol('administrador','socio'), async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await query('UPDATE Doctrina SET activo=0 WHERE id=@id', { id });
    res.json({ ok: true });
  } catch (err) { console.error('[doctrina DELETE]', err); res.status(500).json({ error: 'Error interno' }); }
});

module.exports = router;
