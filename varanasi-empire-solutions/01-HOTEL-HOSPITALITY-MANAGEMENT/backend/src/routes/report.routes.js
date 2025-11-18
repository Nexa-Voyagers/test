import express from 'express';
import { reportController } from '../controllers/report.controller.js';

const router = express.Router();

router.get('/occupancy', reportController.getOccupancyReport);
router.get('/revenue', reportController.getRevenueReport);
router.get('/revpar', reportController.getRevPAR);
router.get('/adr', reportController.getADR);
router.get('/guests', reportController.getGuestStats);
router.get('/performance', reportController.getPerformanceSummary);
router.get('/channel-analysis', reportController.getChannelAnalysis);
router.get('/forecast', reportController.getForecastingData);

export default router;
