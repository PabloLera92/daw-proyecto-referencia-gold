import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, tokenStore } from '../services/api.js';

// Página = pantalla completa que orquesta componentes y servicios.
export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    try {
      const session = await login(form.email, form.password);
      tokenStore.set(session.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>GesTaller</h1>
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      {error && <p role="alert">{error}</p>}
      <button type="submit">Entrar</button>
    </form>
  );
}
