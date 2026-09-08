import * as Colaborador from '../models/Colaborador.js';
import { asyncHandler, httpError } from '../utils/asyncHandler.js';
import { rutaPublica } from '../middlewares/upload.js';
import { mapColaborador } from '../utils/mediaPath.js';

function payload(req) {
  const nombre = String(req.body.nombre || '').trim();
  if (!nombre) throw httpError(400, 'El nombre es obligatorio');
  return {
    nombre,
    descripcion: req.body.descripcion || null,
    imagen: req.file ? rutaPublica(req.file) : req.body.imagen || null,
    orden: req.body.orden ?? 0,
    activo: req.body.activo,
  };
}

export const listar = asyncHandler(async (req, res) => {
  const items = (await Colaborador.listar()).map(mapColaborador);
  res.json({ ok: true, items });
});

export const crear = asyncHandler(async (req, res) => {
  const item = mapColaborador(await Colaborador.crear(payload(req)));
  res.status(201).json({ ok: true, item });
});

export const actualizar = asyncHandler(async (req, res) => {
  const item = mapColaborador(await Colaborador.actualizar(Number(req.params.id), payload(req)));
  if (!item) throw httpError(404, 'Colaborador no encontrado');
  res.json({ ok: true, item });
});

export const eliminar = asyncHandler(async (req, res) => {
  const item = await Colaborador.eliminar(Number(req.params.id));
  if (!item) throw httpError(404, 'Colaborador no encontrado');
  res.json({ ok: true });
});
