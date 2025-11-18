import { darshanService } from '../services/darshan.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { logger } from '../config/logger.js';

export const bookDarshan = asyncHandler(async (req, res) => {
  const bookingData = {
    ...req.body,
    temple_id: req.user.temple_id,
    created_by: req.user.id,
  };

  const booking = await darshanService.bookDarshan(bookingData);

  logger.info(`Darshan booked: ${booking.booking_id}`);

  res.status(201).json({
    success: true,
    message: 'Darshan booked successfully',
    data: booking,
  });
});

export const getBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const booking = await darshanService.getBooking(id);

  res.json({
    success: true,
    data: booking,
  });
});

export const getDaySchedule = asyncHandler(async (req, res) => {
  const { date } = req.query;
  const templeId = req.user.temple_id;

  const bookings = await darshanService.getDaySchedule(templeId, date);

  res.json({
    success: true,
    data: bookings,
    count: bookings.length,
  });
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const booking = await darshanService.updateBookingStatus(id, status);

  logger.info(`Darshan booking status updated: ${id} -> ${status}`);

  res.json({
    success: true,
    message: 'Status updated successfully',
    data: booking,
  });
});

export const getDailyStats = asyncHandler(async (req, res) => {
  const { date } = req.query;
  const templeId = req.user.temple_id;

  const stats = await darshanService.getDailyStats(templeId, date);

  res.json({
    success: true,
    data: stats,
  });
});

export default { bookDarshan, getBooking, getDaySchedule, updateBookingStatus, getDailyStats };
