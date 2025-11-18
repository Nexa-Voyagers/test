import express from 'express';
import customerController from '../controllers/customer.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/v1/customers
 * @desc    Create a new customer
 * @access  Private
 */
router.post('/', asyncHandler(customerController.createCustomer.bind(customerController)));

/**
 * @route   GET /api/v1/customers/search
 * @desc    Search customers
 * @access  Private
 */
router.get('/search', asyncHandler(customerController.searchCustomers.bind(customerController)));

/**
 * @route   GET /api/v1/customers/outstanding-balance
 * @desc    Get customers with outstanding balance
 * @access  Private
 */
router.get('/outstanding-balance', asyncHandler(customerController.getWithOutstandingBalance.bind(customerController)));

/**
 * @route   GET /api/v1/customers/top-customers
 * @desc    Get top customers
 * @access  Private
 */
router.get('/top-customers', asyncHandler(customerController.getTopCustomers.bind(customerController)));

/**
 * @route   GET /api/v1/customers/loyalty-tier/:tier
 * @desc    Get customers by loyalty tier
 * @access  Private
 */
router.get('/loyalty-tier/:tier', asyncHandler(customerController.getByLoyaltyTier.bind(customerController)));

/**
 * @route   GET /api/v1/customers/:id/purchases
 * @desc    Get customer purchase history
 * @access  Private
 */
router.get('/:id/purchases', asyncHandler(customerController.getPurchaseHistory.bind(customerController)));

/**
 * @route   POST /api/v1/customers/:id/payments
 * @desc    Record payment
 * @access  Private
 */
router.post('/:id/payments', asyncHandler(customerController.recordPayment.bind(customerController)));

/**
 * @route   PATCH /api/v1/customers/:id/loyalty-tier
 * @desc    Update loyalty tier
 * @access  Private
 */
router.patch('/:id/loyalty-tier', asyncHandler(customerController.updateLoyaltyTier.bind(customerController)));

/**
 * @route   GET /api/v1/customers/:id
 * @desc    Get customer by ID
 * @access  Private
 */
router.get('/:id', asyncHandler(customerController.getCustomerById.bind(customerController)));

/**
 * @route   GET /api/v1/customers
 * @desc    Get all customers with filters
 * @access  Private
 */
router.get('/', asyncHandler(customerController.getAllCustomers.bind(customerController)));

/**
 * @route   PUT /api/v1/customers/:id
 * @desc    Update customer
 * @access  Private
 */
router.put('/:id', asyncHandler(customerController.updateCustomer.bind(customerController)));

/**
 * @route   DELETE /api/v1/customers/:id
 * @desc    Delete customer
 * @access  Private
 */
router.delete('/:id', asyncHandler(customerController.deleteCustomer.bind(customerController)));

export default router;
