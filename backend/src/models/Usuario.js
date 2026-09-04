import { query, sql } from '../config/db.js';

export async function findByEmail(email) {
  const result = await query(
    `SELECT id, email, nombre, password_hash, activo
     FROM dbo.usuarios
     WHERE email = @email AND activo = 1`,
    { email: { type: sql.NVarChar(191), value: email } },
  );
  return result.recordset[0] || null;
}

export async function findById(id) {
  const result = await query(
    `SELECT id, email, nombre, activo, creado_en
     FROM dbo.usuarios
     WHERE id = @id AND activo = 1`,
    { id: { type: sql.Int, value: id } },
  );
  return result.recordset[0] || null;
}
