const router      = require('express').Router();
const PDFDocument = require('pdfkit');
const ExcelJS     = require('exceljs');
const { query }   = require('../db');
const { authMiddleware } = require('../middleware/auth');

const BRAND = {
  primary:  '#1D4ED8',
  light:    '#EFF6FF',
  accent:   '#DBEAFE',
  muted:    '#6B7280',
  text:     '#111827',
  border:   '#E5E7EB',
  stripe:   '#F9FAFB',
};

// BUG FIX: argb para ExcelJS debe ser UPPERCASE y prefijado con 'FF' para opacidad 100%
const XL = {
  primary:  'FF1D4ED8',
  light:    'FFEFF6FF',
  accent:   'FFDBEAFE',
  muted:    'FF6B7280',
  stripe:   'FFF9FAFB',
  success:  'FF166534',
  danger:   'FFB91C1C',
  warning:  'FFB45309',
  gray:     'FF374151',
};

// ─── Helper: fila de tabla PDF ────────────────────────────
function pdfRow(doc, cols, y, isHeader = false) {
  doc.fillColor(isHeader ? BRAND.border : '#FFFFFF').rect(40, y, 762, 18).fill();
  doc.fillColor(isHeader ? BRAND.primary : BRAND.text)
    .font(isHeader ? 'Helvetica-Bold' : 'Helvetica')
    .fontSize(8);
  cols.forEach(({ text, x, w, align }) => {
    doc.text(String(text || ''), x, y + 5, {
      width:     w - 4,
      align:     align || 'left',
      lineBreak: false,
      ellipsis:  true,
    });
  });
  doc.strokeColor(BRAND.border).lineWidth(0.3)
    .moveTo(40, y + 18).lineTo(802, y + 18).stroke();
}

// ─── GET /api/exportar/expedientes/pdf ───────────────────
router.get('/expedientes/pdf', authMiddleware, async (req, res) => {
  const { area, estado } = req.query;
  try {
    const where  = [];
    const params = {};
    if (area   && area.trim())   { where.push('e.area = @area');     params.area   = area.trim();   }
    if (estado && estado.trim()) { where.push('e.estado = @estado'); params.estado = estado.trim(); }
    if (req.user.rol === 'abogado' && req.user.id_abogado) {
      where.push('e.id_abogado = @id_abogado');
      params.id_abogado = req.user.id_abogado;
    }

    const r = await query(
      `SELECT e.numero, e.caratula, e.area, e.estado, e.juzgado,
              CONVERT(VARCHAR, e.apertura,   103) AS apertura,
              CONVERT(VARCHAR, e.prox_fecha, 103) AS prox_fecha,
              c.razon  AS cliente,
              a.nombre AS abogado
       FROM Expedientes e
       LEFT JOIN Clientes c ON c.id = e.id_cliente
       LEFT JOIN Abogados a ON a.id = e.id_abogado
       ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
       ORDER BY e.numero`,
      params
    );
    const rows = r.recordset;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="expedientes-${Date.now()}.pdf"`);

    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 40 });
    doc.pipe(res);

    // Cabecera azul
    doc.fillColor(BRAND.primary).rect(0, 0, 842, 52).fill();
    doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(16)
      .text('ESTUDIO JURÍDICO', 40, 14);
    doc.font('Helvetica').fontSize(9).fillColor('#BFDBFE')
      .text(
        `Expedientes — ${new Date().toLocaleDateString('es-AR')}  ·  ${rows.length} registro(s)` +
        (area || estado ? `  ·  ${[area && `Área: ${area}`, estado && `Estado: ${estado}`].filter(Boolean).join(', ')}` : ''),
        40, 35
      );

    // BUG FIX: columnas ahora suman 762px = ancho útil (842 - 40*2)
    const COLS = [
      { label: 'Número',       x: 40,  w: 100 },
      { label: 'Carátula',     x: 140, w: 260 },
      { label: 'Área',         x: 400, w: 80  },
      { label: 'Estado',       x: 480, w: 70  },
      { label: 'Abogado',      x: 550, w: 140 },
      { label: 'Prox. fecha',  x: 690, w: 112 },
    ];

    let y = 62;
    pdfRow(doc, COLS.map(c => ({ text: c.label, x: c.x, w: c.w })), y, true);
    y += 18;

    rows.forEach((row, i) => {
      if (y > 545) {
        doc.addPage({ size: 'A4', layout: 'landscape', margin: 40 });
        y = 40;
        pdfRow(doc, COLS.map(c => ({ text: c.label, x: c.x, w: c.w })), y, true);
        y += 18;
      }
      if (i % 2 === 1) {
        doc.fillColor(BRAND.stripe).rect(40, y, 762, 18).fill();
      }
      pdfRow(doc, [
        { text: row.numero  || '',   x: 40,  w: 100 },
        { text: row.caratula || '',  x: 140, w: 260 },
        { text: row.area    || '',   x: 400, w: 80  },
        { text: row.estado  || '',   x: 480, w: 70  },
        { text: (row.abogado || '').replace(/^Dr[a]?\.?\s+/i, ''), x: 550, w: 140 },
        { text: row.prox_fecha || '—', x: 690, w: 112 },
      ], y);
      y += 18;
    });

    doc.fillColor(BRAND.muted).fontSize(7).font('Helvetica')
      .text(
        'Generado automáticamente · Sistema de Gestión — Estudio Jurídico',
        40, doc.page.height - 28, { align: 'center', width: 762 }
      );
    doc.end();
  } catch (err) {
    console.error('[exportar/expedientes/pdf]', err);
    if (!res.headersSent) res.status(500).json({ error: 'Error al generar PDF' });
  }
});

// ─── GET /api/exportar/expedientes/excel ─────────────────
router.get('/expedientes/excel', authMiddleware, async (req, res) => {
  const { area, estado } = req.query;
  try {
    const where  = [];
    const params = {};
    if (area   && area.trim())   { where.push('e.area = @area');     params.area   = area.trim();   }
    if (estado && estado.trim()) { where.push('e.estado = @estado'); params.estado = estado.trim(); }
    if (req.user.rol === 'abogado' && req.user.id_abogado) {
      where.push('e.id_abogado = @id_abogado');
      params.id_abogado = req.user.id_abogado;
    }

    const r = await query(
      `SELECT e.numero, e.caratula, e.area, e.estado, e.juzgado,
              e.apertura, e.prox_fecha, e.notas,
              c.razon AS cliente, c.email AS cliente_email, c.cuit,
              a.nombre AS abogado, a.matricula AS abogado_matricula
       FROM Expedientes e
       LEFT JOIN Clientes  c ON c.id = e.id_cliente
       LEFT JOIN Abogados  a ON a.id = e.id_abogado
       ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
       ORDER BY e.numero`,
      params
    );

    const wb = new ExcelJS.Workbook();
    wb.creator = 'Sistema Estudio Jurídico';
    const ws = wb.addWorksheet('Expedientes', { views: [{ state: 'frozen', ySplit: 3 }] });

    // Fila 1: título
    ws.mergeCells('A1:M1');
    const t1 = ws.getCell('A1');
    t1.value = 'ESTUDIO JURÍDICO — Listado de Expedientes';
    t1.font  = { size: 14, bold: true, color: { argb: XL.primary } };
    t1.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: XL.light } };
    ws.getRow(1).height = 24;

    // Fila 2: subtítulo
    ws.mergeCells('A2:M2');
    const t2 = ws.getCell('A2');
    t2.value = `Exportado: ${new Date().toLocaleString('es-AR')}  ·  ${r.recordset.length} expediente(s)`;
    t2.font  = { size: 9, color: { argb: XL.muted } };
    ws.getRow(2).height = 16;

    // Fila 3: encabezados
    const headers = ['Número','Carátula','Área','Estado','Juzgado','Apertura','Próx. Fecha','Cliente','CUIT','Email Cliente','Abogado','Matrícula','Notas'];
    const widths  = [    15,       60,     15,     12,      35,       13,          13,          35,     18,       35,             30,        15,       40];
    ws.addRow(headers);
    const hRow = ws.getRow(3);
    hRow.height = 18;
    hRow.eachCell(cell => {
      cell.font      = { bold: true, color: { argb: XL.primary } };
      cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: XL.accent } };
      cell.border    = { bottom: { style: 'thin', color: { argb: XL.primary } } };
      cell.alignment = { vertical: 'middle' };
    });
    headers.forEach((_, i) => { ws.getColumn(i + 1).width = widths[i]; });

    // Filas de datos
    r.recordset.forEach((row, idx) => {
      const wsRow = ws.addRow([
        row.numero,          row.caratula,         row.area,           row.estado,
        row.juzgado || '',
        row.apertura   ? new Date(row.apertura)   : '',
        row.prox_fecha ? new Date(row.prox_fecha) : '',
        row.cliente || '',   row.cuit || '',        row.cliente_email || '',
        row.abogado || '',   row.abogado_matricula || '',  row.notas || '',
      ]);

      // Filas alternadas
      if (idx % 2 === 1) {
        wsRow.eachCell(cell => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: XL.stripe } };
        });
      }

      // Formato de fechas
      [6, 7].forEach(col => {
        const c = wsRow.getCell(col);
        if (c.value) c.numFmt = 'dd/mm/yyyy';
      });

      // Color por estado
      const estadoColores = { activo: XL.success, cerrado: XL.gray, suspendido: XL.warning };
      wsRow.getCell(4).font = { color: { argb: estadoColores[row.estado] || XL.gray } };
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="expedientes-${Date.now()}.xlsx"`);
    await wb.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('[exportar/expedientes/excel]', err);
    if (!res.headersSent) res.status(500).json({ error: 'Error al generar Excel' });
  }
});

// ─── GET /api/exportar/clientes/excel ────────────────────
router.get('/clientes/excel', authMiddleware, async (req, res) => {
  try {
    const r = await query(
      `SELECT razon, tipo, area, cuit, contacto, email, tel, notas,
              CONVERT(VARCHAR, creado_en, 103) AS creado_en
       FROM Clientes
       ORDER BY tipo, razon`
    );
    const wb = new ExcelJS.Workbook();
    wb.creator = 'Sistema Estudio Jurídico';
    const ws = wb.addWorksheet('Clientes');

    ws.mergeCells('A1:I1');
    const t1 = ws.getCell('A1');
    t1.value = 'ESTUDIO JURÍDICO — Base de Clientes';
    t1.font  = { size: 13, bold: true, color: { argb: XL.primary } };
    t1.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: XL.light } };
    ws.getRow(1).height = 22;

    ws.mergeCells('A2:I2');
    ws.getCell('A2').value = `Exportado: ${new Date().toLocaleString('es-AR')}  ·  ${r.recordset.length} cliente(s)`;
    ws.getCell('A2').font  = { size: 9, color: { argb: XL.muted } };

    const headers = ['Razón Social','Tipo','Área','CUIT','Contacto','Email','Teléfono','Notas','Ingresado'];
    const widths  = [40, 12, 16, 18, 25, 35, 20, 40, 13];
    ws.addRow(headers);
    const hRow = ws.getRow(3);
    hRow.height = 16;
    hRow.eachCell(c => {
      c.font   = { bold: true, color: { argb: XL.primary } };
      c.fill   = { type: 'pattern', pattern: 'solid', fgColor: { argb: XL.accent } };
      c.border = { bottom: { style: 'thin', color: { argb: XL.primary } } };
    });
    headers.forEach((_, i) => { ws.getColumn(i + 1).width = widths[i]; });

    r.recordset.forEach((row, idx) => {
      const wsRow = ws.addRow([
        row.razon, row.tipo, row.area || '', row.cuit || '',
        row.contacto || '', row.email || '', row.tel || '',
        row.notas || '', row.creado_en || '',
      ]);
      if (idx % 2 === 1) {
        wsRow.eachCell(c => { c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: XL.stripe } }; });
      }
      wsRow.getCell(2).font = {
        color: { argb: row.tipo === 'actual' ? XL.primary : XL.warning },
      };
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="clientes-${Date.now()}.xlsx"`);
    await wb.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('[exportar/clientes/excel]', err);
    if (!res.headersSent) res.status(500).json({ error: 'Error al generar Excel' });
  }
});

module.exports = router;
