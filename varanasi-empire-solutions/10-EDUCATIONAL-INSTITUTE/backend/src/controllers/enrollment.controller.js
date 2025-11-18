import Joi from 'joi';
import enrollmentService from '../services/enrollment.service.js';
import { asyncHandler } from '../asyncHandler.js';
import { ValidationError } from '../errors.js';

/**
 * Enrollment Controller
 * Handles HTTP requests for enrollment management
 */

// Validation schemas
const createEnrollmentSchema = Joi.object({
  student_id: Joi.number().integer().required(),
  batch_id: Joi.number().integer().required(),
  enrollment_date: Joi.date().optional(),
  discount_amount: Joi.number().min(0).default(0),
  fee_paid: Joi.number().min(0).default(0),
  enrollment_status: Joi.string().valid('ACTIVE', 'COMPLETED', 'CANCELLED', 'DROPPED').default('ACTIVE')
});

const updateEnrollmentSchema = Joi.object({
  discount_amount: Joi.number().min(0).optional(),
  enrollment_status: Joi.string().valid('ACTIVE', 'COMPLETED', 'CANCELLED', 'DROPPED').optional()
});

/**
 * @route   POST /api/v1/enrollments
 * @desc    Create a new enrollment
 * @access  Private
 */
export const createEnrollment = asyncHandler(async (req, res) => {
  const { error, value } = createEnrollmentSchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const enrollment = await enrollmentService.createEnrollment(value);

  res.status(201).json({
    success: true,
    message: 'Enrollment created successfully',
    data: enrollment
  });
});

/**
 * @route   GET /api/v1/enrollments/:id
 * @desc    Get enrollment by ID
 * @access  Private
 */
export const getEnrollmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const enrollment = await enrollmentService.getEnrollmentById(parseInt(id));

  res.status(200).json({
    success: true,
    data: enrollment
  });
});

/**
 * @route   GET /api/v1/enrollments
 * @desc    Get all enrollments
 * @access  Private
 */
export const getAllEnrollments = asyncHandler(async (req, res) => {
  const { student_id, batch_id, institute_id, payment_status, enrollment_status, has_pending_fee } = req.query;

  const filters = {};
  if (student_id) filters.student_id = parseInt(student_id);
  if (batch_id) filters.batch_id = parseInt(batch_id);
  if (institute_id) filters.institute_id = parseInt(institute_id);
  if (payment_status) filters.payment_status = payment_status;
  if (enrollment_status) filters.enrollment_status = enrollment_status;
  if (has_pending_fee === 'true') filters.has_pending_fee = true;

  const enrollments = await enrollmentService.getAllEnrollments(filters);

  res.status(200).json({
    success: true,
    count: enrollments.length,
    data: enrollments
  });
});

/**
 * @route   PUT /api/v1/enrollments/:id
 * @desc    Update enrollment
 * @access  Private
 */
export const updateEnrollment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error, value } = updateEnrollmentSchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const enrollment = await enrollmentService.updateEnrollment(parseInt(id), value);

  res.status(200).json({
    success: true,
    message: 'Enrollment updated successfully',
    data: enrollment
  });
});

/**
 * @route   PUT /api/v1/enrollments/:id/cancel
 * @desc    Cancel enrollment
 * @access  Private
 */
export const cancelEnrollment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const enrollment = await enrollmentService.cancelEnrollment(parseInt(id));

  res.status(200).json({
    success: true,
    message: 'Enrollment cancelled successfully',
    data: enrollment
  });
});

/**
 * @route   DELETE /api/v1/enrollments/:id
 * @desc    Delete enrollment
 * @access  Private
 */
export const deleteEnrollment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await enrollmentService.deleteEnrollment(parseInt(id));

  res.status(200).json({
    success: true,
    message: 'Enrollment deleted successfully'
  });
});

/**
 * @route   GET /api/v1/institutes/:instituteId/fee-defaulters
 * @desc    Get fee defaulters
 * @access  Private
 */
export const getFeeDefaulters = asyncHandler(async (req, res) => {
  const { instituteId } = req.params;
  const { days_overdue } = req.query;

  const defaulters = await enrollmentService.getFeeDefaulters(
    parseInt(instituteId),
    days_overdue ? parseInt(days_overdue) : null
  );

  res.status(200).json({
    success: true,
    count: defaulters.length,
    data: defaulters
  });
});

/**
 * @route   GET /api/v1/enrollments/statistics
 * @desc    Get enrollment statistics
 * @access  Private
 */
export const getEnrollmentStatistics = asyncHandler(async (req, res) => {
  const { institute_id, batch_id } = req.query;

  const filters = {};
  if (institute_id) filters.institute_id = parseInt(institute_id);
  if (batch_id) filters.batch_id = parseInt(batch_id);

  const statistics = await enrollmentService.getEnrollmentStatistics(filters);

  res.status(200).json({
    success: true,
    data: statistics
  });
});
