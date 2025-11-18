import express from 'express';
import { invoiceController } from '../controllers/invoice.controller.js';

const router = express.Router();

router.post('/', invoiceController.createInvoice);
router.get('/:id', invoiceController.getInvoice);
router.get('/number/:invoiceNumber', invoiceController.getInvoiceByNumber);
router.post('/:id/payment', invoiceController.recordPayment);

// Booking invoices
router.get('/booking/:reservationId/invoices', invoiceController.getInvoicesByReservation);

// Property invoices
router.get('/property/:propertyId/invoices', invoiceController.getInvoicesByProperty);
router.get('/property/:propertyId/invoices/unpaid', invoiceController.getUnpaidInvoices);
router.get('/property/:propertyId/revenue', invoiceController.getRevenueStats);
router.get('/property/:propertyId/gst-report', invoiceController.generateGSTReport);

export default router;
