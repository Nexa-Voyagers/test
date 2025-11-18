import Joi from 'joi';
import instituteService from '../services/institute.service.js';
import { asyncHandler } from '../asyncHandler.js';
import { ValidationError } from '../errors.js';

/**
 * Institute Controller
 * Handles HTTP requests for institute management
 */

// Validation schemas
const createInstituteSchema = Joi.object({
  name: Joi.string().required().min(2).max(255),
  registration_number: Joi.string().optional().max(100),
  contact_email: Joi.string().email().required(),
  contact_phone: Joi.string().required().pattern(/^[0-9]{10}$/),
  address: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  pincode: Joi.string().required().pattern(/^[0-9]{6}$/),
  website: Joi.string().uri().optional().allow('', null),
  established_year: Joi.number().integer().min(1900).max(new Date().getFullYear()).optional(),
  affiliation: Joi.string().optional().allow('', null),
  director_name: Joi.string().optional().allow('', null),
  director_phone: Joi.string().optional().pattern(/^[0-9]{10}$/).allow('', null),
  status: Joi.string().valid('ACTIVE', 'INACTIVE').default('ACTIVE')
});

const updateInstituteSchema = Joi.object({
  name: Joi.string().min(2).max(255).optional(),
  registration_number: Joi.string().max(100).optional(),
  contact_email: Joi.string().email().optional(),
  contact_phone: Joi.string().pattern(/^[0-9]{10}$/).optional(),
  address: Joi.string().optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  pincode: Joi.string().pattern(/^[0-9]{6}$/).optional(),
  website: Joi.string().uri().optional().allow('', null),
  established_year: Joi.number().integer().min(1900).max(new Date().getFullYear()).optional(),
  affiliation: Joi.string().optional().allow('', null),
  director_name: Joi.string().optional().allow('', null),
  director_phone: Joi.string().pattern(/^[0-9]{10}$/).optional().allow('', null),
  status: Joi.string().valid('ACTIVE', 'INACTIVE').optional()
});

/**
 * @route   POST /api/v1/institutes
 * @desc    Create a new institute
 * @access  Private
 */
export const createInstitute = asyncHandler(async (req, res) => {
  const { error, value } = createInstituteSchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const institute = await instituteService.createInstitute(value);

  res.status(201).json({
    success: true,
    message: 'Institute created successfully',
    data: institute
  });
});

/**
 * @route   GET /api/v1/institutes/:id
 * @desc    Get institute by ID
 * @access  Private
 */
export const getInstituteById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const institute = await instituteService.getInstituteById(parseInt(id));

  res.status(200).json({
    success: true,
    data: institute
  });
});

/**
 * @route   GET /api/v1/institutes
 * @desc    Get all institutes
 * @access  Private
 */
export const getAllInstitutes = asyncHandler(async (req, res) => {
  const { status, city, state, search } = req.query;

  const filters = {};
  if (status) filters.status = status;
  if (city) filters.city = city;
  if (state) filters.state = state;
  if (search) filters.search = search;

  const institutes = await instituteService.getAllInstitutes(filters);

  res.status(200).json({
    success: true,
    count: institutes.length,
    data: institutes
  });
});

/**
 * @route   PUT /api/v1/institutes/:id
 * @desc    Update institute
 * @access  Private
 */
export const updateInstitute = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error, value } = updateInstituteSchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const institute = await instituteService.updateInstitute(parseInt(id), value);

  res.status(200).json({
    success: true,
    message: 'Institute updated successfully',
    data: institute
  });
});

/**
 * @route   DELETE /api/v1/institutes/:id
 * @desc    Delete institute
 * @access  Private
 */
export const deleteInstitute = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await instituteService.deleteInstitute(parseInt(id));

  res.status(200).json({
    success: true,
    message: 'Institute deleted successfully'
  });
});

/**
 * @route   GET /api/v1/institutes/:id/statistics
 * @desc    Get institute statistics
 * @access  Private
 */
export const getInstituteStatistics = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const statistics = await instituteService.getInstituteStatistics(parseInt(id));

  res.status(200).json({
    success: true,
    data: statistics
  });
});
