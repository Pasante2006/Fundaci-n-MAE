import { useEffect, useState } from 'react';
import { api } from '../../api/client.js';
import { Toast, useAviso } from '../../components/admin/Ui.jsx';

const GRUPOS = [
  {
    titulo: 'Identidad',
    texto: 'Cómo se nombra la fundación en el encabezado y el pie de página.',
    claves: ['nombre_corto', 'nombre_completo', 'nombre_legal'],
  },
  {
    titulo: 'Huella viva',
    texto: 'Número de impacto y frase corta del hero.',
    claves: ['vidas_impactadas', 'eslogan'],
  },
  {
    titulo: 'Quiénes somos',
    texto: 'Contenido de la sección Nosotros en la landing.',
    claves: ['razon_social', 'proposito', 'filosofia'],
  },
];

const AYUDAS = {
  nombre_corto: 'Junto al logo, por ejemplo MAE.',
  nombre_completo: 'Frase bajo el nombre corto.',
  nombre_legal: 'Nombre que aparece en el pie de página.',
  vidas_impactadas: 'Número de familias, por ejemplo 100+.',
  eslogan: 'Frase corta bajo el nombre en el hero.',
  razon_social: 'Razón social y nombre completo de la fundación.',
  proposito: 'Propósito principal en Quiénes somos.',
  filosofia: 'Filosofía en el hero y en Quiénes somos.',
};

function Campo({ item, onChange }) {
  const largo = item.clave === 'proposito' || item.clave === 'filosofia';
  return (
    <label className={`campo${largo ? ' campo-ancho' : ''}`}>
      {item.etiqueta}
      {AYUDAS[item.clave] && <span className="campo-ayuda">{AYUDAS[item.clave]}</span>}
      {largo ? (
        <textarea rows={5} value={item.valor} onChange={(e) => onChange(item.id, e.target.value)} />
      ) : (
        <input type="text" value={item.valor} onChange={(e) => onChange(item.id, e.target.value)} />
      )}
    </label>
  );
}

export default function ConfigPage() {
  const [items, setItems] = useState([]);
  const { mensaje, avisar, cerrar } = useAviso();

  useEffect(() => {
    api.get('/api/configuracion').then((data) => setItems(data.items)).catch((e) => avisar(e.message));
  }, []);

  function cambiar(id, valor) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, valor } : item)));
  }

  async function guardar(e) {
    e.preventDefault();
    try {
      await api.put('/api/configuracion', { items });
      avisar('Textos guardados');
    } catch (err) {
      avisar(err.message);
    }
  }

  const usados = new Set(GRUPOS.flatMap((g) => g.claves));
  const extras = items.filter((item) => !usados.has(item.clave));
  const grupos = extras.length
    ? [...GRUPOS, { titulo: 'Otros textos', texto: '', claves: extras.map((i) => i.clave) }]
    : GRUPOS;

  return (
    <>
      <div className="admin-top">
        <div>
          <h1>Textos del sitio</h1>
          <p className="admin-lead">Edita los nombres y mensajes que se ven en la página pública.</p>
        </div>
        <button className="btn btn-primario" type="submit" form="form-config">Guardar</button>
      </div>
      <form id="form-config" className="config-form" onSubmit={guardar}>
        {grupos.map((grupo) => {
          const campos = grupo.claves
            .map((clave) => items.find((item) => item.clave === clave))
            .filter(Boolean);
          if (!campos.length) return null;
          return (
            <section className="config-card" key={grupo.titulo}>
              <header className="config-card-head">
                <h2>{grupo.titulo}</h2>
                {grupo.texto && <p>{grupo.texto}</p>}
              </header>
              <div className="config-card-grid">
                {campos.map((item) => (
                  <Campo key={item.id} item={item} onChange={cambiar} />
                ))}
              </div>
            </section>
          );
        })}
      </form>
      <Toast mensaje={mensaje} onClose={cerrar} />
    </>
  );
}
