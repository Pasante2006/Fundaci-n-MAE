import { useSitio } from '../../context/SiteContext.jsx';
import { useCountUp, useInView } from '../../hooks/useMotion.js';

export default function Impacto() {
  const { sitio } = useSitio();
  const { ref, visible } = useInView();
  const bruto = sitio.configuracion.vidas_impactadas || '100+';
  const numero = useCountUp(bruto, visible);
  const sufijo = String(bruto).replace(/[\d\s]/g, '') || '+';

  return (
    <section className="seccion" id="impacto" ref={ref}>
      <div className={`impacto reveal ${visible ? 'es-visible' : ''}`}>
        <figure className="impacto-foto">
          <img
            src="/margarita.png"
            alt="Manos que abrazan la esperanza: un adulto y un niño tomados de la mano"
          />
        </figure>
        <div>
          <div className="eyebrow">Huella viva</div>
          <div className="impacto-numero">
            {numero}
            <span>{sufijo}</span>
          </div>
          <h3>Familias impactadas</h3>
          <p>Más de cien hogares acompañados con dignidad, solidaridad y esperanza.</p>
        </div>
      </div>
    </section>
  );
}
