'use strict';

/**
 * NOTAS DE ARQUITECTURA PARA EL ALUMNO
 * Seeder de ejemplo, IDEMPOTENTE: se puede ejecutar N veces sin duplicar datos
 * (`onConflict().ignore()` descarta las filas que ya existen por su clave UNIQUE).
 * Un seeder que falla o duplica al ejecutarse dos veces es un seeder frágil.
 *
 * TODO(alumno): crea los seeders de TU proyecto (ver requisitos en README.md).
 */
exports.seed = async (knex) => {
  await knex('rol')
    .insert([{ nombre: 'ADMIN' }, { nombre: 'MECANICO' }, { nombre: 'CLIENTE' }])
    .onConflict('nombre')
    .ignore();
};
