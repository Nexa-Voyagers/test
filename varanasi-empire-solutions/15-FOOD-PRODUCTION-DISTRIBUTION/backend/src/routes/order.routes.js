import express from 'express';
import * as orderController from '../controllers/order.controller.js';

const router = express.Router();

router.post('/', orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrder);
router.put('/:id', orderController.updateOrder);
router.post('/:orderId/items', orderController.addOrderItem);
router.patch('/:id/approve', orderController.approveOrder);
router.patch('/:id/process', orderController.processOrder);
router.patch('/:id/ship', orderController.shipOrder);
router.patch('/:id/deliver', orderController.deliverOrder);
router.patch('/:id/cancel', orderController.cancelOrder);
router.post('/:id/payment', orderController.recordPayment);

export default router;
