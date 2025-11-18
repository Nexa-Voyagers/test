import express from 'express';
import customOrderController from '../controllers/custom-order.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/v1/custom-orders
 * @desc    Create a new custom order
 * @access  Private
 */
router.post('/', asyncHandler(customOrderController.createCustomOrder.bind(customOrderController)));

/**
 * @route   GET /api/v1/custom-orders/pending
 * @desc    Get pending custom orders
 * @access  Private
 */
router.get('/pending', asyncHandler(customOrderController.getPendingOrders.bind(customOrderController)));

/**
 * @route   GET /api/v1/custom-orders/overdue
 * @desc    Get overdue custom orders
 * @access  Private
 */
router.get('/overdue', asyncHandler(customOrderController.getOverdueOrders.bind(customOrderController)));

/**
 * @route   GET /api/v1/custom-orders/statistics
 * @desc    Get custom order statistics
 * @access  Private
 */
router.get('/statistics', asyncHandler(customOrderController.getOrderStatistics.bind(customOrderController)));

/**
 * @route   GET /api/v1/custom-orders/generate-order-number
 * @desc    Generate custom order number
 * @access  Private
 */
router.get('/generate-order-number', asyncHandler(customOrderController.generateOrderNumber.bind(customOrderController)));

/**
 * @route   GET /api/v1/custom-orders/customer/:customerId
 * @desc    Get orders by customer
 * @access  Private
 */
router.get('/customer/:customerId', asyncHandler(customOrderController.getOrdersByCustomer.bind(customOrderController)));

/**
 * @route   GET /api/v1/custom-orders/weaver/:weaverId
 * @desc    Get orders by weaver
 * @access  Private
 */
router.get('/weaver/:weaverId', asyncHandler(customOrderController.getOrdersByWeaver.bind(customOrderController)));

/**
 * @route   POST /api/v1/custom-orders/:id/assign-weaver
 * @desc    Assign weaver to custom order
 * @access  Private
 */
router.post('/:id/assign-weaver', asyncHandler(customOrderController.assignWeaver.bind(customOrderController)));

/**
 * @route   POST /api/v1/custom-orders/:id/approve-design
 * @desc    Approve design
 * @access  Private
 */
router.post('/:id/approve-design', asyncHandler(customOrderController.approveDesign.bind(customOrderController)));

/**
 * @route   POST /api/v1/custom-orders/:id/start-production
 * @desc    Start production
 * @access  Private
 */
router.post('/:id/start-production', asyncHandler(customOrderController.startProduction.bind(customOrderController)));

/**
 * @route   POST /api/v1/custom-orders/:id/quality-check
 * @desc    Complete quality check
 * @access  Private
 */
router.post('/:id/quality-check', asyncHandler(customOrderController.completeQualityCheck.bind(customOrderController)));

/**
 * @route   POST /api/v1/custom-orders/:id/ready-for-delivery
 * @desc    Mark ready for delivery
 * @access  Private
 */
router.post('/:id/ready-for-delivery', asyncHandler(customOrderController.markReadyForDelivery.bind(customOrderController)));

/**
 * @route   POST /api/v1/custom-orders/:id/complete
 * @desc    Complete custom order
 * @access  Private
 */
router.post('/:id/complete', asyncHandler(customOrderController.completeOrder.bind(customOrderController)));

/**
 * @route   POST /api/v1/custom-orders/:id/cancel
 * @desc    Cancel custom order
 * @access  Private
 */
router.post('/:id/cancel', asyncHandler(customOrderController.cancelOrder.bind(customOrderController)));

/**
 * @route   PATCH /api/v1/custom-orders/:id/status
 * @desc    Update custom order status
 * @access  Private
 */
router.patch('/:id/status', asyncHandler(customOrderController.updateOrderStatus.bind(customOrderController)));

/**
 * @route   GET /api/v1/custom-orders/:id
 * @desc    Get custom order by ID
 * @access  Private
 */
router.get('/:id', asyncHandler(customOrderController.getCustomOrderById.bind(customOrderController)));

/**
 * @route   GET /api/v1/custom-orders
 * @desc    Get all custom orders with filters
 * @access  Private
 */
router.get('/', asyncHandler(customOrderController.getAllCustomOrders.bind(customOrderController)));

/**
 * @route   PUT /api/v1/custom-orders/:id
 * @desc    Update custom order
 * @access  Private
 */
router.put('/:id', asyncHandler(customOrderController.updateCustomOrder.bind(customOrderController)));

export default router;
