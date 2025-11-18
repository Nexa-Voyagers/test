import express from 'express';
import * as productionController from '../controllers/production.controller.js';

const router = express.Router();

router.post('/', productionController.createBatch);
router.get('/', productionController.getAllBatches);
router.get('/stats', productionController.getProductionStats);
router.get('/:id', productionController.getBatch);
router.put('/:id', productionController.updateBatch);
router.patch('/:id/start', productionController.startProduction);
router.patch('/:id/complete', productionController.completeProduction);
router.patch('/:id/cancel', productionController.cancelBatch);

export default router;
