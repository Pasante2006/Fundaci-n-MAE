import { useSitio } from '../../context/SiteContext.jsx';
import { useCountUp, useInView } from '../../hooks/useMotion.js';

export default function Impacto() {
  const { sitio } = useSitio();
  const { ref, visible } = useInView();
  const cfg = sitio.configuracion;
  const bruto = cfg.vidas_impactadas || '100+';
  const numero = useCountUp(bruto, visible);
  const sufijo = String(bruto).replace(/[\d\s]/g, '') || '+';

  return (
    <section className="seccion" id="impacto" ref={ref}>
      <div className={`impacto-nosotros reveal ${visible ? 'es-visible' : ''}`}>
        <div className="impacto-nosotros-col" id="nosotros">
          <div className="eyebrow">Quiénes somos</div>
          <h3>Identidad, propósito y filosofía</h3>
          <div className="nosotros-vertical">
            <article className="tarjeta">
              <h4>Razón social / Nombre</h4>
              <p>{cfg.razon_social}</p>
            </article>
            <article className="tarjeta">
              <h4>Propósito principal</h4>
              <p>{cfg.proposito}</p>
            </article>
            <article className="tarjeta">
              <h4>Filosofía</h4>
              <p>{cfg.filosofia}</p>
            </article>
          </div>
        </div>

        <div className="impacto-nosotros-col impacto-nosotros-huella">
          <div className="eyebrow">Huella viva</div>
          <div className="impacto-numero">
            {numero}
            <span>{sufijo}</span>
          </div>
          <h3>Familias impactadas</h3>
          <p>Más de cien hogares acompañados con dignidad, solidaridad y esperanza.</p>
          <figure className="impacto-foto">
            <video
              src="/video.mp4"
              autoPlay
              loop
              muted
              playsInline
              aria-label="Video de la labor de la fundación con familias impactadas"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
