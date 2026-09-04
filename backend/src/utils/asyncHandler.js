export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export function toBit(valor) {
  return valor === false || valor === 0 || valor === '0' || valor === 'false' ? 0 : 1;
}

export function httpError(status, mensaje) {
  const error = new Error(mensaje);
  error.status = status;
  return error;
}
