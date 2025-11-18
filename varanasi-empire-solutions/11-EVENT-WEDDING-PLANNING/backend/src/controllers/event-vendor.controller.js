import eventVendorService from '../services/event-vendor.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Controller for event vendor booking endpoints
 */
class EventVendorController {
  /**
   * @route   POST /api/event-vendors
   * @desc    Create a new vendor booking
   * @access  Private
   */
  createBooking = asyncHandler(async (req, res) => {
    const booking = await eventVendorService.createBooking(req.body);

    res.status(201).json({
      success: true,
      message: 'Vendor booked successfully',
      data: booking,
    });
  });

  /**
   * @route   GET /api/event-vendors
   * @desc    Get all bookings with filters
   * @access  Private
   */
  getBookings = asyncHandler(async (req, res) => {
    const filters = {
      event_id: req.query.event_id,
      vendor_id: req.query.vendor_id,
      payment_status: req.query.payment_status,
      booking_status: req.query.booking_status,
      limit: req.query.limit ? parseInt(req.query.limit) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset) : undefined,
    };

    const bookings = await eventVendorService.getBookings(filters);

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  });

  /**
   * @route   GET /api/event-vendors/:id
   * @desc    Get booking by ID
   * @access  Private
   */
  getBookingById = asyncHandler(async (req, res) => {
    const booking = await eventVendorService.getBookingById(req.params.id);

    res.json({
      success: true,
      data: booking,
    });
  });

  /**
   * @route   GET /api/event-vendors/event/:eventId
   * @desc    Get bookings for an event
   * @access  Private
   */
  getEventBookings = asyncHandler(async (req, res) => {
    const bookings = await eventVendorService.getEventBookings(req.params.eventId);

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  });

  /**
   * @route   GET /api/event-vendors/vendor/:vendorId
   * @desc    Get bookings for a vendor
   * @access  Private
   */
  getVendorBookings = asyncHandler(async (req, res) => {
    const bookings = await eventVendorService.getVendorBookings(req.params.vendorId);

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  });

  /**
   * @route   GET /api/event-vendors/pending-payments
   * @desc    Get bookings with pending payments
   * @access  Private
   */
  getPendingPayments = asyncHandler(async (req, res) => {
    const { event_id } = req.query;
    const bookings = await eventVendorService.getPendingPayments(event_id);

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  });

  /**
   * @route   GET /api/event-vendors/event/:eventId/summary
   * @desc    Get event vendor summary
   * @access  Private
   */
  getEventVendorSummary = asyncHandler(async (req, res) => {
    const summary = await eventVendorService.getEventVendorSummary(req.params.eventId);

    res.json({
      success: true,
      data: summary,
    });
  });

  /**
   * @route   GET /api/event-vendors/vendor/:vendorId/payment-summary
   * @desc    Get vendor payment summary
   * @access  Private
   */
  getVendorPaymentSummary = asyncHandler(async (req, res) => {
    const summary = await eventVendorService.getVendorPaymentSummary(req.params.vendorId);

    res.json({
      success: true,
      data: summary,
    });
  });

  /**
   * @route   PUT /api/event-vendors/:id
   * @desc    Update booking
   * @access  Private
   */
  updateBooking = asyncHandler(async (req, res) => {
    const booking = await eventVendorService.updateBooking(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: booking,
    });
  });

  /**
   * @route   PUT /api/event-vendors/:id/payment
   * @desc    Record payment for booking
   * @access  Private
   */
  recordPayment = asyncHandler(async (req, res) => {
    const { payment_amount } = req.body;

    if (!payment_amount) {
      return res.status(400).json({
        success: false,
        message: 'Payment amount is required',
      });
    }

    const booking = await eventVendorService.recordPayment(req.params.id, payment_amount);

    res.json({
      success: true,
      message: 'Payment recorded successfully',
      data: booking,
    });
  });

  /**
   * @route   PUT /api/event-vendors/:id/status
   * @desc    Update booking status
   * @access  Private
   */
  updateBookingStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
      });
    }

    const booking = await eventVendorService.updateBookingStatus(req.params.id, status);

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking,
    });
  });

  /**
   * @route   POST /api/event-vendors/calculate-payment
   * @desc    Calculate payment breakdown
   * @access  Private
   */
  calculatePaymentBreakdown = asyncHandler(async (req, res) => {
    const { final_price, advance_percentage } = req.body;

    if (!final_price) {
      return res.status(400).json({
        success: false,
        message: 'Final price is required',
      });
    }

    const breakdown = eventVendorService.calculatePaymentBreakdown(
      final_price,
      advance_percentage
    );

    res.json({
      success: true,
      data: breakdown,
    });
  });

  /**
   * @route   DELETE /api/event-vendors/:id
   * @desc    Delete booking
   * @access  Private
   */
  deleteBooking = asyncHandler(async (req, res) => {
    await eventVendorService.deleteBooking(req.params.id);

    res.json({
      success: true,
      message: 'Booking deleted successfully',
    });
  });
}

export default new EventVendorController();
