'use strict';

const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const authRoutes = require('./routes/auth.routes');
const { notFound, errorHandler } = require('./middlewares/error.middleware');

/**
 * Composición de la aplicación. Separada de server.js para poder importarla
 * en tests (supertest) sin abrir un puerto.
 */
const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());

app.get('/api/v1/health', (req, res) =>
  res.json({ success: true, data: { status: 'up' }, message: 'OK', errors: [] })
);
app.use('/api/v1/auth', authRoutes);
// Siguientes recursos: app.use('/api/v1/citas', citasRoutes); ...

app.use(notFound);
app.use(errorHandler);

module.exports = app;
