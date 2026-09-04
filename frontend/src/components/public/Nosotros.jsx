import { useSitio } from '../../context/SiteContext.jsx';
import { useInView } from '../../hooks/useMotion.js';

export default function Nosotros() {
  const { sitio } = useSitio();
  const { ref, visible } = useInView();
  const cfg = sitio.configuracion;

  return (
    <section className="seccion" id="nosotros" ref={ref}>
      <div className="eyebrow">Quiénes somos</div>
      <h3>Razón social y propósito</h3>
      <div className={`nosotros reveal ${visible ? 'es-visible' : ''}`}>
        <article className="tarjeta">
          <h4>Razón social</h4>
          <p>{cfg.razon_social}</p>
          <p style={{ marginTop: 12 }}><strong>Nombre legal:</strong> {cfg.nombre_legal}</p>
        </article>
        <article className="tarjeta">
          <h4>Propósito</h4>
          <p>{cfg.proposito}</p>
        </article>
      </div>
    </section>
  );
}
