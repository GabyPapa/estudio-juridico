const cron       = require('node-cron');
const nodemailer = require('nodemailer');
const { query }  = require('../db');

let transporter = null;

// BUG FIX: era createTransporter (no existe) → createTransport
function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host:   process.env.SMTP_HOST || 'smtp.gmail.com',
      port:   parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

/**
 * Verifica expedientes activos con prox_fecha en los próximos N días
 * y envía un email de alerta a los destinatarios configurados.
 * No duplica alertas — registra cada envío en AlertasEnviadas.
 */
async function verificarAlertas() {
  const destinatarios = (process.env.ALERT_TO || '').trim();
  if (!destinatarios || !process.env.SMTP_USER) {
    console.log('⚠️  Alertas: SMTP no configurado en .env, omitiendo.');
    return;
  }

  // BUG FIX: validar diasConfig para evitar SQL injection
  const diasRaw    = (process.env.ALERT_DAYS || '3,7').split(',');
  const diasConfig = diasRaw
    .map(d => parseInt(d.trim()))
    .filter(d => Number.isInteger(d) && d > 0 && d <= 365);

  if (diasConfig.length === 0) {
    console.warn('⚠️  Alertas: ALERTA_DIAS no contiene valores válidos.');
    return;
  }

  try {
    const r = await query(
      `SELECT e.id, e.numero, e.caratula, e.area, e.juzgado,
              CONVERT(VARCHAR, e.prox_fecha, 103) AS prox_fecha_fmt,
              e.prox_fecha,
              DATEDIFF(day, CAST(GETDATE() AS DATE), e.prox_fecha) AS dias_restantes,
              c.razon  AS cliente,
              a.nombre AS abogado,
              a.email  AS abogado_email
       FROM Expedientes e
       LEFT JOIN Clientes c ON c.id = e.id_cliente
       LEFT JOIN Abogados a ON a.id = e.id_abogado
       WHERE e.estado = 'activo'
         AND e.prox_fecha IS NOT NULL
         AND DATEDIFF(day, CAST(GETDATE() AS DATE), e.prox_fecha)
             IN (${diasConfig.map(String).join(',')})
       ORDER BY e.prox_fecha`
    );

    if (r.recordset.length === 0) {
      console.log('✅ Alertas: Sin vencimientos próximos.');
      return;
    }

    // Filtrar ya notificados hoy
    const pendientes = [];
    for (const exp of r.recordset) {
      const ya = await query(
        `SELECT TOP 1 id FROM AlertasEnviadas
         WHERE id_expediente     = @id
           AND dias_anticipacion = @dias
           AND CAST(enviado_en AS DATE) = CAST(GETDATE() AS DATE)`,
        { id: exp.id, dias: exp.dias_restantes }
      );
      if (ya.recordset.length === 0) pendientes.push(exp);
    }

    if (pendientes.length === 0) {
      console.log('✅ Alertas: Todo ya fue notificado hoy.');
      return;
    }

    // Construir HTML del email
    const rowsHTML = pendientes.map(e => `
      <tr>
        <td style="padding:8px 12px;font-weight:600;color:#1D4ED8;border-bottom:1px solid #E5E7EB">${e.numero}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #E5E7EB">${e.caratula}</td>
        <td style="padding:8px 12px;color:#6B7280;border-bottom:1px solid #E5E7EB">${e.area}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #E5E7EB">${e.cliente || '—'}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #E5E7EB">${(e.abogado || '').replace(/^Dr[a]?\.?\s+/i, '')}</td>
        <td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #E5E7EB;color:${e.dias_restantes <= 3 ? '#B91C1C' : '#B45309'}">
          ${e.prox_fecha_fmt} (${e.dias_restantes} día${e.dias_restantes !== 1 ? 's' : ''})
        </td>
      </tr>`).join('');

    const html = `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"></head>
<body style="font-family:system-ui,sans-serif;color:#111827;margin:0;padding:0;background:#F9FAFB">
  <div style="max-width:800px;margin:0 auto;background:#fff;border:1px solid #E5E7EB;border-radius:8px;overflow:hidden">
    <div style="background:#1D4ED8;padding:20px 30px">
      <h1 style="color:#fff;margin:0;font-size:18px">⚖️ Estudio Jurídico — Alerta de Vencimientos</h1>
      <p style="color:#BFDBFE;margin:4px 0 0;font-size:13px">
        ${new Date().toLocaleDateString('es-AR', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
      </p>
    </div>
    <div style="padding:24px 30px">
      <p style="font-size:14px;margin:0 0 16px">
        Se detectaron <strong>${pendientes.length}</strong> expediente${pendientes.length !== 1 ? 's' : ''} con fechas próximas:
      </p>
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <thead>
          <tr style="background:#EFF6FF">
            <th style="padding:8px 12px;text-align:left;color:#1D4ED8">Número</th>
            <th style="padding:8px 12px;text-align:left;color:#1D4ED8">Carátula</th>
            <th style="padding:8px 12px;text-align:left;color:#1D4ED8">Área</th>
            <th style="padding:8px 12px;text-align:left;color:#1D4ED8">Cliente</th>
            <th style="padding:8px 12px;text-align:left;color:#1D4ED8">Abogado</th>
            <th style="padding:8px 12px;text-align:left;color:#1D4ED8">Fecha</th>
          </tr>
        </thead>
        <tbody>${rowsHTML}</tbody>
      </table>
      <p style="font-size:11px;color:#9CA3AF;margin:20px 0 0">
        Generado automáticamente · Sistema de Gestión del Estudio Jurídico
      </p>
    </div>
  </div>
</body></html>`;

    await getTransporter().sendMail({
      from:    process.env.ALERT_FROM || process.env.SMTP_USER,
      to:      destinatarios,
      subject: `⚖️ [${pendientes.length}] Expediente${pendientes.length !== 1 ? 's' : ''} con vencimiento próximo — ${new Date().toLocaleDateString('es-AR')}`,
      html,
    });

    // Registrar envíos
    for (const exp of pendientes) {
      await query(
        `INSERT INTO AlertasEnviadas (id_expediente, dias_anticipacion) VALUES (@id, @dias)`,
        { id: exp.id, dias: exp.dias_restantes }
      );
    }

    console.log(`📧 Alertas: email enviado → ${destinatarios} | ${pendientes.length} expediente(s)`);
  } catch (err) {
    console.error('❌ Error en servicio de alertas:', err.message);
  }
}

function iniciarAlertas() {
  const hora = process.env.ALERT_HOUR || '08:00';
  const [h, m] = hora.split(':');
  const expresion = `${parseInt(m)} ${parseInt(h)} * * 1-6`; // Lun-Sáb

  console.log(`🕐 Alertas programadas para las ${hora} (Lunes a Sábado, zona AR)`);

  cron.schedule(expresion, () => {
    console.log('🔔 Verificando alertas de vencimiento...');
    verificarAlertas();
  }, { timezone: 'America/Argentina/Buenos_Aires' });
}

module.exports = { iniciarAlertas, verificarAlertas };
