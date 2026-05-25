// BUG FIX: BASE usa URL relativa en dev (aprovecha el proxy de Vite) y la variable
// de entorno en producción. El approach anterior hardcodeaba localhost:3001 en ambos casos.
const BASE = import.meta.env.VITE_API_URL ?? '';

function authHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: authHeaders(),
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  // 401 → limpiar token y recargar
  if (res.status === 401) {
    localStorage.removeItem('token');
    window.location.reload();
    return; // unreachable pero evita que el caller siga
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export const api = {
  get:    path       => request('GET',    path),
  post:   (path, b)  => request('POST',   path, b),
  put:    (path, b)  => request('PUT',    path, b),
  delete: path       => request('DELETE', path),
};

/**
 * Descarga un archivo autenticado disparando un click en un <a> temporal.
 * @param {string} path  - Ruta relativa: '/api/exportar/expedientes/pdf?...'
 * @param {string} filename - Nombre de descarga: 'expedientes.pdf'
 */
export async function descargar(path, filename) {
  const token = localStorage.getItem('token');
  const res   = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  const blob = await res.blob();
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
