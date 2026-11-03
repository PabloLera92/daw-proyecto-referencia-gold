import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { login, session, ApiError } from '../services/api.js';

/**
 * Página = pantalla completa que orquesta componentes y servicios.
 *
 * NOTAS DE ARQUITECTURA PARA EL ALUMNO
 * Muestra el patrón de los TRES ESTADOS asíncronos que exige el Hito 3:
 *   - LOADING: el botón se deshabilita (evita dobles envíos) y cambia su texto.
 *   - SUCCESS: se guarda la sesión y se redirige.
 *   - ERROR:   mensaje global (401, red, 500) y errores 422 bajo cada campo.
 * Nunca `alert('Error')` ni mostrar el objeto de error en crudo.
 * Accesibilidad: cada campo lleva su <label> y los errores se anuncian con role="alert".
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [form, setForm] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // ApiError | null

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const data = await login(form.email, form.password);
      session.save(data);
      navigate('/');
    } catch (err) {
      setError(err instanceof ApiError ? err : new ApiError(0, 'Ocurrió un error inesperado.'));
    } finally {
      setIsLoading(false); // el botón vuelve a estar disponible, haya éxito o error
    }
  }

  const fieldError = (name) => error?.fieldErrors?.[name];

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h1>GesTaller</h1>

      {params.get('expired') && <p role="status">Tu sesión ha caducado. Inicia sesión de nuevo.</p>}
      {error && Object.keys(error.fieldErrors).length === 0 && <p role="alert">{error.message}</p>}

      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        autoComplete="username"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        aria-invalid={Boolean(fieldError('email'))}
      />
      {fieldError('email') && <p role="alert">{fieldError('email')}</p>}

      <label htmlFor="password">Contraseña</label>
      <input
        id="password"
        type="password"
        autoComplete="current-password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        aria-invalid={Boolean(fieldError('password'))}
      />
      {fieldError('password') && <p role="alert">{fieldError('password')}</p>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  );
}
