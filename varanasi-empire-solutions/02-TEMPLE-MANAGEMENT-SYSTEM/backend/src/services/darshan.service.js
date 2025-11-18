import { darshanRepository } from '../repositories/darshan.repository.js';
import { devoteeRepository } from '../repositories/devotee.repository.js';
import { NotFoundError, ValidationError, ConflictError } from '../utils/errors.js';

const generateBookingId = () => `DARSHAN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

const bookDarshan = async (bookingData) => {
  const devotee = await devoteeRepository.findById(bookingData.devotee_id);
  if (!devotee) {
    throw new NotFoundError('Devotee');
  }

  const availability = await darshanRepository.checkSlotAvailability(
    bookingData.temple_id,
    bookingData.darshan_date,
    bookingData.darshan_slot,
    bookingData.darshan_type
  );

  const maxCapacity = bookingData.darshan_type === 'VIP' ? 50 : 500;
  const currentOccupancy = parseInt(availability.total_devotees || 0);

  if (currentOccupancy + bookingData.number_of_devotees > maxCapacity) {
    throw new ConflictError('Slot is full. Please choose another slot.');
  }

  const booking = await darshanRepository.createBooking({
    ...bookingData,
    booking_id: generateBookingId(),
  });

  return booking;
};

const getBooking = async (id) => {
  const booking = await darshanRepository.findById(id);
  if (!booking) {
    throw new NotFoundError('Booking');
  }
  return booking;
};

const getDaySchedule = async (templeId, date) => {
  const bookings = await darshanRepository.findByDate(templeId, date);
  return bookings;
};

const updateBookingStatus = async (id, status) => {
  const booking = await darshanRepository.findById(id);
  if (!booking) {
    throw new NotFoundError('Booking');
  }

  const validStatuses = ['CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];
  if (!validStatuses.includes(status)) {
    throw new ValidationError([{ field: 'status', message: 'Invalid status' }]);
  }

  const updated = await darshanRepository.updateStatus(id, status);
  return updated;
};

const getDailyStats = async (templeId, date) => {
  const stats = await darshanRepository.getDailyStats(templeId, date);
  return stats;
};

export const darshanService = {
  bookDarshan,
  getBooking,
  getDaySchedule,
  updateBookingStatus,
  getDailyStats,
};

export default darshanService;
