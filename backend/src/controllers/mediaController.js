import * as Media from '../models/Media.js';
import { asyncHandler, httpError } from '../utils/asyncHandler.js';
import { borrarArchivo, rutaPublica } from '../middlewares/upload.js';
import { seccionesMedia, tiposMedia } from '../utils/fallbacks.js';

function payloadDesde(req) {
  const tipo = req.body.tipo || (req.file?.mimetype.startsWith('video/') ? 'video' : 'imagen');
  const seccion = req.body.seccion;
  if (!tiposMedia.includes(tipo)) throw httpError(400, 'Tipo de media inválido');
  if (!seccionesMedia.includes(seccion)) throw httpError(400, 'Sección de media inválida');

  return {
    tipo,
    seccion,
    titulo: req.body.titulo || null,
    ruta_relativa: req.file ? rutaPublica(req.file) : req.body.ruta_relativa || null,
    url_externa: req.body.url_externa || null,
    orden: req.body.orden ?? 0,
    activo: req.body.activo,
  };
}

export const listar = asyncHandler(async (req, res) => {
  const items = await Media.listar();
  res.json({ ok: true, items });
});

export const crear = asyncHandler(async (req, res) => {
  const datos = payloadDesde(req);
  if (!datos.ruta_relativa && !datos.url_externa) {
    throw httpError(400, 'Sube un archivo o indica una URL externa');
  }
  const item = await Media.crear(datos);
  res.status(201).json({ ok: true, item });
});

export const actualizar = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const actual = await Media.findById(id);
  if (!actual) throw httpError(404, 'Media no encontrada');

  const datos = payloadDesde(req);
  if (req.file && actual.ruta_relativa) borrarArchivo(actual.ruta_relativa);
  const item = await Media.actualizar(id, datos);
  res.json({ ok: true, item });
});

export const eliminar = asyncHandler(async (req, res) => {
  const item = await Media.eliminar(Number(req.params.id));
  if (!item) throw httpError(404, 'Media no encontrada');
  borrarArchivo(item.ruta_relativa);
  res.json({ ok: true });
});
