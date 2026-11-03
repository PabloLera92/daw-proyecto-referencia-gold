import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ForbiddenPage from './pages/ForbiddenPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

/**
 * Solo el MAPA DE RUTAS: cada pantalla vive en src/pages y las piezas
 * reutilizables en src/components. Tres niveles de acceso (Hito 3):
 *   - Públicas:       sin guard (login, catálogo de solo lectura, registro).
 *   - Privadas:       <ProtectedRoute>.
 *   - Administrativas:<ProtectedRoute roles={['ADMIN']}> (un usuario estándar acaba en /403).
 */
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/403" element={<ForbiddenPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
