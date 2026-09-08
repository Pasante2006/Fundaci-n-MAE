import { useEffect, useRef } from 'react';

/** Mariposas que ascienden con trayectoria ondulada (solo algunas). */
const VIAJERAS = [
  { ruta: 1, left: '4%', size: 50, dur: 26, delay: 0, vis: 0.46 },
  { ruta: 2, left: '28%', size: 44, dur: 30, delay: -11, vis: 0.42 },
  { ruta: 3, left: '54%', size: 48, dur: 24, delay: -19, vis: 0.44 },
  { ruta: 4, left: '76%', size: 42, dur: 28, delay: -7, vis: 0.4 },
];

/** Mariposas moradas quietas en la zona de Impacto. */
const REPOSO_IMPACTO = [
  { top: '8%', left: '68%', size: 48, durA: 0.84, durR: 4.7, delay: 0 },
  { top: '22%', left: '22%', size: 42, durA: 0.78, durR: 5.1, delay: 0.35 },
  { top: '36%', left: '58%', size: 46, durA: 0.9, durR: 4.4, delay: 0.65 },
];

function suavizar(valor) {
  const t = Math.max(0, Math.min(1, valor));
  return t * t * (3 - 2 * t);
}

function mezclaMorada(centroY) {
  const impacto = document.getElementById('impacto');
  const causas = document.getElementById('causas');
  if (!impacto || !causas) return 0;

  const impactoBottom = impacto.getBoundingClientRect().bottom;
  const causasTop = causas.getBoundingClientRect().top;
  const union = (impactoBottom + causasTop) / 2;
  const zona = Math.max(110, Math.abs(causasTop - impactoBottom) + 90);

  return suavizar((union + zona / 2 - centroY) / zona);
}

export default function MariposasCorredor() {
  const viajerasRef = useRef([]);

  useEffect(() => {
    let raf = 0;

    const actualizar = () => {
      viajerasRef.current.forEach((el) => {
        if (!el) return;
        const { top, height } = el.getBoundingClientRect();
        const morada = mezclaMorada(top + height * 0.45);
        el.style.setProperty('--bf-morada', morada.toFixed(3));
        el.style.setProperty('--bf-blanca', (1 - morada).toFixed(3));
      });
      raf = requestAnimationFrame(actualizar);
    };

    raf = requestAnimationFrame(actualizar);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="mariposas-corredor" aria-hidden="true">
      {REPOSO_IMPACTO.map((bf, i) => (
        <div
          key={`reposo-${i}`}
          className="mariposa-reposo mariposa-reposo-impacto"
          style={{
            '--bf-size': `${bf.size}px`,
            '--bf-top': bf.top,
            '--bf-left': bf.left,
            '--bf-dur-a': `${bf.durA}s`,
            '--bf-dur-r': `${bf.durR}s`,
            '--bf-delay-r': `${bf.delay}s`,
          }}
        >
          <img className="mariposa-reposo-img" src="/secundaria.png" alt="" />
        </div>
      ))}

      {VIAJERAS.map((bf, i) => (
        <div
          key={`viajera-${i}`}
          ref={(el) => {
            viajerasRef.current[i] = el;
          }}
          className={`mariposa-viajera mariposa-ruta-${bf.ruta}`}
          style={{
            '--bf-size': `${bf.size}px`,
            '--bf-left': bf.left,
            '--bf-dur': `${bf.dur}s`,
            '--bf-delay': `${bf.delay}s`,
            '--bf-vis': bf.vis,
          }}
        >
          <div className="mariposa-viajera-capas">
            <img className="mariposa-viajera-img mariposa-viajera-blanca" src="/mariposa-blanca.png" alt="" />
            <img className="mariposa-viajera-img mariposa-viajera-morada" src="/secundaria.png" alt="" />
          </div>
        </div>
      ))}
    </div>
  );
}
