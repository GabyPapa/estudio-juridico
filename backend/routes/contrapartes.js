const router = require('express').Router();
const { query } = require('../db');
const { authMiddleware, requireRol } = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { tipo, area, q } = req.query;
    const where = []; const params = {};
    if (tipo)  { where.push('c.tipo=@tipo');   params.tipo = tipo; }
    if (area)  { where.push('c.area=@area');   params.area = area; }
    if (q)     { where.push('(c.nombre LIKE @q OR c.razon_social LIKE @q OR c.cuit LIKE @q OR c.dni LIKE @q)'); params.q = `%${q}%`; }
    const sql = 'SELECT c.* FROM Contrapartes c' +
      (where.length ? ' WHERE '+where.join(' AND ') : '') + ' ORDER BY c.nombre';
    const r = await query(sql, params);
    res.json(r.recordset);
  } catch (err) { console.error('[contrapartes GET]', err); res.status(500).json({ error: 'Error interno' }); }
});

router.get('/:id', authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID invalido' });
  try {
    const r = await query('SELECT * FROM Contrapartes WHERE id=@id', { id });
    if (!r.recordset[0]) return res.status(404).json({ error: 'No encontrado' });
    // Expedientes vinculados
    const exps = await query(
      `SELECT e.id, e.numero, e.caratula, e.area, e.estado
       FROM Expedientes e
       JOIN ContraprtesExpedientes ce ON ce.id_expediente=e.id
       WHERE ce.id_contraparte=@id ORDER BY e.creado_en DESC`, { id }
    );
    res.json({ ...r.recordset[0], expedientes: exps.recordset });
  } catch (err) { console.error('[contrapartes GET/:id]', err); res.status(500).json({ error: 'Error interno' }); }
});

router.post('/', authMiddleware, async (req, res) => {
  const { tipo,nombre,razon_social,dni,cuit,email,tel,celular,domicilio,localidad,
          provincia,cp,abogado_contraparte,mat_abogado,rol_procesal,area,observaciones,notas_internas } = req.body;
  if (!nombre?.trim()) return res.status(400).json({ error: 'nombre requerido' });
  try {
    const r = await query(
      `INSERT INTO Contrapartes (tipo,nombre,razon_social,dni,cuit,email,tel,celular,domicilio,
        localidad,provincia,cp,abogado_contraparte,mat_abogado,rol_procesal,area,observaciones,notas_internas)
       OUTPUT INSERTED.*
       VALUES (@tipo,@nombre,@razon_social,@dni,@cuit,@email,@tel,@celular,@domicilio,
        @localidad,@provincia,@cp,@abogado_contraparte,@mat_abogado,@rol_procesal,@area,@observaciones,@notas_internas)`,
      { tipo:tipo||'fisica', nombre:nombre.trim(), razon_social:razon_social||null, dni:dni||null,
        cuit:cuit||null, email:email||null, tel:tel||null, celular:celular||null,
        domicilio:domicilio||null, localidad:localidad||null, provincia:provincia||'Buenos Aires',
        cp:cp||null, abogado_contraparte:abogado_contraparte||null, mat_abogado:mat_abogado||null,
        rol_procesal:rol_procesal||null, area:area||null, observaciones:observaciones||null,
        notas_internas:notas_internas||null }
    );
    res.status(201).json(r.recordset[0]);
  } catch (err) { console.error('[contrapartes POST]', err); res.status(500).json({ error: 'Error interno' }); }
});

router.put('/:id', authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID invalido' });
  const { tipo,nombre,razon_social,dni,cuit,email,tel,celular,domicilio,localidad,
          provincia,cp,abogado_contraparte,mat_abogado,rol_procesal,area,observaciones,notas_internas,activo } = req.body;
  if (!nombre?.trim()) return res.status(400).json({ error: 'nombre requerido' });
  try {
    const r = await query(
      `UPDATE Contrapartes SET tipo=@tipo,nombre=@nombre,razon_social=@razon_social,
        dni=@dni,cuit=@cuit,email=@email,tel=@tel,celular=@celular,domicilio=@domicilio,
        localidad=@localidad,provincia=@provincia,cp=@cp,abogado_contraparte=@abogado_contraparte,
        mat_abogado=@mat_abogado,rol_procesal=@rol_procesal,area=@area,
        observaciones=@observaciones,notas_internas=@notas_internas,activo=@activo
       OUTPUT INSERTED.* WHERE id=@id`,
      { tipo:tipo||'fisica', nombre:nombre.trim(), razon_social:razon_social||null, dni:dni||null,
        cuit:cuit||null, email:email||null, tel:tel||null, celular:celular||null,
        domicilio:domicilio||null, localidad:localidad||null, provincia:provincia||'Buenos Aires',
        cp:cp||null, abogado_contraparte:abogado_contraparte||null, mat_abogado:mat_abogado||null,
        rol_procesal:rol_procesal||null, area:area||null, observaciones:observaciones||null,
        notas_internas:notas_internas||null, activo:activo!==false?1:0, id }
    );
    if (!r.recordset[0]) return res.status(404).json({ error: 'No encontrado' });
    res.json(r.recordset[0]);
  } catch (err) { console.error('[contrapartes PUT]', err); res.status(500).json({ error: 'Error interno' }); }
});

// Vincular/desvincular con expediente
router.post('/:id/expedientes', authMiddleware, async (req, res) => {
  const id_contraparte = parseInt(req.params.id);
  const { id_expediente } = req.body;
  if (!id_expediente) return res.status(400).json({ error: 'id_expediente requerido' });
  try {
    await query(
      `IF NOT EXISTS (SELECT 1 FROM ContraprtesExpedientes WHERE id_contraparte=@c AND id_expediente=@e)
       INSERT INTO ContraprtesExpedientes VALUES (@c, @e)`,
      { c: id_contraparte, e: parseInt(id_expediente) }
    );
    res.status(201).json({ ok: true });
  } catch (err) { console.error('[contrapartes POST expedientes]', err); res.status(500).json({ error: 'Error interno' }); }
});

router.delete('/:id', authMiddleware, requireRol('administrador','socio'), async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await query('DELETE FROM Contrapartes WHERE id=@id', { id });
    res.json({ ok: true });
  } catch (err) { console.error('[contrapartes DELETE]', err); res.status(500).json({ error: 'Error interno' }); }
});

module.exports = router;
