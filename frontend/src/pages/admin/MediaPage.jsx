import { useEffect, useState } from 'react';
import { api, mediaUrl, SECCIONES_MEDIA } from '../../api/client.js';
import { Modal, Toast, useAviso } from '../../components/admin/Ui.jsx';

const vacio = { seccion: 'hero', tipo: 'imagen', titulo: '', url_externa: '', orden: 0, activo: true };

export default function MediaPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(vacio);
  const [archivo, setArchivo] = useState(null);
  const [abierto, setAbierto] = useState(false);
  const [editando, setEditando] = useState(null);
  const { mensaje, avisar, cerrar } = useAviso();

  async function cargar() {
    const data = await api.get('/api/media');
    setItems(data.items);
  }

  useEffect(() => {
    cargar().catch((e) => avisar(e.message));
  }, []);

  function abrir(item = null) {
    setEditando(item);
    setArchivo(null);
    setForm(item ? { seccion: item.seccion, tipo: item.tipo, titulo: item.titulo || '', url_externa: item.url_externa || '', orden: item.orden, activo: !!item.activo } : vacio);
    setAbierto(true);
  }

  async function guardar(e) {
    e.preventDefault();
    const body = new FormData();
    Object.entries(form).forEach(([k, v]) => body.append(k, v));
    if (archivo) body.append('archivo', archivo);
    try {
      if (editando) await api.put(`/api/media/${editando.id}`, body);
      else await api.post('/api/media', body);
      setAbierto(false);
      await cargar();
      avisar('Media actualizada');
    } catch (err) {
      avisar(err.message);
    }
  }

  async function borrar(id) {
    if (!confirm('¿Eliminar este archivo?')) return;
    await api.del(`/api/media/${id}`);
    await cargar();
    avisar('Eliminado');
  }

  return (
    <>
      <div className="admin-top">
        <h1>Fotos y videos</h1>
        <button className="btn btn-primario" type="button" onClick={() => abrir()}>Subir</button>
      </div>
      <table className="tabla">
        <thead>
          <tr><th></th><th>Título</th><th>Sección</th><th>Tipo</th><th></th></tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                {item.tipo === 'video'
                  ? <span>🎬</span>
                  : <img className="thumb" src={mediaUrl(item)} alt="" />}
              </td>
              <td>{item.titulo || 'Sin título'}</td>
              <td>{item.seccion}</td>
              <td>{item.tipo}</td>
              <td className="acciones">
                <button className="btn btn-linea" type="button" onClick={() => abrir(item)}>Editar</button>
                <button className="btn btn-peligro" type="button" onClick={() => borrar(item.id)}>Borrar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal abierto={abierto} titulo={editando ? 'Editar media' : 'Nueva media'} onClose={() => setAbierto(false)}>
        <form className="form-grid" onSubmit={guardar}>
          <label className="campo">
            Sección
            <select value={form.seccion} onChange={(e) => setForm({ ...form, seccion: e.target.value })}>
              {SECCIONES_MEDIA.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </label>
          <label className="campo">
            Tipo
            <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
              <option value="imagen">Imagen</option>
              <option value="video">Video</option>
            </select>
          </label>
          <label className="campo">
            Título
            <input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
          </label>
          <label className="campo">
            Archivo
            <input type="file" accept="image/*,video/*" onChange={(e) => setArchivo(e.target.files?.[0] || null)} />
          </label>
          <label className="campo">
            O URL externa
            <input value={form.url_externa} onChange={(e) => setForm({ ...form, url_externa: e.target.value })} placeholder="https://" />
          </label>
          <label className="campo">
            Orden
            <input type="number" value={form.orden} onChange={(e) => setForm({ ...form, orden: e.target.value })} />
          </label>
          <label className="campo">
            <input type="checkbox" checked={!!form.activo} onChange={(e) => setForm({ ...form, activo: e.target.checked })} /> Visible
          </label>
          <button className="btn btn-primario" type="submit">Guardar</button>
        </form>
      </Modal>
      <Toast mensaje={mensaje} onClose={cerrar} />
    </>
  );
}
