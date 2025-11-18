import { bookingService } from '../services/booking.service.js';
import { bookingRepository } from '../repositories/booking.repository.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { NotFoundError } from '../utils/errors.js';

/**
 * Create booking
 * POST /api/v1/bookings
 */
const createBooking = asyncHandler(async (req, res) => {
  const result = await bookingService.createBooking({
    ...req.body,
    created_by: req.user.id,
  });

  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    data: {
      reservation: result.reservation,
      guest: result.guest,
      pricing: result.pricing,
      availableRooms: result.availableRooms,
    },
  });
});

/**
 * Get booking
 * GET /api/v1/bookings/:id
 */
const getBooking = asyncHandler(async (req, res) => {
  const booking = await bookingRepository.findById(req.params.id);

  if (!booking) {
    throw new NotFoundError('Booking');
  }

  res.json({
    success: true,
    data: booking,
  });
});

/**
 * Get bookings by property
 * GET /api/v1/properties/:propertyId/bookings
 */
const getBookingsByProperty = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;
  const { status = null, limit = 20, offset = 0 } = req.query;

  const result = await bookingRepository.findByProperty(propertyId, {
    status,
    limit: parseInt(limit),
    offset: parseInt(offset),
  });

  res.json({
    success: true,
    data: result.reservations,
    pagination: {
      total: result.totalCount,
      limit: parseInt(limit),
      offset: parseInt(offset),
    },
  });
});

/**
 * Get upcoming arrivals
 * GET /api/v1/properties/:propertyId/arrivals
 */
const getUpcomingArrivals = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;
  const { daysAhead = 7 } = req.query;

  const arrivals = await bookingRepository.findUpcomingArrivals(propertyId, parseInt(daysAhead));

  res.json({
    success: true,
    data: arrivals,
  });
});

/**
 * Get current reservations
 * GET /api/v1/properties/:propertyId/current-reservations
 */
const getCurrentReservations = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;

  const reservations = await bookingRepository.findCurrentReservations(propertyId);

  res.json({
    success: true,
    data: reservations,
  });
});

/**
 * Check-in guest
 * POST /api/v1/bookings/:id/check-in
 */
const checkIn = asyncHandler(async (req, res) => {
  const { roomId } = req.body;

  const reservation = await bookingService.checkIn(req.params.id, roomId);

  res.json({
    success: true,
    message: 'Guest checked in successfully',
    data: reservation,
  });
});

/**
 * Check-out guest
 * POST /api/v1/bookings/:id/check-out
 */
const checkOut = asyncHandler(async (req, res) => {
  const { foodAndBeverage, spa, laundry, other } = req.body;

  const result = await bookingService.checkOut(req.params.id, {
    foodAndBeverage: foodAndBeverage || 0,
    spa: spa || 0,
    laundry: laundry || 0,
    other: other || 0,
  });

  res.json({
    success: true,
    message: 'Guest checked out successfully',
    data: {
      reservation: result.reservation,
      invoice: result.invoice,
    },
  });
});

/**
 * Cancel booking
 * POST /api/v1/bookings/:id/cancel
 */
const cancelBooking = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const reservation = await bookingService.cancelBooking(req.params.id, reason);

  res.json({
    success: true,
    message: 'Booking cancelled successfully',
    data: reservation,
  });
});

/**
 * Check availability
 * POST /api/v1/bookings/availability/check
 */
const checkAvailability = asyncHandler(async (req, res) => {
  const { propertyId, categoryId, checkInDate, checkOutDate } = req.body;

  const availableRooms = await bookingService.checkAvailability(
    propertyId,
    categoryId,
    checkInDate,
    checkOutDate
  );

  res.json({
    success: true,
    data: availableRooms,
  });
});

export const bookingController = {
  createBooking,
  getBooking,
  getBookingsByProperty,
  getUpcomingArrivals,
  getCurrentReservations,
  checkIn,
  checkOut,
  cancelBooking,
  checkAvailability,
};
