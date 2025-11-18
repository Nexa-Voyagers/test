import express from 'express';
import {
  markAttendance,
  markBulkAttendance,
  getAttendanceById,
  getAllAttendance,
  updateAttendance,
  deleteAttendance,
  getAttendancePercentage,
  getBatchAttendanceReport,
  getStudentAttendanceSummary,
  getLowAttendanceStudents
} from '../controllers/attendance.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Attendance management endpoints
 */

router.post('/', markAttendance);
router.post('/bulk', markBulkAttendance);
router.get('/', getAllAttendance);
router.get('/:id', getAttendanceById);
router.put('/:id', updateAttendance);
router.delete('/:id', deleteAttendance);

export default router;
