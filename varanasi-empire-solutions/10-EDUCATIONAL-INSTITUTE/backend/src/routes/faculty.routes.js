import express from 'express';
import {
  createFaculty,
  getFacultyById,
  getAllFaculty,
  updateFaculty,
  deleteFaculty,
  getFacultyBatches,
  getFacultyStatistics
} from '../controllers/faculty.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Faculty
 *   description: Faculty management endpoints
 */

router.post('/', createFaculty);
router.get('/', getAllFaculty);
router.get('/:id', getFacultyById);
router.put('/:id', updateFaculty);
router.delete('/:id', deleteFaculty);
router.get('/:id/batches', getFacultyBatches);
router.get('/:id/statistics', getFacultyStatistics);

export default router;
