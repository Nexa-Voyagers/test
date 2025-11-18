import express from 'express';
import * as analyticsController from '../controllers/analytics.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Analytics and reporting endpoints
 */

// Protected routes - require authentication
router.use(authMiddleware);

/**
 * @route   GET /api/v1/analytics/dashboard
 * @desc    Get dashboard statistics
 * @access  Private
 */
router.get('/dashboard', analyticsController.getDashboardStats);

/**
 * @route   GET /api/v1/analytics/cases/by-status
 * @desc    Get case statistics by status
 * @access  Private
 */
router.get('/cases/by-status', analyticsController.getCaseStatsByStatus);

/**
 * @route   GET /api/v1/analytics/cases/by-type
 * @desc    Get case statistics by type
 * @access  Private
 */
router.get('/cases/by-type', analyticsController.getCaseStatsByType);

/**
 * @route   GET /api/v1/analytics/cases/aging-report
 * @desc    Get case aging report
 * @access  Private
 */
router.get('/cases/aging-report', analyticsController.getCaseAgingReport);

/**
 * @route   GET /api/v1/analytics/professionals/performance
 * @desc    Get professional performance rankings
 * @access  Private
 */
router.get('/professionals/performance', analyticsController.getProfessionalPerformance);

/**
 * @route   GET /api/v1/analytics/revenue/trends
 * @desc    Get revenue trends by month
 * @access  Private
 */
router.get('/revenue/trends', analyticsController.getRevenueTrends);

/**
 * @route   GET /api/v1/analytics/clients/statistics
 * @desc    Get client statistics
 * @access  Private
 */
router.get('/clients/statistics', analyticsController.getClientStatistics);

/**
 * @route   GET /api/v1/analytics/clients/top-by-revenue
 * @desc    Get top clients by revenue
 * @access  Private
 */
router.get('/clients/top-by-revenue', analyticsController.getTopClientsByRevenue);

/**
 * @route   GET /api/v1/analytics/hearings/trends
 * @desc    Get hearing trends
 * @access  Private
 */
router.get('/hearings/trends', analyticsController.getHearingTrends);

/**
 * @route   GET /api/v1/analytics/payments/collection-report
 * @desc    Get payment collection report
 * @access  Private
 */
router.get('/payments/collection-report', analyticsController.getPaymentCollectionReport);

/**
 * @route   GET /api/v1/analytics/comprehensive-report
 * @desc    Get comprehensive analytics report
 * @access  Private
 */
router.get('/comprehensive-report', analyticsController.getComprehensiveReport);

export default router;
