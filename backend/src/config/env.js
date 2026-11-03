'use strict';

/**
 * NOTAS DE ARQUITECTURA PARA EL ALUMNO
 * Configuración centralizada (12-Factor, factor III: Config).
 *
 *  - Es el ÚNICO archivo que lee `process.env`; el resto del código importa
 *    el objeto `env`. Así sabes en un solo sitio qué variables necesita la app.
 *  - Falla al ARRANCAR si falta una variable crítica («fail fast»): es mejor un
 *    error claro al inicio que un fallo oscuro a mitad de una petición.
 *  - Todo lo que se valida aquí debe estar documentado en `.env.example`.
 *  - Nunca imprimas `env.jwt.secret` ni `env.db.password` en logs.
 */
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const required = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'JWT_SECRET'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  throw new Error(`Missing environment variables: ${missing.join(', ')}. Copy .env.example to .env`);
}

if (process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters long (openssl rand -base64 32)');
}

// Copiar .env.example sin tocarlo dejaría un secreto público y conocido.
// En producción, eso permitiría a cualquiera forjar tokens de administrador.
if (process.env.NODE_ENV === 'production' && process.env.JWT_SECRET.startsWith('replace_with')) {
  throw new Error('JWT_SECRET still has the .env.example placeholder value');
}

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3000,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 12,
};
