import express from 'express';
import {
  recordPayment,
  getPaymentById,
  getAllPayments,
  updatePayment,
  deletePayment,
  getPaymentHistory,
  getPendingPayments,
  getPaymentStatistics,
  getDailyCollection,
  generateReceipt
} from '../controllers/payment.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Fee payment management endpoints
 */

router.post('/', recordPayment);
router.get('/statistics', getPaymentStatistics);
router.get('/', getAllPayments);
router.get('/:id', getPaymentById);
router.put('/:id', updatePayment);
router.delete('/:id', deletePayment);
router.get('/:paymentId/receipt', generateReceipt);

export default router;
