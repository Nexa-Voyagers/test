import express from 'express';
import {
  createBooking,
  getBooking,
  getBookingByNumber,
  getAgencyBookings,
  updateBookingStatus,
  addPayment,
  getBookingStats,
} from '../controllers/booking.controller.js';

const router = express.Router();

router.post('/', createBooking);
router.get('/stats', getBookingStats);
router.get('/number/:bookingNumber', getBookingByNumber);
router.get('/', getAgencyBookings);
router.get('/:id', getBooking);
router.patch('/:id/status', updateBookingStatus);
router.post('/:id/payment', addPayment);

export default router;
