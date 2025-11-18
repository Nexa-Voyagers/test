import express from 'express';
import * as attendanceController from '../controllers/attendance.controller.js';

const router = express.Router();

router.get('/', attendanceController.getAllAttendances || attendanceController.getAllAttendance || attendanceController.getTimetable || attendanceController.getAdmissionReport);
router.get('/:id', attendanceController.getAttendanceById || attendanceController.getAttendance);
router.post('/', attendanceController.createAttendance);
router.put('/:id', attendanceController.updateAttendance);
router.delete('/:id', attendanceController.deleteAttendance);

export default router;
