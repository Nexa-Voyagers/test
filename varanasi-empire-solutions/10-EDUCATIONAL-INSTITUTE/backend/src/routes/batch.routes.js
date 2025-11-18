import express from 'express';
import {
  createBatch,
  getBatchById,
  getAllBatches,
  updateBatch,
  deleteBatch,
  getBatchStatistics,
  getAvailableBatches
} from '../controllers/batch.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Batches
 *   description: Batch management endpoints
 */

router.post('/', createBatch);
router.get('/', getAllBatches);
router.get('/:id', getBatchById);
router.put('/:id', updateBatch);
router.delete('/:id', deleteBatch);
router.get('/:id/statistics', getBatchStatistics);

export default router;
