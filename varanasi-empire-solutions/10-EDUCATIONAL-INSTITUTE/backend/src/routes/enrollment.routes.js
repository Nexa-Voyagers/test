import express from 'express';
import {
  createEnrollment,
  getEnrollmentById,
  getAllEnrollments,
  updateEnrollment,
  cancelEnrollment,
  deleteEnrollment,
  getFeeDefaulters,
  getEnrollmentStatistics
} from '../controllers/enrollment.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Enrollments
 *   description: Enrollment management endpoints
 */

router.post('/', createEnrollment);
router.get('/statistics', getEnrollmentStatistics);
router.get('/', getAllEnrollments);
router.get('/:id', getEnrollmentById);
router.put('/:id', updateEnrollment);
router.put('/:id/cancel', cancelEnrollment);
router.delete('/:id', deleteEnrollment);

export default router;
