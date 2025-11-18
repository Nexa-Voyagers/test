import Joi from 'joi';
import paymentService from '../services/payment.service.js';
import { asyncHandler } from '../asyncHandler.js';
import { ValidationError } from '../errors.js';

/**
 * Payment Controller
 * Handles HTTP requests for fee payment management
 */

// Validation schemas
const recordPaymentSchema = Joi.object({
  enrollment_id: Joi.number().integer().required(),
  payment_date: Joi.date().optional(),
  amount: Joi.number().min(0.01).required(),
  payment_method: Joi.string().valid('CASH', 'CARD', 'UPI', 'BANK_TRANSFER', 'CHEQUE').required(),
  transaction_id: Joi.string().optional().allow('', null),
  received_by: Joi.string().required(),
  remarks: Joi.string().optional().allow('', null)
});

const updatePaymentSchema = Joi.object({
  payment_method: Joi.string().valid('CASH', 'CARD', 'UPI', 'BANK_TRANSFER', 'CHEQUE').optional(),
  transaction_id: Joi.string().optional().allow('', null),
  remarks: Joi.string().optional().allow('', null)
});

/**
 * @route   POST /api/v1/payments
 * @desc    Record a fee payment
 * @access  Private
 */
export const recordPayment = asyncHandler(async (req, res) => {
  const { error, value } = recordPaymentSchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const payment = await paymentService.recordPayment(value);

  res.status(201).json({
    success: true,
    message: 'Payment recorded successfully',
    data: payment
  });
});

/**
 * @route   GET /api/v1/payments/:id
 * @desc    Get payment by ID
 * @access  Private
 */
export const getPaymentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const payment = await paymentService.getPaymentById(parseInt(id));

  res.status(200).json({
    success: true,
    data: payment
  });
});

/**
 * @route   GET /api/v1/payments
 * @desc    Get all payments
 * @access  Private
 */
export const getAllPayments = asyncHandler(async (req, res) => {
  const { enrollment_id, student_id, batch_id, institute_id, payment_method, date_from, date_to } = req.query;

  const filters = {};
  if (enrollment_id) filters.enrollment_id = parseInt(enrollment_id);
  if (student_id) filters.student_id = parseInt(student_id);
  if (batch_id) filters.batch_id = parseInt(batch_id);
  if (institute_id) filters.institute_id = parseInt(institute_id);
  if (payment_method) filters.payment_method = payment_method;
  if (date_from) filters.date_from = date_from;
  if (date_to) filters.date_to = date_to;

  const payments = await paymentService.getAllPayments(filters);

  res.status(200).json({
    success: true,
    count: payments.length,
    data: payments
  });
});

/**
 * @route   PUT /api/v1/payments/:id
 * @desc    Update payment
 * @access  Private
 */
export const updatePayment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error, value } = updatePaymentSchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const payment = await paymentService.updatePayment(parseInt(id), value);

  res.status(200).json({
    success: true,
    message: 'Payment updated successfully',
    data: payment
  });
});

/**
 * @route   DELETE /api/v1/payments/:id
 * @desc    Delete payment (refund scenario)
 * @access  Private
 */
export const deletePayment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await paymentService.deletePayment(parseInt(id));

  res.status(200).json({
    success: true,
    message: 'Payment deleted (refunded) successfully'
  });
});

/**
 * @route   GET /api/v1/enrollments/:enrollmentId/payment-history
 * @desc    Get payment history for an enrollment
 * @access  Private
 */
export const getPaymentHistory = asyncHandler(async (req, res) => {
  const { enrollmentId } = req.params;
  const history = await paymentService.getPaymentHistory(parseInt(enrollmentId));

  res.status(200).json({
    success: true,
    count: history.length,
    data: history
  });
});

/**
 * @route   GET /api/v1/institutes/:instituteId/pending-payments
 * @desc    Get pending payments
 * @access  Private
 */
export const getPendingPayments = asyncHandler(async (req, res) => {
  const { instituteId } = req.params;
  const pending = await paymentService.getPendingPayments(parseInt(instituteId));

  res.status(200).json({
    success: true,
    count: pending.length,
    data: pending
  });
});

/**
 * @route   GET /api/v1/payments/statistics
 * @desc    Get payment statistics
 * @access  Private
 */
export const getPaymentStatistics = asyncHandler(async (req, res) => {
  const { institute_id, date_from, date_to } = req.query;

  const filters = {};
  if (institute_id) filters.institute_id = parseInt(institute_id);
  if (date_from) filters.date_from = date_from;
  if (date_to) filters.date_to = date_to;

  const statistics = await paymentService.getPaymentStatistics(filters);

  res.status(200).json({
    success: true,
    data: statistics
  });
});

/**
 * @route   GET /api/v1/institutes/:instituteId/daily-collection
 * @desc    Get daily collection report
 * @access  Private
 */
export const getDailyCollection = asyncHandler(async (req, res) => {
  const { instituteId } = req.params;
  const { date } = req.query;

  const report = await paymentService.getDailyCollection(parseInt(instituteId), date);

  res.status(200).json({
    success: true,
    data: report
  });
});

/**
 * @route   GET /api/v1/payments/:paymentId/receipt
 * @desc    Generate payment receipt
 * @access  Private
 */
export const generateReceipt = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;
  const receipt = await paymentService.generateReceipt(parseInt(paymentId));

  res.status(200).json({
    success: true,
    data: receipt
  });
});
