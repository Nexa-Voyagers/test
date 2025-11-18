import { bookingService } from '../services/booking.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { logger } from '../config/logger.js';

export const createBooking = asyncHandler(async (req, res) => {
  const bookingData = {
    ...req.body,
    agency_id: req.user.agency_id,
    created_by: req.user.id,
  };

  const booking = await bookingService.createBooking(bookingData);

  logger.info(`Booking created: ${booking.booking_number}`);

  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    data: booking,
  });
});

export const getBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const booking = await bookingService.getBooking(id);

  res.json({
    success: true,
    data: booking,
  });
});

export const getBookingByNumber = asyncHandler(async (req, res) => {
  const { bookingNumber } = req.params;
  const booking = await bookingService.getBookingByNumber(bookingNumber);

  res.json({
    success: true,
    data: booking,
  });
});

export const getAgencyBookings = asyncHandler(async (req, res) => {
  const agencyId = req.user.agency_id;
  const filters = req.query;

  const bookings = await bookingService.getAgencyBookings(agencyId, filters);

  res.json({
    success: true,
    data: bookings,
    count: bookings.length,
  });
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const booking = await bookingService.updateBookingStatus(id, status);

  logger.info(`Booking status updated: ${id} -> ${status}`);

  res.json({
    success: true,
    message: 'Status updated successfully',
    data: booking,
  });
});

export const addPayment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { amount, payment_method } = req.body;

  const booking = await bookingService.addPayment(id, amount, payment_method);

  logger.info(`Payment added to booking: ${id}, Amount: ${amount}`);

  res.json({
    success: true,
    message: 'Payment added successfully',
    data: booking,
  });
});

export const getBookingStats = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const agencyId = req.user.agency_id;

  const stats = await bookingService.getBookingStats(agencyId, startDate, endDate);

  res.json({
    success: true,
    data: stats,
  });
});

export default {
  createBooking,
  getBooking,
  getBookingByNumber,
  getAgencyBookings,
  updateBookingStatus,
  addPayment,
  getBookingStats,
};
