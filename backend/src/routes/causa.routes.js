import { Router } from 'express';
import * as causaController from '../controllers/causaController.js';
import { upload } from '../middlewares/upload.js';

const router = Router();
router.get('/', causaController.listar);
router.post('/', upload.single('archivo'), causaController.crear);
router.put('/:id', upload.single('archivo'), causaController.actualizar);
router.delete('/:id', causaController.eliminar);
export default router;
