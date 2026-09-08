import 'dotenv/config';
import bcrypt from 'bcrypt';
import { connectDb, query, sql } from '../src/config/db.js';

const email = String(process.argv[2] || '').trim().toLowerCase();
const password = String(process.argv[3] || '');

if (!email || !password) {
  console.error('Uso: node scripts/reset-password.mjs <email> <nueva-contraseña>');
  process.exit(1);
}

await connectDb();
const hash = await bcrypt.hash(password, 12);
const result = await query(
  `UPDATE dbo.usuarios SET password_hash = @hash WHERE email = @email;
   SELECT @@ROWCOUNT AS filas;`,
  {
    email: { type: sql.NVarChar(191), value: email },
    hash: { type: sql.NVarChar(255), value: hash },
  },
);

const filas = result.recordset[0]?.filas ?? 0;
if (!filas) {
  console.error('No se encontró el usuario:', email);
  process.exit(1);
}

console.log('Contraseña actualizada para', email);
