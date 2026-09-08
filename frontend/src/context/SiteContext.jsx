import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';

const SiteContext = createContext(null);

const respaldo = {
  configuracion: {
    nombre_corto: 'MAE',
    nombre_completo: 'Manos que Abrazan la Esperanza',
    nombre_legal: 'Fundación MAE',
    razon_social: 'Fundación MAE (Margarita Maria Arango Escobar – Manos que Abrazan la Esperanza).',
    proposito:
      'Servir y apoyar a diferentes comunidades vulnerables, logrando impactar vidas de manera positiva y transformadora a través de MAE. Buscamos ser un canal de amor, brindando herramientas, acompañamiento y esperanza a quienes más lo necesitan.',
    filosofia:
      'Toda la labor de la fundación se rige por la premisa de que "por encima de bien, está mejor", buscando siempre entregar excelencia y calidad humana en cada acto de generosidad.',
    vidas_impactadas: '100+',
    eslogan: 'Manos que Abrazan la Esperanza',
  },
  media: { logo: [], hero: [], galeria: [], video_principal: [], causa: [] },
  lugares: [],
  causas: [],
  colaboradores: [
    {
      id: 1,
      nombre: 'Escuelita de Maltería',
      descripcion: 'Espacio de formación y cuidado para la niñez, donde el aprendizaje se vive con cariño, juego y esperanza.',
      imagen: '/colab-malteria.png',
    },
    {
      id: 2,
      nombre: 'Abre Tus Ojos',
      descripcion: 'Iniciativa de sensibilización que invita a mirar con empatía las realidades de quienes más lo necesitan.',
      imagen: '/colab-abre-tus-ojos.png',
    },
    {
      id: 3,
      nombre: 'Abuelitos',
      descripcion: 'Acompañamiento a personas mayores para honrar su historia, su dignidad y su lugar en la comunidad.',
      imagen: '/colab-abuelitos.png',
    },
  ],
};

export function SiteProvider({ children }) {
  const [sitio, setSitio] = useState(respaldo);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const ac = new AbortController();
    fetch('/api/public/sitio', { signal: ac.signal })
      .then((res) => res.json())
      .then((data) => {
        if (data?.data) setSitio({ ...respaldo, ...data.data, configuracion: { ...respaldo.configuracion, ...data.data.configuracion } });
      })
      .catch(() => setSitio(respaldo))
      .finally(() => setCargando(false));
    return () => ac.abort();
  }, []);

  const value = useMemo(() => ({ sitio, cargando, recargar: () => api.get('/api/public/sitio').then((d) => setSitio({ ...respaldo, ...d.data })) }), [sitio, cargando]);

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSitio() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSitio fuera de SiteProvider');
  return ctx;
}
