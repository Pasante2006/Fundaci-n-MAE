import { useEffect, useRef, useState } from 'react';

export function useInView(opciones = { threshold: 0.18 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(([entrada]) => {
      if (entrada.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, opciones);
    observer.observe(el);
    return () => observer.disconnect();
  }, [opciones.threshold]);

  return { ref, visible };
}

export function useCountUp(objetivo, activo, duracion = 1400) {
  const [valor, setValor] = useState(0);

  useEffect(() => {
    if (!activo) return undefined;
    const numero = Number(String(objetivo).replace(/[^\d]/g, '')) || 0;
    const inicio = performance.now();
    let frame;

    const tick = (ahora) => {
      const t = Math.min(1, (ahora - inicio) / duracion);
      const eased = 1 - (1 - t) ** 3;
      setValor(Math.round(numero * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [objetivo, activo, duracion]);

  return valor;
}
