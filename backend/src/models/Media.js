import { query, sql } from '../config/db.js';
import { toBit } from '../utils/asyncHandler.js';

export async function listar({ soloActivos = false } = {}) {
  const result = await query(
    `SELECT id, tipo, seccion, titulo, ruta_relativa, url_externa, orden, activo, creado_en
     FROM dbo.media
     WHERE (@soloActivos = 0 OR activo = 1)
     ORDER BY seccion, orden, id`,
    { soloActivos: { type: sql.Bit, value: soloActivos } },
  );
  return result.recordset;
}

export async function agruparPublico() {
  const filas = await listar({ soloActivos: true });
  const grupos = { logo: [], hero: [], galeria: [], video_principal: [], causa: [] };
  for (const item of filas) {
    if (grupos[item.seccion]) grupos[item.seccion].push(item);
  }
  return grupos;
}

export async function findById(id) {
  const result = await query(
    `SELECT id, tipo, seccion, titulo, ruta_relativa, url_externa, orden, activo, creado_en
     FROM dbo.media WHERE id = @id`,
    { id: { type: sql.Int, value: id } },
  );
  return result.recordset[0] || null;
}

export async function crear(datos) {
  const result = await query(
    `INSERT INTO dbo.media (tipo, seccion, titulo, ruta_relativa, url_externa, orden, activo)
     OUTPUT inserted.id, inserted.tipo, inserted.seccion, inserted.titulo,
            inserted.ruta_relativa, inserted.url_externa, inserted.orden, inserted.activo
     VALUES (@tipo, @seccion, @titulo, @ruta_relativa, @url_externa, @orden, @activo)`,
    {
      tipo: { type: sql.NVarChar(20), value: datos.tipo },
      seccion: { type: sql.NVarChar(30), value: datos.seccion },
      titulo: { type: sql.NVarChar(180), value: datos.titulo || null },
      ruta_relativa: { type: sql.NVarChar(255), value: datos.ruta_relativa || null },
      url_externa: { type: sql.NVarChar(500), value: datos.url_externa || null },
      orden: { type: sql.Int, value: Number(datos.orden ?? 0) },
      activo: { type: sql.Bit, value: toBit(datos.activo) },
    },
  );
  return result.recordset[0];
}

export async function actualizar(id, datos) {
  const result = await query(
    `UPDATE dbo.media
     SET tipo = @tipo,
         seccion = @seccion,
         titulo = @titulo,
         ruta_relativa = COALESCE(@ruta_relativa, ruta_relativa),
         url_externa = @url_externa,
         orden = @orden,
         activo = @activo
     OUTPUT inserted.id, inserted.tipo, inserted.seccion, inserted.titulo,
            inserted.ruta_relativa, inserted.url_externa, inserted.orden, inserted.activo
     WHERE id = @id`,
    {
      id: { type: sql.Int, value: id },
      tipo: { type: sql.NVarChar(20), value: datos.tipo },
      seccion: { type: sql.NVarChar(30), value: datos.seccion },
      titulo: { type: sql.NVarChar(180), value: datos.titulo || null },
      ruta_relativa: { type: sql.NVarChar(255), value: datos.ruta_relativa || null },
      url_externa: { type: sql.NVarChar(500), value: datos.url_externa || null },
      orden: { type: sql.Int, value: Number(datos.orden ?? 0) },
      activo: { type: sql.Bit, value: toBit(datos.activo) },
    },
  );
  return result.recordset[0] || null;
}

export async function eliminar(id) {
  const actual = await findById(id);
  if (!actual) return null;
  await query(`DELETE FROM dbo.media WHERE id = @id`, {
    id: { type: sql.Int, value: id },
  });
  return actual;
}
