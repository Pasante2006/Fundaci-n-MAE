import * as Configuracion from '../models/Configuracion.js';
import * as Media from '../models/Media.js';
import * as Lugar from '../models/Lugar.js';
import * as Causa from '../models/Causa.js';
import * as Colaborador from '../models/Colaborador.js';
import { getDbStatus } from '../config/db.js';
import { fallbackSitio } from '../utils/fallbacks.js';
import { asyncHandler } from '../utils/asyncHandler.js';

async function seguro(promesa, respaldo, etiqueta) {
  try {
    return await promesa;
  } catch (error) {
    console.warn(`Sitio público: no se pudo leer ${etiqueta}:`, error.message);
    return respaldo;
  }
}

export const sitio = asyncHandler(async (req, res) => {
  const [configuracion, media, lugares, causas, colaboradores] = await Promise.all([
    seguro(Configuracion.mapa(), {}, 'configuracion'),
    seguro(Media.agruparPublico(), fallbackSitio.media, 'media'),
    seguro(Lugar.listar({ soloActivos: true }), [], 'lugares'),
    seguro(Causa.listar({ soloActivos: true }), [], 'causas'),
    seguro(Colaborador.listar({ soloActivos: true }), fallbackSitio.colaboradores, 'colaboradores'),
  ]);

  const hayBd = getDbStatus().conectado;
  res.json({
    ok: true,
    fuente: hayBd ? 'base_de_datos' : 'respaldo',
    data: {
      configuracion: { ...fallbackSitio.configuracion, ...configuracion },
      media,
      lugares,
      causas,
      colaboradores: colaboradores.length ? colaboradores : fallbackSitio.colaboradores,
    },
  });
});

export const salud = asyncHandler(async (req, res) => {
  res.json({ ok: true, db: getDbStatus() });
});
