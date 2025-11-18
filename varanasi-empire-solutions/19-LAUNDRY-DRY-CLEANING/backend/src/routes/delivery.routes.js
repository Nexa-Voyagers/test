import express from 'express';
import * as deliveryController from '../controllers/delivery.controller.js';
const router = express.Router();
router.post('/', deliveryController.create);
router.get('/', deliveryController.getAll);
router.get('/:id', deliveryController.getOne);
router.put('/:id', deliveryController.update);
router.delete('/:id', deliveryController.remove);
export default router;
