import { useState } from 'react';

export function Toast({ mensaje, onClose }) {
  if (!mensaje) return null;
  return (
    <div className="toast" role="status" onClick={onClose}>
      {mensaje}
    </div>
  );
}

export function Modal({ abierto, titulo, children, onClose }) {
  if (!abierto) return null;
  return (
    <div className="modal-fondo" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{titulo}</h2>
        {children}
      </div>
    </div>
  );
}

export function useAviso() {
  const [mensaje, setMensaje] = useState('');
  const avisar = (texto) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(''), 2800);
  };
  return { mensaje, avisar, cerrar: () => setMensaje('') };
}
