'use strict';

/**
 * Instancia única de acceso a la base de datos (pool de conexiones de Knex).
 * La importan SOLO los modelos: ninguna otra capa habla con la BD.
 */
const knex = require('knex');
const knexfile = require('../../knexfile');

module.exports = knex(knexfile);
