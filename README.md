# ⚖️ Sistema de Gestión — Estudio Jurídico

Sistema full-stack para gestión de estudios jurídicos: expedientes, clientes, abogados, exportaciones y alertas automáticas de vencimiento.

**Stack:** Node.js · Express · SQL Server · React · Vite

---

## Estructura

```
estudio-juridico/
├── backend/
│   ├── routes/
│   │   ├── auth.js         → Login, usuarios (JWT)
│   │   ├── expedientes.js  → CRUD expedientes + bitácora
│   │   ├── clientes.js     → CRUD clientes
│   │   ├── abogados.js     → CRUD abogados
│   │   └── exportar.js     → PDF y Excel
│   ├── middleware/auth.js  → JWT + control de roles
│   ├── services/alertas.js → Cron de emails (node-cron)
│   ├── scripts/seed.js     → Carga usuarios iniciales con bcrypt
│   ├── db.js               → Pool SQL Server (singleton seguro)
│   └── server.js           → Punto de entrada Express
├── frontend/
│   └── src/
│       ├── App.jsx         → UI React completa
│       └── api.js          → Cliente fetch con JWT
├── sql/
│   ├── 01_schema.sql       → Tablas, constraints, índices
│   └── 02_seed.sql         → Datos de ejemplo (sin usuarios)
└── README.md
```

---

## Setup rápido

### 1 — Base de datos

Ejecutar en SQL Server Management Studio o Azure Data Studio:

```sql
-- Primero el schema
-- Archivo: sql/01_schema.sql

-- Luego los datos de ejemplo (opcional)
-- Archivo: sql/02_seed.sql
```

### 2 — Backend

```bash
cd backend
npm install
cp .env.example .env
# → Editar .env con tus credenciales de SQL Server y SMTP
node scripts/seed.js   # crea usuarios iniciales
npm run dev            # nodemon
```

### 3 — Frontend

```bash
cd frontend
npm install
npm run dev   # Vite en http://localhost:5173
```

---

## Usuarios iniciales

Creados por `backend/scripts/seed.js`:

| Email | Contraseña | Rol |
|-------|-----------|-----|
| `admin@estudio.com` | `Admin2024!` | Administrador |
| `c.rodriguez@estudio.com` | `Rodrigo2024!` | Socio |
| `a.garcia@estudio.com` | `Garcia2024!` | Abogado |
| `m.lopez@estudio.com` | `Lopez2024!` | Abogado |
| `v.sosa@estudio.com` | `Sosa2024!` | Abogado |

---

## Roles y permisos

| Acción | Socio | Abogado | Administrador |
|--------|-------|---------|---------------|
| Ver expedientes | ✅ Todos | ✅ Solo los propios | ✅ Todos |
| Crear / editar expedientes | ✅ | ✅ Solo los propios | ✅ |
| Crear / editar clientes | ✅ | ❌ | ✅ |
| Crear / editar abogados | ✅ | ❌ | ✅ |
| Exportar PDF / Excel | ✅ | ✅ | ✅ |
| Gestión de usuarios | ❌ | ❌ | ✅ |

---

## Alertas de vencimiento

El backend ejecuta un cron a las **8:00 AM (Lun–Sáb, zona AR)** que envía un email cuando un expediente activo tiene `prox_fecha` en 3 o 7 días (configurable). No duplica alertas gracias a la tabla `AlertasEnviadas`.

```bash
# Probar manualmente sin esperar el cron
cd backend && node -e "require('./services/alertas').verificarAlertas()"
```

Variables en `.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu@gmail.com
SMTP_PASS=xxxx-xxxx-xxxx-xxxx  # App Password de Google
EMAIL_DESTINATARIOS=socio@estudio.com,admin@estudio.com
ALERTA_DIAS=3,7
ALERTA_HORA=08:00
```

> Para Gmail: `Google Account → Security → 2-Step Verification → App Passwords`

---

## API — Endpoints principales

```
POST   /api/auth/login
GET    /api/auth/me
GET    /api/auth/usuarios          (socio, admin)
POST   /api/auth/usuarios          (admin)
PUT    /api/auth/usuarios/:id      (admin)

GET    /api/expedientes            ?area= &estado= &id_abogado=
POST   /api/expedientes
PUT    /api/expedientes/:id
GET    /api/expedientes/:id        incluye movimientos[]
POST   /api/expedientes/:id/movimientos
DELETE /api/expedientes/:id        (socio, admin)

GET    /api/clientes               ?tipo= &area=
POST   /api/clientes               (socio, admin)
PUT    /api/clientes/:id           (socio, admin)
DELETE /api/clientes/:id           (socio, admin)
GET    /api/clientes/:id           incluye expedientes[]

GET    /api/abogados               incluye exp_activos
POST   /api/abogados               (socio, admin)
PUT    /api/abogados/:id           (socio, admin)

GET    /api/exportar/expedientes/pdf    ?area= &estado=
GET    /api/exportar/expedientes/excel  ?area= &estado=
GET    /api/exportar/clientes/excel

GET    /api/health
```

---

## Bugs corregidos en esta versión

- `db.js`: race condition en el singleton del pool → resuelto con promise-based singleton
- `routes/auth.js`: `req.params.id` sin `parseInt` en PUT → corregido
- `routes/expedientes.js`: race condition en generación de número correlativo → resuelto con `UPDLOCK`
- `routes/expedientes.js`: abogados podían ver/editar expedientes ajenos → restricción aplicada
- `routes/clientes.js`: abogados podían crear clientes vía API → restricción de rol aplicada
- `services/alertas.js`: `createTransporter` (no existe en nodemailer) → `createTransport`
- `services/alertas.js`: SQL injection en `diasConfig.join(',')` → validación de enteros
- `sql/01_schema.sql`: `AlertasEnviadas` sin `ON DELETE CASCADE` → FK error al borrar expedientes
- `sql/01_schema.sql`: índices de rendimiento agregados
- `frontend/api.js`: BASE hardcodeada ignoraba el proxy de Vite → URL relativa por defecto
- `frontend/App.jsx`: token expirado no detectado al cargar → verificación de `exp` del JWT
- `frontend/App.jsx`: `expDetail` quedaba stale tras editar → se refresca con GET /:id
- `frontend/App.jsx`: export URLs generaban `area=&estado=` → `URLSearchParams` limpio
- `routes/exportar.js`: argb en ExcelJS en minúsculas → UPPERCASE requerido
- `routes/exportar.js`: columnas PDF no sumaban el ancho real → recalculado
