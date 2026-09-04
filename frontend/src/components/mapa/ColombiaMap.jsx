import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';
import { COLOMBIA_BOUNDS, COLOMBIA_CENTRO, recortarMapaAColombia } from '../../data/colombia.js';

const limites = L.latLngBounds(COLOMBIA_BOUNDS);

function RecorteColombia() {
  const map = useMap();

  useEffect(() => {
    map.setMaxBounds(limites.pad(0.06));
    map.fitBounds(limites, { padding: [10, 10], animate: false });
    const quitar = recortarMapaAColombia(map);
    const invalidar = () => map.invalidateSize();
    const t1 = setTimeout(invalidar, 60);
    const t2 = setTimeout(invalidar, 280);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      quitar();
    };
  }, [map]);

  return null;
}

export default function ColombiaMap({ children, className, zoomControl = true }) {
  return (
    <MapContainer
      className={className}
      center={COLOMBIA_CENTRO}
      zoom={6}
      minZoom={5}
      maxZoom={19}
      maxBounds={limites.pad(0.06)}
      maxBoundsViscosity={1}
      scrollWheelZoom
      zoomControl={zoomControl}
      worldCopyJump={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      <RecorteColombia />
      {children}
    </MapContainer>
  );
}
