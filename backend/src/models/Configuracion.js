import { query, sql } from '../config/db.js';

export async function listar() {
  const result = await query(
    `SELECT id, clave, valor, etiqueta FROM dbo.configuracion ORDER BY id`,
  );
  return result.recordset;
}

export async function mapa() {
  const filas = await listar();
  return Object.fromEntries(filas.map((item) => [item.clave, item.valor]));
}

export async function upsert({ clave, valor, etiqueta }) {
  const result = await query(
    `MERGE dbo.configuracion AS destino
     USING (SELECT @clave AS clave) AS origen
     ON destino.clave = origen.clave
     WHEN MATCHED THEN
       UPDATE SET valor = @valor, etiqueta = COALESCE(@etiqueta, destino.etiqueta)
     WHEN NOT MATCHED THEN
       INSERT (clave, valor, etiqueta) VALUES (@clave, @valor, COALESCE(@etiqueta, @clave))
     OUTPUT inserted.id, inserted.clave, inserted.valor, inserted.etiqueta;`,
    {
      clave: { type: sql.NVarChar(80), value: clave },
      valor: { type: sql.NVarChar(sql.MAX), value: valor },
      etiqueta: { type: sql.NVarChar(120), value: etiqueta || null },
    },
  );
  return result.recordset[0];
}
