'use strict';

/**
 * NOTAS DE ARQUITECTURA PARA EL ALUMNO
 * Migración de ejemplo: tablas de infraestructura `rol` y `usuario` (recuerda que
 * NO cuentan entre las 5 entidades de negocio del Hito 2).
 *
 * Cada migración es un cambio de esquema versionado con su `up` (aplicar) y su
 * `down` (deshacer). El orden lo da el prefijo de fecha del nombre del archivo.
 *
 * TODO(alumno): crea tus propias migraciones para las tablas de negocio de
 * TU `docs/der.md`, con sus restricciones DECLARADAS (FK, UNIQUE, CHECK).
 *
 * Regla de integridad: `ON DELETE CASCADE` solo en detalles subordinados;
 * `RESTRICT` para catálogos e históricos (ver docs/der.md, apartado 6).
 */
exports.up = async (knex) => {
  await knex.schema.createTable('rol', (table) => {
    table.increments('id'); // INT UNSIGNED AUTO_INCREMENT, clave primaria
    table.string('nombre', 30).notNullable().unique();
  });

  await knex.schema.createTable('usuario', (table) => {
    table.increments('id');
    table
      .integer('rol_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('rol')
      .onDelete('RESTRICT'); // no se borra un rol con usuarios
    table.string('nombre', 100).notNullable();
    table.string('email', 150).notNullable().unique();
    table.string('password_hash', 255).notNullable(); // hash bcrypt, jamás texto plano
    table.boolean('activo').notNullable().defaultTo(true); // borrado lógico
    table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
  });
};

// El orden inverso al de `up`: primero la tabla que depende de la otra.
exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('usuario');
  await knex.schema.dropTableIfExists('rol');
};
