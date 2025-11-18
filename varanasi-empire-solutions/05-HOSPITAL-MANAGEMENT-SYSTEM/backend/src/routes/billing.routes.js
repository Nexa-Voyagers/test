import express from 'express';
import {
  createBill,
  getBill,
  getBillByNumber,
  updatePaymentStatus,
  getRevenueReport,
  generateInvoice,
} from '../controllers/billing.controller.js';

const router = express.Router();

router.post('/', createBill);
router.get('/revenue', getRevenueReport);
router.get('/bill-number/:billNumber', getBillByNumber);
router.get('/:id', getBill);
router.get('/:id/invoice', generateInvoice);
router.patch('/:id/payment', updatePaymentStatus);

export default router;
