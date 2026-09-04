import * as Lugar from '../models/Lugar.js';
import { asyncHandler, httpError } from '../utils/asyncHandler.js';

function validar(body) {
  const departamento = String(body.departamento || '').trim();
  const municipio = String(body.municipio || '').trim();
  const latitud = Number(body.latitud);
  const longitud = Number(body.longitud);
  if (!departamento || !municipio) throw httpError(400, 'Departamento y municipio son obligatorios');
  if (!Number.isFinite(latitud) || !Number.isFinite(longitud)) {
    throw httpError(400, 'Latitud y longitud deben ser números');
  }
  return {
    departamento,
    municipio,
    latitud,
    longitud,
    titulo: body.titulo || null,
    descripcion: body.descripcion || null,
    activo: body.activo,
  };
}

export const listar = asyncHandler(async (req, res) => {
  res.json({ ok: true, items: await Lugar.listar() });
});

export const crear = asyncHandler(async (req, res) => {
  const item = await Lugar.crear(validar(req.body));
  res.status(201).json({ ok: true, item });
});

export const actualizar = asyncHandler(async (req, res) => {
  const item = await Lugar.actualizar(Number(req.params.id), validar(req.body));
  if (!item) throw httpError(404, 'Lugar no encontrado');
  res.json({ ok: true, item });
});

export const eliminar = asyncHandler(async (req, res) => {
  const item = await Lugar.eliminar(Number(req.params.id));
  if (!item) throw httpError(404, 'Lugar no encontrado');
  res.json({ ok: true });
});
