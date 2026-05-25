const jwt = require('jsonwebtoken');

/**
 * Verifica el Bearer token JWT en Authorization header.
 * Adjunta req.user con el payload decodificado.
 */
function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token  = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Token requerido' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    const msg = err.name === 'TokenExpiredError'
      ? 'Token expirado — volvé a iniciar sesión'
      : 'Token inválido';
    res.status(401).json({ error: msg });
  }
}

/**
 * Verifica que req.user.rol esté en la lista permitida.
 * Debe usarse DESPUÉS de authMiddleware.
 */
function requireRol(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'No autenticado' });
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ error: `Acción restringida a: ${roles.join(', ')}` });
    }
    next();
  };
}

module.exports = { authMiddleware, requireRol };
