'use strict';

/**
 * Constructores de respuestas HTTP según docs/contrato_api_rest.md.
 *
 * NOTAS DE ARQUITECTURA PARA EL ALUMNO
 *  - Éxito:  { success: true, data, message }   (2xx)
 *  - Error:  RFC 9457 «Problem Details» + extensión `errors[]` (4xx y 5xx)
 * Centralizar el formato aquí garantiza que TODA la API responde igual; el
 * frontend puede confiar en una única forma de leer errores.
 */
const ERROR_BASE_URL = 'https://api.gestaller.example/errors';

const ok = (res, data, message = 'OK', status = 200) =>
  res.status(status).json({ success: true, data, message });

const created = (res, data, message = 'Created') => ok(res, data, message, 201);

const noContent = (res) => res.status(204).end();

/**
 * Error en formato RFC 9457.
 * @param {import('express').Request} req   Aporta `instance` (ruta que falló).
 * @param {import('express').Response} res
 * @param {number} status   Código HTTP.
 * @param {string} slug     Tipo de error (se concatena a ERROR_BASE_URL).
 * @param {string} title    Resumen corto y estable.
 * @param {string} detail   Explicación de esta ocurrencia.
 * @param {Array<{field: string, message: string}>} [errors] Errores por campo (422/400).
 */
const problem = (req, res, status, slug, title, detail, errors) =>
  res
    .status(status)
    .type('application/problem+json')
    .json({
      type: `${ERROR_BASE_URL}/${slug}`,
      title,
      status,
      detail,
      instance: req.originalUrl,
      timestamp: new Date().toISOString(),
      ...(errors && errors.length > 0 ? { errors } : {}),
    });

/** Atajo para el 422 de validación: el caso más frecuente en los controladores. */
const validationProblem = (req, res, errors) =>
  problem(
    req,
    res,
    422,
    'validation-failed',
    'Error de validación',
    'La petición contiene campos que incumplen las reglas de validación.',
    errors
  );

module.exports = { ok, created, noContent, problem, validationProblem };
