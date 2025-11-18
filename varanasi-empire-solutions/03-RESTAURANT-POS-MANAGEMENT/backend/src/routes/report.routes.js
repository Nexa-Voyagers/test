import express from 'express';
import { reportController } from '../controllers/report.controller.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /reports/sales:
 *   get:
 *     summary: Get sales report (Admin/Manager only)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: to_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: group_by
 *         schema:
 *           type: string
 *           enum: [day, week, month]
 */
router.get('/sales', authorize('admin', 'manager'), reportController.getSalesReport);

/**
 * @swagger
 * /reports/top-items:
 *   get:
 *     summary: Get top selling items (Admin/Manager only)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 */
router.get('/top-items', authorize('admin', 'manager'), reportController.getTopSellingItems);

/**
 * @swagger
 * /reports/revenue:
 *   get:
 *     summary: Get revenue report (Admin/Manager only)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 */
router.get('/revenue', authorize('admin', 'manager'), reportController.getRevenueReport);

/**
 * @swagger
 * /reports/staff-performance:
 *   get:
 *     summary: Get staff performance report (Admin/Manager only)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 */
router.get('/staff-performance', authorize('admin', 'manager'), reportController.getStaffPerformance);

/**
 * @swagger
 * /reports/inventory-usage:
 *   get:
 *     summary: Get inventory usage report (Admin/Manager only)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 */
router.get('/inventory-usage', authorize('admin', 'manager'), reportController.getInventoryUsage);

/**
 * @swagger
 * /reports/waste:
 *   get:
 *     summary: Get waste report (Admin/Manager only)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 */
router.get('/waste', authorize('admin', 'manager'), reportController.getWasteReport);

export default router;
