import express from 'express';
import {
  bookDarshan,
  getBooking,
  getDaySchedule,
  updateBookingStatus,
  getDailyStats,
} from '../controllers/darshan.controller.js';

const router = express.Router();

router.post('/bookings', bookDarshan);
router.get('/bookings/schedule', getDaySchedule);
router.get('/bookings/stats', getDailyStats);
router.get('/bookings/:id', getBooking);
router.patch('/bookings/:id/status', updateBookingStatus);

export default router;
