require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const authRouter    = require('./routes/auth');
const expRouter     = require('./routes/expedientes');
const cliRouter     = require('./routes/clientes');
const abRouter      = require('./routes/abogados');
const exportRouter  = require('./routes/exportar');
const juzgRouter    = require('./routes/juzgados');
const { routerModelos, routerColegios, routerMatriculas } = require('./routes/modelos');
const { iniciarAlertas } = require('./services/alertas');
const { getPool } = require('./db');

const app  = express();
const PORT = parseInt(process.env.PORT || '3001');

// ── Middlewares ───────────────────────────────────────────
app.use(cors({
  origin:      (process.env.FRONTEND_URL || 'http://localhost:5173').split(',').map(s => s.trim()),
  credentials: true,
}));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Rutas ─────────────────────────────────────────────────
app.use('/api/auth',        authRouter);
app.use('/api/expedientes', expRouter);
app.use('/api/clientes',    cliRouter);
app.use('/api/abogados',    abRouter);
app.use('/api/exportar',    exportRouter);
app.use('/api/juzgados',    juzgRouter);
app.use('/api/modelos',     routerModelos);
app.use('/api/colegios',    routerColegios);
app.use('/api/matriculas',  routerMatriculas);

// ── Health check ──────────────────────────────────────────
app.get('/api/health', async (_req, res) => {
  try {
    await getPool();
    res.json({ status: 'ok', db: 'connected', ts: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: 'error', db: 'disconnected' });
  }
});

app.use((req, res) => res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.path}` }));

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[error global]', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// ── Arranque ──────────────────────────────────────────────
// FIX: el servidor arranca siempre. Si la DB no está disponible al inicio,
// cada request reintentará la conexión automáticamente (ver db.js getPool).
app.listen(PORT, () => {
  console.log(`\nServidor en http://localhost:${PORT}`);
  console.log('  /api/auth | /api/expedientes | /api/clientes | /api/abogados');
  console.log('  /api/juzgados | /api/modelos | /api/colegios | /api/matriculas');
  console.log('  /api/exportar | /api/health\n');
});

// Intentar conectar a la DB en background (no bloquea el arranque)
getPool()
  .then(() => iniciarAlertas())
  .catch(() => {
    console.warn('[server] Servidor iniciado sin DB. Se reintentará en cada request.');
    console.warn('[server] Ejecuta CONFIGURAR_SQL.bat como Administrador si persiste el error.\n');
  });
