import { asyncHandler } from '../utils/asyncHandler.js';
import membershipPlanService from '../services/membership-plan.service.js';
import Joi from 'joi';
import { ValidationError } from '../utils/errors.js';

/**
 * Membership Plan Controller
 * Handles HTTP requests for membership plan operations
 */

// Validation schemas
const createPlanSchema = Joi.object({
  name: Joi.string().required().max(255),
  description: Joi.string(),
  duration_months: Joi.number().integer().min(1).max(60).required(),
  plan_fee: Joi.number().min(0).required(),
  registration_fee: Joi.number().min(0).default(0),
  benefits: Joi.string(),
  is_active: Joi.boolean().default(true)
});

const updatePlanSchema = Joi.object({
  name: Joi.string().max(255),
  description: Joi.string(),
  duration_months: Joi.number().integer().min(1).max(60),
  plan_fee: Joi.number().min(0),
  registration_fee: Joi.number().min(0),
  benefits: Joi.string(),
  is_active: Joi.boolean()
}).min(1);

/**
 * @route   POST /api/v1/membership-plans
 * @desc    Create a new membership plan
 * @access  Private
 */
export const createPlan = asyncHandler(async (req, res) => {
  const { error } = createPlanSchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details.map(d => d.message));
  }

  const plan = await membershipPlanService.createPlan(req.body);

  res.status(201).json({
    success: true,
    message: 'Membership plan created successfully',
    data: plan
  });
});

/**
 * @route   GET /api/v1/membership-plans
 * @desc    Get all membership plans with filters
 * @access  Private
 */
export const getAllPlans = asyncHandler(async (req, res) => {
  const { is_active, duration_months, min_fee, max_fee, page = 1, limit = 50 } = req.query;

  const filters = {
    is_active: is_active === 'true' ? true : is_active === 'false' ? false : undefined,
    duration_months: duration_months ? parseInt(duration_months) : undefined,
    min_fee: min_fee ? parseFloat(min_fee) : undefined,
    max_fee: max_fee ? parseFloat(max_fee) : undefined,
    limit: parseInt(limit),
    offset: (parseInt(page) - 1) * parseInt(limit)
  };

  const result = await membershipPlanService.getAllPlans(filters);

  res.json({
    success: true,
    data: result.plans,
    pagination: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      pages: Math.ceil(result.total / result.limit)
    }
  });
});

/**
 * @route   GET /api/v1/membership-plans/active
 * @desc    Get all active membership plans
 * @access  Private
 */
export const getActivePlans = asyncHandler(async (req, res) => {
  const plans = await membershipPlanService.getActivePlans();

  res.json({
    success: true,
    data: plans
  });
});

/**
 * @route   GET /api/v1/membership-plans/with-stats
 * @desc    Get all plans with statistics
 * @access  Private
 */
export const getPlansWithStats = asyncHandler(async (req, res) => {
  const plans = await membershipPlanService.getPlansWithStats();

  res.json({
    success: true,
    data: plans
  });
});

/**
 * @route   GET /api/v1/membership-plans/:id
 * @desc    Get membership plan by ID
 * @access  Private
 */
export const getPlanById = asyncHandler(async (req, res) => {
  const plan = await membershipPlanService.getPlanById(parseInt(req.params.id));

  res.json({
    success: true,
    data: plan
  });
});

/**
 * @route   GET /api/v1/membership-plans/:id/stats
 * @desc    Get plan with statistics
 * @access  Private
 */
export const getPlanWithStats = asyncHandler(async (req, res) => {
  const plan = await membershipPlanService.getPlanWithStats(parseInt(req.params.id));

  res.json({
    success: true,
    data: plan
  });
});

/**
 * @route   PUT /api/v1/membership-plans/:id
 * @desc    Update membership plan
 * @access  Private
 */
export const updatePlan = asyncHandler(async (req, res) => {
  const { error } = updatePlanSchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details.map(d => d.message));
  }

  const plan = await membershipPlanService.updatePlan(parseInt(req.params.id), req.body);

  res.json({
    success: true,
    message: 'Membership plan updated successfully',
    data: plan
  });
});

/**
 * @route   DELETE /api/v1/membership-plans/:id
 * @desc    Delete membership plan (soft delete)
 * @access  Private
 */
export const deletePlan = asyncHandler(async (req, res) => {
  await membershipPlanService.deletePlan(parseInt(req.params.id));

  res.json({
    success: true,
    message: 'Membership plan deleted successfully'
  });
});

export default {
  createPlan,
  getAllPlans,
  getActivePlans,
  getPlansWithStats,
  getPlanById,
  getPlanWithStats,
  updatePlan,
  deletePlan
};
