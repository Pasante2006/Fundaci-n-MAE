# Fundación MAE

Sitio institucional de **MAE — Manos que Abrazan la Esperanza**.

## Arquitectura

- **Frontend:** React 18, Vite, React Router, CSS propio, Leaflet
- **Backend:** Node.js, Express, MVC, SQL Server con consultas parametrizadas (equivalente a PDO), JWT + cookies, bcrypt, Multer

La vista pública es una landing. El panel `/admin` gestiona textos, media, causas, colaboradores y el mapa.

## Arranque

1. Ejecuta en SQL Server el script original de tablas y luego `backend/sql/contenido.sql`.
2. Completa `backend/.env` (usuario y contraseña de SQL Server).
3. Backend:

```bash
cd backend
npm install
npm run dev
```

4. Frontend:

```bash
cd frontend
npm install
npm run dev
```

- Pública: http://localhost:5173
- Admin: http://localhost:5173/admin/login
