'use strict';

/**
 * Error de dominio con significado HTTP.
 *
 * NOTAS DE ARQUITECTURA PARA EL ALUMNO
 * El SERVICIO decide qué ha ido mal («este email ya existe») pero no conoce
 * Express: lanza un HttpError y el middleware global de errores lo traduce a
 * una respuesta RFC 9457. Así la regla de negocio no depende de `res`.
 *
 * Uso en un servicio:
 *   throw new HttpError(409, 'email-taken', 'Email ya registrado', 'Ya existe una cuenta con ese email.');
 */
class HttpError extends Error {
  /**
   * @param {number} status  Código HTTP (409, 404, 403...).
   * @param {string} slug    Identificador del tipo de error (sufijo del campo `type`).
   * @param {string} title   Resumen corto y estable.
   * @param {string} detail  Explicación de esta ocurrencia.
   * @param {Array<{field: string, message: string}>} [errors] Errores por campo.
   */
  constructor(status, slug, title, detail, errors) {
    super(detail);
    this.status = status;
    this.slug = slug;
    this.title = title;
    this.errors = errors;
  }
}

module.exports = HttpError;
