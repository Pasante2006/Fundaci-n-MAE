import { mediaUrl } from '../../api/client.js';
import { useSitio } from '../../context/SiteContext.jsx';
import { useInView } from '../../hooks/useMotion.js';

export default function Causas() {
  const { sitio } = useSitio();
  const { ref, visible } = useInView();

  return (
    <section className="seccion" id="causas" ref={ref}>
      <div className="eyebrow">Caminos de esperanza</div>
      <h3>Nuestras causas</h3>
      {sitio.causas.length === 0 ? (
        <div className="vacio-elegante">Las causas se publicarán desde el panel administrativo.</div>
      ) : (
        <div className={`grid-3 reveal ${visible ? 'es-visible' : ''}`}>
          {sitio.causas.map((causa) => (
            <article className="tarjeta" key={causa.id}>
              {causa.imagen && (
                <img src={mediaUrl(causa)} alt="" style={{ borderRadius: 16, height: 160, objectFit: 'cover', width: '100%', marginBottom: 14 }} />
              )}
              <h4>{causa.nombre}</h4>
              <p>{causa.descripcion}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
