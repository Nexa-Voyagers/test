import express from 'express';
import { bookingController } from '../controllers/booking.controller.js';
import { bookingRateLimiter } from '../config/rateLimiter.js';

const router = express.Router();

router.post('/', bookingRateLimiter, bookingController.createBooking);
router.post('/availability/check', bookingController.checkAvailability);
router.get('/:id', bookingController.getBooking);
router.post('/:id/check-in', bookingController.checkIn);
router.post('/:id/check-out', bookingController.checkOut);
router.post('/:id/cancel', bookingController.cancelBooking);

// Property bookings
router.get('/property/:propertyId/bookings', bookingController.getBookingsByProperty);
router.get('/property/:propertyId/arrivals', bookingController.getUpcomingArrivals);
router.get('/property/:propertyId/current', bookingController.getCurrentReservations);

export default router;
