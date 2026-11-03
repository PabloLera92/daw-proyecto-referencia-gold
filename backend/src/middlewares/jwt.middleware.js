'use strict';

const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { problem } = require('../utils/response');

/**
 * ============================================================================
 * MIDDLEWARES                                    (backend/src/middlewares/)
 * ============================================================================
 * RESPONSABILIDAD ÚNICA: interceptar la petición ANTES de que llegue al
 * controlador para aplicar una preocupación transversal: validar tokens,
 * comprobar roles, sanear/validar datos, limitar peticiones (rate limit)...
 *
 * Un middleware recibe `(req, res, next)`:
 *   - si todo es correcto, llama a `next()` y la petición continúa;
 *   - si no, responde él mismo (401, 403, 422...) y la cadena se corta.
 *
 * Por qué existen: la seguridad se declara UNA vez en las rutas y no se repite
 * (ni se olvida) en cada controlador.
 *
 * Qué NO hacen: lógica de negocio ni acceso a datos del dominio. Y recuerda:
 * comprobar la TITULARIDAD de un recurso (¿esta orden es tuya?) no es tarea de
 * un middleware sino del servicio, que es quien consulta el recurso.
 */

/**
 * AUTENTICACIÓN (401): ¿quién eres?
 * Verifica firma y caducidad del token y deja la identidad en `req.user`.
 */
function authGuard(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return problem(req, res, 401, 'missing-token', 'No autenticado',
      'Falta la cabecera Authorization: Bearer <token>.');
  }

  try {
    const payload = jwt.verify(token, env.jwt.secret);
    req.user = { id: payload.sub, rol: payload.rol };
    return next();
  } catch (err) {
    // Caducado o manipulado: mismo 401, sin detallar el motivo al cliente.
    return problem(req, res, 401, 'invalid-token', 'Token inválido o caducado',
      'El token no es válido o ha caducado. Inicia sesión de nuevo.');
  }
}

/**
 * AUTORIZACIÓN (403): ¿puede tu rol hacer esto?
 * Va SIEMPRE después de authGuard (sin identidad no hay rol que evaluar).
 *
 * @param {string[]} allowedRoles Roles permitidos, p. ej. ['ADMIN', 'MECANICO'].
 * @example router.get('/', authGuard, roleGuard(['ADMIN']), ordenesController.listAll);
 */
function roleGuard(allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.rol)) {
      return problem(req, res, 403, 'forbidden', 'Acceso denegado',
        'Tu rol no tiene permisos para esta acción.');
    }
    return next();
  };
}

module.exports = { authGuard, roleGuard };
