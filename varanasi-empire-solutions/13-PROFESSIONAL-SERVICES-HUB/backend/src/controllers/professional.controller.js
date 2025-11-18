import Joi from 'joi';
import professionalService from '../services/professional.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ValidationError } from '../utils/errors.js';

/**
 * Professional Controller
 * Handles HTTP requests for professional operations
 */

// Validation schemas
const createProfessionalSchema = Joi.object({
  firm_id: Joi.string().uuid().required().messages({
    'string.guid': 'Invalid firm ID format',
    'any.required': 'Firm ID is required',
  }),
  professional_code: Joi.string().required().max(50).messages({
    'string.empty': 'Professional code is required',
    'any.required': 'Professional code is required',
  }),
  first_name: Joi.string().required().max(100).messages({
    'string.empty': 'First name is required',
    'any.required': 'First name is required',
  }),
  last_name: Joi.string().max(100).allow(null, ''),
  designation: Joi.string().max(100).allow(null, ''),
  specialization: Joi.array().items(Joi.string()).allow(null),
  bar_council_number: Joi.string().max(100).allow(null, ''),
  phone: Joi.string().max(20).allow(null, ''),
  email: Joi.string().email().max(255).allow(null, ''),
  hourly_rate: Joi.number().min(0).allow(null),
});

const updateProfessionalSchema = Joi.object({
  firm_id: Joi.string().uuid(),
  first_name: Joi.string().max(100),
  last_name: Joi.string().max(100).allow(null, ''),
  designation: Joi.string().max(100).allow(null, ''),
  specialization: Joi.array().items(Joi.string()).allow(null),
  bar_council_number: Joi.string().max(100).allow(null, ''),
  phone: Joi.string().max(20).allow(null, ''),
  email: Joi.string().email().max(255).allow(null, ''),
  hourly_rate: Joi.number().min(0).allow(null),
  is_active: Joi.boolean(),
});

/**
 * Create a new professional
 */
export const createProfessional = asyncHandler(async (req, res) => {
  const { error, value } = createProfessionalSchema.validate(req.body);

  if (error) {
    throw new ValidationError(error.details.map(d => d.message));
  }

  const professional = await professionalService.createProfessional(value);

  res.status(201).json({
    success: true,
    message: 'Professional created successfully',
    data: professional,
  });
});

/**
 * Get professional by ID
 */
export const getProfessionalById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const professional = await professionalService.getProfessionalById(id);

  res.status(200).json({
    success: true,
    data: professional,
  });
});

/**
 * Get all professionals with pagination
 */
export const getAllProfessionals = asyncHandler(async (req, res) => {
  const options = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    firm_id: req.query.firm_id,
    specialization: req.query.specialization,
    is_active: req.query.is_active === 'true' ? true : req.query.is_active === 'false' ? false : undefined,
    search: req.query.search,
  };

  const result = await professionalService.getAllProfessionals(options);

  res.status(200).json({
    success: true,
    ...result,
  });
});

/**
 * Update professional
 */
export const updateProfessional = asyncHandler(async (req, res) => {
  const { error, value } = updateProfessionalSchema.validate(req.body);

  if (error) {
    throw new ValidationError(error.details.map(d => d.message));
  }

  const { id } = req.params;
  const professional = await professionalService.updateProfessional(id, value);

  res.status(200).json({
    success: true,
    message: 'Professional updated successfully',
    data: professional,
  });
});

/**
 * Delete professional (soft delete)
 */
export const deleteProfessional = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const professional = await professionalService.deleteProfessional(id);

  res.status(200).json({
    success: true,
    message: 'Professional deleted successfully',
    data: professional,
  });
});

/**
 * Get professional workload
 */
export const getProfessionalWorkload = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const workload = await professionalService.getProfessionalWorkload(id);

  res.status(200).json({
    success: true,
    data: workload,
  });
});

/**
 * Get available professionals for case assignment
 */
export const getAvailableProfessionals = asyncHandler(async (req, res) => {
  const { firmId } = req.params;
  const maxCases = parseInt(req.query.maxCases) || 10;

  const professionals = await professionalService.getAvailableProfessionals(firmId, maxCases);

  res.status(200).json({
    success: true,
    data: professionals,
  });
});

/**
 * Get professional performance metrics
 */
export const getProfessionalPerformance = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { start_date, end_date } = req.query;

  if (!start_date || !end_date) {
    throw new ValidationError(['Start date and end date are required']);
  }

  const metrics = await professionalService.getProfessionalPerformance(
    id,
    new Date(start_date),
    new Date(end_date)
  );

  res.status(200).json({
    success: true,
    data: metrics,
  });
});
