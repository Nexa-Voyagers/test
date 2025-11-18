import express from 'express';
import * as orderController from '../controllers/order.controller.js';
const router = express.Router();
router.post('/', orderController.create);
router.get('/', orderController.getAll);
router.get('/:id', orderController.getOne);
router.put('/:id', orderController.update);
router.delete('/:id', orderController.remove);
export default router;
