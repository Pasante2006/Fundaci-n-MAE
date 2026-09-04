import { Router } from 'express';
import * as colaboradorController from '../controllers/colaboradorController.js';
import { upload } from '../middlewares/upload.js';

const router = Router();
router.get('/', colaboradorController.listar);
router.post('/', upload.single('archivo'), colaboradorController.crear);
router.put('/:id', upload.single('archivo'), colaboradorController.actualizar);
router.delete('/:id', colaboradorController.eliminar);
export default router;
