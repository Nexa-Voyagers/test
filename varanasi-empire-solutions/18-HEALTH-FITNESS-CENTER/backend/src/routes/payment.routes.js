import express from 'express';
import * as paymentController from '../controllers/payment.controller.js';
const router = express.Router();
router.post('/', paymentController.create);
router.get('/', paymentController.getAll);
router.get('/:id', paymentController.getOne);
router.put('/:id', paymentController.update);
router.delete('/:id', paymentController.remove);
export default router;
