'use strict';

const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const authRoutes = require('./routes/auth.routes');
const { notFound, errorHandler } = require('./middlewares/error.middleware');

/**
 * NOTAS DE ARQUITECTURA PARA EL ALUMNO
 * Composición de la aplicación Express. Está separada de `server.js` (que solo
 * abre el puerto) para poder importarla en las pruebas (supertest) sin levantar
 * un servidor real.
 *
 * El ORDEN de registro importa:
 *   1. Middlewares globales (cors, parseo de JSON)
 *   2. Rutas
 *   3. 404 para lo que no coincidió con ninguna ruta
 *   4. Manejador global de errores (siempre el último)
 */
const app = express();

// CORS restringido al origen del frontend (nunca `*` si hay credenciales).
app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());

// Endpoint público de salud: permite comprobar el despliegue.
app.get('/api/v1/health', (req, res) =>
  res.json({ success: true, data: { status: 'up' }, message: 'OK' })
);

app.use('/api/v1/auth', authRoutes);
// Siguientes recursos (uno por archivo de rutas):
//   app.use('/api/v1/citas', citasRoutes);
//   app.use('/api/v1/ordenes', ordenesRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
