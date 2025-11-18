import express from 'express';
import measurementController from '../controllers/measurement.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', measurementController.createMeasurement);
router.get('/', measurementController.getAllMeasurements);
router.get('/calculate-bmi', measurementController.calculateBMI);
router.get('/bmi-distribution', measurementController.getBMIDistribution);
router.get('/member/:memberId', measurementController.getMeasurementsByMember);
router.get('/member/:memberId/latest', measurementController.getLatestMeasurement);
router.get('/member/:memberId/progress', measurementController.getProgressReport);
router.get('/member/:memberId/trend', measurementController.getMeasurementTrend);
router.get('/:id', measurementController.getMeasurementById);
router.put('/:id', measurementController.updateMeasurement);
router.delete('/:id', measurementController.deleteMeasurement);

export default router;
