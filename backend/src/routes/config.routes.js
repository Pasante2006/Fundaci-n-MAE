import { Router } from 'express';
import * as configController from '../controllers/configController.js';

const router = Router();
router.get('/', configController.listar);
router.put('/', configController.guardar);
export default router;
