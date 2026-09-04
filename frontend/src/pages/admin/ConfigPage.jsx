import { useEffect, useState } from 'react';
import { api } from '../../api/client.js';
import { Toast, useAviso } from '../../components/admin/Ui.jsx';

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

  return (
    <>
      <div className="admin-top">
        <h1>Textos del sitio</h1>
        <button className="btn btn-primario" type="submit" form="form-config">Guardar</button>
      </div>
      <form id="form-config" className="form-grid" onSubmit={guardar}>
        {items.map((item) => (
          <label className="campo" key={item.id}>
            {item.etiqueta} <small>({item.clave})</small>
            <textarea rows={item.clave === 'proposito' ? 4 : 2} value={item.valor} onChange={(e) => cambiar(item.id, e.target.value)} />
          </label>
        ))}
      </form>
      <Toast mensaje={mensaje} onClose={cerrar} />
    </>
  );
}
