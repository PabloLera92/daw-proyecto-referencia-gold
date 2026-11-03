'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const usuarioModel = require('../models/usuario.model');

/**
 * CAPA 3 — SERVICIO
 * Responsabilidad ÚNICA: reglas de negocio. No conoce Express (ni req ni res),
 * por lo que se puede probar sin levantar servidor y reutilizar desde otro canal.
 * Accede a datos SOLO a través de los modelos.
 *
 * ESQUELETO: la estructura y la firma son la referencia. Las reglas completas
 * (email duplicado, usuario inactivo, rol por defecto...) las implementa cada alumno.
 */

async function register({ nombre, email, password }) {
  // TODO(alumno): comprobar email duplicado -> lanzar error con status 409.
  const passwordHash = await bcrypt.hash(password, env.bcryptSaltRounds);
  // TODO(alumno): rol por defecto CLIENTE; persistir con usuarioModel.create(...)
  return usuarioModel.create({ nombre, email, passwordHash });
}

async function login({ email, password }) {
  const user = await usuarioModel.findByEmail(email);
  // Mismo resultado para "no existe" y "contraseña errónea": no revelar qué cuentas existen.
  if (!user) return null;

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return null;

  const token = jwt.sign({ sub: user.id, rol: user.rol }, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  });

  return {
    token,
    tokenType: 'Bearer',
    expiresIn: env.jwt.expiresIn,
    user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol },
  };
}

async function getProfile(userId) {
  // TODO(alumno): devolver el perfil SIN password_hash.
  return usuarioModel.findById(userId);
}

module.exports = { register, login, getProfile };
