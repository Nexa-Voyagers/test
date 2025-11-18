import express from 'express';
import * as platformController from '../controllers/platform.controller.js';
const router = express.Router();
router.post('/', platformController.create);
router.get('/', platformController.getAll);
router.get('/:id', platformController.getOne);
router.put('/:id', platformController.update);
router.delete('/:id', platformController.remove);
export default router;
