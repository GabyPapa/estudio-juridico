const router = require('express').Router();
const { authMiddleware } = require('../middleware/auth');

/**
 * POST /api/investigacion
 * Proxy autenticado hacia Anthropic API.
 * Body: { query: string, tipo: "jurisprudencia" | "doctrina" | "legislacion" }
 */
router.post('/', authMiddleware, async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return res.status(503).json({
      error: 'ANTHROPIC_API_KEY no configurada en backend/.env. Agregá tu clave de API de Anthropic para usar este módulo.',
    });
  }

  const { query, tipo } = req.body;
  if (!query?.trim()) return res.status(400).json({ error: 'query requerida' });

  const tipoTexto = tipo === 'jurisprudencia'
    ? 'jurisprudencia argentina: fallos de la CSJN, Cámaras Nacionales y Provinciales'
    : tipo === 'doctrina'
    ? 'doctrina jurídica argentina: autores, publicaciones en LL, ED, JA, libros'
    : 'legislación argentina vigente: leyes nacionales, decretos y resoluciones';

  const systemPrompt = `Sos un asistente jurídico especializado en derecho argentino.
Tu tarea es buscar información actualizada sobre ${tipoTexto}.
Responde EXCLUSIVAMENTE con un objeto JSON válido, sin texto adicional, sin backticks, sin comentarios.
Estructura exacta requerida:
{
  "titulo": "título descriptivo de la búsqueda",
  "resultados": [
    {
      "titulo": "nombre del fallo/obra/ley",
      "referencia": "cita completa (ej: Fallos 327:3753, LL 2024-A-123, Ley 20.744)",
      "fecha": "año o fecha del fallo/publicación",
      "resumen": "resumen de 2-3 oraciones sobre el contenido y relevancia",
      "relevancia": "alta"
    }
  ],
  "nota": "aclaración útil sobre los resultados o limitaciones de la búsqueda"
}
Incluí entre 3 y 6 resultados ordenados por relevancia. Si no encontrás resultados confiables, indicalo en "nota" y devolvé resultados vacíos.`;

  const userPrompt = `Buscá información sobre: "${query.trim()}" en ${tipoTexto}.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':   'application/json',
        'x-api-key':      apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'web-search-2025-03-05',
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-5',
        max_tokens: 2000,
        system:     systemPrompt,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      const msg = errBody?.error?.message || `HTTP ${response.status}`;
      return res.status(502).json({ error: `Error en API de Anthropic: ${msg}` });
    }

    const data = await response.json();

    // Extraer bloque de texto de la respuesta (puede haber tool_use intercalados)
    const textBlock = data.content?.find(b => b.type === 'text');
    const raw = textBlock?.text || '';

    // Intentar parsear JSON
    try {
      const clean = raw.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      return res.json({ ok: true, data: parsed });
    } catch {
      // Si no es JSON válido, devolver el texto crudo
      return res.json({ ok: true, data: { titulo: query, resultados: [], nota: raw, raw: true } });
    }
  } catch (err) {
    console.error('[investigacion POST]', err.message);
    // Distinguir errores de red vs otros
    if (err.cause?.code === 'ENOTFOUND' || err.cause?.code === 'ECONNREFUSED') {
      return res.status(503).json({ error: 'Sin conexión a internet. Verificá la conexión del servidor.' });
    }
    res.status(500).json({ error: 'Error al contactar la API. Revisá la clave en backend/.env.' });
  }
});

module.exports = router;
