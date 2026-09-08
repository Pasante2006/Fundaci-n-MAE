import { NavLink, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useAuth } from '../../context/AuthContext.jsx';

const links = [
  { to: '/admin', label: 'Resumen', end: true },
  { to: '/admin/configuracion', label: 'Textos del sitio' },
  { to: '/admin/media', label: 'Fotos y videos' },
  { to: '/admin/causas', label: 'Causas' },
  { to: '/admin/lugares', label: 'Mapa / lugares' },
];

export default function AdminLayout() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div className="brand" style={{ color: 'white', marginBottom: 18 }}>
          <img src={logo} alt="" width="44" height="44" />
          <span>Panel MAE</span>
        </div>
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.end} className={({ isActive }) => (isActive ? 'activo' : '')}>
            {link.label}
          </NavLink>
        ))}
        <div style={{ marginTop: 'auto' }}>
          <div style={{ opacity: 0.7, fontSize: 13, padding: '8px 12px' }}>{usuario?.nombre}</div>
          <button
            className="nav-like"
            type="button"
            onClick={async () => {
              await logout();
              navigate('/PortalMAE');
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>
      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  );
}
