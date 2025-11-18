import express from 'express';
import * as invoiceController from '../controllers/invoice.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Invoices
 *   description: Invoice management endpoints
 */

// Protected routes - require authentication
router.use(authMiddleware);

/**
 * @route   POST /api/v1/invoices
 * @desc    Create a new invoice
 * @access  Private
 */
router.post('/', invoiceController.createInvoice);

/**
 * @route   GET /api/v1/invoices
 * @desc    Get all invoices with pagination
 * @access  Private
 */
router.get('/', invoiceController.getAllInvoices);

/**
 * @route   GET /api/v1/invoices/outstanding
 * @desc    Get outstanding invoices
 * @access  Private
 */
router.get('/outstanding', invoiceController.getOutstandingInvoices);

/**
 * @route   GET /api/v1/invoices/statistics
 * @desc    Get invoice statistics
 * @access  Private
 */
router.get('/statistics', invoiceController.getInvoiceStatistics);

/**
 * @route   GET /api/v1/invoices/revenue-by-month
 * @desc    Get revenue by month
 * @access  Private
 */
router.get('/revenue-by-month', invoiceController.getRevenueByMonth);

/**
 * @route   GET /api/v1/invoices/case/:caseId
 * @desc    Get invoices by case
 * @access  Private
 */
router.get('/case/:caseId', invoiceController.getInvoicesByCase);

/**
 * @route   GET /api/v1/invoices/client/:clientId
 * @desc    Get invoices by client
 * @access  Private
 */
router.get('/client/:clientId', invoiceController.getInvoicesByClient);

/**
 * @route   GET /api/v1/invoices/:id
 * @desc    Get invoice by ID
 * @access  Private
 */
router.get('/:id', invoiceController.getInvoiceById);

/**
 * @route   PUT /api/v1/invoices/:id
 * @desc    Update invoice
 * @access  Private
 */
router.put('/:id', invoiceController.updateInvoice);

/**
 * @route   PATCH /api/v1/invoices/:id/payment-status
 * @desc    Update payment status
 * @access  Private
 */
router.patch('/:id/payment-status', invoiceController.updatePaymentStatus);

/**
 * @route   DELETE /api/v1/invoices/:id
 * @desc    Delete invoice
 * @access  Private
 */
router.delete('/:id', invoiceController.deleteInvoice);

export default router;
