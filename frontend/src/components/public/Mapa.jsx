import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useSitio } from '../../context/SiteContext.jsx';
import ColombiaMap from '../mapa/ColombiaMap.jsx';

const icono = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function Mapa() {
  const { sitio } = useSitio();
  const lugares = sitio.lugares || [];

  return (
    <section className="seccion" id="mapa">
      <div className="mapa-seccion">
        <div className="mapa-copy">
          <div className="eyebrow mapa-kicker">territorios</div>
          <h3>Dónde abrazamos la esperanza</h3>
          <article className="mapa-tarjeta">
            <p>los sectores donde se abraza la esperanza</p>
          </article>
        </div>
        <div className="mapa-lado">
          <div className="mapa-wrap">
            <ColombiaMap>
              {lugares.map((lugar) => (
                <Marker key={lugar.id} position={[Number(lugar.latitud), Number(lugar.longitud)]} icon={icono}>
                  <Popup>
                    <strong>{lugar.titulo || lugar.municipio}</strong>
                    <div>{lugar.departamento}</div>
                    {lugar.descripcion && <p>{lugar.descripcion}</p>}
                  </Popup>
                </Marker>
              ))}
            </ColombiaMap>
          </div>
          {lugares.length === 0 && (
            <p className="vacio-elegante" style={{ marginTop: 16 }}>
              El mapa muestra solo Colombia. Los puntos se agregan desde el panel administrativo.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
