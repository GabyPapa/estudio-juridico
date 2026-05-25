require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const authRouter           = require('./routes/auth');
const expRouter            = require('./routes/expedientes');
const cliRouter            = require('./routes/clientes');
const abRouter             = require('./routes/abogados');
const exportRouter         = require('./routes/exportar');
const juzgRouter           = require('./routes/juzgados');
const contraprtesRouter    = require('./routes/contrapartes');
const areasRouter          = require('./routes/areas');
const doctrinaRouter       = require('./routes/doctrina');
const jurisprudenciaRouter = require('./routes/jurisprudencia');
const leyesRouter          = require('./routes/leyes');
const escritosRouter       = require('./routes/escritos');
const investigacionRouter  = require('./routes/investigacion');
const { routerModelos, routerColegios, routerMatriculas } = require('./routes/modelos');
const { iniciarAlertas } = require('./services/alertas');
const { getPool } = require('./db');

const app  = express();
const PORT = parseInt(process.env.PORT || '3001');

app.use(cors({
  origin:      (process.env.FRONTEND_URL || 'http://localhost:5173').split(',').map(s => s.trim()),
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth',           authRouter);
app.use('/api/expedientes',    expRouter);
app.use('/api/clientes',       cliRouter);
app.use('/api/abogados',       abRouter);
app.use('/api/exportar',       exportRouter);
app.use('/api/juzgados',       juzgRouter);
app.use('/api/contrapartes',   contraprtesRouter);
app.use('/api/areas',          areasRouter);
app.use('/api/doctrina',       doctrinaRouter);
app.use('/api/jurisprudencia', jurisprudenciaRouter);
app.use('/api/leyes',          leyesRouter);
app.use('/api/escritos',       escritosRouter);
app.use('/api/investigacion',  investigacionRouter);
app.use('/api/modelos',        routerModelos);
app.use('/api/colegios',       routerColegios);
app.use('/api/matriculas',     routerMatriculas);

app.get('/api/health', async (_req, res) => {
  try { await getPool(); res.json({ status: 'ok', db: 'connected', ts: new Date().toISOString() }); }
  catch { res.status(503).json({ status: 'error', db: 'disconnected' }); }
});

app.use((req, res) => res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.path}` }));
app.use((err, _req, res, _next) => { console.error('[error global]', err); res.status(500).json({ error: 'Error interno' }); });

app.listen(PORT, () => {
  console.log(`\nServidor en http://localhost:${PORT}`);
  console.log('  + /api/escritos  (upload PDF/DOCX/TXT)\n');
});

getPool()
  .then(() => iniciarAlertas())
  .catch(() => { console.warn('[server] Sin DB al arrancar.\n'); });
