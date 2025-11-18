import express from 'express';
import * as qualityController from '../controllers/quality.controller.js';

const router = express.Router();

router.post('/', qualityController.createQualityCheck);
router.get('/', qualityController.getAllQualityChecks);
router.get('/stats', qualityController.getQualityStats);
router.get('/batch/:batchId', qualityController.getChecksByBatch);
router.get('/:id', qualityController.getQualityCheck);
router.put('/:id', qualityController.updateQualityCheck);
router.patch('/:id/approve', qualityController.approveQualityCheck);

export default router;
