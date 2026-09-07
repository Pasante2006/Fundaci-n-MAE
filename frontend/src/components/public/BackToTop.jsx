import { useEffect, useState } from 'react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 280);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function irAlInicio() {
    const inicio = document.getElementById('inicio');
    if (inicio) {
      inicio.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <button
      type="button"
      className={`btn-arriba${visible ? ' es-visible' : ''}`}
      onClick={irAlInicio}
      aria-label="Volver al inicio"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 5.5 5.8 11.7l1.4 1.4L11 9.3V19h2V9.3l3.8 3.8 1.4-1.4Z"
          fill="currentColor"
        />
      </svg>
    </button>
  );
}
