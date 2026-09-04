import { query, sql } from '../config/db.js';
import { toBit } from '../utils/asyncHandler.js';

export async function listar({ soloActivos = false } = {}) {
  const result = await query(
    `SELECT id, departamento, municipio, latitud, longitud, titulo, descripcion, activo, creado_en
     FROM dbo.lugares
     WHERE (@soloActivos = 0 OR activo = 1)
     ORDER BY departamento, municipio`,
    { soloActivos: { type: sql.Bit, value: soloActivos } },
  );
  return result.recordset;
}

export async function crear(datos) {
  const result = await query(
    `INSERT INTO dbo.lugares (departamento, municipio, latitud, longitud, titulo, descripcion, activo)
     OUTPUT inserted.id, inserted.departamento, inserted.municipio, inserted.latitud,
            inserted.longitud, inserted.titulo, inserted.descripcion, inserted.activo
     VALUES (@departamento, @municipio, @latitud, @longitud, @titulo, @descripcion, @activo)`,
    {
      departamento: { type: sql.NVarChar(80), value: datos.departamento },
      municipio: { type: sql.NVarChar(120), value: datos.municipio },
      latitud: { type: sql.Decimal(10, 7), value: Number(datos.latitud) },
      longitud: { type: sql.Decimal(11, 7), value: Number(datos.longitud) },
      titulo: { type: sql.NVarChar(180), value: datos.titulo || null },
      descripcion: { type: sql.NVarChar(sql.MAX), value: datos.descripcion || null },
      activo: { type: sql.Bit, value: toBit(datos.activo) },
    },
  );
  return result.recordset[0];
}

export async function actualizar(id, datos) {
  const result = await query(
    `UPDATE dbo.lugares
     SET departamento = @departamento,
         municipio = @municipio,
         latitud = @latitud,
         longitud = @longitud,
         titulo = @titulo,
         descripcion = @descripcion,
         activo = @activo
     OUTPUT inserted.id, inserted.departamento, inserted.municipio, inserted.latitud,
            inserted.longitud, inserted.titulo, inserted.descripcion, inserted.activo
     WHERE id = @id`,
    {
      id: { type: sql.Int, value: id },
      departamento: { type: sql.NVarChar(80), value: datos.departamento },
      municipio: { type: sql.NVarChar(120), value: datos.municipio },
      latitud: { type: sql.Decimal(10, 7), value: Number(datos.latitud) },
      longitud: { type: sql.Decimal(11, 7), value: Number(datos.longitud) },
      titulo: { type: sql.NVarChar(180), value: datos.titulo || null },
      descripcion: { type: sql.NVarChar(sql.MAX), value: datos.descripcion || null },
      activo: { type: sql.Bit, value: toBit(datos.activo) },
    },
  );
  return result.recordset[0] || null;
}

export async function eliminar(id) {
  const result = await query(`DELETE FROM dbo.lugares OUTPUT deleted.id WHERE id = @id`, {
    id: { type: sql.Int, value: id },
  });
  return result.recordset[0] || null;
}
