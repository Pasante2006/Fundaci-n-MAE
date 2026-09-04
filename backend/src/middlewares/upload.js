import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import multer from 'multer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const uploadsRoot = path.resolve(__dirname, '../../uploads');

const imagenesDir = path.join(uploadsRoot, 'imagenes');
const videosDir = path.join(uploadsRoot, 'videos');

for (const dir of [imagenesDir, videosDir]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const permitidos = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/webm',
  'video/quicktime',
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, file.mimetype.startsWith('video/') ? videosDir : imagenesDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase() || '.bin';
    cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 80 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!permitidos.has(file.mimetype)) {
      cb(Object.assign(new Error('Formato de archivo no permitido'), { status: 400 }));
      return;
    }
    cb(null, true);
  },
});

export function rutaPublica(file) {
  const carpeta = file.mimetype.startsWith('video/') ? 'videos' : 'imagenes';
  return `/uploads/${carpeta}/${file.filename}`;
}

export function borrarArchivo(rutaRelativa) {
  if (!rutaRelativa || !rutaRelativa.startsWith('/uploads/')) return;
  const absoluto = path.join(uploadsRoot, rutaRelativa.replace('/uploads/', ''));
  if (fs.existsSync(absoluto)) fs.unlinkSync(absoluto);
}
