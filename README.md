# Sistema de Gestión — Estudio Jurídico

Sistema de gestión integral para estudios jurídicos argentinos.

## Requisitos previos

- **Windows 10/11** (64-bit)
- **Node.js 18+** → https://nodejs.org (descargar LTS)
- **SQL Server Express** → ya instalado (SQLEXPRESS)
- **SSMS** (SQL Server Management Studio) → solo si querés revisar la BD

---

## Instalación (primera vez)

### Paso 1 — Configurar SQL Server
Doble clic en **`CONFIGURAR_SQL.bat`** (necesita permisos de administrador).

Esto:
- Habilita TCP/IP en SQL Server
- Inicia el servicio SQL Server Browser
- Crea la base de datos `EstudioJuridico`
- Ejecuta los 9 scripts SQL automáticamente (si `sqlcmd` está en PATH)

> Si `sqlcmd` **no está en PATH**, ejecutar manualmente en SSMS los archivos
> de la carpeta `sql/` en orden del 01 al 09.

### Paso 2 — Instalar dependencias Node.js
Doble clic en **`INSTALAR.bat`**

Instala `node_modules` para backend y frontend (~2 min).

### Paso 3 — Arrancar la app
Doble clic en **`INICIAR.bat`**

Abre dos terminales (backend + frontend) y el navegador en `http://localhost:5173`.

---

## Credenciales por defecto

| Campo      | Valor                    |
|------------|--------------------------|
| Email      | p.gabrielpapa@gmail.com  |
| Contraseña | 22715293                 |
| Rol        | Administrador            |

---

## Estructura del proyecto

```
estudio-juridico/
├── backend/
│   ├── routes/           # API REST (Express)
│   ├── services/         # Alertas por email
│   ├── middleware/        # Auth JWT
│   ├── uploads/escritos/ # Archivos subidos (se crea automático)
│   ├── .env              # Configuración (DB, JWT, SMTP)
│   └── server.js
├── frontend/
│   └── src/
│       ├── App.jsx       # Toda la UI (React + Vite)
│       └── api.js        # Cliente HTTP
├── sql/
│   ├── 01_schema.sql     # Esquema base
│   ├── 02_seed.sql       # Datos de ejemplo
│   ├── 03_expansion.sql  # Columnas extra abogados
│   ├── 04_seed_expansion.sql
│   ├── 05_modelos.sql    # 15 modelos base
│   ├── 06_usuarios.sql   # Usuarios del sistema
│   ├── 07_modelos_ampliados.sql  # 48 modelos
│   ├── 08_nuevos_modulos.sql     # Areas, Contrapartes, Doctrina, Jurisprudencia, Leyes
│   └── 09_escritos_propios.sql   # Módulo de upload de documentos
├── CONFIGURAR_SQL.bat    # Configura SQL Server (1ra vez)
├── INSTALAR.bat          # npm install (1ra vez)
└── INICIAR.bat           # Arrancar la app
```

---

## Módulos disponibles

| Módulo            | Descripción |
|-------------------|-------------|
| Panel General     | Dashboard con métricas y vencimientos |
| Áreas del Estudio | Áreas configurables con ícono y color |
| Expedientes       | CRUD completo + export PDF/Excel |
| Clientes          | Base de clientes + export Excel |
| Contrapartes      | Personas físicas/jurídicas con abogado contrario |
| Abogados          | Internos y externos |
| Juzgados          | Base de juzgados con secretarías |
| Modelos           | 63 modelos jurídicos con variables |
| Escritos Propios  | Upload de PDF/DOCX/TXT organizados por materia |
| Doctrina          | Biblioteca de doctrina jurídica |
| Jurisprudencia    | Base de fallos con visualizador |
| Legislación       | Leyes, decretos, resoluciones |
| Investigación IA  | Búsqueda asistida con Claude + web |

---

## Configurar alertas de email (opcional)

Editar `backend/.env`:

```
SMTP_HOST=smtp.gmail.com
SMTP_USER=tu@gmail.com
SMTP_PASS=tu-app-password
ALERT_TO=destinatario@gmail.com
ALERT_DAYS=3,7
ALERT_HOUR=08:00
```

> Para Gmail usá una "App Password" (no la contraseña normal).
> Configuración: Cuenta Google → Seguridad → Verificación en 2 pasos → Contraseñas de aplicación

---

## Solución de problemas

**"Error de conexión a SQL Server"**
→ Ejecutar `CONFIGURAR_SQL.bat` como administrador

**"Token inválido" al iniciar sesión**
→ Verificar que `JWT_SECRET` en `.env` no esté vacío

**Puerto 3001 o 5173 ocupado**
→ Cambiar `PORT` en `backend/.env` o el puerto en `frontend/vite.config.js`
