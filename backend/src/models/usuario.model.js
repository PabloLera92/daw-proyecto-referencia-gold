'use strict';

// const db = require('../config/db'); // instancia de Knex: solo los modelos la importan

/**
 * ============================================================================
 * CAPA 4 · MODELOS                                  (backend/src/models/)
 * ============================================================================
 * RESPONSABILIDAD ÚNICA: interactuar con la base de datos, y SOLO eso. Es el
 * único sitio donde viven las consultas (a través del ORM o query builder).
 *
 * Qué NO hace:
 *   - ✗ Reglas de negocio ni decisiones («¿puede este usuario hacerlo?»).
 *   - ✗ Conocer HTTP: ni `req`, ni `res`, ni códigos de estado.
 *   - ✗ Concatenar texto para construir SQL. NUNCA:
 *         db.raw(`SELECT * FROM usuario WHERE email = '${email}'`)   // ✗ inyección SQL
 *     Siempre consultas parametrizadas o el query builder:
 *         db('usuario').where({ email })                             // ✓
 *
 * Los resultados se devuelven tal cual; quitar campos sensibles
 * (`password_hash`) antes de responder es responsabilidad del servicio.
 *
 * ESQUELETO: firmas y un ejemplo comentado. El esquema real sale de
 * docs/der.md y se crea con migraciones (database/migrations), nunca a mano.
 */

/**
 * @param {string} email
 * @returns {Promise<{id: number, nombre: string, email: string, password_hash: string, rol: string}|null>}
 */
async function findByEmail(email) {
  // Ejemplo con query builder (consulta parametrizada):
  //   return db('usuario')
  //     .join('rol', 'rol.id', 'usuario.rol_id')
  //     .where({ 'usuario.email': email, 'usuario.activo': true })
  //     .first('usuario.id', 'usuario.nombre', 'usuario.email', 'usuario.password_hash', 'rol.nombre as rol')
  //     || null;
  throw new Error('TODO(alumno): usuarioModel.findByEmail not implemented');
}

async function findById(id) {
  throw new Error('TODO(alumno): usuarioModel.findById not implemented');
}

async function create({ nombre, email, passwordHash }) {
  throw new Error('TODO(alumno): usuarioModel.create not implemented');
}

module.exports = { findByEmail, findById, create };
