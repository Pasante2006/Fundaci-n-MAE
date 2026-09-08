import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import MaeButterflySvg from './MaeButterflySvg.jsx';

function reducirMovimiento() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function esMovil() {
  return window.matchMedia('(max-width: 900px)').matches;
}

function destinoMariposas(hero) {
  const caja = hero.getBoundingClientRect();
  const movil = esMovil();
  const cantidad = movil ? 4 : 7;
  return Array.from({ length: cantidad }, (_, i) => {
    const t = i / Math.max(1, cantidad - 1);
    return {
      id: `flotante-${i}`,
      x: movil ? caja.width * (0.08 + t * 0.28) : caja.width * (0.04 + t * 0.3),
      y: movil ? caja.height * (0.08 + ((i * 37) % 50) / 100) : caja.height * (0.12 + ((i * 29) % 62) / 100),
      size: movil ? 34 + (i % 3) * 10 : 42 + (i % 4) * 14,
      opacity: 0.28 + (i % 5) * 0.1,
      delay: 0.1 + i * (0.1 + (i % 2) * 0.06),
      drift: 6 + (i % 3) * 1.4,
    };
  });
}

export default function ButterflyIntro({ heroRef, targetRef, iniciar = true }) {
  const vueloRef = useRef(null);
  const nombreRef = useRef(null);
  const [flotantes, setFlotantes] = useState([]);
  const [introVisible, setIntroVisible] = useState(true);

  useEffect(() => {
    const hero = heroRef.current;
    const destino = targetRef.current;
    const vuelo = vueloRef.current;
    const nombre = nombreRef.current;
    if (!iniciar || !hero || !destino || !vuelo) return undefined;

    const mostrarLogo = () => {
      destino.classList.remove('mae-logo-oculto');
      hero.querySelectorAll('[data-mae-nombre-logo]').forEach((el) => {
        el.classList.remove('mae-logo-oculto');
      });
    };

    if (reducirMovimiento()) {
      mostrarLogo();
      hero.classList.remove('mae-intro-activa');
      setIntroVisible(false);
      setFlotantes(destinoMariposas(hero));
      return undefined;
    }

    destino.classList.add('mae-logo-oculto');
    requestAnimationFrame(() => hero.classList.add('mae-intro-activa'));

    const capa = vuelo.parentElement;
    gsap.set(vuelo, {
      left: '50%',
      top: '50%',
      xPercent: -50,
      yPercent: -50,
      x: 0,
      y: 0,
      scale: 0.72,
      rotation: -4,
      opacity: 0,
      force3D: true,
    });

    if (nombre) {
      gsap.set(nombre, { opacity: 0 });
    }

    const flotar = gsap.to(vuelo, {
      y: -20,
      x: 10,
      rotation: 3,
      duration: 2.4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      paused: true,
    });

    const tl = gsap.timeline({
      onComplete: () => {
        mostrarLogo();
        setFlotantes(destinoMariposas(hero));
        gsap.to(vuelo, {
          opacity: 0,
          duration: 0.55,
          ease: 'sine.inOut',
          onComplete: () => setIntroVisible(false),
        });
      },
    });

    tl.to(vuelo, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 1.15,
      ease: 'expo.out',
    }, 0);

    if (nombre) {
      tl.to(nombre, {
        opacity: 1,
        duration: 1.2,
        ease: 'sine.out',
      }, 0.2);
    }

    tl.add(() => flotar.play());
    tl.to({}, { duration: 1 });
    tl.add(() => flotar.pause());
    tl.add(() => hero.classList.remove('mae-intro-activa'));
    if (nombre) {
      tl.to(nombre, {
        opacity: 0,
        duration: 0.7,
        ease: 'sine.inOut',
      }, '>-0.05');
    }

    tl.add(() => {
      const origen = (capa || hero).getBoundingClientRect();
      const t = destino.getBoundingClientRect();
      const destX = t.left + t.width / 2 - (origen.left + origen.width / 2);
      const destY = t.top + t.height / 2 - (origen.top + origen.height / 2);
      const escala = Math.max(0.12, t.width / vuelo.offsetWidth);
      const actual = {
        x: Number(gsap.getProperty(vuelo, 'x')) || 0,
        y: Number(gsap.getProperty(vuelo, 'y')) || 0,
      };
      vuelo.classList.remove('butterfly-flying');
      vuelo.classList.add('butterfly-final-position');
      gsap.to(vuelo, {
        keyframes: [
          {
            x: actual.x + (destX - actual.x) * 0.45,
            y: Math.min(actual.y, destY) - 48,
            scale: escala * 1.25,
            rotation: 6,
            duration: 1.15,
            ease: 'sine.out',
          },
          {
            x: destX,
            y: destY,
            scale: escala,
            rotation: 0,
            duration: 1.45,
            ease: 'sine.inOut',
          },
        ],
        force3D: true,
      });
    });

    tl.to({}, { duration: 2.6 });

    return () => {
      hero.classList.remove('mae-intro-activa');
      flotar.kill();
      tl.kill();
    };
  }, [heroRef, targetRef, iniciar]);

  return (
    <>
      {introVisible && (
        <div className="main-butterfly-intro" aria-hidden="true">
          <div ref={nombreRef} className="mae-intro-nombre">
            <span>Margarita Maria Arango Escobar</span>
          </div>
          <div ref={vueloRef} className="butterfly-flying">
            <div className="mae-intro-glow" />
            <MaeButterflySvg className="mae-intro-svg" />
          </div>
        </div>
      )}
      <MariposasFlotantes heroRef={heroRef} items={flotantes} />
    </>
  );
}

function MariposasFlotantes({ heroRef, items }) {
  const nodos = useRef([]);

  useEffect(() => {
    if (!items.length || !heroRef.current) return undefined;

    const tweens = items.map((item, i) => {
      const el = nodos.current[i];
      if (!el) return null;
      const origen = heroRef.current.querySelector('.butterfly-final-position, [data-mae-logo-target]');
      const hero = heroRef.current.getBoundingClientRect();
      const desde = origen?.getBoundingClientRect();
      gsap.set(el, {
        x: desde ? desde.left - hero.left + desde.width / 2 : hero.width * 0.72,
        y: desde ? desde.top - hero.top + desde.height / 2 : hero.height * 0.45,
        xPercent: -50,
        yPercent: -50,
        scale: 0.15,
        opacity: 0,
      });

      return gsap.to(el, {
        x: item.x,
        y: item.y,
        scale: 1,
        opacity: item.opacity,
        duration: 1.85,
        delay: item.delay,
        ease: 'expo.out',
        onStart: () => {
          const ox = desde ? desde.left - hero.left + desde.width / 2 : item.x;
          const oy = desde ? desde.top - hero.top + desde.height / 2 : item.y;
          for (let n = 0; n < 3; n += 1) {
            const polvo = document.createElement('span');
            polvo.className = 'mae-polvo-luz';
            heroRef.current.appendChild(polvo);
            gsap.set(polvo, {
              x: ox + (Math.random() * 24 - 12),
              y: oy + (Math.random() * 24 - 12),
              opacity: 0.95,
              scale: 0.35,
            });
            gsap.to(polvo, {
              x: ox - (50 + Math.random() * 70),
              y: oy - (10 + Math.random() * 50),
              opacity: 0,
              scale: 1.8,
              duration: 0.75 + Math.random() * 0.3,
              ease: 'power1.out',
              onComplete: () => polvo.remove(),
            });
          }
        },
        onComplete: () => el.classList.add('butterfly-flying'),
      });
    });

    return () => {
      tweens.forEach((tw) => tw?.kill());
    };
  }, [items, heroRef]);

  if (!items.length) return null;

  return (
    <>
      {items.map((item, i) => (
        <div
          key={item.id}
          className="floating-butterfly"
          ref={(nodo) => {
            nodos.current[i] = nodo;
          }}
          style={{ width: item.size }}
        >
          <img src="/secundaria.png" alt="" style={{ animationDuration: `${0.85 + (i % 4) * 0.18}s` }} />
        </div>
      ))}
    </>
  );
}
