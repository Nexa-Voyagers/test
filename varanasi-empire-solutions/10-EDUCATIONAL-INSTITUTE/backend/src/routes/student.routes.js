import express from 'express';
import {
  createStudent,
  getStudentById,
  getAllStudents,
  searchStudents,
  updateStudent,
  deleteStudent,
  getStudentEnrollments,
  getStudentPerformance
} from '../controllers/student.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Student management endpoints
 */

router.post('/', createStudent);
router.get('/search', searchStudents);
router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);
router.get('/:id/enrollments', getStudentEnrollments);
router.get('/:id/performance', getStudentPerformance);

export default router;
