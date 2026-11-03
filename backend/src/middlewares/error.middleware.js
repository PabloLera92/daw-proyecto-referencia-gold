'use strict';

const HttpError = require('../utils/http-error');
const { problem } = require('../utils/response');

/**
 * MIDDLEWARES DE ERROR: la red de seguridad de toda la API.
 *
 * NOTAS DE ARQUITECTURA PARA EL ALUMNO
 *  - Los controladores y servicios no formatean errores inesperados: los lanzan
 *    o los pasan con `next(err)` y llegan aquí. Un único sitio garantiza que
 *    TODA respuesta 4xx/5xx tiene el mismo formato RFC 9457.
 *  - REGLA ELIMINATORIA: un 500 NUNCA expone `err.stack`, SQL ni rutas al
 *    cliente. El detalle va al log del servidor; al cliente, un mensaje genérico.
 *  - Los errores de entrada del usuario (400, 409, 422) NO son 500: si lo son,
 *    hay un bug de validación en tu código.
 */

/** 404 para rutas inexistentes. Se registra DESPUÉS de todas las rutas. */
function notFound(req, res) {
  return problem(req, res, 404, 'route-not-found', 'Recurso no encontrado',
    `No existe la ruta ${req.method} ${req.originalUrl}.`);
}

/** Manejador global. Debe registrarse el ÚLTIMO y llevar 4 parámetros. */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // JSON malformado en el cuerpo: error de sintaxis del cliente -> 400.
  if (err.type === 'entity.parse.failed') {
    return problem(req, res, 400, 'malformed-json', 'JSON malformado',
      'El cuerpo de la petición no es un JSON válido.');
  }

  // Error de negocio lanzado por un servicio (409, 404, 403...).
  if (err instanceof HttpError) {
    return problem(req, res, err.status, err.slug, err.title, err.message, err.errors);
  }

  // Cualquier otra cosa es un fallo inesperado: se registra TODO y se responde genérico.
  console.error(err); // en producción: logger estructurado (winston/pino) sin secretos
  return problem(req, res, 500, 'internal-error', 'Error interno del servidor',
    'Ocurrió una anomalía inesperada. Contacte con soporte técnico.');
}

module.exports = { notFound, errorHandler };
