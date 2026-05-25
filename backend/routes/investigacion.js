const router = require('express').Router();
const { query } = require('../db');
const { authMiddleware } = require('../middleware/auth');

async function getApiKey() {
  // Prioridad 1: variable de entorno
  if (process.env.ANTHROPIC_API_KEY?.trim()) return process.env.ANTHROPIC_API_KEY.trim();
  // Prioridad 2: base de datos
  try {
    const r = await query("SELECT valor FROM ConfiguracionSistema WHERE clave='ANTHROPIC_API_KEY' AND valor IS NOT NULL AND valor<>''");
    if (r.recordset[0]?.valor) return r.recordset[0].valor;
  } catch {}
  return null;
}

router.post('/', authMiddleware, async (req, res) => {
  const apiKey = await getApiKey();
  if (!apiKey) {
    return res.status(503).json({ sinKey: true, error: 'API key no configurada' });
  }

  const { query: searchQuery, tipo } = req.body;
  if (!searchQuery?.trim()) return res.status(400).json({ error: 'query requerida' });

  const tipoTexto = tipo === 'jurisprudencia'
    ? 'jurisprudencia argentina: fallos de la CSJN, Cámaras Nacionales y Provinciales'
    : tipo === 'doctrina'
    ? 'doctrina jurídica argentina: autores, publicaciones en LL, ED, JA, libros'
    : 'legislación argentina vigente: leyes nacionales, decretos y resoluciones';

  const systemPrompt = `Sos un asistente jurídico especializado en derecho argentino.
Buscá información actualizada sobre ${tipoTexto}.
Respondé EXCLUSIVAMENTE con JSON válido, sin texto adicional, sin backticks.
Estructura:
{
  "titulo": "título descriptivo de la búsqueda",
  "resultados": [
    {
      "titulo": "nombre del fallo/obra/ley",
      "referencia": "cita completa (Fallos 327:3753, LL 2024-A-123, Ley 20.744)",
      "fecha": "año o fecha",
      "resumen": "2-3 oraciones sobre contenido y relevancia",
      "relevancia": "alta"
    }
  ],
  "nota": "aclaración sobre los resultados o limitaciones"
}
Incluí 3-6 resultados ordenados por relevancia.`;

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
        system:     systemPrompt,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages: [{ role: 'user', content: `Buscá sobre: "${searchQuery.trim()}" en ${tipoTexto}.` }],
      }),
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      const msg = errBody?.error?.message || `HTTP ${response.status}`;
      if (response.status === 401) return res.status(401).json({ sinKey: true, error: 'API key inválida. Verificá la clave en Configuración.' });
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
    const sinInternet = ['ENOTFOUND','ECONNREFUSED','ETIMEDOUT'].includes(err.cause?.code);
    res.status(503).json({ error: sinInternet ? 'Sin conexión a internet.' : 'Error al contactar Anthropic.' });
  }
});

module.exports = router;
