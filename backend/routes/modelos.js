// ── Modelos de escritos y contratos ──────────────────────
const routerModelos   = require('express').Router();
const routerColegios  = require('express').Router();
const routerMatriculas = require('express').Router();
const { query } = require('../db');
const { authMiddleware, requireRol } = require('../middleware/auth');

// ════════════════════════════════════════════════════════════
// MODELOS
// ════════════════════════════════════════════════════════════

// GET /api/modelos/categorias
routerModelos.get('/categorias', authMiddleware, async (req, res) => {
  try {
    const r = await query(
      `SELECT c.*,
         (SELECT COUNT(*) FROM Modelos m WHERE m.id_categoria = c.id AND m.activo = 1) AS total_modelos
       FROM ModelosCategorias c
       ORDER BY c.tipo, c.orden, c.nombre`
    );
    res.json(r.recordset);
  } catch (err) {
    console.error('[modelos/categorias]', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// GET /api/modelos
routerModelos.get('/', authMiddleware, async (req, res) => {
  try {
    const { tipo, area, id_categoria } = req.query;
    const where  = ['m.activo = 1'];
    const params = {};
    if (tipo)         { where.push('c.tipo = @tipo');                params.tipo        = tipo; }
    if (area)         { where.push('m.area = @area');                params.area        = area; }
    if (id_categoria) { where.push('m.id_categoria = @id_categoria'); params.id_categoria = parseInt(id_categoria); }

    const r = await query(
      `SELECT m.id, m.nombre, m.descripcion, m.area, m.version, m.variables,
              m.id_categoria, c.nombre AS categoria_nombre, c.tipo AS categoria_tipo
       FROM Modelos m
       JOIN ModelosCategorias c ON c.id = m.id_categoria
       WHERE ${where.join(' AND ')}
       ORDER BY c.tipo, c.orden, m.nombre`,
      params
    );
    res.json(r.recordset);
  } catch (err) {
    console.error('[modelos GET /]', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// GET /api/modelos/:id (incluye contenido completo)
routerModelos.get('/:id', authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
  try {
    const r = await query(
      `SELECT m.*, c.nombre AS categoria_nombre, c.tipo AS categoria_tipo
       FROM Modelos m
       JOIN ModelosCategorias c ON c.id = m.id_categoria
       WHERE m.id = @id`,
      { id }
    );
    if (!r.recordset[0]) return res.status(404).json({ error: 'No encontrado' });
    // Parsear variables JSON
    const modelo = r.recordset[0];
    try { modelo.variables = JSON.parse(modelo.variables || '[]'); } catch { modelo.variables = []; }
    res.json(modelo);
  } catch (err) {
    console.error('[modelos GET /:id]', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// POST /api/modelos (admin + socio)
routerModelos.post('/', authMiddleware, requireRol('administrador', 'socio'), async (req, res) => {
  const { id_categoria, nombre, descripcion, area, contenido, variables, version } = req.body;
  if (!id_categoria || !nombre || !contenido)
    return res.status(400).json({ error: 'id_categoria, nombre y contenido son requeridos' });
  try {
    const r = await query(
      `INSERT INTO Modelos (id_categoria, nombre, descripcion, area, contenido, variables, version)
       OUTPUT INSERTED.id, INSERTED.nombre
       VALUES (@id_categoria, @nombre, @descripcion, @area, @contenido, @variables, @version)`,
      {
        id_categoria: parseInt(id_categoria), nombre,
        descripcion: descripcion || null, area: area || null,
        contenido, variables: variables ? JSON.stringify(variables) : null,
        version: version || '1.0',
      }
    );
    res.status(201).json(r.recordset[0]);
  } catch (err) {
    console.error('[modelos POST /]', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// PUT /api/modelos/:id
routerModelos.put('/:id', authMiddleware, requireRol('administrador', 'socio'), async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
  const { id_categoria, nombre, descripcion, area, contenido, variables, version, activo } = req.body;
  try {
    await query(
      `UPDATE Modelos SET id_categoria=@id_categoria,nombre=@nombre,descripcion=@descripcion,
        area=@area,contenido=@contenido,variables=@variables,version=@version,
        activo=@activo,actualizado_en=GETDATE()
       WHERE id=@id`,
      {
        id_categoria: parseInt(id_categoria), nombre,
        descripcion: descripcion || null, area: area || null,
        contenido, variables: variables ? JSON.stringify(variables) : null,
        version: version || '1.0', activo: activo !== false ? 1 : 0, id,
      }
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('[modelos PUT /:id]', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// DELETE /api/modelos/:id (soft delete)
routerModelos.delete('/:id', authMiddleware, requireRol('administrador'), async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
  try {
    await query('UPDATE Modelos SET activo=0 WHERE id=@id', { id });
    res.json({ ok: true });
  } catch (err) {
    console.error('[modelos DELETE /:id]', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// ════════════════════════════════════════════════════════════
// COLEGIOS DE ABOGADOS
// ════════════════════════════════════════════════════════════

routerColegios.get('/', authMiddleware, async (req, res) => {
  try {
    const r = await query('SELECT * FROM ColegiosAbogados WHERE activo=1 ORDER BY nombre');
    res.json(r.recordset);
  } catch (err) { res.status(500).json({ error: 'Error interno' }); }
});

routerColegios.post('/', authMiddleware, requireRol('administrador', 'socio'), async (req, res) => {
  const { nombre, sigla, jurisdiccion, domicilio, telefono, email, web } = req.body;
  if (!nombre) return res.status(400).json({ error: 'nombre requerido' });
  try {
    const r = await query(
      `INSERT INTO ColegiosAbogados (nombre,sigla,jurisdiccion,domicilio,telefono,email,web)
       OUTPUT INSERTED.* VALUES (@nombre,@sigla,@jurisdiccion,@domicilio,@telefono,@email,@web)`,
      { nombre, sigla: sigla||null, jurisdiccion: jurisdiccion||null, domicilio: domicilio||null,
        telefono: telefono||null, email: email||null, web: web||null }
    );
    res.status(201).json(r.recordset[0]);
  } catch (err) { res.status(500).json({ error: 'Error interno' }); }
});

routerColegios.put('/:id', authMiddleware, requireRol('administrador', 'socio'), async (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre, sigla, jurisdiccion, domicilio, telefono, email, web, activo } = req.body;
  try {
    const r = await query(
      `UPDATE ColegiosAbogados SET nombre=@nombre,sigla=@sigla,jurisdiccion=@jurisdiccion,
        domicilio=@domicilio,telefono=@telefono,email=@email,web=@web,activo=@activo
       OUTPUT INSERTED.* WHERE id=@id`,
      { nombre, sigla: sigla||null, jurisdiccion: jurisdiccion||null, domicilio: domicilio||null,
        telefono: telefono||null, email: email||null, web: web||null, activo: activo?1:0, id }
    );
    if (!r.recordset[0]) return res.status(404).json({ error: 'No encontrado' });
    res.json(r.recordset[0]);
  } catch (err) { res.status(500).json({ error: 'Error interno' }); }
});

// ════════════════════════════════════════════════════════════
// MATRÍCULAS DE ABOGADOS
// ════════════════════════════════════════════════════════════

// GET /api/abogados/:id/matriculas — ver abogados.js; aquí el endpoint de gestión
routerMatriculas.get('/abogado/:id_abogado', authMiddleware, async (req, res) => {
  try {
    const r = await query(
      `SELECT am.*, c.nombre AS colegio_nombre, c.sigla AS colegio_sigla
       FROM AbogadosMatriculas am
       JOIN ColegiosAbogados c ON c.id = am.id_colegio
       WHERE am.id_abogado = @id
       ORDER BY am.fecha_inscripcion`,
      { id: parseInt(req.params.id_abogado) }
    );
    res.json(r.recordset);
  } catch (err) { res.status(500).json({ error: 'Error interno' }); }
});

routerMatriculas.post('/', authMiddleware, requireRol('administrador', 'socio'), async (req, res) => {
  const { id_abogado, id_colegio, tomo, folio, numero_matricula, fecha_inscripcion, estado, observaciones } = req.body;
  if (!id_abogado || !id_colegio) return res.status(400).json({ error: 'id_abogado e id_colegio son requeridos' });
  try {
    const r = await query(
      `INSERT INTO AbogadosMatriculas (id_abogado,id_colegio,tomo,folio,numero_matricula,fecha_inscripcion,estado,observaciones)
       OUTPUT INSERTED.*
       VALUES (@id_abogado,@id_colegio,@tomo,@folio,@numero_matricula,@fecha_inscripcion,@estado,@observaciones)`,
      {
        id_abogado: parseInt(id_abogado), id_colegio: parseInt(id_colegio),
        tomo: tomo||null, folio: folio||null, numero_matricula: numero_matricula||null,
        fecha_inscripcion: fecha_inscripcion||null, estado: estado||'activa', observaciones: observaciones||null,
      }
    );
    res.status(201).json(r.recordset[0]);
  } catch (err) {
    if (err.number === 2627) return res.status(409).json({ error: 'Ya existe una matrícula para ese colegio' });
    res.status(500).json({ error: 'Error interno' });
  }
});

routerMatriculas.put('/:id', authMiddleware, requireRol('administrador', 'socio'), async (req, res) => {
  const id = parseInt(req.params.id);
  const { tomo, folio, numero_matricula, fecha_inscripcion, estado, observaciones } = req.body;
  try {
    const r = await query(
      `UPDATE AbogadosMatriculas SET tomo=@tomo,folio=@folio,numero_matricula=@numero_matricula,
        fecha_inscripcion=@fecha_inscripcion,estado=@estado,observaciones=@observaciones
       OUTPUT INSERTED.* WHERE id=@id`,
      { tomo: tomo||null, folio: folio||null, numero_matricula: numero_matricula||null,
        fecha_inscripcion: fecha_inscripcion||null, estado: estado||'activa', observaciones: observaciones||null, id }
    );
    if (!r.recordset[0]) return res.status(404).json({ error: 'No encontrada' });
    res.json(r.recordset[0]);
  } catch (err) { res.status(500).json({ error: 'Error interno' }); }
});

routerMatriculas.delete('/:id', authMiddleware, requireRol('administrador', 'socio'), async (req, res) => {
  try {
    await query('DELETE FROM AbogadosMatriculas WHERE id=@id', { id: parseInt(req.params.id) });
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: 'Error interno' }); }
});

module.exports = { routerModelos, routerColegios, routerMatriculas };
