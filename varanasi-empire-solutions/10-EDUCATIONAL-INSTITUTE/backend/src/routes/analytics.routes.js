import express from 'express';
import {
  getDashboardStats,
  getBatchPerformance,
  getRevenueReport,
  getMonthlyRevenueTrend,
  getCourseWiseEnrollments,
  getFacultyPerformance,
  getAttendanceTrends,
  getTestPerformanceTrends,
  getTopPerformingStudents,
  generateInstituteReport
} from '../controllers/analytics.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Analytics and reporting endpoints
 */

router.get('/dashboard/:instituteId', getDashboardStats);
router.get('/batch-performance/:batchId', getBatchPerformance);
router.get('/revenue/:instituteId', getRevenueReport);
router.get('/revenue-trend/:instituteId', getMonthlyRevenueTrend);
router.get('/course-enrollments/:instituteId', getCourseWiseEnrollments);
router.get('/faculty-performance/:instituteId', getFacultyPerformance);
router.get('/attendance-trends/:batchId', getAttendanceTrends);
router.get('/test-performance/:batchId', getTestPerformanceTrends);
router.get('/top-performers/:instituteId', getTopPerformingStudents);
router.get('/institute-report/:instituteId', generateInstituteReport);

export default router;
