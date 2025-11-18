import express from 'express';
import * as reportController from '../controllers/report.controller.js';

const router = express.Router();

router.get('/production', reportController.getProductionReport);
router.get('/quality', reportController.getQualityReport);
router.get('/sales', reportController.getSalesReport);
router.get('/inventory', reportController.getInventoryReport);
router.get('/dashboard', reportController.getDashboardStats);
router.get('/distributor-performance', reportController.getDistributorPerformance);
router.get('/product-performance', reportController.getProductPerformance);
router.get('/expiry', reportController.getExpiryReport);

export default router;
