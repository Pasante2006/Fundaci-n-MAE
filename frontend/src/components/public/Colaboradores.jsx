import { mediaUrl } from '../../api/client.js';
import { useSitio } from '../../context/SiteContext.jsx';
import { useInView } from '../../hooks/useMotion.js';

const iniciales = ['E', 'A', 'A'];

export default function Colaboradores() {
  const { sitio } = useSitio();
  const { ref, visible } = useInView();

  return (
    <section className="seccion seccion-oscura" id="colaboradores" ref={ref}>
      <div className="eyebrow" style={{ color: '#c4b5fd' }}>Comunidad</div>
      <h3>Colaboradores impactados</h3>
      <div className={`grid-3 reveal ${visible ? 'es-visible' : ''}`}>
        {sitio.colaboradores.map((item, i) => (
          <article className="card-colab" key={item.id}>
            {item.imagen ? (
              <img src={mediaUrl(item)} alt="" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 16, marginBottom: 16 }} />
            ) : (
              <div className="marca">{iniciales[i] || item.nombre[0]}</div>
            )}
            <h4>{item.nombre}</h4>
            <p>{item.descripcion}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
