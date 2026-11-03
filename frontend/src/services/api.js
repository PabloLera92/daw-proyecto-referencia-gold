/**
 * ============================================================================
 * CAPA DE ACCESO A LA API                          (frontend/src/services/)
 * ============================================================================
 * NOTAS DE ARQUITECTURA PARA EL ALUMNO
 * Es el ÚNICO archivo del frontend que conoce la URL base, las cabeceras, el
 * token y el formato de errores del contrato (docs/contrato_api_rest.md).
 * Los componentes llaman a funciones como `login()` y NUNCA usan `fetch`
 * directamente: si cambia el backend, se toca este archivo y no cincuenta
 * componentes. (Puedes sustituir `fetch` por Axios y sus interceptores: la
 * idea es la misma.)
 *
 * Responsabilidades que centraliza (Hito 3):
 *   - URL base desde variable de entorno (cero `localhost` escrito en el código).
 *   - Inyección de `Authorization: Bearer <token>` en cada petición.
 *   - Interceptor 401: sesión caducada -> limpia la sesión y redirige a /login.
 *   - Traducción de errores RFC 9457 a un `ApiError` que la UI puede pintar
 *     (mensaje global y errores por campo), sin `[object Object]` ni `alert()`.
 *   - Timeout y mensaje comprensible ante caída de red.
 *
 * Sobre el almacenamiento del token: aquí usamos sessionStorage por sencillez.
 * localStorage es accesible desde JavaScript y por tanto vulnerable a XSS; la
 * alternativa más segura es una cookie HttpOnly. Documenta tu decisión.
 */
const API_URL = import.meta.env.VITE_API_URL;
const TIMEOUT_MS = 10000;
const SESSION_KEY = 'gestaller_session';

/** Sesión del usuario (token + datos públicos). El rol aquí es SOLO para la UX. */
export const session = {
  get() {
    try {
      return JSON.parse(sessionStorage.getItem(SESSION_KEY));
    } catch {
      return null;
    }
  },
  save(data) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ token: data.token, user: data.user }));
  },
  clear() {
    sessionStorage.removeItem(SESSION_KEY);
  },
};

/** Error de la API listo para la interfaz. */
export class ApiError extends Error {
  /**
   * @param {number} status       Código HTTP (0 = sin respuesta del servidor).
   * @param {string} message      Texto comprensible para el usuario.
   * @param {Record<string, string>} fieldErrors  Mensajes por campo (422).
   */
  constructor(status, message, fieldErrors = {}) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

async function request(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const current = session.get();
  if (current?.token) headers.Authorization = `Bearer ${current.token}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch {
    // Red caída, CORS bloqueado o timeout: no hay respuesta que interpretar.
    throw new ApiError(0, 'No se pudo conectar con el servidor. Verifique su conexión.');
  } finally {
    clearTimeout(timer);
  }

  if (response.status === 204) return null;

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    // Interceptor 401: si TENÍAMOS token, la sesión ha caducado. (Un 401 en el
    // login, sin token previo, es simplemente «credenciales incorrectas».)
    if (response.status === 401 && current?.token) {
      session.clear();
      window.location.href = '/login?expired=true';
    }
    // Cuerpo RFC 9457: `detail` es el mensaje; `errors[]` trae los errores por campo.
    const fieldErrors = Object.fromEntries((payload?.errors ?? []).map((e) => [e.field, e.message]));
    const message = payload?.detail ?? 'Ocurrió un error inesperado. Inténtalo de nuevo.';
    throw new ApiError(response.status, message, fieldErrors);
  }

  return payload.data;
}

export const login = (email, password) =>
  request('/auth/login', { method: 'POST', body: { email, password } });

export const getProfile = () => request('/auth/me');
