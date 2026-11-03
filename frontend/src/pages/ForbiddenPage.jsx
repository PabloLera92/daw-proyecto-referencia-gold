import { Link } from 'react-router-dom';

// Destino del guard cuando el usuario está autenticado pero su rol no permite la ruta (403).
export default function ForbiddenPage() {
  return (
    <main>
      <h1>Acceso denegado</h1>
      <p>Tu cuenta no tiene permisos para ver esta página.</p>
      <Link to="/">Volver al inicio</Link>
    </main>
  );
}
