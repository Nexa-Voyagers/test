import express from 'express';
import * as routeController from '../controllers/route.controller.js';
const router = express.Router();
router.post('/', routeController.create);
router.get('/', routeController.getAll);
router.get('/:id', routeController.getOne);
router.put('/:id', routeController.update);
router.delete('/:id', routeController.remove);
export default router;
