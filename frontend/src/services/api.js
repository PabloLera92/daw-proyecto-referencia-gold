/**
 * Capa de acceso a la API — ÚNICO sitio del frontend que conoce la URL base,
 * las cabeceras y el contrato { success, data, message, errors }.
 * Los componentes llaman a funciones como `login()` y nunca usan fetch directamente:
 * si cambia el backend, se toca este archivo y no cincuenta componentes.
 */
const API_URL = import.meta.env.VITE_API_URL;
const TOKEN_KEY = 'gestaller_token';

export const tokenStore = {
  get: () => sessionStorage.getItem(TOKEN_KEY),
  set: (token) => sessionStorage.setItem(TOKEN_KEY, token),
  clear: () => sessionStorage.removeItem(TOKEN_KEY),
};

async function request(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = tokenStore.get();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload = await response.json();

  if (!payload.success) {
    // Error uniforme para la UI: mensaje + errores por campo + status HTTP.
    const error = new Error(payload.message);
    error.status = response.status;
    error.errors = payload.errors;
    throw error;
  }
  return payload.data;
}

export const login = (email, password) =>
  request('/auth/login', { method: 'POST', body: { email, password } });

export const getProfile = () => request('/auth/me');
