'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const usuarioModel = require('../models/usuario.model');
// const HttpError = require('../utils/http-error'); // se usará para el 409 de email duplicado

/**
 * ============================================================================
 * CAPA 3 · SERVICIOS                              (backend/src/services/)
 * ============================================================================
 * RESPONSABILIDAD ÚNICA: la lógica de negocio pura y la orquestación. Aquí
 * viven las REGLAS («un cliente no puede reservar una franja ocupada»,
 * «el precio se congela al crear la línea»), el hash de contraseñas, la firma
 * de tokens y las transacciones que combinan varios modelos.
 *
 * Qué NO hace:
 *   - ✗ Conocer Express: nada de `req`, `res` ni códigos HTTP directamente.
 *     Para comunicar un fallo de negocio, lanza un `HttpError` (utils/).
 *   - ✗ Escribir SQL: accede a los datos SOLO a través de los modelos.
 *
 * Ventaja de esta separación: el servicio se puede probar sin levantar un
 * servidor y reutilizar desde otro canal (otra API, un script, un job).
 *
 * También es el sitio de la TITULARIDAD de recursos (anti-BOLA/IDOR): para
 * `GET /ordenes/:id` el servicio comprueba que `orden.cliente_id === userId`;
 * un middleware no puede hacerlo porque no sabe de quién es la orden 58.
 *
 * ESQUELETO: la estructura y las firmas son la referencia. Las reglas completas
 * (email duplicado, usuario inactivo, rol por defecto...) las implementas tú en
 * tu proyecto: aquí están marcadas con TODO(alumno).
 */

/**
 * @param {{nombre: string, email: string, password: string}} data
 * @returns {Promise<object>} Usuario creado, SIN `password_hash`.
 */
async function register({ nombre, email, password }) {
  // TODO(alumno): si el email ya existe -> throw new HttpError(409, 'email-taken', ...).
  // Hash con coste adaptativo. Prohibido MD5, SHA-1 o SHA-256 sin sal y sin coste.
  const passwordHash = await bcrypt.hash(password, env.bcryptSaltRounds);
  // TODO(alumno): asignar el rol por defecto (CLIENTE) y persistir con el modelo.
  return usuarioModel.create({ nombre, email, passwordHash });
}

/**
 * @param {{email: string, password: string}} credentials
 * @returns {Promise<object|null>} Sesión con JWT, o `null` si las credenciales no son válidas.
 */
async function login({ email, password }) {
  const user = await usuarioModel.findByEmail(email);
  // Mismo resultado para «no existe» y «contraseña errónea» (no revelar cuentas).
  if (!user) return null;

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return null;

  // El token solo lleva lo imprescindible (id y rol). Nunca datos sensibles:
  // un JWT está firmado, NO cifrado, y cualquiera puede leer su contenido.
  const token = jwt.sign({ sub: user.id, rol: user.rol }, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn, // máximo 2 h en el Hito 2
  });

  return {
    token,
    tokenType: 'Bearer',
    expiresIn: env.jwt.expiresIn,
    user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol },
  };
}

/**
 * @param {number} userId
 * @returns {Promise<object|null>} Perfil SIN `password_hash`.
 */
async function getProfile(userId) {
  // TODO(alumno): devolver el perfil sin password_hash (lista blanca de campos).
  return usuarioModel.findById(userId);
}

module.exports = { register, login, getProfile };
