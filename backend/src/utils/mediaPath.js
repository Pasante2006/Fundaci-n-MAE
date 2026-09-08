import fs from 'fs';
import path from 'path';
import { uploadsRoot } from '../middlewares/upload.js';

const FALLBACKS = [
  { match: /malter/i, ruta: '/colab-malteria.png' },
  { match: /abre\s*tus\s*ojos|hogar\s*guadalupe/i, ruta: '/colab-abre-tus-ojos.png' },
  { match: /abuelit|abuelos/i, ruta: '/colab-abuelitos.png' },
];

function existeEnDisco(ruta) {
  if (!ruta?.startsWith('/uploads/')) return true;
  const absoluto = path.join(uploadsRoot, ruta.replace('/uploads/', ''));
  return fs.existsSync(absoluto);
}

function fallbackPorNombre(nombre = '') {
  const clave = String(nombre).normalize('NFD').replace(/\p{Diacritic}/gu, '');
  return FALLBACKS.find(({ match }) => match.test(clave))?.ruta || null;
}

export function resolverImagenPublica(imagen, nombre = '') {
  if (!imagen) return fallbackPorNombre(nombre) || imagen;
  if (!imagen.startsWith('/uploads/')) return imagen;
  if (existeEnDisco(imagen)) return imagen;
  return fallbackPorNombre(nombre) || imagen;
}

export function mapColaborador(item) {
  if (!item) return item;
  return { ...item, imagen: resolverImagenPublica(item.imagen, item.nombre) };
}
