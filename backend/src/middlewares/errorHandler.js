export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    next(err);
    return;
  }

  const status = err.status || 500;
  const mensaje =
    status >= 500 && process.env.NODE_ENV === 'production'
      ? 'Ocurrió un error interno.'
      : err.message || 'Error inesperado';

  if (status >= 500) console.error(err);

  res.status(status).json({ ok: false, mensaje });
}

export function notFound(req, res) {
  res.status(404).json({ ok: false, mensaje: 'Recurso no encontrado' });
}
