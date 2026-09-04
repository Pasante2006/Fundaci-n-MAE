import { useEffect, useState } from 'react';
import { Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { api } from '../../api/client.js';
import { Modal, Toast, useAviso } from '../../components/admin/Ui.jsx';
import ColombiaMap from '../../components/mapa/ColombiaMap.jsx';
import { puntoEnColombia } from '../../data/colombia.js';

const icono = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const vacio = {
  departamento: '',
  municipio: '',
  latitud: 4.711,
  longitud: -74.0721,
  titulo: '',
  descripcion: '',
  activo: true,
};

function ClickMapa({ onPick }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      if (!puntoEnColombia(lat, lng)) return;
      onPick(lat, lng);
    },
  });
  return null;
}

export default function LugaresPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(vacio);
  const [abierto, setAbierto] = useState(false);
  const [editando, setEditando] = useState(null);
  const { mensaje, avisar, cerrar } = useAviso();

  async function cargar() {
    setItems((await api.get('/api/lugares')).items);
  }
  useEffect(() => { cargar().catch((e) => avisar(e.message)); }, []);

  function abrir(item = null) {
    setEditando(item);
    setForm(item ? { ...item, activo: !!item.activo } : vacio);
    setAbierto(true);
  }

  async function guardar(e) {
    e.preventDefault();
    try {
      if (editando) await api.put(`/api/lugares/${editando.id}`, form);
      else await api.post('/api/lugares', form);
      setAbierto(false);
      await cargar();
      avisar('Lugar guardado');
    } catch (err) {
      avisar(err.message);
    }
  }

  async function borrar(id) {
    if (!confirm('¿Eliminar este lugar?')) return;
    await api.del(`/api/lugares/${id}`);
    await cargar();
  }

  return (
    <>
      <div className="admin-top">
        <h1>Lugares del mapa</h1>
        <button className="btn btn-primario" type="button" onClick={() => abrir()}>Nuevo lugar</button>
      </div>
      <table className="tabla">
        <thead>
          <tr><th>Título</th><th>Municipio</th><th>Departamento</th><th></th></tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.titulo || '—'}</td>
              <td>{item.municipio}</td>
              <td>{item.departamento}</td>
              <td className="acciones">
                <button className="btn btn-linea" type="button" onClick={() => abrir(item)}>Editar</button>
                <button className="btn btn-peligro" type="button" onClick={() => borrar(item.id)}>Borrar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal abierto={abierto} titulo={editando ? 'Editar lugar' : 'Nuevo lugar'} onClose={() => setAbierto(false)}>
        <form className="form-grid" onSubmit={guardar}>
          <p>Haz clic dentro de Colombia para fijar la ubicación.</p>
          <div className="mapa-admin">
            <ColombiaMap>
              <Marker position={[Number(form.latitud), Number(form.longitud)]} icon={icono} />
              <ClickMapa onPick={(lat, lng) => setForm((f) => ({ ...f, latitud: lat.toFixed(7), longitud: lng.toFixed(7) }))} />
            </ColombiaMap>
          </div>
          <label className="campo">Departamento<input value={form.departamento} onChange={(e) => setForm({ ...form, departamento: e.target.value })} required /></label>
          <label className="campo">Municipio<input value={form.municipio} onChange={(e) => setForm({ ...form, municipio: e.target.value })} required /></label>
          <label className="campo">Título<input value={form.titulo || ''} onChange={(e) => setForm({ ...form, titulo: e.target.value })} /></label>
          <label className="campo">Descripción<textarea value={form.descripcion || ''} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} /></label>
          <button className="btn btn-primario" type="submit">Guardar</button>
        </form>
      </Modal>
      <Toast mensaje={mensaje} onClose={cerrar} />
    </>
  );
}
