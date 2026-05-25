const sql = require('mssql');
require('dotenv').config();

// Intenta primero con TCP, si falla usa named pipes
const configTCP = {
  server:   process.env.DB_SERVER   || 'localhost\\SQLEXPRESS',
  port:     parseInt(process.env.DB_PORT || '1433'),
  database: process.env.DB_DATABASE || 'EstudioJuridico',
  user:     process.env.DB_USER     || 'sa',
  password: process.env.DB_PASSWORD || '',
  options: {
    encrypt:                false,
    trustServerCertificate: true,
    enableArithAbort:       true,
  },
  pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },
  connectTimeout: 8000,
};

// Named pipes — no requiere TCP/IP habilitado
const configPipes = {
  server:   '.',
  database: process.env.DB_DATABASE || 'EstudioJuridico',
  user:     process.env.DB_USER     || 'sa',
  password: process.env.DB_PASSWORD || '',
  options: {
    encrypt:                false,
    trustServerCertificate: true,
    enableArithAbort:       true,
    instanceName:           'SQLEXPRESS',
  },
  pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },
  connectTimeout: 8000,
};

let poolPromise = null;

function getPool() {
  if (!poolPromise) {
    poolPromise = sql.connect(configTCP)
      .then(pool => {
        console.log('[DB] Conectado via TCP/IP');
        pool.on('error', err => {
          console.error('[DB] Error en pool:', err.message);
          poolPromise = null;
        });
        return pool;
      })
      .catch(() => {
        console.log('[DB] TCP fallo, intentando named pipes...');
        return sql.connect(configPipes).then(pool => {
          console.log('[DB] Conectado via named pipes');
          pool.on('error', err => {
            console.error('[DB] Error en pool:', err.message);
            poolPromise = null;
          });
          return pool;
        });
      })
      .catch(err => {
        poolPromise = null;
        console.error('[DB] No se pudo conectar a SQL Server:', err.message);
        console.error('[DB] Asegurate de que SQL Server esta corriendo y el usuario/contrasena son correctos.');
        throw err;
      });
  }
  return poolPromise;
}

async function query(q, params = {}) {
  const pool = await getPool();
  const req  = pool.request();
  for (const [key, val] of Object.entries(params)) {
    req.input(key, val);
  }
  return req.query(q);
}

module.exports = { getPool, query, sql };
