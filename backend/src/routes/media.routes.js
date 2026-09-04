import { Router } from 'express';
import * as mediaController from '../controllers/mediaController.js';
import { upload } from '../middlewares/upload.js';

const router = Router();
router.get('/', mediaController.listar);
router.post('/', upload.single('archivo'), mediaController.crear);
router.put('/:id', upload.single('archivo'), mediaController.actualizar);
router.delete('/:id', mediaController.eliminar);
export default router;
