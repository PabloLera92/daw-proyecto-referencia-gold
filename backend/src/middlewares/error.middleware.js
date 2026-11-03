'use strict';

const env = require('../config/env');
const { fail } = require('../utils/response');

/** 404 para rutas inexistentes. */
function notFound(req, res) {
  return fail(res, 404, `Ruta no encontrada: ${req.method} ${req.originalUrl}`);
}

/**
 * Manejador global de errores. Los servicios lanzan errores con `err.status`
 * (p. ej. 409); cualquier otro es un 500 genérico. El detalle va al log,
 * nunca al cliente (ni stack ni SQL).
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err.type === 'entity.parse.failed') {
    return fail(res, 400, 'JSON malformado');
  }
  const status = err.status || 500;
  if (status >= 500) {
    console.error(err); // en producción: logger estructurado, sin secretos
  }
  const message = status >= 500 && env.nodeEnv === 'production' ? 'Error interno del servidor' : err.message;
  return fail(res, status, message);
}

module.exports = { notFound, errorHandler };
