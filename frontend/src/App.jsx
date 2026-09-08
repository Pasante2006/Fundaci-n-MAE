import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import PublicLayout from './pages/public/PublicLayout.jsx';
import HomePage from './pages/public/HomePage.jsx';
import LoginPage from './pages/admin/LoginPage.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import DashboardPage from './pages/admin/DashboardPage.jsx';
import ConfigPage from './pages/admin/ConfigPage.jsx';
import MediaPage from './pages/admin/MediaPage.jsx';
import LugaresPage from './pages/admin/LugaresPage.jsx';
import CausasPage from './pages/admin/CausasPage.jsx';

function RequireAuth({ children }) {
  const { usuario, cargando } = useAuth();
  if (cargando) return <div className="admin-boot">Cargando sesión…</div>;
  if (!usuario) return <Navigate to="/PortalMAE" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>
      <Route path="/PortalMAE" element={<LoginPage />} />
      <Route path="/admin/login" element={<Navigate to="/PortalMAE" replace />} />
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="configuracion" element={<ConfigPage />} />
        <Route path="media" element={<MediaPage />} />
        <Route path="lugares" element={<LugaresPage />} />
        <Route path="causas" element={<CausasPage />} />
        <Route path="colaboradores" element={<Navigate to="/admin/causas" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
