const router = require('express').Router();
const { query } = require('../db');
const { authMiddleware, requireRol } = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { area, tipo, q } = req.query;
    const where = ['l.activo=1']; const params = {};
    if (area) { where.push('l.area=@area');   params.area = area; }
    if (tipo) { where.push('l.tipo=@tipo');   params.tipo = tipo; }
    if (q)    { where.push('(l.numero LIKE @q OR l.nombre LIKE @q)'); params.q=`%${q}%`; }
    const r = await query('SELECT * FROM Leyes l WHERE '+where.join(' AND ')+' ORDER BY l.fecha_sancion DESC', params);
    res.json(r.recordset);
  } catch (err) { res.status(500).json({ error: 'Error interno' }); }
});

router.get('/:id', authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID invalido' });
  try {
    const r = await query('SELECT * FROM Leyes WHERE id=@id AND activo=1', { id });
    if (!r.recordset[0]) return res.status(404).json({ error: 'No encontrado' });
    res.json(r.recordset[0]);
  } catch (err) { res.status(500).json({ error: 'Error interno' }); }
});

router.post('/', authMiddleware, async (req, res) => {
  const { numero,nombre,tipo,organismo,fecha_sancion,fecha_promulgacion,fecha_vigencia,
          boletin_numero,boletin_fecha,area,resumen,texto,url_infoleg } = req.body;
  if (!numero?.trim()||!nombre?.trim()) return res.status(400).json({ error: 'numero y nombre requeridos' });
  try {
    const r = await query(
      `INSERT INTO Leyes (numero,nombre,tipo,organismo,fecha_sancion,fecha_promulgacion,
        fecha_vigencia,boletin_numero,boletin_fecha,area,resumen,texto,url_infoleg)
       OUTPUT INSERTED.*
       VALUES (@numero,@nombre,@tipo,@organismo,@fecha_sancion,@fecha_promulgacion,
        @fecha_vigencia,@boletin_numero,@boletin_fecha,@area,@resumen,@texto,@url_infoleg)`,
      { numero:numero.trim(), nombre:nombre.trim(), tipo:tipo||'ley', organismo:organismo||null,
        fecha_sancion:fecha_sancion||null, fecha_promulgacion:fecha_promulgacion||null,
        fecha_vigencia:fecha_vigencia||null, boletin_numero:boletin_numero||null,
        boletin_fecha:boletin_fecha||null, area:area||null, resumen:resumen||null,
        texto:texto||null, url_infoleg:url_infoleg||null }
    );
    res.status(201).json(r.recordset[0]);
  } catch (err) { console.error('[leyes POST]', err); res.status(500).json({ error: 'Error interno' }); }
});

router.put('/:id', authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID invalido' });
  const { numero,nombre,tipo,organismo,fecha_sancion,fecha_promulgacion,fecha_vigencia,
          boletin_numero,boletin_fecha,area,resumen,texto,url_infoleg } = req.body;
  try {
    const r = await query(
      `UPDATE Leyes SET numero=@numero,nombre=@nombre,tipo=@tipo,organismo=@organismo,
        fecha_sancion=@fecha_sancion,fecha_promulgacion=@fecha_promulgacion,fecha_vigencia=@fecha_vigencia,
        boletin_numero=@boletin_numero,boletin_fecha=@boletin_fecha,area=@area,
        resumen=@resumen,texto=@texto,url_infoleg=@url_infoleg
       OUTPUT INSERTED.* WHERE id=@id`,
      { numero:numero?.trim()||'', nombre:nombre?.trim()||'', tipo:tipo||'ley', organismo:organismo||null,
        fecha_sancion:fecha_sancion||null, fecha_promulgacion:fecha_promulgacion||null,
        fecha_vigencia:fecha_vigencia||null, boletin_numero:boletin_numero||null,
        boletin_fecha:boletin_fecha||null, area:area||null, resumen:resumen||null,
        texto:texto||null, url_infoleg:url_infoleg||null, id }
    );
    if (!r.recordset[0]) return res.status(404).json({ error: 'No encontrado' });
    res.json(r.recordset[0]);
  } catch (err) { res.status(500).json({ error: 'Error interno' }); }
});

router.delete('/:id', authMiddleware, requireRol('administrador','socio'), async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID invalido' });
  try {
    await query('UPDATE Leyes SET activo=0 WHERE id=@id', { id });
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: 'Error interno' }); }
});

module.exports = router;
