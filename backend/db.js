/**
 * db.js — Conexión a SQL Server con reconexión automática.
 *
 * SOLUCIÓN AL PROBLEMA DE CONEXIÓN:
 * mssql usa el protocolo TDS que requiere TCP/IP habilitado en SQL Server
 * y que el servicio SQL Server Browser esté corriendo (para resolver instancias
 * nombradas como SQLEXPRESS). INSTALAR.bat configura ambos automáticamente.
 */
const sql = require('mssql');
require('dotenv').config();

const config = {
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
  pool: {
    max:               10,
    min:               0,
    idleTimeoutMillis: 30000,
  },
  connectTimeout: 15000,
};

let poolPromise = null;

function getPool() {
  if (!poolPromise) {
    poolPromise = sql.connect(config)
      .then(pool => {
        console.log('[DB] Conectado a SQL Server ✓');
        pool.on('error', err => {
          console.error('[DB] Error en pool:', err.message);
          poolPromise = null;
        });
        return pool;
      })
      .catch(err => {
        poolPromise = null;
        console.error('[DB] Error de conexión:', err.message);
        console.error('[DB] Verificá que:');
        console.error('     1. SQL Server (SQLEXPRESS) esté corriendo en Servicios de Windows');
        console.error('     2. TCP/IP esté habilitado en SQL Server Configuration Manager');
        console.error('     3. SQL Server Browser esté corriendo');
        console.error('     4. DB_SERVER, DB_USER y DB_PASSWORD en backend/.env sean correctos');
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
