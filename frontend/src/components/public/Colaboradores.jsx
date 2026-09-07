import { mediaUrl } from '../../api/client.js';
import { useSitio } from '../../context/SiteContext.jsx';
import { useInView } from '../../hooks/useMotion.js';

export default function Colaboradores() {
  const { sitio } = useSitio();
  const { ref, visible } = useInView();

  return (
    <section className="seccion seccion-oscura colaboradores-escena" id="colaboradores" ref={ref}>
      <div className="colab-mariposas" aria-hidden="true">
        <img className="colab-bf colab-bf-a" src="/mariposa-blanca.png" alt="" />
        <img className="colab-bf colab-bf-b" src="/mariposa-blanca.png" alt="" />
        <img className="colab-bf colab-bf-c" src="/mariposa-blanca.png" alt="" />
        <img className="colab-bf colab-bf-d" src="/mariposa-blanca.png" alt="" />
        <img className="colab-bf colab-bf-e" src="/mariposa-blanca.png" alt="" />
      </div>
      <div className="eyebrow" style={{ color: '#c4b5fd' }}>Comunidad</div>
      <h3>Colaboradores impactados</h3>
      <div className={`grid-3 reveal ${visible ? 'es-visible' : ''}`}>
        {sitio.colaboradores.map((item) => (
          <article className="card-colab" key={item.id}>
            {item.imagen ? (
              <img className="card-colab-foto" src={mediaUrl(item)} alt={item.nombre} />
            ) : (
              <div className="marca marca-mariposa" aria-hidden="true">
                <img src="/secundaria.png" alt="" />
              </div>
            )}
            <h4>{item.nombre}</h4>
            <p>{item.descripcion}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
