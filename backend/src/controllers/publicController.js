import * as Configuracion from '../models/Configuracion.js';
import * as Media from '../models/Media.js';
import * as Lugar from '../models/Lugar.js';
import * as Causa from '../models/Causa.js';
import * as Colaborador from '../models/Colaborador.js';
import { getDbStatus } from '../config/db.js';
import { fallbackSitio } from '../utils/fallbacks.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const sitio = asyncHandler(async (req, res) => {
  try {
    const [configuracion, media, lugares, causas, colaboradores] = await Promise.all([
      Configuracion.mapa(),
      Media.agruparPublico(),
      Lugar.listar({ soloActivos: true }),
      Causa.listar({ soloActivos: true }),
      Colaborador.listar({ soloActivos: true }),
    ]);

    res.json({
      ok: true,
      fuente: 'base_de_datos',
      data: {
        configuracion: { ...fallbackSitio.configuracion, ...configuracion },
        media,
        lugares,
        causas,
        colaboradores: colaboradores.length ? colaboradores : fallbackSitio.colaboradores,
      },
    });
  } catch {
    res.json({
      ok: true,
      fuente: 'respaldo',
      data: fallbackSitio,
    });
  }
});

export const salud = asyncHandler(async (req, res) => {
  res.json({ ok: true, db: getDbStatus() });
});
