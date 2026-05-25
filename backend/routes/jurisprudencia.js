const router = require('express').Router();
const { query } = require('../db');
const { authMiddleware, requireRol } = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { area, tribunal, q } = req.query;
    const where = ['j.activo=1']; const params = {};
    if (area)     { where.push('j.area=@area');         params.area     = area; }
    if (tribunal) { where.push('j.tribunal LIKE @trib'); params.trib     = `%${tribunal}%`; }
    if (q)        { where.push('(j.caratula LIKE @q OR j.tema LIKE @q OR j.voces LIKE @q)'); params.q=`%${q}%`; }
    const r = await query('SELECT * FROM Jurisprudencia j WHERE '+where.join(' AND ')+' ORDER BY j.fecha_fallo DESC', params);
    res.json(r.recordset);
  } catch (err) { console.error('[jurisprudencia GET]', err); res.status(500).json({ error: 'Error interno' }); }
});

router.get('/:id', authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID invalido' });
  try {
    const r = await query('SELECT * FROM Jurisprudencia WHERE id=@id AND activo=1', { id });
    if (!r.recordset[0]) return res.status(404).json({ error: 'No encontrado' });
    res.json(r.recordset[0]);
  } catch (err) { res.status(500).json({ error: 'Error interno' }); }
});

router.post('/', authMiddleware, async (req, res) => {
  const { caratula,tribunal,sala,fecha_fallo,area,tema,voces,resumen,texto,cita,publicado_en,url } = req.body;
  if (!caratula?.trim()) return res.status(400).json({ error: 'caratula requerida' });
  try {
    const r = await query(
      `INSERT INTO Jurisprudencia (caratula,tribunal,sala,fecha_fallo,area,tema,voces,resumen,texto,cita,publicado_en,url)
       OUTPUT INSERTED.*
       VALUES (@caratula,@tribunal,@sala,@fecha_fallo,@area,@tema,@voces,@resumen,@texto,@cita,@publicado_en,@url)`,
      { caratula:caratula.trim(), tribunal:tribunal||null, sala:sala||null,
        fecha_fallo:fecha_fallo||null, area:area||null, tema:tema||null, voces:voces||null,
        resumen:resumen||null, texto:texto||null, cita:cita||null, publicado_en:publicado_en||null, url:url||null }
    );
    res.status(201).json(r.recordset[0]);
  } catch (err) { console.error('[jurisprudencia POST]', err); res.status(500).json({ error: 'Error interno' }); }
});

router.put('/:id', authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  const { caratula,tribunal,sala,fecha_fallo,area,tema,voces,resumen,texto,cita,publicado_en,url } = req.body;
  try {
    const r = await query(
      `UPDATE Jurisprudencia SET caratula=@caratula,tribunal=@tribunal,sala=@sala,
        fecha_fallo=@fecha_fallo,area=@area,tema=@tema,voces=@voces,resumen=@resumen,
        texto=@texto,cita=@cita,publicado_en=@publicado_en,url=@url
       OUTPUT INSERTED.* WHERE id=@id`,
      { caratula:caratula?.trim()||'', tribunal:tribunal||null, sala:sala||null,
        fecha_fallo:fecha_fallo||null, area:area||null, tema:tema||null, voces:voces||null,
        resumen:resumen||null, texto:texto||null, cita:cita||null, publicado_en:publicado_en||null, url:url||null, id }
    );
    if (!r.recordset[0]) return res.status(404).json({ error: 'No encontrado' });
    res.json(r.recordset[0]);
  } catch (err) { res.status(500).json({ error: 'Error interno' }); }
});

router.delete('/:id', authMiddleware, requireRol('administrador','socio'), async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await query('UPDATE Jurisprudencia SET activo=0 WHERE id=@id', { id });
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: 'Error interno' }); }
});

module.exports = router;
