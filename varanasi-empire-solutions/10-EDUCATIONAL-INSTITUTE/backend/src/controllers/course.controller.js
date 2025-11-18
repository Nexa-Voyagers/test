import Joi from 'joi';
import courseService from '../services/course.service.js';
import { asyncHandler } from '../asyncHandler.js';
import { ValidationError } from '../errors.js';

/**
 * Course Controller
 * Handles HTTP requests for course management
 */

// Validation schemas
const createCourseSchema = Joi.object({
  institute_id: Joi.number().integer().required(),
  name: Joi.string().required().min(2).max(255),
  code: Joi.string().required().max(50),
  description: Joi.string().optional().allow('', null),
  category: Joi.string().valid('ACADEMIC', 'COMPETITIVE', 'SKILL_DEVELOPMENT', 'CERTIFICATION', 'OTHER').required(),
  duration_months: Joi.number().integer().min(1).required(),
  course_fee: Joi.number().min(0).required(),
  registration_fee: Joi.number().min(0).required(),
  study_material_fee: Joi.number().min(0).required(),
  syllabus: Joi.string().optional().allow('', null),
  prerequisites: Joi.string().optional().allow('', null),
  status: Joi.string().valid('ACTIVE', 'INACTIVE').default('ACTIVE')
});

const updateCourseSchema = Joi.object({
  name: Joi.string().min(2).max(255).optional(),
  code: Joi.string().max(50).optional(),
  description: Joi.string().optional().allow('', null),
  category: Joi.string().valid('ACADEMIC', 'COMPETITIVE', 'SKILL_DEVELOPMENT', 'CERTIFICATION', 'OTHER').optional(),
  duration_months: Joi.number().integer().min(1).optional(),
  course_fee: Joi.number().min(0).optional(),
  registration_fee: Joi.number().min(0).optional(),
  study_material_fee: Joi.number().min(0).optional(),
  syllabus: Joi.string().optional().allow('', null),
  prerequisites: Joi.string().optional().allow('', null),
  status: Joi.string().valid('ACTIVE', 'INACTIVE').optional()
});

/**
 * @route   POST /api/v1/courses
 * @desc    Create a new course
 * @access  Private
 */
export const createCourse = asyncHandler(async (req, res) => {
  const { error, value } = createCourseSchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const course = await courseService.createCourse(value);

  res.status(201).json({
    success: true,
    message: 'Course created successfully',
    data: course
  });
});

/**
 * @route   GET /api/v1/courses/:id
 * @desc    Get course by ID
 * @access  Private
 */
export const getCourseById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const course = await courseService.getCourseById(parseInt(id));

  res.status(200).json({
    success: true,
    data: course
  });
});

/**
 * @route   GET /api/v1/courses
 * @desc    Get all courses
 * @access  Private
 */
export const getAllCourses = asyncHandler(async (req, res) => {
  const { institute_id, category, status, search } = req.query;

  const filters = {};
  if (institute_id) filters.institute_id = parseInt(institute_id);
  if (category) filters.category = category;
  if (status) filters.status = status;
  if (search) filters.search = search;

  const courses = await courseService.getAllCourses(filters);

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses
  });
});

/**
 * @route   PUT /api/v1/courses/:id
 * @desc    Update course
 * @access  Private
 */
export const updateCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error, value } = updateCourseSchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const course = await courseService.updateCourse(parseInt(id), value);

  res.status(200).json({
    success: true,
    message: 'Course updated successfully',
    data: course
  });
});

/**
 * @route   DELETE /api/v1/courses/:id
 * @desc    Delete course
 * @access  Private
 */
export const deleteCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await courseService.deleteCourse(parseInt(id));

  res.status(200).json({
    success: true,
    message: 'Course deleted successfully'
  });
});

/**
 * @route   GET /api/v1/courses/:id/enrollment-stats
 * @desc    Get course enrollment statistics
 * @access  Private
 */
export const getCourseEnrollmentStats = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const stats = await courseService.getCourseEnrollmentStats(parseInt(id));

  res.status(200).json({
    success: true,
    data: stats
  });
});
