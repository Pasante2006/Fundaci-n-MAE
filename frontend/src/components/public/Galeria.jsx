import { mediaUrl } from '../../api/client.js';
import { useSitio } from '../../context/SiteContext.jsx';

export default function Galeria() {
  const { sitio } = useSitio();
  const items = [...(sitio.media.galeria || []), ...(sitio.media.hero || [])].slice(0, 6);

  return (
    <section className="seccion" id="galeria">
      <div className="eyebrow">Memoria visual</div>
      <h3>Fotos y videos</h3>
      {items.length === 0 ? (
        <div className="vacio-elegante">Cuando subas fotos y videos en el admin, aparecerán aquí al inicio y en esta galería.</div>
      ) : (
        <div className="galeria">
          {items.map((item) => (
            <div className="galeria-item" key={item.id}>
              {item.tipo === 'video' ? (
                <video src={mediaUrl(item)} muted loop playsInline controls />
              ) : (
                <img src={mediaUrl(item)} alt={item.titulo || 'Galería MAE'} />
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
