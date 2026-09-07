import { query, sql } from '../config/db.js';
import { toBit } from '../utils/asyncHandler.js';

let tablaLista = false;

async function asegurarTabla() {
  if (tablaLista) return;
  await query(`
    IF OBJECT_ID(N'dbo.colaboradores', N'U') IS NULL
    BEGIN
      CREATE TABLE dbo.colaboradores (
        id           INT            IDENTITY(1,1) NOT NULL PRIMARY KEY,
        nombre       NVARCHAR(150)  NOT NULL,
        descripcion  NVARCHAR(MAX)  NULL,
        imagen       NVARCHAR(255)  NULL,
        orden        INT            NOT NULL CONSTRAINT DF_colaboradores_orden DEFAULT (0),
        activo       BIT            NOT NULL CONSTRAINT DF_colaboradores_activo DEFAULT (1),
        creado_en    DATETIME2(0)   NOT NULL CONSTRAINT DF_colaboradores_creado DEFAULT (SYSDATETIME())
      );
    END
  `);
  tablaLista = true;
}

export async function listar({ soloActivos = false } = {}) {
  await asegurarTabla();
  const result = await query(
    `SELECT id, nombre, descripcion, imagen, orden, activo, creado_en
     FROM dbo.colaboradores
     WHERE (@soloActivos = 0 OR activo = 1)
     ORDER BY orden, id`,
    { soloActivos: { type: sql.Bit, value: soloActivos } },
  );
  return result.recordset;
}

export async function crear(datos) {
  const result = await query(
    `INSERT INTO dbo.colaboradores (nombre, descripcion, imagen, orden, activo)
     OUTPUT inserted.id, inserted.nombre, inserted.descripcion, inserted.imagen, inserted.orden, inserted.activo
     VALUES (@nombre, @descripcion, @imagen, @orden, @activo)`,
    {
      nombre: { type: sql.NVarChar(150), value: datos.nombre },
      descripcion: { type: sql.NVarChar(sql.MAX), value: datos.descripcion || null },
      imagen: { type: sql.NVarChar(255), value: datos.imagen || null },
      orden: { type: sql.Int, value: Number(datos.orden ?? 0) },
      activo: { type: sql.Bit, value: toBit(datos.activo) },
    },
  );
  return result.recordset[0];
}

export async function actualizar(id, datos) {
  const result = await query(
    `UPDATE dbo.colaboradores
     SET nombre = @nombre,
         descripcion = @descripcion,
         imagen = COALESCE(@imagen, imagen),
         orden = @orden,
         activo = @activo
     OUTPUT inserted.id, inserted.nombre, inserted.descripcion, inserted.imagen, inserted.orden, inserted.activo
     WHERE id = @id`,
    {
      id: { type: sql.Int, value: id },
      nombre: { type: sql.NVarChar(150), value: datos.nombre },
      descripcion: { type: sql.NVarChar(sql.MAX), value: datos.descripcion || null },
      imagen: { type: sql.NVarChar(255), value: datos.imagen || null },
      orden: { type: sql.Int, value: Number(datos.orden ?? 0) },
      activo: { type: sql.Bit, value: toBit(datos.activo) },
    },
  );
  return result.recordset[0] || null;
}

export async function eliminar(id) {
  const result = await query(`DELETE FROM dbo.colaboradores OUTPUT deleted.id WHERE id = @id`, {
    id: { type: sql.Int, value: id },
  });
  return result.recordset[0] || null;
}
