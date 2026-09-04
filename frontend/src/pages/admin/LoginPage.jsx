import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useAuth } from '../../context/AuthContext.jsx';

export default function LoginPage() {
  const { usuario, login, cargando } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (!cargando && usuario) return <Navigate to="/admin" replace />;

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setEnviando(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-card">
        <img src={logo} alt="Fundación MAE" />
        <h1>Entrar al panel</h1>
        <p>Administra textos, fotos, videos y el mapa de MAE.</p>
        <form onSubmit={onSubmit}>
          {error && <div className="alerta">{error}</div>}
          <label className="campo">
            Correo
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" />
          </label>
          <label className="campo">
            Contraseña
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
          </label>
          <button className="btn btn-primario" type="submit" disabled={enviando}>
            {enviando ? 'Entrando…' : 'Ingresar'}
          </button>
        </form>
      </div>
    </main>
  );
}
