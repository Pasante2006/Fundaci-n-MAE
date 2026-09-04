import sql from 'mssql';

let pool = null;
let estado = { conectado: false, ultimoError: null };

export { sql };

export function getDbStatus() {
  return { ...estado };
}

export async function connectDb() {
  const config = {
    server: process.env.DB_SERVER || 'localhost',
    port: Number(process.env.DB_PORT || 1433),
    database: process.env.DB_DATABASE || 'Fundacion MAE',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '',
    options: {
      encrypt: process.env.DB_ENCRYPT === 'true',
      trustServerCertificate: process.env.DB_TRUST_CERT !== 'false',
      enableArithAbort: true,
    },
    pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },
  };

  try {
    pool = await sql.connect(config);
    estado = { conectado: true, ultimoError: null };
    pool.on('error', (error) => {
      estado = { conectado: false, ultimoError: error.message };
      console.error('Error de pool SQL:', error.message);
    });
    return pool;
  } catch (error) {
    estado = { conectado: false, ultimoError: error.message };
    pool = null;
    throw error;
  }
}

export async function getPool() {
  if (pool?.connected) return pool;
  return connectDb();
}

/** Consultas parametrizadas: ningún valor de usuario se concatena al SQL. */
export async function query(texto, parametros = {}) {
  const conexion = await getPool();
  const request = conexion.request();

  for (const [nombre, definicion] of Object.entries(parametros)) {
    if (definicion && typeof definicion === 'object' && 'type' in definicion) {
      request.input(nombre, definicion.type, definicion.value);
    } else {
      request.input(nombre, definicion);
    }
  }

  return request.query(texto);
}
