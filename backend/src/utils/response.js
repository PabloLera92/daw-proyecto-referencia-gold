'use strict';

/**
 * Envoltura estándar del contrato (docs/contrato_api_rest.md):
 * { success, data, message, errors } — los cuatro campos SIEMPRE presentes.
 */
const ok = (res, data, message = 'OK', status = 200) =>
  res.status(status).json({ success: true, data, message, errors: [] });

const created = (res, data, message = 'Created') => ok(res, data, message, 201);

const fail = (res, status, message, errors = []) =>
  res.status(status).json({ success: false, data: null, message, errors });

module.exports = { ok, created, fail };
