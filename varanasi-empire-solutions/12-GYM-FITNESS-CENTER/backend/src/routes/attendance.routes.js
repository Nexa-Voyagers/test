import express from 'express';
import attendanceController from '../controllers/attendance.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/check-in', attendanceController.checkIn);
router.post('/check-out', attendanceController.checkOutByMember);
router.get('/', attendanceController.getAllAttendance);
router.get('/today', attendanceController.getTodayAttendance);
router.get('/currently-checked-in', attendanceController.getCurrentlyCheckedIn);
router.get('/statistics', attendanceController.getAttendanceStatistics);
router.get('/peak-hours', attendanceController.getPeakHours);
router.get('/daily-trend', attendanceController.getDailyTrend);
router.get('/member/:memberId/history', attendanceController.getMemberAttendanceHistory);
router.get('/member/:memberId/frequency', attendanceController.getAttendanceFrequency);
router.get('/:id', attendanceController.getAttendanceById);
router.post('/:id/check-out', attendanceController.checkOut);

export default router;
