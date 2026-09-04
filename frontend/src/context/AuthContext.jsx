import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let vivo = true;
    api
      .get('/api/auth/me')
      .then((data) => vivo && setUsuario(data.usuario))
      .catch(() => vivo && setUsuario(null))
      .finally(() => vivo && setCargando(false));
    return () => {
      vivo = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      usuario,
      cargando,
      async login(email, password) {
        const data = await api.post('/api/auth/login', { email, password });
        setUsuario(data.usuario);
        return data.usuario;
      },
      async logout() {
        await api.post('/api/auth/logout', {});
        setUsuario(null);
      },
    }),
    [usuario, cargando],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth fuera de AuthProvider');
  return ctx;
}
