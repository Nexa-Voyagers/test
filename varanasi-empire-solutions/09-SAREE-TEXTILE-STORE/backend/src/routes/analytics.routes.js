import express from 'express';
import analyticsController from '../controllers/analytics.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/v1/analytics/daily-summary
 * @desc    Generate daily sales summary
 * @access  Private
 */
router.post('/daily-summary', asyncHandler(analyticsController.generateDailySummary.bind(analyticsController)));

/**
 * @route   GET /api/v1/analytics/daily-summaries
 * @desc    Get daily sales summaries
 * @access  Private
 */
router.get('/daily-summaries', asyncHandler(analyticsController.getDailySummaries.bind(analyticsController)));

/**
 * @route   GET /api/v1/analytics/dashboard
 * @desc    Get dashboard statistics
 * @access  Private
 */
router.get('/dashboard', asyncHandler(analyticsController.getDashboardStats.bind(analyticsController)));

/**
 * @route   GET /api/v1/analytics/top-products
 * @desc    Get top selling products
 * @access  Private
 */
router.get('/top-products', asyncHandler(analyticsController.getTopSellingProducts.bind(analyticsController)));

/**
 * @route   GET /api/v1/analytics/inventory-report
 * @desc    Get inventory report
 * @access  Private
 */
router.get('/inventory-report', asyncHandler(analyticsController.getInventoryReport.bind(analyticsController)));

/**
 * @route   GET /api/v1/analytics/customers
 * @desc    Get customer analytics
 * @access  Private
 */
router.get('/customers', asyncHandler(analyticsController.getCustomerAnalytics.bind(analyticsController)));

/**
 * @route   GET /api/v1/analytics/weaver-performance
 * @desc    Get weaver performance analytics
 * @access  Private
 */
router.get('/weaver-performance', asyncHandler(analyticsController.getWeaverPerformance.bind(analyticsController)));

/**
 * @route   GET /api/v1/analytics/sales-by-payment-method
 * @desc    Get sales by payment method
 * @access  Private
 */
router.get('/sales-by-payment-method', asyncHandler(analyticsController.getSalesByPaymentMethod.bind(analyticsController)));

/**
 * @route   GET /api/v1/analytics/sales-trends
 * @desc    Get sales trends
 * @access  Private
 */
router.get('/sales-trends', asyncHandler(analyticsController.getSalesTrends.bind(analyticsController)));

/**
 * @route   GET /api/v1/analytics/category-performance
 * @desc    Get category performance
 * @access  Private
 */
router.get('/category-performance', asyncHandler(analyticsController.getCategoryPerformance.bind(analyticsController)));

/**
 * @route   GET /api/v1/analytics/custom-orders
 * @desc    Get custom order analytics
 * @access  Private
 */
router.get('/custom-orders', asyncHandler(analyticsController.getCustomOrderAnalytics.bind(analyticsController)));

/**
 * @route   GET /api/v1/analytics/monthly-report
 * @desc    Get monthly report
 * @access  Private
 */
router.get('/monthly-report', asyncHandler(analyticsController.getMonthlyReport.bind(analyticsController)));

/**
 * @route   GET /api/v1/analytics/ytd-summary
 * @desc    Get year-to-date summary
 * @access  Private
 */
router.get('/ytd-summary', asyncHandler(analyticsController.getYearToDateSummary.bind(analyticsController)));

export default router;
