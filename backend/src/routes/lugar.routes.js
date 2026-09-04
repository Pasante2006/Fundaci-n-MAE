import { Router } from 'express';
import * as lugarController from '../controllers/lugarController.js';

const router = Router();
router.get('/', lugarController.listar);
router.post('/', lugarController.crear);
router.put('/:id', lugarController.actualizar);
router.delete('/:id', lugarController.eliminar);
export default router;
