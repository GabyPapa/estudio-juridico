-- ============================================================
--  ESTUDIO JURÍDICO — Insertar usuarios del sistema
--  Ejecutar en SSMS después de correr 01_schema.sql y 02_seed.sql
--  Contraseñas ya hasheadas con bcrypt (salt 10)
-- ============================================================

USE EstudioJuridico;
GO

-- Evitar duplicados: sólo inserta si el email no existe
INSERT INTO Usuarios (nombre, email, password_hash, rol, id_abogado)
SELECT * FROM (VALUES
    ('Administrador',
     'admin@estudio.com',
     '$2b$10$nPkFZYu0FWfiXwkwX2cfTOo31.oC14RItHl9KocQUuOrKfW/gEMF.',
     'administrador', NULL),

    ('Dr. Carlos Rodríguez',
     'c.rodriguez@estudio.com',
     '$2b$10$QWwGMfciel7HvtlInIls3u97TIJDSxLHIj0ED6mJkfN033Q7G2yCu',
     'socio', 1),

    ('Dra. Ana García',
     'a.garcia@estudio.com',
     '$2b$10$NlS4EBdgvMgvxycILfXrAeFAhWPytO5Y.7u6Uxl/LLUHGwMK5VJnC',
     'abogado', 2),

    ('Dr. Martín López',
     'm.lopez@estudio.com',
     '$2b$10$TlPrmoIs2S68TeLScVsTEuMG6Doq5YvB5HAMJ1RM.8f6rQhPsF.LK',
     'abogado', 3),

    ('Dra. Valentina Sosa',
     'v.sosa@estudio.com',
     '$2b$10$RToy81HeP8VC6CEsmu9.pu7tYtXM92L6KLnClmlCeE0.pdej5aR3y',
     'abogado', 4),

    ('Pablo Gabriel Papa',
     'p.gabrielpapa@gmail.com',
     '$2b$10$BUGSDXNB7cjVoa02zv4hH.7CX4Gbo1kvb2n29iFNKUuvo74AziMLG',
     'administrador', NULL)

) AS src(nombre, email, password_hash, rol, id_abogado)
WHERE NOT EXISTS (
    SELECT 1 FROM Usuarios u WHERE u.email = src.email
);
GO

-- Verificar resultado
SELECT id, nombre, email, rol, activo, creado_en
FROM Usuarios
ORDER BY id;
GO

-- ============================================================
--  CREDENCIALES DE ACCESO
-- ============================================================
--  admin@estudio.com         → Admin2024!       (administrador)
--  c.rodriguez@estudio.com   → Rodrigo2024!     (socio)
--  a.garcia@estudio.com      → Garcia2024!      (abogado)
--  m.lopez@estudio.com       → Lopez2024!       (abogado)
--  v.sosa@estudio.com        → Sosa2024!        (abogado)
--  p.gabrielpapa@gmail.com   → 22715293         (administrador)
-- ============================================================
