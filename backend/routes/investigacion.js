const router = require('express').Router();
const { query } = require('../db');
const { authMiddleware } = require('../middleware/auth');

async function ensureTable() {
  try {
    await query(`
      IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'ConfiguracionSistema')
      BEGIN
        CREATE TABLE ConfiguracionSistema (
          clave          NVARCHAR(100) NOT NULL PRIMARY KEY,
          valor          NVARCHAR(MAX),
          descripcion    NVARCHAR(300),
          actualizado_en DATETIME2     NOT NULL DEFAULT GETDATE()
        );
        INSERT INTO ConfiguracionSistema (clave, descripcion) VALUES
          ('ANTHROPIC_API_KEY', 'API Key de Anthropic para el modulo Investigacion IA');
      END
    `);
  } catch {}
}

async function getApiKey() {
  if (process.env.ANTHROPIC_API_KEY?.trim()) return process.env.ANTHROPIC_API_KEY.trim();
  try {
    await ensureTable();
    const r = await query(
      "SELECT valor FROM ConfiguracionSistema WHERE clave='ANTHROPIC_API_KEY' AND valor IS NOT NULL AND valor<>''"
    );
    if (r.recordset[0]?.valor) return r.recordset[0].valor;
  } catch {}
  return null;
}

router.post('/', authMiddleware, async (req, res) => {
  const apiKey = await getApiKey();
  if (!apiKey) return res.status(503).json({ sinKey: true, error: 'API key no configurada' });

  const { query: searchQuery, tipo } = req.body;
  if (!searchQuery?.trim()) return res.status(400).json({ error: 'query requerida' });

  const tipoTexto = tipo === 'jurisprudencia'
    ? 'jurisprudencia argentina: fallos de la CSJN, Cámaras Nacionales y Provinciales'
    : tipo === 'doctrina'
    ? 'doctrina jurídica argentina: autores, publicaciones en LL, ED, JA, libros'
    : 'legislación argentina vigente: leyes nacionales, decretos y resoluciones';

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-beta':    'web-search-2025-03-05',
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-5',
        max_tokens: 2000,
        system: `Sos un asistente jurídico especializado en derecho argentino. Buscá información actualizada sobre ${tipoTexto}. Respondé EXCLUSIVAMENTE con JSON válido, sin backticks. Estructura: {"titulo":"...","resultados":[{"titulo":"...","referencia":"...","fecha":"...","resumen":"...","relevancia":"alta"}],"nota":"..."}. Incluí 3-6 resultados ordenados por relevancia.`,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages: [{ role: 'user', content: `Buscá sobre: "${searchQuery.trim()}" en ${tipoTexto}.` }],
      }),
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      const msg = errBody?.error?.message || `HTTP ${response.status}`;
      if (response.status === 401) return res.status(401).json({ sinKey: true, error: 'API key inválida. Volvé a configurarla.' });
      return res.status(502).json({ error: `Error Anthropic: ${msg}` });
    }

    const data = await response.json();
    const textBlock = data.content?.find(b => b.type === 'text');
    const raw = textBlock?.text || '';

    try {
      const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
      return res.json({ ok: true, data: parsed });
    } catch {
      return res.json({ ok: true, data: { titulo: searchQuery, resultados: [], nota: raw, raw: true } });
    }
  } catch (err) {
    console.error('[investigacion]', err.message);
    const sinInternet = ['ENOTFOUND', 'ECONNREFUSED', 'ETIMEDOUT'].includes(err.cause?.code);
    res.status(503).json({ error: sinInternet ? 'Sin conexión a internet.' : 'Error al contactar Anthropic.' });
  }
});

module.exports = router;
