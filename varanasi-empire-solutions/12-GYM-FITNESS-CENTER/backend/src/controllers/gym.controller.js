import { asyncHandler } from '../utils/asyncHandler.js';
import gymService from '../services/gym.service.js';
import Joi from 'joi';
import { ValidationError } from '../utils/errors.js';

/**
 * Gym Controller
 * Handles HTTP requests for gym operations
 */

// Validation schemas
const createGymSchema = Joi.object({
  name: Joi.string().required().max(255),
  address: Joi.string().required(),
  city: Joi.string().required().max(100),
  state: Joi.string().required().max(100),
  pincode: Joi.string().required().max(10),
  phone: Joi.string().required().max(15),
  email: Joi.string().email().max(255),
  capacity: Joi.number().integer().min(1).required(),
  amenities: Joi.string(),
  opening_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  closing_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
});

const updateGymSchema = Joi.object({
  name: Joi.string().max(255),
  address: Joi.string(),
  city: Joi.string().max(100),
  state: Joi.string().max(100),
  pincode: Joi.string().max(10),
  phone: Joi.string().max(15),
  email: Joi.string().email().max(255),
  capacity: Joi.number().integer().min(1),
  amenities: Joi.string(),
  opening_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  closing_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  is_active: Joi.boolean()
}).min(1);

/**
 * @route   POST /api/v1/gyms
 * @desc    Create a new gym
 * @access  Private
 */
export const createGym = asyncHandler(async (req, res) => {
  const { error } = createGymSchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details.map(d => d.message));
  }

  const gym = await gymService.createGym(req.body);

  res.status(201).json({
    success: true,
    message: 'Gym created successfully',
    data: gym
  });
});

/**
 * @route   GET /api/v1/gyms
 * @desc    Get all gyms with filters and pagination
 * @access  Private
 */
export const getAllGyms = asyncHandler(async (req, res) => {
  const { city, state, is_active, search, page = 1, limit = 50 } = req.query;

  const filters = {
    city,
    state,
    is_active: is_active === 'true' ? true : is_active === 'false' ? false : undefined,
    search,
    limit: parseInt(limit),
    offset: (parseInt(page) - 1) * parseInt(limit)
  };

  const result = await gymService.getAllGyms(filters);

  res.json({
    success: true,
    data: result.gyms,
    pagination: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      pages: Math.ceil(result.total / result.limit)
    }
  });
});

/**
 * @route   GET /api/v1/gyms/active
 * @desc    Get all active gyms
 * @access  Private
 */
export const getActiveGyms = asyncHandler(async (req, res) => {
  const gyms = await gymService.getActiveGyms();

  res.json({
    success: true,
    data: gyms
  });
});

/**
 * @route   GET /api/v1/gyms/:id
 * @desc    Get gym by ID
 * @access  Private
 */
export const getGymById = asyncHandler(async (req, res) => {
  const gym = await gymService.getGymById(parseInt(req.params.id));

  res.json({
    success: true,
    data: gym
  });
});

/**
 * @route   GET /api/v1/gyms/:id/stats
 * @desc    Get gym with statistics
 * @access  Private
 */
export const getGymWithStats = asyncHandler(async (req, res) => {
  const gym = await gymService.getGymWithStats(parseInt(req.params.id));

  res.json({
    success: true,
    data: gym
  });
});

/**
 * @route   PUT /api/v1/gyms/:id
 * @desc    Update gym
 * @access  Private
 */
export const updateGym = asyncHandler(async (req, res) => {
  const { error } = updateGymSchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details.map(d => d.message));
  }

  const gym = await gymService.updateGym(parseInt(req.params.id), req.body);

  res.json({
    success: true,
    message: 'Gym updated successfully',
    data: gym
  });
});

/**
 * @route   DELETE /api/v1/gyms/:id
 * @desc    Delete gym (soft delete)
 * @access  Private
 */
export const deleteGym = asyncHandler(async (req, res) => {
  await gymService.deleteGym(parseInt(req.params.id));

  res.json({
    success: true,
    message: 'Gym deleted successfully'
  });
});

/**
 * @route   GET /api/v1/gyms/search
 * @desc    Search gyms
 * @access  Private
 */
export const searchGyms = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === '') {
    throw new ValidationError(['Search query is required']);
  }

  const gyms = await gymService.searchGyms(q);

  res.json({
    success: true,
    data: gyms
  });
});

export default {
  createGym,
  getAllGyms,
  getActiveGyms,
  getGymById,
  getGymWithStats,
  updateGym,
  deleteGym,
  searchGyms
};
