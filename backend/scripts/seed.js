/**
 * node scripts/seed.js
 * Genera los hashes de contraseñas y ejecuta el INSERT de usuarios.
 * Correr UNA sola vez después de crear el esquema.
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const bcrypt = require('bcryptjs');
const { query, getPool } = require('../db');

const USUARIOS = [
  { nombre: 'Administrador',         email: 'admin@estudio.com',         password: 'Admin2024!',    rol: 'administrador', id_abogado: null },
  { nombre: 'Dr. Carlos Rodríguez',  email: 'c.rodriguez@estudio.com',   password: 'Rodrigo2024!',  rol: 'socio',          id_abogado: 1 },
  { nombre: 'Dra. Ana García',       email: 'a.garcia@estudio.com',      password: 'Garcia2024!',   rol: 'abogado',         id_abogado: 2 },
  { nombre: 'Dr. Martín López',      email: 'm.lopez@estudio.com',       password: 'Lopez2024!',    rol: 'abogado',         id_abogado: 3 },
  { nombre: 'Dra. Valentina Sosa',   email: 'v.sosa@estudio.com',        password: 'Sosa2024!',     rol: 'abogado',         id_abogado: 4 },
];

async function run() {
  try {
    await getPool();
    console.log('Generando hashes de contraseñas...');

    for (const u of USUARIOS) {
      const hash = await bcrypt.hash(u.password, 10);

      // Verificar si ya existe
      const exists = await query('SELECT id FROM Usuarios WHERE email=@email', { email: u.email });
      if (exists.recordset.length > 0) {
        console.log(`  ⚠️  ${u.email} ya existe, omitiendo.`);
        continue;
      }

      await query(
        `INSERT INTO Usuarios (nombre, email, password_hash, rol, id_abogado)
         VALUES (@nombre, @email, @hash, @rol, @id_abogado)`,
        { nombre: u.nombre, email: u.email, hash, rol: u.rol, id_abogado: u.id_abogado }
      );
      console.log(`  ✅ ${u.email} (${u.rol}) — contraseña: ${u.password}`);
    }

    console.log('\n✅ Seed completado.');
    process.exit(0);
  } catch(err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

run();
