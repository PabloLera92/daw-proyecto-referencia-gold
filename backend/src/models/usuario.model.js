'use strict';

/**
 * CAPA 4 — MODELO (acceso a datos)
 * Responsabilidad ÚNICA: hablar con la base de datos. Aquí —y solo aquí— vive el SQL.
 * Siempre con consultas parametrizadas (`?`): jamás concatenar entrada del usuario.
 *
 * ESQUELETO: se muestran firmas y una consulta de ejemplo. El pool de conexiones
 * (mysql2/promise) se inicializaría en src/config/db.js.
 */

// const pool = require('../config/db');

async function findByEmail(email) {
  // const [rows] = await pool.query(
  //   `SELECT u.id, u.nombre, u.email, u.password_hash, r.nombre AS rol
  //      FROM usuario u JOIN rol r ON r.id = u.rol_id
  //     WHERE u.email = ? AND u.activo = TRUE`,
  //   [email]
  // );
  // return rows[0] || null;
  throw new Error('Not implemented: usuarioModel.findByEmail');
}

async function findById(id) {
  throw new Error('Not implemented: usuarioModel.findById');
}

async function create({ nombre, email, passwordHash }) {
  throw new Error('Not implemented: usuarioModel.create');
}

module.exports = { findByEmail, findById, create };
