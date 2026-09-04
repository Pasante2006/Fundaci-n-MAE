async function request(path, options = {}) {
  const isForm = options.body instanceof FormData;
  const res = await fetch(path, {
    credentials: 'include',
    ...options,
    headers: isForm
      ? options.headers
      : { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.mensaje || 'No se pudo completar la solicitud');
  }
  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: body instanceof FormData ? body : JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: body instanceof FormData ? body : JSON.stringify(body) }),
  del: (path) => request(path, { method: 'DELETE' }),
};

export function mediaUrl(item) {
  if (!item) return '';
  if (typeof item === 'string') return item;
  return item.url_externa || item.ruta_relativa || item.imagen || '';
}

export const SECCIONES_MEDIA = [
  { id: 'logo', label: 'Logo' },
  { id: 'hero', label: 'Inicio / hero' },
  { id: 'galeria', label: 'Galería' },
  { id: 'video_principal', label: 'Video principal' },
  { id: 'causa', label: 'Causas' },
];
