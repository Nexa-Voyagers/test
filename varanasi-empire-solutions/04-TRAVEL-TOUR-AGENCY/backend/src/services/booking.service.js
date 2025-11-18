import { bookingRepository } from '../repositories/booking.repository.js';
import { customerRepository } from '../repositories/customer.repository.js';
import { tourPackageRepository } from '../repositories/tourPackage.repository.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';

const generateBookingNumber = () => `TRV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

const createBooking = async (bookingData) => {
  const customer = await customerRepository.findById(bookingData.customer_id);
  if (!customer) {
    throw new NotFoundError('Customer');
  }

  const tourPackage = await tourPackageRepository.findById(bookingData.package_id);
  if (!tourPackage) {
    throw new NotFoundError('Tour package');
  }

  const totalAmount = tourPackage.price_per_person * bookingData.number_of_travelers;

  const booking = await bookingRepository.createBooking({
    ...bookingData,
    booking_number: generateBookingNumber(),
    total_amount: totalAmount,
  });

  return booking;
};

const getBooking = async (id) => {
  const booking = await bookingRepository.findById(id);
  if (!booking) {
    throw new NotFoundError('Booking');
  }
  return booking;
};

const getBookingByNumber = async (bookingNumber) => {
  const booking = await bookingRepository.findByBookingNumber(bookingNumber);
  if (!booking) {
    throw new NotFoundError('Booking');
  }
  return booking;
};

const getAgencyBookings = async (agencyId, filters) => {
  const bookings = await bookingRepository.findByAgency(agencyId, filters);
  return bookings;
};

const updateBookingStatus = async (id, status) => {
  const booking = await bookingRepository.findById(id);
  if (!booking) {
    throw new NotFoundError('Booking');
  }

  const validStatuses = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
  if (!validStatuses.includes(status)) {
    throw new ValidationError([{ field: 'status', message: 'Invalid status' }]);
  }

  const updated = await bookingRepository.updateStatus(id, status);
  return updated;
};

const addPayment = async (bookingId, amount, paymentMethod) => {
  const booking = await bookingRepository.findById(bookingId);
  if (!booking) {
    throw new NotFoundError('Booking');
  }

  if (amount <= 0) {
    throw new ValidationError([{ field: 'amount', message: 'Amount must be greater than 0' }]);
  }

  const updated = await bookingRepository.addPayment(bookingId, amount, paymentMethod);
  return updated;
};

const getBookingStats = async (agencyId, startDate, endDate) => {
  const stats = await bookingRepository.getBookingStats(agencyId, startDate, endDate);
  return stats;
};

export const bookingService = {
  createBooking,
  getBooking,
  getBookingByNumber,
  getAgencyBookings,
  updateBookingStatus,
  addPayment,
  getBookingStats,
};

export default bookingService;
