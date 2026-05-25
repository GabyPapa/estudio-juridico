/**
 * node scripts/seed.js
 * Genera hashes de contraseñas e inserta usuarios iniciales.
 * Correr UNA sola vez después de crear el esquema SQL.
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const bcrypt = require('bcryptjs');
const { query, getPool } = require('../db');

const USUARIOS = [
  { nombre: 'Administrador',        email: 'admin@estudio.com',       password: 'Admin2024!',   rol: 'administrador', id_abogado: null },
  { nombre: 'Dr. Carlos Rodriguez', email: 'c.rodriguez@estudio.com', password: 'Rodrigo2024!', rol: 'socio',         id_abogado: 1 },
  { nombre: 'Dra. Ana Garcia',      email: 'a.garcia@estudio.com',    password: 'Garcia2024!',  rol: 'abogado',       id_abogado: 2 },
  { nombre: 'Dr. Martin Lopez',     email: 'm.lopez@estudio.com',     password: 'Lopez2024!',   rol: 'abogado',       id_abogado: 3 },
  { nombre: 'Dra. Valentina Sosa',  email: 'v.sosa@estudio.com',      password: 'Sosa2024!',    rol: 'abogado',       id_abogado: 4 },
  { nombre: 'Pablo Gabriel Papa',   email: 'p.gabrielpapa@gmail.com', password: '22715293',     rol: 'administrador', id_abogado: null },
];

async function run() {
  try {
    await getPool();
    console.log('Generando hashes...\n');

    for (const u of USUARIOS) {
      const exists = await query('SELECT id FROM Usuarios WHERE email = @email', { email: u.email });
      if (exists.recordset.length > 0) {
        console.log(`  OMITIDO  ${u.email} (ya existe)`);
        continue;
      }
      const hash = await bcrypt.hash(u.password, 10);
      await query(
        `INSERT INTO Usuarios (nombre, email, password_hash, rol, id_abogado)
         VALUES (@nombre, @email, @hash, @rol, @id_abogado)`,
        { nombre: u.nombre, email: u.email, hash, rol: u.rol, id_abogado: u.id_abogado }
      );
      console.log(`  OK  ${u.email} (${u.rol}) — pass: ${u.password}`);
    }

    console.log('\nSeed completado.');
    process.exit(0);
  } catch (err) {
    console.error('ERROR:', err.message);
    process.exit(1);
  }
}

run();
