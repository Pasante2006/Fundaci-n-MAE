import * as Configuracion from '../models/Configuracion.js';
import { asyncHandler, httpError } from '../utils/asyncHandler.js';

export const listar = asyncHandler(async (req, res) => {
  const items = await Configuracion.listar();
  res.json({ ok: true, items });
});

export const guardar = asyncHandler(async (req, res) => {
  const entradas = Array.isArray(req.body.items) ? req.body.items : [req.body];
  const guardados = [];

  for (const item of entradas) {
    if (!item?.clave) throw httpError(400, 'Cada configuración necesita una clave');
    guardados.push(
      await Configuracion.upsert({
        clave: String(item.clave).trim(),
        valor: String(item.valor ?? ''),
        etiqueta: item.etiqueta ? String(item.etiqueta) : null,
      }),
    );
  }

  res.json({ ok: true, items: guardados });
});
