import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { mediaUrl } from '../../api/client.js';
import { useSitio } from '../../context/SiteContext.jsx';
import { useInView } from '../../hooks/useMotion.js';

const GAP = 22;
const INTERVALO_MS = 2000;

function visibleCount(ancho) {
  if (ancho < 600) return 1;
  if (ancho < 1000) return 2;
  return 3;
}

export default function Colaboradores() {
  const { sitio } = useSitio();
  const { ref, visible } = useInView();
  const items = sitio.colaboradores ?? [];
  const total = items.length;
  const itemsKey = items.map((i) => i.id).join(',');

  const vistaRef = useRef(null);
  const pistaRef = useRef(null);
  const animandoRef = useRef(false);
  const indiceRef = useRef(0);

  const [indice, setIndice] = useState(0);
  const [paso, setPaso] = useState(0);
  const [visibles, setVisibles] = useState(3);
  const [pausado, setPausado] = useState(false);
  const [sinTransicion, setSinTransicion] = useState(false);
  const [listo, setListo] = useState(false);

  const hayOverflow = total > visibles;

  const pistaItems = useMemo(() => {
    if (!total) return [];
    const clones = items.slice(0, Math.min(visibles, total));
    return [...items, ...clones].map((item, i) => ({
      item,
      key: i < total ? `causa-${item.id}` : `causa-${item.id}-clone-${i - total}`,
    }));
  }, [items, total, visibles]);

  const reiniciarSinSalto = useCallback(() => {
    setSinTransicion(true);
    indiceRef.current = 0;
    setIndice(0);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setSinTransicion(false));
    });
  }, []);

  const medir = useCallback(() => {
    const vista = vistaRef.current;
    const pista = pistaRef.current;
    if (!vista || !pista) return;

    const n = visibleCount(vista.clientWidth);
    const reservaFlecha = total > n ? 56 : 0;
    const anchoUtil = Math.max(0, vista.clientWidth - reservaFlecha);

    vista.style.setProperty('--vista-ancho', `${anchoUtil}px`);
    vista.style.setProperty('--causas-visibles', String(n));
    vista.style.setProperty('--causas-gap', `${GAP}px`);
    setVisibles(n);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const tarjetas = pista.querySelectorAll('.card-colab-carrusel');
        if (tarjetas.length >= 2) {
          const distancia = tarjetas[1].offsetLeft - tarjetas[0].offsetLeft;
          if (distancia > 0) setPaso(distancia);
        } else if (tarjetas.length === 1) {
          setPaso(tarjetas[0].getBoundingClientRect().width);
        }
        setListo(true);
      });
    });
  }, [total]);

  useEffect(() => {
    indiceRef.current = indice;
  }, [indice]);

  useEffect(() => {
    setListo(false);
    reiniciarSinSalto();
  }, [itemsKey, total, reiniciarSinSalto]);

  useEffect(() => {
    const vista = vistaRef.current;
    if (!vista) return undefined;
    const observer = new ResizeObserver(() => medir());
    observer.observe(vista);
    return () => observer.disconnect();
  }, [medir]);

  useEffect(() => {
    requestAnimationFrame(() => medir());
  }, [medir, pistaItems.length]);

  const avanzar = useCallback(() => {
    if (animandoRef.current || !paso || total <= 1) return;
    animandoRef.current = true;
    setIndice((i) => i + 1);
  }, [paso, total]);

  const onTransitionEnd = useCallback((e) => {
    if (e.propertyName !== 'transform' || e.target !== pistaRef.current) return;

    if (indiceRef.current >= total) {
      reiniciarSinSalto();
    }

    animandoRef.current = false;
  }, [total, reiniciarSinSalto]);

  useEffect(() => {
    if (!visible || !listo || !paso || total <= 1 || pausado) return undefined;
    const timer = setInterval(() => {
      if (!animandoRef.current) avanzar();
    }, INTERVALO_MS);
    return () => clearInterval(timer);
  }, [visible, listo, paso, total, pausado, avanzar]);

  return (
    <section className="seccion seccion-oscura colaboradores-escena" id="causas" ref={ref}>
      <div className="colab-mariposas" aria-hidden="true">
        <img className="colab-bf colab-bf-a" src="/mariposa-blanca.png" alt="" />
        <img className="colab-bf colab-bf-b" src="/mariposa-blanca.png" alt="" />
        <img className="colab-bf colab-bf-c" src="/mariposa-blanca.png" alt="" />
      </div>
      <div className="eyebrow" style={{ color: '#c4b5fd' }}>Comunidad</div>
      <h3>Causas impactadas</h3>

      {total === 0 ? (
        <div className="vacio-elegante">Las causas se publicarán desde el panel administrativo.</div>
      ) : (
        <div className={`causas-carrusel reveal ${visible ? 'es-visible' : ''}`}>
          <div className="causas-carrusel-vista" ref={vistaRef} aria-live="polite">
            <div
              ref={pistaRef}
              className={`causas-carrusel-pista${sinTransicion ? ' sin-transicion' : ''}`}
              style={{
                transform: paso ? `translate3d(-${indice * paso}px, 0, 0)` : undefined,
              }}
              onTransitionEnd={onTransitionEnd}
            >
              {pistaItems.map(({ item, key }) => (
                <article
                  className="card-colab card-colab-carrusel"
                  key={key}
                  onMouseEnter={() => setPausado(true)}
                  onMouseLeave={() => setPausado(false)}
                >
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
          </div>

          {hayOverflow && (
            <button
              type="button"
              className="causas-carrusel-btn causas-carrusel-btn-next"
              onClick={avanzar}
              aria-label="Ver más causas"
            >
              ›
            </button>
          )}
        </div>
      )}
    </section>
  );
}
