'use strict';

const authService = require('../services/auth.service');
const { ok, created, fail } = require('../utils/response');

/**
 * CAPA 2 — CONTROLADOR
 * Responsabilidad ÚNICA: traducir HTTP <-> negocio.
 *   1. Extrae datos de req (body, params, user).
 *   2. Llama al SERVICIO.
 *   3. Traduce el resultado (o el error) a código HTTP + envoltura estándar.
 *
 * Un controlador NUNCA: escribe SQL, hashea contraseñas, firma tokens
 * ni contiene reglas de negocio. Si crece de ~30 líneas por handler,
 * la lógica está en el sitio equivocado.
 */

async function register(req, res, next) {
  try {
    const { nombre, email, password } = req.body;

    // Validación de entrada en servidor (formato del contrato: 422 + errors[]).
    const errors = [];
    if (!nombre) errors.push({ field: 'nombre', message: 'El nombre es obligatorio' });
    if (!email) errors.push({ field: 'email', message: 'El email es obligatorio' });
    if (!password || password.length < 8) {
      errors.push({ field: 'password', message: 'La contraseña debe tener al menos 8 caracteres' });
    }
    if (errors.length > 0) return fail(res, 422, 'Error de validación', errors);

    const user = await authService.register({ nombre, email, password });
    return created(res, user, 'Usuario registrado correctamente');
  } catch (err) {
    return next(err); // el middleware de errores decide 409/500, no el controlador
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return fail(res, 422, 'Error de validación', [
        ...(!email ? [{ field: 'email', message: 'El email es obligatorio' }] : []),
        ...(!password ? [{ field: 'password', message: 'La contraseña es obligatoria' }] : []),
      ]);
    }

    const session = await authService.login({ email, password });
    if (!session) return fail(res, 401, 'Credenciales inválidas');

    return ok(res, session, 'Login correcto');
  } catch (err) {
    return next(err);
  }
}

async function me(req, res, next) {
  try {
    // req.user lo ha dejado verifyJwt: el controlador no sabe cómo se verificó el token.
    const user = await authService.getProfile(req.user.id);
    if (!user) return fail(res, 404, 'Usuario no encontrado');
    return ok(res, user);
  } catch (err) {
    return next(err);
  }
}

module.exports = { register, login, me };
