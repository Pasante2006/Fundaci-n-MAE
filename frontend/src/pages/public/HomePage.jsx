import Hero from '../../components/public/Hero.jsx';
import Impacto from '../../components/public/Impacto.jsx';
import Colaboradores from '../../components/public/Colaboradores.jsx';
import MariposasCorredor from '../../components/public/MariposasCorredor.jsx';
import Mapa from '../../components/public/Mapa.jsx';

export default function HomePage() {
  return (
    <main id="contenido">
      <Hero introLista />
      <div className="impacto-causas-escena">
        <Impacto />
        <Colaboradores />
        <MariposasCorredor />
      </div>
      <Mapa />
    </main>
  );
}
