import { bookingRepository } from '../repositories/booking.repository.js';
import { roomRepository } from '../repositories/room.repository.js';
import { guestRepository } from '../repositories/guest.repository.js';
import { invoiceRepository } from '../repositories/invoice.repository.js';
import { AppError, ConflictError, NotFoundError, ValidationError } from '../utils/errors.js';
import { v4 as uuidv4 } from 'uuid';

const GST_RATE = parseFloat(process.env.GST_RATE || 18) / 100;

/**
 * Check room availability
 * @param {string} propertyId - Property ID
 * @param {string} categoryId - Room category ID
 * @param {string} checkInDate - Check-in date
 * @param {string} checkOutDate - Check-out date
 * @returns {Promise<Array>} Available rooms
 */
const checkAvailability = async (propertyId, categoryId, checkInDate, checkOutDate) => {
  const availableRooms = await roomRepository.findAvailableRooms(
    propertyId,
    categoryId,
    checkInDate,
    checkOutDate
  );

  if (availableRooms.length === 0) {
    throw new ConflictError('No rooms available for the selected dates');
  }

  return availableRooms;
};

/**
 * Calculate room pricing with GST
 * @param {number} basePrice - Base room price
 * @param {number} nights - Number of nights
 * @param {Object} options - Pricing options
 * @returns {Object} Pricing breakdown
 */
const calculatePricing = (basePrice, nights, options = {}) => {
  const roomTotal = basePrice * nights;
  const subtotal = roomTotal + (options.extraCharges || 0);
  const cgst = (subtotal * GST_RATE) / 2;
  const sgst = (subtotal * GST_RATE) / 2;
  const serviceCharge = options.serviceCharge || 0;
  const discount = options.discount || 0;

  const totalAmount = subtotal + cgst + sgst + serviceCharge - discount;

  return {
    roomTotal,
    extraCharges: options.extraCharges || 0,
    subtotal,
    cgstAmount: cgst,
    sgstAmount: sgst,
    serviceCharge,
    discountAmount: discount,
    totalAmount,
  };
};

/**
 * Create booking
 * @param {Object} bookingData - Booking data
 * @returns {Promise<Object>} Created booking
 */
const createBooking = async (bookingData) => {
  // Check availability
  const availableRooms = await checkAvailability(
    bookingData.property_id,
    bookingData.room_category_id,
    bookingData.check_in_date,
    bookingData.check_out_date
  );

  // Get or create guest
  let guest = await guestRepository.findByEmail(bookingData.guest_email);
  if (!guest) {
    guest = await guestRepository.create({
      first_name: bookingData.guest_first_name,
      last_name: bookingData.guest_last_name,
      email: bookingData.guest_email,
      phone: bookingData.guest_phone,
    });
  }

  // Calculate nights
  const checkInDate = new Date(bookingData.check_in_date);
  const checkOutDate = new Date(bookingData.check_out_date);
  const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

  // Calculate pricing
  const pricing = calculatePricing(bookingData.room_price, nights, {
    extraCharges: bookingData.extra_charges || 0,
    serviceCharge: bookingData.service_charge || 0,
    discount: bookingData.discount || 0,
  });

  // Generate booking reference
  const bookingReference = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase();

  // Create reservation
  const reservation = await bookingRepository.create({
    property_id: bookingData.property_id,
    primary_guest_id: guest.id,
    booking_reference: bookingReference,
    check_in_date: bookingData.check_in_date,
    check_out_date: bookingData.check_out_date,
    nights,
    adults: bookingData.adults || 1,
    children: bookingData.children || 0,
    booking_source: bookingData.booking_source || 'WEBSITE_DIRECT',
    status: bookingData.status || 'CONFIRMED',
    room_total: pricing.roomTotal,
    subtotal: pricing.subtotal,
    cgst_amount: pricing.cgstAmount,
    sgst_amount: pricing.sgstAmount,
    total_amount: pricing.totalAmount,
    payment_status: bookingData.payment_status || 'PENDING',
    created_by: bookingData.created_by,
  });

  return {
    reservation,
    guest,
    pricing,
    availableRooms,
  };
};

/**
 * Check-in guest
 * @param {string} reservationId - Reservation ID
 * @param {string} roomId - Room ID
 * @returns {Promise<Object>} Updated reservation
 */
const checkIn = async (reservationId, roomId) => {
  const reservation = await bookingRepository.findById(reservationId);
  if (!reservation) {
    throw new NotFoundError('Reservation');
  }

  if (reservation.status === 'CHECKED_IN') {
    throw new ConflictError('Guest already checked in');
  }

  // Update reservation status
  const updatedReservation = await bookingRepository.update(reservationId, {
    status: 'CHECKED_IN',
    actual_check_in_time: new Date().toISOString(),
  });

  // Update room status
  await roomRepository.updateStatus(roomId, 'OCCUPIED');

  return updatedReservation;
};

/**
 * Check-out guest and generate invoice
 * @param {string} reservationId - Reservation ID
 * @param {Object} charges - Additional charges
 * @returns {Promise<Object>} Invoice and updated reservation
 */
const checkOut = async (reservationId, charges = {}) => {
  const reservation = await bookingRepository.findById(reservationId);
  if (!reservation) {
    throw new NotFoundError('Reservation');
  }

  if (reservation.status !== 'CHECKED_IN') {
    throw new ConflictError('Guest is not checked in');
  }

  // Update reservation status
  const updatedReservation = await bookingRepository.update(reservationId, {
    status: 'CHECKED_OUT',
    actual_check_out_time: new Date().toISOString(),
    f_and_b_total: charges.foodAndBeverage || 0,
    spa_total: charges.spa || 0,
    laundry_total: charges.laundry || 0,
    other_charges: charges.other || 0,
  });

  // Calculate total charges
  const totalAdditionalCharges = (charges.foodAndBeverage || 0) +
    (charges.spa || 0) +
    (charges.laundry || 0) +
    (charges.other || 0);

  const newSubtotal = updatedReservation.room_total + totalAdditionalCharges;
  const gstAmount = newSubtotal * GST_RATE;
  const newTotal = newSubtotal + gstAmount;

  // Update reservation with new totals
  await bookingRepository.update(reservationId, {
    subtotal: newSubtotal,
    cgst_amount: gstAmount / 2,
    sgst_amount: gstAmount / 2,
    total_amount: newTotal,
  });

  // Create invoice
  const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase();
  const invoice = await invoiceRepository.create({
    reservation_id: reservationId,
    property_id: reservation.property_id,
    guest_id: reservation.primary_guest_id,
    invoice_number: invoiceNumber,
    room_charges: reservation.room_total,
    food_beverage: charges.foodAndBeverage || 0,
    spa_charges: charges.spa || 0,
    laundry_charges: charges.laundry || 0,
    other_charges: charges.other || 0,
    subtotal: newSubtotal,
    payment_status: 'PENDING',
  });

  // Update guest stay statistics
  await guestRepository.updateStayStats(
    reservation.primary_guest_id,
    reservation.nights,
    newTotal
  );

  // Award loyalty points (1 point per rupee spent)
  await guestRepository.updateLoyaltyPoints(
    reservation.primary_guest_id,
    Math.floor(newTotal)
  );

  return {
    reservation: updatedReservation,
    invoice,
  };
};

/**
 * Cancel booking
 * @param {string} reservationId - Reservation ID
 * @param {string} reason - Cancellation reason
 * @returns {Promise<Object>} Cancelled reservation
 */
const cancelBooking = async (reservationId, reason = '') => {
  const reservation = await bookingRepository.findById(reservationId);
  if (!reservation) {
    throw new NotFoundError('Reservation');
  }

  if (['CHECKED_OUT', 'CANCELLED', 'NO_SHOW'].includes(reservation.status)) {
    throw new ConflictError('Cannot cancel this reservation');
  }

  // Calculate refund (with 48-hour cancellation policy)
  const checkInDate = new Date(reservation.check_in_date);
  const now = new Date();
  const hoursUntilCheckIn = (checkInDate - now) / (1000 * 60 * 60);
  let refundAmount = reservation.total_amount;

  if (hoursUntilCheckIn < 48) {
    refundAmount = reservation.total_amount * 0.5; // 50% refund within 48 hours
  }

  const updatedReservation = await bookingRepository.update(reservationId, {
    status: 'CANCELLED',
    cancelled_at: new Date().toISOString(),
    cancellation_reason: reason,
    refund_amount: refundAmount,
    payment_status: 'REFUNDED',
  });

  return updatedReservation;
};

/**
 * Get occupancy rate for date range
 * @param {string} propertyId - Property ID
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {Promise<number>} Occupancy percentage
 */
const getOccupancyRate = async (propertyId, startDate, endDate) => {
  // This would query the reservations table
  // Returns occupancy percentage for the date range
  return 75; // Placeholder
};

export const bookingService = {
  checkAvailability,
  calculatePricing,
  createBooking,
  checkIn,
  checkOut,
  cancelBooking,
  getOccupancyRate,
};
