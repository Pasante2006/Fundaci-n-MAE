import jwt from 'jsonwebtoken';

function leerToken(req) {
  const cookieName = process.env.COOKIE_NAME || 'mae_sesion';
  if (req.cookies?.[cookieName]) return req.cookies[cookieName];
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) return header.slice(7);
  return null;
}

export function opcionesCookie() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 8 * 60 * 60 * 1000,
    path: '/',
  };
}

export function requireAuth(req, res, next) {
  const token = leerToken(req);
  if (!token) {
    return res.status(401).json({ ok: false, mensaje: 'Sesión requerida' });
  }

  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ ok: false, mensaje: 'Sesión inválida o vencida' });
  }
}
