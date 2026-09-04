import { useEffect, useState } from 'react';

const DURACION_MS = 4000;
const SALIDA_MS = 700;

export default function SplashMae({ onFin }) {
  const [visible, setVisible] = useState(true);
  const [sale, setSale] = useState(false);

  useEffect(() => {
    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const espera = reducir ? 600 : DURACION_MS;

    const t1 = setTimeout(() => {
      setSale(true);
    }, espera);

    const t2 = setTimeout(() => {
      setVisible(false);
      onFin?.();
    }, espera + SALIDA_MS);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onFin]);

  if (!visible) return null;

  return (
    <div className={`mae-splash ${sale ? 'sale' : ''}`} role="dialog" aria-label="Bienvenida Fundación MAE">
      <div className="mae-splash-scene">
        <div className="mae-splash-glow" />
        <div className="mae-splash-spark" />
        <div className="mae-splash-spark" />
        <div className="mae-splash-spark" />
        <div className="mae-splash-spark" />

        <div className="mae-splash-butterfly">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e8d4ff" />
                <stop offset="35%" stopColor="#b57edc" />
                <stop offset="70%" stopColor="#9b59b6" />
                <stop offset="100%" stopColor="#6a3093" />
              </linearGradient>
              <linearGradient id="wingInner" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f0e0ff" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#8e44ad" stopOpacity="0.6" />
              </linearGradient>
              <radialGradient id="bodyGrad" cx="50%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#d4a5ff" />
                <stop offset="100%" stopColor="#4a148c" />
              </radialGradient>
              <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <g className="mae-splash-wing-left" filter="url(#softGlow)">
              <path
                d="M100,95 C70,60 20,40 15,75 C10,105 35,130 65,120 C85,115 95,105 100,95 Z"
                fill="url(#wingGrad)"
                stroke="#7b2cbf"
                strokeWidth="0.8"
                opacity="0.95"
              />
              <path
                d="M100,95 C75,70 40,65 30,85 C25,100 45,115 70,110 C85,107 95,100 100,95 Z"
                fill="url(#wingInner)"
                opacity="0.7"
              />
              <circle cx="45" cy="82" r="4" fill="#f0e0ff" opacity="0.5" />
              <circle cx="60" cy="95" r="2.5" fill="#e8d4ff" opacity="0.4" />
            </g>

            <g className="mae-splash-wing-right" filter="url(#softGlow)">
              <path
                d="M100,95 C130,60 180,40 185,75 C190,105 165,130 135,120 C115,115 105,105 100,95 Z"
                fill="url(#wingGrad)"
                stroke="#7b2cbf"
                strokeWidth="0.8"
                opacity="0.95"
              />
              <path
                d="M100,95 C125,70 160,65 170,85 C175,100 155,115 130,110 C115,107 105,100 100,95 Z"
                fill="url(#wingInner)"
                opacity="0.7"
              />
              <circle cx="155" cy="82" r="4" fill="#f0e0ff" opacity="0.5" />
              <circle cx="140" cy="95" r="2.5" fill="#e8d4ff" opacity="0.4" />
            </g>

            <g className="mae-splash-wing-left" filter="url(#softGlow)">
              <path
                d="M100,100 C75,115 30,130 25,155 C20,175 45,185 70,170 C88,160 98,115 100,100 Z"
                fill="url(#wingGrad)"
                stroke="#7b2cbf"
                strokeWidth="0.8"
                opacity="0.9"
              />
              <ellipse cx="55" cy="155" rx="8" ry="12" fill="#c9a0ff" opacity="0.35" />
            </g>

            <g className="mae-splash-wing-right" filter="url(#softGlow)">
              <path
                d="M100,100 C125,115 170,130 175,155 C180,175 155,185 130,170 C112,160 102,115 100,100 Z"
                fill="url(#wingGrad)"
                stroke="#7b2cbf"
                strokeWidth="0.8"
                opacity="0.9"
              />
              <ellipse cx="145" cy="155" rx="8" ry="12" fill="#c9a0ff" opacity="0.35" />
            </g>

            <ellipse cx="100" cy="105" rx="4" ry="28" fill="url(#bodyGrad)" />
            <ellipse cx="100" cy="78" rx="5" ry="6" fill="#9b59b6" />
            <path d="M97,72 Q90,55 85,48" fill="none" stroke="#b57edc" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M103,72 Q110,55 115,48" fill="none" stroke="#b57edc" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="85" cy="48" r="2" fill="#e8d4ff" />
            <circle cx="115" cy="48" r="2" fill="#e8d4ff" />
          </svg>
        </div>
      </div>

      <div className="mae-splash-nombre">
        <p>Fundación</p>
        <p>MAE</p>
      </div>
    </div>
  );
}
