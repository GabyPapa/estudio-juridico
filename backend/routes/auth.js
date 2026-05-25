const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { query } = require('../db');
const { authMiddleware, requireRol } = require('../middleware/auth');

// ── POST /api/auth/login ──────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email y contraseña requeridos' });

  try {
    const r = await query(
      `SELECT u.*, a.nombre AS nombre_abogado
       FROM Usuarios u
       LEFT JOIN Abogados a ON a.id = u.id_abogado
       WHERE u.email = @email AND u.activo = 1`,
      { email: email.trim().toLowerCase() }
    );
    const user = r.recordset[0];

    // Respuesta genérica para no revelar si el email existe
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });

    const payload = {
      id:         user.id,
      nombre:     user.nombre,
      email:      user.email,
      rol:        user.rol,
      id_abogado: user.id_abogado,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES || '8h',
    });

    res.json({ token, user: payload });
  } catch (err) {
    console.error('[auth/login]', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// ── GET /api/auth/me ──────────────────────────────────────
router.get('/me', authMiddleware, (req, res) => res.json(req.user));

// ── GET /api/auth/usuarios (admin + socio) ────────────────
router.get('/usuarios', authMiddleware, requireRol('administrador', 'socio'), async (req, res) => {
  try {
    const r = await query(
      `SELECT u.id, u.nombre, u.email, u.rol, u.activo, u.id_abogado, u.creado_en,
              a.nombre AS nombre_abogado
       FROM Usuarios u
       LEFT JOIN Abogados a ON a.id = u.id_abogado
       ORDER BY u.nombre`
    );
    res.json(r.recordset);
  } catch (err) {
    console.error('[auth/usuarios GET]', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// ── POST /api/auth/usuarios (solo admin) ─────────────────
router.post('/usuarios', authMiddleware, requireRol('administrador'), async (req, res) => {
  const { nombre, email, password, rol, id_abogado } = req.body;
  if (!nombre || !email || !password || !rol)
    return res.status(400).json({ error: 'Campos requeridos: nombre, email, password, rol' });
  if (!['socio', 'abogado', 'administrador'].includes(rol))
    return res.status(400).json({ error: 'Rol inválido' });

  try {
    const hash = await bcrypt.hash(password, 10);
    await query(
      `INSERT INTO Usuarios (nombre, email, password_hash, rol, id_abogado)
       VALUES (@nombre, @email, @hash, @rol, @id_abogado)`,
      { nombre, email: email.trim().toLowerCase(), hash, rol,
        id_abogado: id_abogado ? parseInt(id_abogado) : null }
    );
    res.status(201).json({ ok: true });
  } catch (err) {
    if (err.number === 2627) return res.status(409).json({ error: 'El email ya está registrado' });
    console.error('[auth/usuarios POST]', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// ── PUT /api/auth/usuarios/:id (solo admin) ───────────────
router.put('/usuarios/:id', authMiddleware, requireRol('administrador'), async (req, res) => {
  const id = parseInt(req.params.id); // BUG FIX: era string
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  const { nombre, email, rol, id_abogado, activo, password } = req.body;
  if (!nombre || !email || !rol)
    return res.status(400).json({ error: 'Campos requeridos: nombre, email, rol' });

  try {
    const params = {
      nombre, email: email.trim().toLowerCase(), rol,
      id_abogado: id_abogado ? parseInt(id_abogado) : null,
      activo:     activo ? 1 : 0,
      id,
    };

    if (password) {
      params.hash = await bcrypt.hash(password, 10);
      await query(
        `UPDATE Usuarios
         SET nombre=@nombre, email=@email, rol=@rol,
             id_abogado=@id_abogado, activo=@activo, password_hash=@hash
         WHERE id=@id`,
        params
      );
    } else {
      await query(
        `UPDATE Usuarios
         SET nombre=@nombre, email=@email, rol=@rol,
             id_abogado=@id_abogado, activo=@activo
         WHERE id=@id`,
        params
      );
    }
    res.json({ ok: true });
  } catch (err) {
    console.error('[auth/usuarios PUT]', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

module.exports = router;
