import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as Usuario from '../models/Usuario.js';
import { asyncHandler, httpError } from '../utils/asyncHandler.js';
import { opcionesCookie } from '../middlewares/auth.js';

function tokenPara(usuario) {
  return jwt.sign(
    { id: usuario.id, email: usuario.email, nombre: usuario.nombre },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || '8h' },
  );
}

export const login = asyncHandler(async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  if (!email || !password) {
    throw httpError(400, 'Email y contraseña son obligatorios');
  }

  const usuario = await Usuario.findByEmail(email);
  if (!usuario) throw httpError(401, 'Credenciales inválidas');

  const hash = String(usuario.password_hash).replace(/^\$2y\$/, '$2b$');
  const ok = await bcrypt.compare(password, hash);
  if (!ok) throw httpError(401, 'Credenciales inválidas');

  const token = tokenPara(usuario);
  res.cookie(process.env.COOKIE_NAME || 'mae_sesion', token, opcionesCookie());
  res.json({
    ok: true,
    usuario: { id: usuario.id, email: usuario.email, nombre: usuario.nombre },
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME || 'mae_sesion', { ...opcionesCookie(), maxAge: 0 });
  res.json({ ok: true });
});

export const me = asyncHandler(async (req, res) => {
  const usuario = await Usuario.findById(req.usuario.id);
  if (!usuario) throw httpError(401, 'Sesión inválida');
  res.json({ ok: true, usuario });
});
