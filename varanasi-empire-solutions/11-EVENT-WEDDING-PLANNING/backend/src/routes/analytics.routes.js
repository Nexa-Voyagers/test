import express from 'express';
import analyticsController from '../controllers/analytics.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Analytics routes
router.get('/dashboard', analyticsController.getDashboardOverview);
router.get('/executive-summary', analyticsController.getExecutiveSummary);
router.get('/comprehensive', analyticsController.getComprehensiveReport);
router.get('/performance', analyticsController.getPerformanceMetrics);
router.get('/revenue', analyticsController.getRevenueStatistics);
router.get('/events/by-type', analyticsController.getEventTypeStatistics);
router.get('/events/by-city', analyticsController.getEventCityStatistics);
router.get('/events/completion', analyticsController.getEventCompletionMetrics);
router.get('/events/upcoming', analyticsController.getUpcomingEventsReport);
router.get('/vendors/performance', analyticsController.getVendorPerformanceReport);
router.get('/vendors/by-category', analyticsController.getVendorCategoryStatistics);
router.get('/clients/top', analyticsController.getTopClientsReport);
router.get('/payments/collection', analyticsController.getPaymentCollectionReport);
router.get('/budget/analysis', analyticsController.getBudgetAnalysisReport);
router.get('/tasks/completion', analyticsController.getTaskCompletionReport);
router.get('/guests/rsvp', analyticsController.getGuestRSVPReport);
router.get('/trends/monthly', analyticsController.getMonthlyTrends);

export default router;
