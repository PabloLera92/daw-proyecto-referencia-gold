'use strict';

const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { fail } = require('../utils/response');

/**
 * MIDDLEWARE — preocupaciones transversales (autenticación y autorización).
 * Se declaran una vez y se enchufan en las rutas; los controladores no repiten
 * esta lógica ni saben cómo se verifica un token.
 */

/** AUTENTICACIÓN (401): ¿quién eres? Deja `req.user` si el token es válido. */
function verifyJwt(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return fail(res, 401, 'Token no proporcionado');
  }

  try {
    const payload = jwt.verify(token, env.jwt.secret);
    req.user = { id: payload.sub, rol: payload.rol };
    return next();
  } catch (err) {
    // Caducado o manipulado: mismo 401, sin detallar el motivo al cliente.
    return fail(res, 401, 'Token inválido o caducado');
  }
}

/** AUTORIZACIÓN (403): ¿puedes hacerlo? Uso: router.get('/x', verifyJwt, requireRole('ADMIN'), ...) */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.rol)) {
      return fail(res, 403, 'No tienes permisos para esta acción');
    }
    return next();
  };
}

module.exports = { verifyJwt, requireRole };
