import express from 'express';
import saleController from '../controllers/sale.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/v1/sales
 * @desc    Create a new sale invoice
 * @access  Private
 */
router.post('/', asyncHandler(saleController.createSale.bind(saleController)));

/**
 * @route   POST /api/v1/sales/calculate-gst
 * @desc    Calculate GST
 * @access  Private
 */
router.post('/calculate-gst', asyncHandler(saleController.calculateGST.bind(saleController)));

/**
 * @route   POST /api/v1/sales/validate-items
 * @desc    Validate sale items
 * @access  Private
 */
router.post('/validate-items', asyncHandler(saleController.validateSaleItems.bind(saleController)));

/**
 * @route   GET /api/v1/sales/summary
 * @desc    Get sales summary
 * @access  Private
 */
router.get('/summary', asyncHandler(saleController.getSalesSummary.bind(saleController)));

/**
 * @route   GET /api/v1/sales/top-products
 * @desc    Get top selling products
 * @access  Private
 */
router.get('/top-products', asyncHandler(saleController.getTopSellingProducts.bind(saleController)));

/**
 * @route   GET /api/v1/sales/generate-invoice-number
 * @desc    Generate invoice number
 * @access  Private
 */
router.get('/generate-invoice-number', asyncHandler(saleController.generateInvoiceNumber.bind(saleController)));

/**
 * @route   GET /api/v1/sales/daily-report
 * @desc    Get daily sales report
 * @access  Private
 */
router.get('/daily-report', asyncHandler(saleController.getDailySalesReport.bind(saleController)));

/**
 * @route   GET /api/v1/sales/invoice/:invoiceNumber
 * @desc    Get sale by invoice number
 * @access  Private
 */
router.get('/invoice/:invoiceNumber', asyncHandler(saleController.getSaleByInvoiceNumber.bind(saleController)));

/**
 * @route   PATCH /api/v1/sales/:id/payment
 * @desc    Update payment status
 * @access  Private
 */
router.patch('/:id/payment', asyncHandler(saleController.updatePaymentStatus.bind(saleController)));

/**
 * @route   GET /api/v1/sales/:id
 * @desc    Get sale by ID
 * @access  Private
 */
router.get('/:id', asyncHandler(saleController.getSaleById.bind(saleController)));

/**
 * @route   GET /api/v1/sales
 * @desc    Get all sales with filters
 * @access  Private
 */
router.get('/', asyncHandler(saleController.getAllSales.bind(saleController)));

export default router;
