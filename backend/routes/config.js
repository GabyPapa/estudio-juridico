const router = require('express').Router();
const { query } = require('../db');
const { authMiddleware, requireRol } = require('../middleware/auth');

// Crea la tabla si no existe (se llama la primera vez que se usa el módulo)
async function ensureTable() {
  await query(`
    IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'ConfiguracionSistema')
    BEGIN
      CREATE TABLE ConfiguracionSistema (
        clave          NVARCHAR(100) NOT NULL PRIMARY KEY,
        valor          NVARCHAR(MAX),
        descripcion    NVARCHAR(300),
        actualizado_en DATETIME2     NOT NULL DEFAULT GETDATE()
      );
      INSERT INTO ConfiguracionSistema (clave, descripcion) VALUES
        ('ANTHROPIC_API_KEY', 'API Key de Anthropic para el modulo Investigacion IA');
    END
  `);
}

// GET /api/config/:clave — estado (no devuelve el valor real)
router.get('/:clave', authMiddleware, requireRol('administrador', 'socio'), async (req, res) => {
  try {
    await ensureTable();
    const r = await query(
      `SELECT clave, descripcion, actualizado_en,
              CAST(CASE WHEN valor IS NULL OR valor='' THEN 0 ELSE 1 END AS BIT) AS configurada
       FROM ConfiguracionSistema WHERE clave=@clave`,
      { clave: req.params.clave }
    );
    // Si la fila no existe, la clave tampoco está configurada
    if (!r.recordset[0]) return res.json({ clave: req.params.clave, configurada: false });
    res.json(r.recordset[0]);
  } catch (err) {
    console.error('[config GET]', err);
    res.status(500).json({ error: 'Error interno', detalle: err.message });
  }
});

// POST /api/config/:clave — guardar valor (solo admin)
router.post('/:clave', authMiddleware, requireRol('administrador'), async (req, res) => {
  const { valor } = req.body;
  const clave = req.params.clave?.trim();
  if (!clave) return res.status(400).json({ error: 'clave requerida' });
  if (!valor?.trim()) return res.status(400).json({ error: 'valor requerido' });
  try {
    await ensureTable();
    await query(
      `IF EXISTS (SELECT 1 FROM ConfiguracionSistema WHERE clave=@clave)
         UPDATE ConfiguracionSistema SET valor=@valor, actualizado_en=GETDATE() WHERE clave=@clave
       ELSE
         INSERT INTO ConfiguracionSistema (clave, valor) VALUES (@clave, @valor)`,
      { clave, valor: valor.trim() }
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('[config POST]', err);
    res.status(500).json({ error: 'Error al guardar', detalle: err.message });
  }
});

// DELETE /api/config/:clave — limpiar valor
router.delete('/:clave', authMiddleware, requireRol('administrador'), async (req, res) => {
  try {
    await ensureTable();
    await query(
      'UPDATE ConfiguracionSistema SET valor=NULL, actualizado_en=GETDATE() WHERE clave=@clave',
      { clave: req.params.clave }
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Error interno' });
  }
});

module.exports = router;
