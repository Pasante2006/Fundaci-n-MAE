import { Router } from 'express';
import * as publicController from '../controllers/publicController.js';

const router = Router();
router.get('/salud', publicController.salud);
router.get('/sitio', publicController.sitio);
export default router;
