import eventVendorRepository from '../repositories/event-vendor.repository.js';
import eventRepository from '../repositories/event.repository.js';
import { ValidationError } from '../utils/errors.js';

/**
 * Service for event vendor booking business logic
 */
class EventVendorService {
  /**
   * Create a new vendor booking
   * @param {Object} bookingData - Booking data
   * @returns {Promise<Object>} Created booking
   */
  async createBooking(bookingData) {
    // Validate required fields
    const errors = this.validateBookingData(bookingData);
    if (errors.length > 0) {
      throw new ValidationError(errors);
    }

    // Check if vendor is already booked for this event
    const isBooked = await eventVendorRepository.isVendorBooked(
      bookingData.event_id,
      bookingData.vendor_id
    );

    if (isBooked) {
      throw new ValidationError([{
        field: 'vendor_id',
        message: 'This vendor is already booked for this event',
      }]);
    }

    // Create booking
    const booking = await eventVendorRepository.create(bookingData);

    // Recalculate event actual cost
    await eventRepository.updateActualCost(bookingData.event_id);

    return booking;
  }

  /**
   * Get all bookings with filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of bookings
   */
  async getBookings(filters = {}) {
    return await eventVendorRepository.findAll(filters);
  }

  /**
   * Get booking by ID
   * @param {string} id - Booking ID
   * @returns {Promise<Object>} Booking data
   */
  async getBookingById(id) {
    return await eventVendorRepository.findById(id);
  }

  /**
   * Get bookings for an event
   * @param {string} eventId - Event ID
   * @returns {Promise<Array>} Event bookings
   */
  async getEventBookings(eventId) {
    return await eventVendorRepository.findByEventId(eventId);
  }

  /**
   * Get bookings for a vendor
   * @param {string} vendorId - Vendor ID
   * @returns {Promise<Array>} Vendor bookings
   */
  async getVendorBookings(vendorId) {
    return await eventVendorRepository.findByVendorId(vendorId);
  }

  /**
   * Update booking
   * @param {string} id - Booking ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated booking
   */
  async updateBooking(id, updateData) {
    const booking = await eventVendorRepository.update(id, updateData);

    // Recalculate event actual cost if price changed
    if (updateData.final_price !== undefined) {
      await eventRepository.updateActualCost(booking.event_id);
    }

    return booking;
  }

  /**
   * Record payment for booking
   * @param {string} id - Booking ID
   * @param {number} paymentAmount - Payment amount
   * @returns {Promise<Object>} Updated booking
   */
  async recordPayment(id, paymentAmount) {
    if (!paymentAmount || paymentAmount <= 0) {
      throw new ValidationError([{
        field: 'payment_amount',
        message: 'Payment amount must be greater than 0',
      }]);
    }

    const booking = await eventVendorRepository.findById(id);

    // Check if payment exceeds balance
    if (paymentAmount > booking.balance_amount) {
      throw new ValidationError([{
        field: 'payment_amount',
        message: 'Payment amount exceeds balance amount',
      }]);
    }

    return await eventVendorRepository.updatePayment(id, paymentAmount);
  }

  /**
   * Update booking status
   * @param {string} id - Booking ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated booking
   */
  async updateBookingStatus(id, status) {
    return await eventVendorRepository.updateStatus(id, status);
  }

  /**
   * Get bookings with pending payments
   * @param {string} eventId - Event ID (optional)
   * @returns {Promise<Array>} Pending bookings
   */
  async getPendingPayments(eventId = null) {
    return await eventVendorRepository.getPendingPayments(eventId);
  }

  /**
   * Get event vendor summary
   * @param {string} eventId - Event ID
   * @returns {Promise<Object>} Vendor summary
   */
  async getEventVendorSummary(eventId) {
    return await eventVendorRepository.getEventVendorSummary(eventId);
  }

  /**
   * Get vendor payment summary
   * @param {string} vendorId - Vendor ID
   * @returns {Promise<Object>} Payment summary
   */
  async getVendorPaymentSummary(vendorId) {
    return await eventVendorRepository.getVendorPaymentSummary(vendorId);
  }

  /**
   * Delete booking
   * @param {string} id - Booking ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteBooking(id) {
    const booking = await eventVendorRepository.findById(id);
    const result = await eventVendorRepository.delete(id);

    // Recalculate event actual cost
    await eventRepository.updateActualCost(booking.event_id);

    return result;
  }

  /**
   * Calculate payment breakdown
   * @param {number} finalPrice - Final price
   * @param {number} advancePercentage - Advance percentage (default 30%)
   * @returns {Object} Payment breakdown
   */
  calculatePaymentBreakdown(finalPrice, advancePercentage = 30) {
    const advance = (finalPrice * advancePercentage) / 100;
    const balance = finalPrice - advance;

    return {
      final_price: finalPrice,
      advance_amount: advance,
      balance_amount: balance,
      advance_percentage: advancePercentage,
    };
  }

  /**
   * Validate booking data
   * @param {Object} bookingData - Booking data
   * @returns {Array} Validation errors
   */
  validateBookingData(bookingData) {
    const errors = [];

    if (!bookingData.event_id) {
      errors.push({ field: 'event_id', message: 'Event is required' });
    }

    if (!bookingData.vendor_id) {
      errors.push({ field: 'vendor_id', message: 'Vendor is required' });
    }

    if (!bookingData.final_price || bookingData.final_price <= 0) {
      errors.push({ field: 'final_price', message: 'Final price must be greater than 0' });
    }

    if (bookingData.advance_paid && bookingData.final_price) {
      if (bookingData.advance_paid > bookingData.final_price) {
        errors.push({
          field: 'advance_paid',
          message: 'Advance paid cannot exceed final price',
        });
      }
    }

    return errors;
  }
}

export default new EventVendorService();
