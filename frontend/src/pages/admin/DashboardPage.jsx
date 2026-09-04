import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function DashboardPage() {
  const { usuario } = useAuth();
  const [conteos, setConteos] = useState({ media: 0, causas: 0, colaboradores: 0, lugares: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/api/media'),
      api.get('/api/causas'),
      api.get('/api/colaboradores'),
      api.get('/api/lugares'),
    ])
      .then(([media, causas, colaboradores, lugares]) => {
        setConteos({
          media: media.items.length,
          causas: causas.items.length,
          colaboradores: colaboradores.items.length,
          lugares: lugares.items.length,
        });
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <div className="admin-top">
        <div>
          <h1>Hola, {usuario?.nombre?.split(' ')[0]}</h1>
          <p>Todo lo que publiques aquí se refleja en la landing.</p>
        </div>
        <Link className="btn btn-linea" to="/" target="_blank" rel="noreferrer">Ver sitio</Link>
      </div>
      <div className="stats">
        <Link className="stat" to="/admin/media"><b>{conteos.media}</b>Fotos y videos</Link>
        <Link className="stat" to="/admin/colaboradores"><b>{conteos.colaboradores}</b>Colaboradores</Link>
        <Link className="stat" to="/admin/causas"><b>{conteos.causas}</b>Causas</Link>
        <Link className="stat" to="/admin/lugares"><b>{conteos.lugares}</b>Lugares</Link>
      </div>
    </>
  );
}
