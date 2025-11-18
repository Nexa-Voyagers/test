import { asyncHandler } from '../utils/asyncHandler.js';
import membershipService from '../services/membership.service.js';
import Joi from 'joi';
import { ValidationError } from '../utils/errors.js';

/**
 * Membership Controller
 * Handles HTTP requests for membership operations
 */

// Validation schemas
const enrollmentSchema = Joi.object({
  member_id: Joi.number().integer().required(),
  plan_id: Joi.number().integer().required(),
  start_date: Joi.date(),
  discount: Joi.number().min(0).default(0),
  registration_fee: Joi.number().min(0).default(0),
  amount_paid: Joi.number().min(0).default(0),
  payment_method: Joi.string().valid('CASH', 'CARD', 'UPI', 'BANK_TRANSFER', 'OTHER'),
  notes: Joi.string()
});

const renewalSchema = Joi.object({
  plan_id: Joi.number().integer().required(),
  discount: Joi.number().min(0).default(0),
  amount_paid: Joi.number().min(0).default(0),
  payment_method: Joi.string().valid('CASH', 'CARD', 'UPI', 'BANK_TRANSFER', 'OTHER'),
  notes: Joi.string()
});

const updateMembershipSchema = Joi.object({
  status: Joi.string().valid('ACTIVE', 'EXPIRED', 'CANCELLED'),
  end_date: Joi.date(),
  amount_paid: Joi.number().min(0),
  payment_status: Joi.string().valid('PENDING', 'PARTIAL', 'PAID'),
  payment_method: Joi.string().valid('CASH', 'CARD', 'UPI', 'BANK_TRANSFER', 'OTHER'),
  notes: Joi.string(),
  discount: Joi.number().min(0)
}).min(1);

const addPaymentSchema = Joi.object({
  amount: Joi.number().min(0).required(),
  payment_method: Joi.string().valid('CASH', 'CARD', 'UPI', 'BANK_TRANSFER', 'OTHER').required()
});

/**
 * @route   POST /api/v1/memberships/enroll
 * @desc    Enroll member in membership plan
 * @access  Private
 */
export const enrollMembership = asyncHandler(async (req, res) => {
  const { error } = enrollmentSchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details.map(d => d.message));
  }

  const membership = await membershipService.enrollMembership(req.body);

  res.status(201).json({
    success: true,
    message: 'Membership enrolled successfully',
    data: membership
  });
});

/**
 * @route   POST /api/v1/memberships/renew/:memberId
 * @desc    Renew membership for member
 * @access  Private
 */
export const renewMembership = asyncHandler(async (req, res) => {
  const { error } = renewalSchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details.map(d => d.message));
  }

  const membership = await membershipService.renewMembership(parseInt(req.params.memberId), req.body);

  res.status(201).json({
    success: true,
    message: 'Membership renewed successfully',
    data: membership
  });
});

/**
 * @route   GET /api/v1/memberships
 * @desc    Get all memberships with filters
 * @access  Private
 */
export const getAllMemberships = asyncHandler(async (req, res) => {
  const { member_id, plan_id, status, payment_status, gym_id, page = 1, limit = 50 } = req.query;

  const filters = {
    member_id: member_id ? parseInt(member_id) : undefined,
    plan_id: plan_id ? parseInt(plan_id) : undefined,
    status,
    payment_status,
    gym_id: gym_id ? parseInt(gym_id) : undefined,
    limit: parseInt(limit),
    offset: (parseInt(page) - 1) * parseInt(limit)
  };

  const result = await membershipService.getAllMemberships(filters);

  res.json({
    success: true,
    data: result.memberships,
    pagination: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      pages: Math.ceil(result.total / result.limit)
    }
  });
});

/**
 * @route   GET /api/v1/memberships/expiring
 * @desc    Get expiring memberships
 * @access  Private
 */
export const getExpiringMemberships = asyncHandler(async (req, res) => {
  const { days = 7, gym_id } = req.query;

  const memberships = await membershipService.getExpiringMemberships(
    parseInt(days),
    gym_id ? parseInt(gym_id) : null
  );

  res.json({
    success: true,
    data: memberships
  });
});

/**
 * @route   GET /api/v1/memberships/:id
 * @desc    Get membership by ID
 * @access  Private
 */
export const getMembershipById = asyncHandler(async (req, res) => {
  const membership = await membershipService.getMembershipById(parseInt(req.params.id));

  res.json({
    success: true,
    data: membership
  });
});

/**
 * @route   GET /api/v1/memberships/member/:memberId
 * @desc    Get active membership for member
 * @access  Private
 */
export const getActiveMembership = asyncHandler(async (req, res) => {
  const membership = await membershipService.getActiveMembership(parseInt(req.params.memberId));

  res.json({
    success: true,
    data: membership
  });
});

/**
 * @route   GET /api/v1/memberships/member/:memberId/history
 * @desc    Get membership history for member
 * @access  Private
 */
export const getMembershipHistory = asyncHandler(async (req, res) => {
  const history = await membershipService.getMembershipHistory(parseInt(req.params.memberId));

  res.json({
    success: true,
    data: history
  });
});

/**
 * @route   PUT /api/v1/memberships/:id
 * @desc    Update membership
 * @access  Private
 */
export const updateMembership = asyncHandler(async (req, res) => {
  const { error } = updateMembershipSchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details.map(d => d.message));
  }

  const membership = await membershipService.updateMembership(parseInt(req.params.id), req.body);

  res.json({
    success: true,
    message: 'Membership updated successfully',
    data: membership
  });
});

/**
 * @route   POST /api/v1/memberships/:id/payment
 * @desc    Add payment to membership
 * @access  Private
 */
export const addPayment = asyncHandler(async (req, res) => {
  const { error } = addPaymentSchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details.map(d => d.message));
  }

  const membership = await membershipService.addPayment(parseInt(req.params.id), req.body);

  res.json({
    success: true,
    message: 'Payment added successfully',
    data: membership
  });
});

/**
 * @route   POST /api/v1/memberships/:id/cancel
 * @desc    Cancel membership
 * @access  Private
 */
export const cancelMembership = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  if (!reason) {
    throw new ValidationError(['Cancellation reason is required']);
  }

  const membership = await membershipService.cancelMembership(parseInt(req.params.id), reason);

  res.json({
    success: true,
    message: 'Membership cancelled successfully',
    data: membership
  });
});

/**
 * @route   GET /api/v1/memberships/revenue/stats
 * @desc    Get revenue statistics
 * @access  Private
 */
export const getRevenueStats = asyncHandler(async (req, res) => {
  const { gym_id, start_date, end_date } = req.query;

  const filters = {
    gym_id: gym_id ? parseInt(gym_id) : undefined,
    start_date,
    end_date
  };

  const stats = await membershipService.getRevenueStats(filters);

  res.json({
    success: true,
    data: stats
  });
});

/**
 * @route   POST /api/v1/memberships/update-expired
 * @desc    Update expired memberships (scheduled job)
 * @access  Private
 */
export const updateExpiredMemberships = asyncHandler(async (req, res) => {
  const count = await membershipService.updateExpiredMemberships();

  res.json({
    success: true,
    message: `Updated ${count} expired memberships`,
    data: { updated_count: count }
  });
});

export default {
  enrollMembership,
  renewMembership,
  getAllMemberships,
  getExpiringMemberships,
  getMembershipById,
  getActiveMembership,
  getMembershipHistory,
  updateMembership,
  addPayment,
  cancelMembership,
  getRevenueStats,
  updateExpiredMemberships
};
