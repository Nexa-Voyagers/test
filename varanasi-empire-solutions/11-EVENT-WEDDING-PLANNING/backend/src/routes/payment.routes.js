import express from 'express';
import paymentController from '../controllers/payment.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Payment routes
router.post('/', paymentController.createPayment);
router.post('/client', paymentController.recordClientPayment);
router.post('/vendor', paymentController.recordVendorPayment);
router.post('/calculate-schedule', paymentController.calculatePaymentSchedule);
router.get('/', paymentController.getPayments);
router.get('/recent', paymentController.getRecentPayments);
router.get('/history', paymentController.getPaymentHistory);
router.get('/trends/monthly', paymentController.getMonthlyTrends);
router.get('/statistics/by-type', paymentController.getPaymentStatisticsByType);
router.get('/statistics/by-mode', paymentController.getPaymentStatisticsByMode);
router.get('/event/:eventId', paymentController.getEventPayments);
router.get('/event/:eventId/client', paymentController.getClientPayments);
router.get('/event/:eventId/vendor', paymentController.getVendorPayments);
router.get('/event/:eventId/summary', paymentController.getEventPaymentSummary);
router.get('/:id', paymentController.getPaymentById);
router.put('/:id', paymentController.updatePayment);
router.delete('/:id', paymentController.deletePayment);

export default router;
