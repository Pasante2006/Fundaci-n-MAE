import { useState } from 'react';
import logo from '../../assets/logo.png';
import { useSitio } from '../../context/SiteContext.jsx';

export default function Header() {
  const { sitio } = useSitio();
  const [abierto, setAbierto] = useState(false);
  const cfg = sitio.configuracion;

  return (
    <header className="site-header">
      <a className="skip" href="/#contenido">Saltar al contenido</a>
      <a className="brand" href="/#inicio">
        <img src={logo} alt="Logo Fundación MAE" />
        <span>
          {cfg.nombre_corto}
          <small>{cfg.nombre_completo}</small>
        </span>
      </a>
      <button className="nav-toggle" type="button" aria-label="Menú" onClick={() => setAbierto((v) => !v)}>
        ☰
      </button>
      <nav className={`nav-public ${abierto ? 'abierto' : ''}`}>
        <a href="/#inicio" onClick={() => setAbierto(false)}>Inicio</a>
        <a href="/#impacto" onClick={() => setAbierto(false)}>Impacto</a>
        <a href="/#nosotros" onClick={() => setAbierto(false)}>Nosotros</a>
        <a href="/#colaboradores" onClick={() => setAbierto(false)}>Colaboradores</a>
        <a href="/#causas" onClick={() => setAbierto(false)}>Causas</a>
        <a href="/#mapa" onClick={() => setAbierto(false)}>Mapa</a>
      </nav>
    </header>
  );
}
