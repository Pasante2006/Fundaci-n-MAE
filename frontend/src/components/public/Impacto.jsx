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
        <div>
          <div className="eyebrow">Huella viva</div>
          <div className="impacto-numero">
            {numero}
            <span>{sufijo}</span>
          </div>
          <h3>Familias impactadas</h3>
          <p>Más de cien hogares acompañados con dignidad, solidaridad y esperanza.</p>
        </div>
        <div>
          <div className="eyebrow">Colaboradores impactados</div>
          <h3>Alianzas que abrazan</h3>
          <div className="chips">
            {sitio.colaboradores.map((item) => (
              <span className="chip" key={item.id}>{item.nombre}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
