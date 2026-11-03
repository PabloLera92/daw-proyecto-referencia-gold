import { Navigate } from 'react-router-dom';
import { session } from '../services/api.js';

/**
 * Guard de navegación (componente reutilizable).
 *
 * NOTAS DE ARQUITECTURA PARA EL ALUMNO
 *  - Sin sesión            -> /login
 *  - Con sesión y sin rol  -> /403 (acceso denegado)
 * ⚠️ Esto mejora la EXPERIENCIA de usuario; NO es seguridad. Cualquiera puede
 * saltarse el frontend. La autorización real la hace el backend con
 * authGuard/roleGuard (devolviendo 401/403): aquí solo evitas mostrar pantallas
 * que fallarían.
 *
 * @param {{roles?: string[], children: JSX.Element}} props  `roles`: roles permitidos (todos si se omite).
 */
export default function ProtectedRoute({ roles, children }) {
  const current = session.get();

  if (!current?.token) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(current.user?.rol)) return <Navigate to="/403" replace />;

  return children;
}
