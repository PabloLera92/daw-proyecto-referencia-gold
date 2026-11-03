'use strict';

const authService = require('../services/auth.service');
const { ok, created, problem, validationProblem } = require('../utils/response');

/**
 * ============================================================================
 * CAPA 2 · CONTROLADORES                      (backend/src/controllers/)
 * ============================================================================
 * RESPONSABILIDAD ÚNICA: traducir HTTP <-> negocio. Cada handler hace tres cosas:
 *   1. Extrae y VALIDA la entrada HTTP (req.body, req.params, req.query).
 *   2. Llama al SERVICIO correspondiente.
 *   3. Devuelve la respuesta JSON con el código de estado adecuado.
 *
 * Qué NO hace:
 *   - ✗ Escribir SQL ni hablar con la base de datos (eso es del modelo).
 *   - ✗ Hashear contraseñas, firmar tokens o aplicar reglas de negocio (servicio).
 *   - ✗ Decidir qué ruta lo llama ni quién tiene permiso (rutas y middlewares).
 *
 * Señal de alarma: un handler de más de ~30 líneas, o un controlador de
 * cientos de líneas con SQL dentro. Si pasa, la lógica está en el sitio equivocado.
 *
 * Los errores inesperados NO se tratan aquí: se delegan con `next(err)` al
 * middleware global de errores, que responde 4xx/5xx en formato RFC 9457.
 */

async function register(req, res, next) {
  try {
    const { nombre, email, password } = req.body;

    // 1. Validación de entrada en servidor (el frontend NO es una barrera de seguridad).
    //    Datos con forma correcta pero inválidos para el negocio -> 422 con errors[].
    const errors = [];
    if (!nombre) errors.push({ field: 'nombre', message: 'El nombre es obligatorio' });
    if (!email) errors.push({ field: 'email', message: 'El email es obligatorio' });
    if (!password || password.length < 8) {
      errors.push({ field: 'password', message: 'La contraseña debe tener al menos 8 caracteres' });
    }
    if (errors.length > 0) return validationProblem(req, res, errors);

    // 2. Delegar en el servicio. Si el email ya existe, el servicio lanza un
    //    HttpError 409 y lo gestiona el middleware de errores.
    const user = await authService.register({ nombre, email, password });

    // 3. 201 Created: se ha creado un recurso.
    return created(res, user, 'Usuario registrado correctamente');
  } catch (err) {
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const errors = [];
    if (!email) errors.push({ field: 'email', message: 'El email es obligatorio' });
    if (!password) errors.push({ field: 'password', message: 'La contraseña es obligatoria' });
    if (errors.length > 0) return validationProblem(req, res, errors);

    const session = await authService.login({ email, password });

    // 401: credenciales erróneas. Mismo mensaje para «no existe» y «contraseña
    // incorrecta»: no se revela qué cuentas existen (enumeración de usuarios).
    if (!session) {
      return problem(req, res, 401, 'invalid-credentials', 'Credenciales inválidas',
        'El email o la contraseña no son correctos.');
    }

    return ok(res, session, 'Login correcto');
  } catch (err) {
    return next(err);
  }
}

async function me(req, res, next) {
  try {
    // `req.user` lo dejó authGuard: el controlador no sabe cómo se verificó el token.
    const user = await authService.getProfile(req.user.id);
    if (!user) {
      return problem(req, res, 404, 'user-not-found', 'Usuario no encontrado',
        'El usuario asociado al token ya no existe.');
    }
    return ok(res, user);
  } catch (err) {
    return next(err);
  }
}

module.exports = { register, login, me };
