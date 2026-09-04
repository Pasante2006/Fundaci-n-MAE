import { useEffect, useState } from 'react';
import { api, mediaUrl } from '../../api/client.js';
import { Modal, Toast, useAviso } from '../../components/admin/Ui.jsx';

const vacio = { nombre: '', descripcion: '', orden: 0, activo: true };

export default function CatalogoPage({ titulo, endpoint, nombreNuevo }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(vacio);
  const [archivo, setArchivo] = useState(null);
  const [abierto, setAbierto] = useState(false);
  const [editando, setEditando] = useState(null);
  const { mensaje, avisar, cerrar } = useAviso();

  async function cargar() {
    setItems((await api.get(endpoint)).items);
  }
  useEffect(() => { cargar().catch((e) => avisar(e.message)); }, [endpoint]);

  function abrir(item = null) {
    setEditando(item);
    setArchivo(null);
    setForm(item ? { nombre: item.nombre, descripcion: item.descripcion || '', orden: item.orden, activo: !!item.activo } : vacio);
    setAbierto(true);
  }

  async function guardar(e) {
    e.preventDefault();
    const body = new FormData();
    Object.entries(form).forEach(([k, v]) => body.append(k, v));
    if (archivo) body.append('archivo', archivo);
    try {
      if (editando) await api.put(`${endpoint}/${editando.id}`, body);
      else await api.post(endpoint, body);
      setAbierto(false);
      await cargar();
      avisar('Guardado');
    } catch (err) {
      avisar(err.message);
    }
  }

  async function borrar(id) {
    if (!confirm('¿Eliminar este registro?')) return;
    await api.del(`${endpoint}/${id}`);
    await cargar();
  }

  return (
    <>
      <div className="admin-top">
        <h1>{titulo}</h1>
        <button className="btn btn-primario" type="button" onClick={() => abrir()}>{nombreNuevo}</button>
      </div>
      <table className="tabla">
        <thead>
          <tr><th></th><th>Nombre</th><th>Orden</th><th></th></tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.imagen ? <img className="thumb" src={mediaUrl(item)} alt="" /> : '—'}</td>
              <td>{item.nombre}</td>
              <td>{item.orden}</td>
              <td className="acciones">
                <button className="btn btn-linea" type="button" onClick={() => abrir(item)}>Editar</button>
                <button className="btn btn-peligro" type="button" onClick={() => borrar(item.id)}>Borrar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal abierto={abierto} titulo={editando ? 'Editar' : nombreNuevo} onClose={() => setAbierto(false)}>
        <form className="form-grid" onSubmit={guardar}>
          <label className="campo">Nombre<input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required /></label>
          <label className="campo">Descripción<textarea rows={4} value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} /></label>
          <label className="campo">Imagen<input type="file" accept="image/*" onChange={(e) => setArchivo(e.target.files?.[0] || null)} /></label>
          <label className="campo">Orden<input type="number" value={form.orden} onChange={(e) => setForm({ ...form, orden: e.target.value })} /></label>
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
