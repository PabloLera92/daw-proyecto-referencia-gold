'use strict';

/**
 * NOTAS DE ARQUITECTURA PARA EL ALUMNO
 * Configuración de Knex (query builder + migraciones por código). Lee los datos
 * de conexión de `src/config/env.js`, nunca de valores escritos aquí.
 *
 * Por qué migraciones y no un volcado `.sql`:
 *  - El esquema queda VERSIONADO en Git, igual que el código.
 *  - Cualquiera (el tutor incluido) reconstruye la BD desde cero con un solo
 *    comando: `npm run db:reset`.
 *  - Los volcados `.sql` sueltos están prohibidos por la rúbrica del Hito 2
 *    (dimensión «Persistencia» = 0).
 *
 * Puedes usar otra herramienta admitida (Prisma, TypeORM, Sequelize, Drizzle,
 * Eloquent...). Lo que no es negociable: esquema y datos se crean por código.
 */
const env = require('./src/config/env');

module.exports = {
  client: 'mysql2',
  connection: {
    host: env.db.host,
    port: env.db.port,
    database: env.db.name,
    user: env.db.user,
    password: env.db.password,
  },
  pool: { min: 0, max: 10 },
  migrations: { directory: './database/migrations' },
  seeds: { directory: './database/seeders' },
};
