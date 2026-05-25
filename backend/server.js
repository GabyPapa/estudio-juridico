require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const authRouter   = require('./routes/auth');
const expRouter    = require('./routes/expedientes');
const cliRouter    = require('./routes/clientes');
const abRouter     = require('./routes/abogados');
const exportRouter = require('./routes/exportar');
const { iniciarAlertas } = require('./services/alertas');
const { getPool } = require('./db');

const app  = express();
const PORT = parseInt(process.env.PORT || '3001');

// ── Middlewares ───────────────────────────────────────────
app.use(cors({
  origin:      (process.env.FRONTEND_URL || 'http://localhost:5173').split(',').map(s => s.trim()),
  credentials: true,
}));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Rutas ─────────────────────────────────────────────────
app.use('/api/auth',        authRouter);
app.use('/api/expedientes', expRouter);
app.use('/api/clientes',    cliRouter);
app.use('/api/abogados',    abRouter);
app.use('/api/exportar',    exportRouter);

// ── Health check ──────────────────────────────────────────
app.get('/api/health', async (_req, res) => {
  try {
    await getPool();
    res.json({ status: 'ok', db: 'connected', ts: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: 'error', db: 'disconnected' });
  }
});

// ── 404 ───────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.path}` });
});

// ── Error handler global ──────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[error global]', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// ── Arranque ──────────────────────────────────────────────
async function start() {
  try {
    await getPool();
    app.listen(PORT, () => {
      console.log(`\n🚀 Servidor en http://localhost:${PORT}`);
      console.log('   POST   /api/auth/login');
      console.log('   GET    /api/expedientes');
      console.log('   GET    /api/exportar/expedientes/pdf');
      console.log('   GET    /api/exportar/expedientes/excel');
      console.log('   GET    /api/exportar/clientes/excel');
      console.log('   GET    /api/health\n');
    });
    iniciarAlertas();
  } catch (err) {
    console.error('❌ Error de conexión a la base de datos:', err.message);
    console.error('   Revisá DB_SERVER, DB_USER, DB_PASSWORD en el archivo .env');
    process.exit(1);
  }
}

start();
