import { Navigate } from 'react-router-dom';
import { tokenStore } from '../services/api.js';

// Componente reutilizable: protege rutas privadas. La autorización REAL sigue en el backend;
// esto solo mejora la experiencia de usuario (nunca es una medida de seguridad por sí sola).
export default function ProtectedRoute({ children }) {
  return tokenStore.get() ? children : <Navigate to="/login" replace />;
}
