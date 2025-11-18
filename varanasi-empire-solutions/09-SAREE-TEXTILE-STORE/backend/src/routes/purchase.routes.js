import express from 'express';
import purchaseController from '../controllers/purchase.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/v1/purchases
 * @desc    Create a new purchase order
 * @access  Private
 */
router.post('/', asyncHandler(purchaseController.createPurchaseOrder.bind(purchaseController)));

/**
 * @route   POST /api/v1/purchases/validate-items
 * @desc    Validate purchase items
 * @access  Private
 */
router.post('/validate-items', asyncHandler(purchaseController.validatePurchaseItems.bind(purchaseController)));

/**
 * @route   GET /api/v1/purchases/pending
 * @desc    Get pending purchase orders
 * @access  Private
 */
router.get('/pending', asyncHandler(purchaseController.getPendingOrders.bind(purchaseController)));

/**
 * @route   GET /api/v1/purchases/overdue
 * @desc    Get overdue purchase orders
 * @access  Private
 */
router.get('/overdue', asyncHandler(purchaseController.getOverdueOrders.bind(purchaseController)));

/**
 * @route   GET /api/v1/purchases/summary
 * @desc    Get purchase summary
 * @access  Private
 */
router.get('/summary', asyncHandler(purchaseController.getPurchaseSummary.bind(purchaseController)));

/**
 * @route   GET /api/v1/purchases/generate-order-number
 * @desc    Generate purchase order number
 * @access  Private
 */
router.get('/generate-order-number', asyncHandler(purchaseController.generateOrderNumber.bind(purchaseController)));

/**
 * @route   GET /api/v1/purchases/order/:orderNumber
 * @desc    Get purchase order by order number
 * @access  Private
 */
router.get('/order/:orderNumber', asyncHandler(purchaseController.getPurchaseOrderByOrderNumber.bind(purchaseController)));

/**
 * @route   GET /api/v1/purchases/weaver/:weaverId
 * @desc    Get orders by weaver
 * @access  Private
 */
router.get('/weaver/:weaverId', asyncHandler(purchaseController.getOrdersByWeaver.bind(purchaseController)));

/**
 * @route   POST /api/v1/purchases/:id/receive
 * @desc    Receive order (mark as completed and update stock)
 * @access  Private
 */
router.post('/:id/receive', asyncHandler(purchaseController.receiveOrder.bind(purchaseController)));

/**
 * @route   POST /api/v1/purchases/:id/cancel
 * @desc    Cancel purchase order
 * @access  Private
 */
router.post('/:id/cancel', asyncHandler(purchaseController.cancelOrder.bind(purchaseController)));

/**
 * @route   PATCH /api/v1/purchases/:id/status
 * @desc    Update purchase order status
 * @access  Private
 */
router.patch('/:id/status', asyncHandler(purchaseController.updateOrderStatus.bind(purchaseController)));

/**
 * @route   GET /api/v1/purchases/:id
 * @desc    Get purchase order by ID
 * @access  Private
 */
router.get('/:id', asyncHandler(purchaseController.getPurchaseOrderById.bind(purchaseController)));

/**
 * @route   GET /api/v1/purchases
 * @desc    Get all purchase orders with filters
 * @access  Private
 */
router.get('/', asyncHandler(purchaseController.getAllPurchaseOrders.bind(purchaseController)));

/**
 * @route   PUT /api/v1/purchases/:id
 * @desc    Update purchase order
 * @access  Private
 */
router.put('/:id', asyncHandler(purchaseController.updatePurchaseOrder.bind(purchaseController)));

export default router;
