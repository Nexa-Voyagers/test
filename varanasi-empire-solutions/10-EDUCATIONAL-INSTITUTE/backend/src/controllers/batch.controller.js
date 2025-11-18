import Joi from 'joi';
import batchService from '../services/batch.service.js';
import { asyncHandler } from '../asyncHandler.js';
import { ValidationError } from '../errors.js';

/**
 * Batch Controller
 * Handles HTTP requests for batch management
 */

// Validation schemas
const createBatchSchema = Joi.object({
  institute_id: Joi.number().integer().required(),
  course_id: Joi.number().integer().required(),
  name: Joi.string().required().min(2).max(255),
  batch_code: Joi.string().required().max(50),
  start_date: Joi.date().required(),
  end_date: Joi.date().required(),
  timings: Joi.string().required(),
  max_students: Joi.number().integer().min(1).required(),
  enrolled_students: Joi.number().integer().min(0).default(0),
  faculty_id: Joi.number().integer().optional().allow(null),
  classroom: Joi.string().optional().allow('', null),
  status: Joi.string().valid('UPCOMING', 'ONGOING', 'COMPLETED', 'FULL', 'CANCELLED').default('UPCOMING')
});

const updateBatchSchema = Joi.object({
  name: Joi.string().min(2).max(255).optional(),
  batch_code: Joi.string().max(50).optional(),
  start_date: Joi.date().optional(),
  end_date: Joi.date().optional(),
  timings: Joi.string().optional(),
  max_students: Joi.number().integer().min(1).optional(),
  faculty_id: Joi.number().integer().optional().allow(null),
  classroom: Joi.string().optional().allow('', null),
  status: Joi.string().valid('UPCOMING', 'ONGOING', 'COMPLETED', 'FULL', 'CANCELLED').optional()
});

/**
 * @route   POST /api/v1/batches
 * @desc    Create a new batch
 * @access  Private
 */
export const createBatch = asyncHandler(async (req, res) => {
  const { error, value } = createBatchSchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const batch = await batchService.createBatch(value);

  res.status(201).json({
    success: true,
    message: 'Batch created successfully',
    data: batch
  });
});

/**
 * @route   GET /api/v1/batches/:id
 * @desc    Get batch by ID
 * @access  Private
 */
export const getBatchById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const batch = await batchService.getBatchById(parseInt(id));

  res.status(200).json({
    success: true,
    data: batch
  });
});

/**
 * @route   GET /api/v1/batches
 * @desc    Get all batches
 * @access  Private
 */
export const getAllBatches = asyncHandler(async (req, res) => {
  const { institute_id, course_id, faculty_id, status, has_available_seats, search } = req.query;

  const filters = {};
  if (institute_id) filters.institute_id = parseInt(institute_id);
  if (course_id) filters.course_id = parseInt(course_id);
  if (faculty_id) filters.faculty_id = parseInt(faculty_id);
  if (status) filters.status = status;
  if (has_available_seats === 'true') filters.has_available_seats = true;
  if (search) filters.search = search;

  const batches = await batchService.getAllBatches(filters);

  res.status(200).json({
    success: true,
    count: batches.length,
    data: batches
  });
});

/**
 * @route   PUT /api/v1/batches/:id
 * @desc    Update batch
 * @access  Private
 */
export const updateBatch = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error, value } = updateBatchSchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const batch = await batchService.updateBatch(parseInt(id), value);

  res.status(200).json({
    success: true,
    message: 'Batch updated successfully',
    data: batch
  });
});

/**
 * @route   DELETE /api/v1/batches/:id
 * @desc    Delete batch
 * @access  Private
 */
export const deleteBatch = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await batchService.deleteBatch(parseInt(id));

  res.status(200).json({
    success: true,
    message: 'Batch deleted successfully'
  });
});

/**
 * @route   GET /api/v1/batches/:id/statistics
 * @desc    Get batch statistics
 * @access  Private
 */
export const getBatchStatistics = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const statistics = await batchService.getBatchStatistics(parseInt(id));

  res.status(200).json({
    success: true,
    data: statistics
  });
});

/**
 * @route   GET /api/v1/courses/:courseId/available-batches
 * @desc    Get available batches for a course
 * @access  Private
 */
export const getAvailableBatches = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const batches = await batchService.getAvailableBatches(parseInt(courseId));

  res.status(200).json({
    success: true,
    count: batches.length,
    data: batches
  });
});
