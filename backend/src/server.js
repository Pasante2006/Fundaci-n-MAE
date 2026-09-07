import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { connectDb, getDbStatus } from './config/db.js';
import { requireAuth } from './middlewares/auth.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import { uploadsRoot } from './middlewares/upload.js';
import publicRoutes from './routes/public.routes.js';
import authRoutes from './routes/auth.routes.js';
import configRoutes from './routes/config.routes.js';
import mediaRoutes from './routes/media.routes.js';
import lugarRoutes from './routes/lugar.routes.js';
import causaRoutes from './routes/causa.routes.js';
import colaboradorRoutes from './routes/colaborador.routes.js';

const app = express();
const port = Number(process.env.PORT || 4000);
const origin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadsRoot));

app.use('/api/public', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/configuracion', requireAuth, configRoutes);
app.use('/api/media', requireAuth, mediaRoutes);
app.use('/api/lugares', requireAuth, lugarRoutes);
app.use('/api/causas', requireAuth, causaRoutes);
app.use('/api/colaboradores', requireAuth, colaboradorRoutes);

app.use(notFound);
app.use(errorHandler);

connectDb()
  .then(() => console.log('SQL Server conectado'))
  .catch((error) => {
    console.warn('SQL Server no disponible todavía:', error.message);
    console.warn('La landing usará contenido de respaldo hasta que la BD responda.');
  });

app.listen(port, () => {
  const db = getDbStatus();
  console.log(`MAE API en http://localhost:${port}  |  vista: ${origin}`);
  if (!db.conectado) console.log('Esperando conexión a SQL Server…');
});

