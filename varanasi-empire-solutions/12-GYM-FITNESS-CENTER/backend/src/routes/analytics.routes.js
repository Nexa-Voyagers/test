import express from 'express';
import analyticsController from '../controllers/analytics.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/dashboard', analyticsController.getDashboardStats);
router.get('/revenue', analyticsController.getRevenueReport);
router.get('/revenue-comparison', analyticsController.getRevenueComparison);
router.get('/retention', analyticsController.getRetentionStats);
router.get('/member-growth', analyticsController.getMemberGrowthTrend);
router.get('/attendance-trend', analyticsController.getAttendanceTrend);
router.get('/peak-hours', analyticsController.getPeakHours);
router.get('/trainer-performance', analyticsController.getTrainerPerformance);
router.get('/plan-popularity', analyticsController.getPlanPopularity);
router.get('/expiring-memberships', analyticsController.getExpiringMemberships);
router.get('/payment-status', analyticsController.getPaymentStatusSummary);
router.get('/top-members', analyticsController.getTopMembersByAttendance);
router.get('/capacity-utilization', analyticsController.getCapacityUtilization);
router.get('/comprehensive-report', analyticsController.getComprehensiveReport);

export default router;
