import Hero from '../../components/public/Hero.jsx';
import Impacto from '../../components/public/Impacto.jsx';
import Nosotros from '../../components/public/Nosotros.jsx';
import Colaboradores from '../../components/public/Colaboradores.jsx';
import Causas from '../../components/public/Causas.jsx';
import Galeria from '../../components/public/Galeria.jsx';
import Mapa from '../../components/public/Mapa.jsx';

export default function HomePage() {
  return (
    <main id="contenido">
      <Hero introLista />
      <Impacto />
      <Nosotros />
      <Colaboradores />
      <Causas />
      <Galeria />
      <Mapa />
    </main>
  );
}
