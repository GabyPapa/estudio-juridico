const router = require('express').Router();
const { query } = require('../db');
const { authMiddleware, requireRol } = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const r = await query('SELECT * FROM AreasEstudio WHERE activo=1 ORDER BY orden, nombre');
    res.json(r.recordset);
  } catch (err) { console.error('[areas GET]', err); res.status(500).json({ error: 'Error interno' }); }
});

router.post('/', authMiddleware, requireRol('administrador','socio'), async (req, res) => {
  const { nombre, icon, color, descripcion, orden } = req.body;
  if (!nombre?.trim()) return res.status(400).json({ error: 'nombre requerido' });
  try {
    const r = await query(
      `INSERT INTO AreasEstudio (nombre, icon, color, descripcion, orden)
       OUTPUT INSERTED.* VALUES (@nombre, @icon, @color, @descripcion, @orden)`,
      { nombre: nombre.trim(), icon: icon||'ti-books', color: color||'info',
        descripcion: descripcion||null, orden: orden||0 }
    );
    res.status(201).json(r.recordset[0]);
  } catch (err) {
    if (err.number===2627) return res.status(409).json({ error: 'Ya existe un area con ese nombre' });
    console.error('[areas POST]', err); res.status(500).json({ error: 'Error interno' });
  }
});

router.put('/:id', authMiddleware, requireRol('administrador','socio'), async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID invalido' });
  const { nombre, icon, color, descripcion, orden, activo } = req.body;
  if (!nombre?.trim()) return res.status(400).json({ error: 'nombre requerido' });
  try {
    const r = await query(
      `UPDATE AreasEstudio SET nombre=@nombre, icon=@icon, color=@color,
       descripcion=@descripcion, orden=@orden, activo=@activo
       OUTPUT INSERTED.* WHERE id=@id`,
      { nombre: nombre.trim(), icon: icon||'ti-books', color: color||'info',
        descripcion: descripcion||null, orden: orden||0, activo: activo!==false?1:0, id }
    );
    if (!r.recordset[0]) return res.status(404).json({ error: 'No encontrada' });
    res.json(r.recordset[0]);
  } catch (err) { console.error('[areas PUT]', err); res.status(500).json({ error: 'Error interno' }); }
});

router.delete('/:id', authMiddleware, requireRol('administrador'), async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID invalido' });
  try {
    // Soft delete — no se puede borrar si tiene expedientes
    const exp = await query('SELECT COUNT(*) AS c FROM Expedientes WHERE area=(SELECT nombre FROM AreasEstudio WHERE id=@id)', { id });
    if (exp.recordset[0].c > 0)
      return res.status(409).json({ error: 'No se puede eliminar: el area tiene expedientes asociados' });
    await query('UPDATE AreasEstudio SET activo=0 WHERE id=@id', { id });
    res.json({ ok: true });
  } catch (err) { console.error('[areas DELETE]', err); res.status(500).json({ error: 'Error interno' }); }
});

module.exports = router;
