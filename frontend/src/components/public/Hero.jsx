import { useEffect, useMemo, useRef, useState } from 'react';
import logo from '../../assets/logo.png';
import { mediaUrl } from '../../api/client.js';
import { useSitio } from '../../context/SiteContext.jsx';
import ButterflyIntro from './ButterflyIntro.jsx';

export default function Hero({ introLista = true }) {
  const heroRef = useRef(null);
  const targetRef = useRef(null);
  const { sitio } = useSitio();
  const cfg = sitio.configuracion;
  const piezas = useMemo(() => {
    const hero = sitio.media.hero || [];
    const videos = sitio.media.video_principal || [];
    const galeria = (sitio.media.galeria || []).filter((item) => item.tipo === 'video');
    const vistos = new Set();
    return [...videos, ...hero, ...galeria].filter((item) => {
      if (!item?.id || vistos.has(item.id)) return false;
      vistos.add(item.id);
      return true;
    });
  }, [sitio.media]);

  const [indice, setIndice] = useState(0);
  useEffect(() => {
    if (piezas.length < 2) return undefined;
    const id = setInterval(() => setIndice((i) => (i + 1) % piezas.length), 6000);
    return () => clearInterval(id);
  }, [piezas.length]);

  const actual = piezas[indice];
  const secundaria = piezas[(indice + 1) % piezas.length];

  return (
    <section className="hero" id="inicio" ref={heroRef}>
      <ButterflyIntro heroRef={heroRef} targetRef={targetRef} iniciar={introLista} />
      <div className="hero-grid">
      <div>
        <div className="hero-kicker">Fundación MAE</div>
        <h1>{cfg.nombre_corto}</h1>
        <h2>{cfg.nombre_completo}</h2>
        <p>{cfg.filosofia}</p>
        <div className="hero-actions">
          <a className="btn btn-primario" href="#impacto">Ver el impacto</a>
          <a className="btn btn-fantasma" href="#nosotros">Conocer la fundación</a>
        </div>
      </div>
      <div className="hero-media" aria-label="Fotos y videos de la fundación">
        {actual ? (
          <>
            <div className="hero-frame principal">
              <MediaPieza item={actual} autoPlay />
            </div>
            {secundaria && secundaria !== actual && (
              <div className="hero-frame flotante">
                <MediaPieza item={secundaria} />
              </div>
            )}
            <img ref={targetRef} data-mae-logo-target className="mae-logo-target-media" src={logo} alt="" />
          </>
        ) : (
          <div className="hero-frame principal hero-vacio">
            <div className="mae-logo-nombre mae-logo-oculto" data-mae-nombre-logo>
              Margarita Maria Arango Escobar
            </div>
            <img ref={targetRef} data-mae-logo-target className="mae-logo-oculto" src={logo} alt="Mariposa MAE" />
          </div>
        )}
      </div>
      </div>
    </section>
  );
}

function MediaPieza({ item, autoPlay = false }) {
  const src = mediaUrl(item);
  if (item.tipo === 'video' || /\.(mp4|webm|mov)$/i.test(src)) {
    return <video src={src} autoPlay={autoPlay} muted loop playsInline />;
  }
  return <img src={src} alt={item.titulo || 'Memoria visual de Fundación MAE'} />;
}
