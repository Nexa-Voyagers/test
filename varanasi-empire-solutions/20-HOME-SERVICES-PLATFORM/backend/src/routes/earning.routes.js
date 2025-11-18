import express from 'express';
import * as earningController from '../controllers/earning.controller.js';
const router = express.Router();
router.post('/', earningController.create);
router.get('/', earningController.getAll);
router.get('/:id', earningController.getOne);
router.put('/:id', earningController.update);
router.delete('/:id', earningController.remove);
export default router;
