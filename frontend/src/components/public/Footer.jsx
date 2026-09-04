import { useSitio } from '../../context/SiteContext.jsx';

export default function Footer() {
  const { sitio } = useSitio();
  const cfg = sitio.configuracion;
  return (
    <footer className="site-footer">
      <div>
        <strong>{cfg.nombre_legal}</strong>
        <div>{(cfg.razon_social || '').replace(/^Fundaci[oó]n\s+/i, '')}</div>
      </div>
      <div className="site-footer-nombre">Maria Margarita Arango Escobar</div>
      <address className="site-footer-dir">
        Camino a la Libertad #74 84, Manizales, Caldas, Mi casa induma
      </address>
    </footer>
  );
}
