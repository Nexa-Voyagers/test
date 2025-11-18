import paymentService from '../services/payment.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Controller for payment endpoints
 */
class PaymentController {
  /**
   * @route   POST /api/payments
   * @desc    Create a new payment record
   * @access  Private
   */
  createPayment = asyncHandler(async (req, res) => {
    const payment = await paymentService.createPayment(req.body);

    res.status(201).json({
      success: true,
      message: 'Payment recorded successfully',
      data: payment,
    });
  });

  /**
   * @route   POST /api/payments/client
   * @desc    Record client payment
   * @access  Private
   */
  recordClientPayment = asyncHandler(async (req, res) => {
    const payment = await paymentService.recordClientPayment(req.body);

    res.status(201).json({
      success: true,
      message: 'Client payment recorded successfully',
      data: payment,
    });
  });

  /**
   * @route   POST /api/payments/vendor
   * @desc    Record vendor payment
   * @access  Private
   */
  recordVendorPayment = asyncHandler(async (req, res) => {
    const payment = await paymentService.recordVendorPayment(req.body);

    res.status(201).json({
      success: true,
      message: 'Vendor payment recorded successfully',
      data: payment,
    });
  });

  /**
   * @route   POST /api/payments/calculate-schedule
   * @desc    Calculate payment schedule
   * @access  Private
   */
  calculatePaymentSchedule = asyncHandler(async (req, res) => {
    const { total_amount, installments, start_date } = req.body;

    if (!total_amount) {
      return res.status(400).json({
        success: false,
        message: 'Total amount is required',
      });
    }

    const schedule = paymentService.calculatePaymentSchedule(
      total_amount,
      installments,
      start_date
    );

    res.json({
      success: true,
      data: schedule,
    });
  });

  /**
   * @route   GET /api/payments
   * @desc    Get all payments with filters
   * @access  Private
   */
  getPayments = asyncHandler(async (req, res) => {
    const filters = {
      event_id: req.query.event_id,
      payment_type: req.query.payment_type,
      payment_mode: req.query.payment_mode,
      date_from: req.query.date_from,
      date_to: req.query.date_to,
      payment_to: req.query.payment_to,
      limit: req.query.limit ? parseInt(req.query.limit) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset) : undefined,
    };

    const payments = await paymentService.getPayments(filters);

    res.json({
      success: true,
      count: payments.length,
      data: payments,
    });
  });

  /**
   * @route   GET /api/payments/recent
   * @desc    Get recent payments
   * @access  Private
   */
  getRecentPayments = asyncHandler(async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const { company_id } = req.query;

    const payments = await paymentService.getRecentPayments(limit, company_id);

    res.json({
      success: true,
      data: payments,
    });
  });

  /**
   * @route   GET /api/payments/:id
   * @desc    Get payment by ID
   * @access  Private
   */
  getPaymentById = asyncHandler(async (req, res) => {
    const payment = await paymentService.getPaymentById(req.params.id);

    res.json({
      success: true,
      data: payment,
    });
  });

  /**
   * @route   GET /api/payments/event/:eventId
   * @desc    Get payments for an event
   * @access  Private
   */
  getEventPayments = asyncHandler(async (req, res) => {
    const payments = await paymentService.getEventPayments(req.params.eventId);

    res.json({
      success: true,
      count: payments.length,
      data: payments,
    });
  });

  /**
   * @route   GET /api/payments/event/:eventId/client
   * @desc    Get client payments for an event
   * @access  Private
   */
  getClientPayments = asyncHandler(async (req, res) => {
    const payments = await paymentService.getClientPayments(req.params.eventId);

    res.json({
      success: true,
      count: payments.length,
      data: payments,
    });
  });

  /**
   * @route   GET /api/payments/event/:eventId/vendor
   * @desc    Get vendor payments for an event
   * @access  Private
   */
  getVendorPayments = asyncHandler(async (req, res) => {
    const payments = await paymentService.getVendorPayments(req.params.eventId);

    res.json({
      success: true,
      count: payments.length,
      data: payments,
    });
  });

  /**
   * @route   GET /api/payments/event/:eventId/summary
   * @desc    Get payment summary for an event
   * @access  Private
   */
  getEventPaymentSummary = asyncHandler(async (req, res) => {
    const summary = await paymentService.getEventPaymentSummary(req.params.eventId);

    res.json({
      success: true,
      data: summary,
    });
  });

  /**
   * @route   GET /api/payments/statistics/by-type
   * @desc    Get payment statistics by type
   * @access  Private
   */
  getPaymentStatisticsByType = asyncHandler(async (req, res) => {
    const { event_id } = req.query;
    const statistics = await paymentService.getPaymentStatisticsByType(event_id);

    res.json({
      success: true,
      data: statistics,
    });
  });

  /**
   * @route   GET /api/payments/statistics/by-mode
   * @desc    Get payment statistics by mode
   * @access  Private
   */
  getPaymentStatisticsByMode = asyncHandler(async (req, res) => {
    const { event_id } = req.query;
    const statistics = await paymentService.getPaymentStatisticsByMode(event_id);

    res.json({
      success: true,
      data: statistics,
    });
  });

  /**
   * @route   GET /api/payments/history
   * @desc    Get payment history with summary
   * @access  Private
   */
  getPaymentHistory = asyncHandler(async (req, res) => {
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required',
      });
    }

    const history = await paymentService.getPaymentHistoryWithSummary(start_date, end_date);

    res.json({
      success: true,
      data: history,
    });
  });

  /**
   * @route   GET /api/payments/trends/monthly
   * @desc    Get monthly payment trends
   * @access  Private
   */
  getMonthlyTrends = asyncHandler(async (req, res) => {
    const months = req.query.months ? parseInt(req.query.months) : 12;
    const { company_id } = req.query;

    const trends = await paymentService.getMonthlyPaymentTrends(months, company_id);

    res.json({
      success: true,
      data: trends,
    });
  });

  /**
   * @route   PUT /api/payments/:id
   * @desc    Update payment
   * @access  Private
   */
  updatePayment = asyncHandler(async (req, res) => {
    const payment = await paymentService.updatePayment(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Payment updated successfully',
      data: payment,
    });
  });

  /**
   * @route   DELETE /api/payments/:id
   * @desc    Delete payment
   * @access  Private
   */
  deletePayment = asyncHandler(async (req, res) => {
    await paymentService.deletePayment(req.params.id);

    res.json({
      success: true,
      message: 'Payment deleted successfully',
    });
  });
}

export default new PaymentController();
