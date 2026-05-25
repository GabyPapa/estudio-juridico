const sql = require('mssql');
require('dotenv').config();

const config = {
  server:   process.env.DB_SERVER   || 'localhost',
  port:     parseInt(process.env.DB_PORT || '1433'),
  database: process.env.DB_DATABASE || 'EstudioJuridico',
  user:     process.env.DB_USER     || 'sa',
  password: process.env.DB_PASSWORD || '',
  options: {
    encrypt:                process.env.DB_ENCRYPT     === 'true',
    trustServerCertificate: process.env.DB_TRUST_CERT  !== 'false',
    enableArithAbort:       true,
  },
  pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },
};

// BUG FIX: Uso de promise para evitar race condition en el singleton del pool.
// Si se llama a getPool() concurrentemente antes de que la conexión se establezca,
// todos los llamados esperan la misma promesa en lugar de crear múltiples conexiones.
let poolPromise = null;

function getPool() {
  if (!poolPromise) {
    poolPromise = sql.connect(config)
      .then(pool => {
        console.log('✅ Conectado a SQL Server');
        pool.on('error', err => {
          console.error('❌ Error en pool SQL Server:', err.message);
          poolPromise = null; // fuerza reconexión en el próximo request
        });
        return pool;
      })
      .catch(err => {
        poolPromise = null; // permite reintentar en el próximo llamado
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
