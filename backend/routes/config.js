const router = require('express').Router();
const { query } = require('../db');
const { authMiddleware, requireRol } = require('../middleware/auth');

// GET /api/config — devuelve config (values sensibles enmascarados)
router.get('/', authMiddleware, requireRol('administrador', 'socio'), async (req, res) => {
  try {
    const r = await query('SELECT clave, descripcion, actualizado_en, CASE WHEN valor IS NULL OR valor=\'\' THEN NULL ELSE \'SET\' END AS estado FROM ConfiguracionSistema');
    res.json(r.recordset);
  } catch { res.json([]); }
});

// GET /api/config/:clave — estado de una clave (no devuelve el valor)
router.get('/:clave', authMiddleware, requireRol('administrador', 'socio'), async (req, res) => {
  try {
    const r = await query('SELECT clave, descripcion, actualizado_en, CASE WHEN valor IS NULL OR valor=\'\' THEN 0 ELSE 1 END AS configurada FROM ConfiguracionSistema WHERE clave=@clave', { clave: req.params.clave });
    if (!r.recordset[0]) return res.status(404).json({ error: 'Clave no encontrada' });
    res.json(r.recordset[0]);
  } catch (err) { res.status(500).json({ error: 'Error interno' }); }
});

// POST /api/config/:clave — guardar o actualizar valor
router.post('/:clave', authMiddleware, requireRol('administrador'), async (req, res) => {
  const { valor } = req.body;
  const clave = req.params.clave;
  if (!clave?.trim()) return res.status(400).json({ error: 'clave requerida' });
  try {
    await query(
      `IF EXISTS (SELECT 1 FROM ConfiguracionSistema WHERE clave=@clave)
         UPDATE ConfiguracionSistema SET valor=@valor, actualizado_en=GETDATE() WHERE clave=@clave
       ELSE
         INSERT INTO ConfiguracionSistema (clave, valor) VALUES (@clave, @valor)`,
      { clave, valor: valor || null }
    );
    res.json({ ok: true });
  } catch (err) { console.error('[config POST]', err); res.status(500).json({ error: 'Error interno' }); }
});

// DELETE /api/config/:clave — limpiar valor (no borra la fila)
router.delete('/:clave', authMiddleware, requireRol('administrador'), async (req, res) => {
  try {
    await query('UPDATE ConfiguracionSistema SET valor=NULL, actualizado_en=GETDATE() WHERE clave=@clave', { clave: req.params.clave });
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: 'Error interno' }); }
});

module.exports = router;
