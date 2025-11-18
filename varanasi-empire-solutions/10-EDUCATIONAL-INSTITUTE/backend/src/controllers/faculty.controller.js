import Joi from 'joi';
import facultyService from '../services/faculty.service.js';
import { asyncHandler } from '../asyncHandler.js';
import { ValidationError } from '../errors.js';

/**
 * Faculty Controller
 * Handles HTTP requests for faculty management
 */

// Validation schemas
const createFacultySchema = Joi.object({
  institute_id: Joi.number().integer().required(),
  name: Joi.string().required().min(2).max(255),
  employee_code: Joi.string().required().max(50),
  email: Joi.string().email().required(),
  phone: Joi.string().required().pattern(/^[0-9]{10}$/),
  date_of_birth: Joi.date().optional().allow(null),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER').required(),
  qualification: Joi.string().required(),
  specialization: Joi.string().required(),
  experience_years: Joi.number().integer().min(0).optional(),
  date_of_joining: Joi.date().required(),
  hourly_rate: Joi.number().min(0).optional(),
  address: Joi.string().optional().allow('', null),
  city: Joi.string().optional().allow('', null),
  state: Joi.string().optional().allow('', null),
  pincode: Joi.string().optional().pattern(/^[0-9]{6}$/).allow('', null),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'ON_LEAVE').default('ACTIVE')
});

const updateFacultySchema = Joi.object({
  name: Joi.string().min(2).max(255).optional(),
  employee_code: Joi.string().max(50).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).optional(),
  date_of_birth: Joi.date().optional().allow(null),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER').optional(),
  qualification: Joi.string().optional(),
  specialization: Joi.string().optional(),
  experience_years: Joi.number().integer().min(0).optional(),
  date_of_joining: Joi.date().optional(),
  hourly_rate: Joi.number().min(0).optional(),
  address: Joi.string().optional().allow('', null),
  city: Joi.string().optional().allow('', null),
  state: Joi.string().optional().allow('', null),
  pincode: Joi.string().pattern(/^[0-9]{6}$/).optional().allow('', null),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'ON_LEAVE').optional()
});

/**
 * @route   POST /api/v1/faculty
 * @desc    Create a new faculty member
 * @access  Private
 */
export const createFaculty = asyncHandler(async (req, res) => {
  const { error, value } = createFacultySchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const faculty = await facultyService.createFaculty(value);

  res.status(201).json({
    success: true,
    message: 'Faculty created successfully',
    data: faculty
  });
});

/**
 * @route   GET /api/v1/faculty/:id
 * @desc    Get faculty by ID
 * @access  Private
 */
export const getFacultyById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const faculty = await facultyService.getFacultyById(parseInt(id));

  res.status(200).json({
    success: true,
    data: faculty
  });
});

/**
 * @route   GET /api/v1/faculty
 * @desc    Get all faculty
 * @access  Private
 */
export const getAllFaculty = asyncHandler(async (req, res) => {
  const { institute_id, specialization, status, search } = req.query;

  const filters = {};
  if (institute_id) filters.institute_id = parseInt(institute_id);
  if (specialization) filters.specialization = specialization;
  if (status) filters.status = status;
  if (search) filters.search = search;

  const faculty = await facultyService.getAllFaculty(filters);

  res.status(200).json({
    success: true,
    count: faculty.length,
    data: faculty
  });
});

/**
 * @route   PUT /api/v1/faculty/:id
 * @desc    Update faculty
 * @access  Private
 */
export const updateFaculty = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error, value } = updateFacultySchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const faculty = await facultyService.updateFaculty(parseInt(id), value);

  res.status(200).json({
    success: true,
    message: 'Faculty updated successfully',
    data: faculty
  });
});

/**
 * @route   DELETE /api/v1/faculty/:id
 * @desc    Delete faculty
 * @access  Private
 */
export const deleteFaculty = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await facultyService.deleteFaculty(parseInt(id));

  res.status(200).json({
    success: true,
    message: 'Faculty deleted successfully'
  });
});

/**
 * @route   GET /api/v1/faculty/:id/batches
 * @desc    Get faculty batches
 * @access  Private
 */
export const getFacultyBatches = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const batches = await facultyService.getFacultyBatches(parseInt(id));

  res.status(200).json({
    success: true,
    count: batches.length,
    data: batches
  });
});

/**
 * @route   GET /api/v1/faculty/:id/statistics
 * @desc    Get faculty statistics
 * @access  Private
 */
export const getFacultyStatistics = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const statistics = await facultyService.getFacultyStatistics(parseInt(id));

  res.status(200).json({
    success: true,
    data: statistics
  });
});
