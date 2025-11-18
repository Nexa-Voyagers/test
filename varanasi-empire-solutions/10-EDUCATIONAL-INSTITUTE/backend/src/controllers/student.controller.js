import Joi from 'joi';
import studentService from '../services/student.service.js';
import { asyncHandler } from '../asyncHandler.js';
import { ValidationError } from '../errors.js';

/**
 * Student Controller
 * Handles HTTP requests for student management
 */

// Validation schemas
const createStudentSchema = Joi.object({
  institute_id: Joi.number().integer().required(),
  name: Joi.string().required().min(2).max(255),
  enrollment_number: Joi.string().required().max(50),
  email: Joi.string().email().required(),
  phone: Joi.string().required().pattern(/^[0-9]{10}$/),
  date_of_birth: Joi.date().required(),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER').required(),
  father_name: Joi.string().optional().allow('', null),
  mother_name: Joi.string().optional().allow('', null),
  parent_phone: Joi.string().required().pattern(/^[0-9]{10}$/),
  address: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  pincode: Joi.string().required().pattern(/^[0-9]{6}$/),
  qualification: Joi.string().optional().allow('', null),
  target_exam: Joi.string().optional().allow('', null),
  previous_percentage: Joi.number().min(0).max(100).optional().allow(null),
  category: Joi.string().valid('GENERAL', 'OBC', 'SC', 'ST', 'OTHER').optional(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'ALUMNI').default('ACTIVE')
});

const updateStudentSchema = Joi.object({
  name: Joi.string().min(2).max(255).optional(),
  enrollment_number: Joi.string().max(50).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).optional(),
  date_of_birth: Joi.date().optional(),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER').optional(),
  father_name: Joi.string().optional().allow('', null),
  mother_name: Joi.string().optional().allow('', null),
  parent_phone: Joi.string().pattern(/^[0-9]{10}$/).optional(),
  address: Joi.string().optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  pincode: Joi.string().pattern(/^[0-9]{6}$/).optional(),
  qualification: Joi.string().optional().allow('', null),
  target_exam: Joi.string().optional().allow('', null),
  previous_percentage: Joi.number().min(0).max(100).optional().allow(null),
  category: Joi.string().valid('GENERAL', 'OBC', 'SC', 'ST', 'OTHER').optional(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'ALUMNI').optional()
});

/**
 * @route   POST /api/v1/students
 * @desc    Create a new student
 * @access  Private
 */
export const createStudent = asyncHandler(async (req, res) => {
  const { error, value } = createStudentSchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const student = await studentService.createStudent(value);

  res.status(201).json({
    success: true,
    message: 'Student created successfully',
    data: student
  });
});

/**
 * @route   GET /api/v1/students/:id
 * @desc    Get student by ID
 * @access  Private
 */
export const getStudentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const student = await studentService.getStudentById(parseInt(id));

  res.status(200).json({
    success: true,
    data: student
  });
});

/**
 * @route   GET /api/v1/students
 * @desc    Get all students
 * @access  Private
 */
export const getAllStudents = asyncHandler(async (req, res) => {
  const { institute_id, target_exam, category, status, search } = req.query;

  const filters = {};
  if (institute_id) filters.institute_id = parseInt(institute_id);
  if (target_exam) filters.target_exam = target_exam;
  if (category) filters.category = category;
  if (status) filters.status = status;
  if (search) filters.search = search;

  const students = await studentService.getAllStudents(filters);

  res.status(200).json({
    success: true,
    count: students.length,
    data: students
  });
});

/**
 * @route   GET /api/v1/students/search
 * @desc    Search students
 * @access  Private
 */
export const searchStudents = asyncHandler(async (req, res) => {
  const { q, institute_id } = req.query;

  if (!q) {
    throw new ValidationError('Search query is required');
  }

  const students = await studentService.searchStudents(q, institute_id ? parseInt(institute_id) : null);

  res.status(200).json({
    success: true,
    count: students.length,
    data: students
  });
});

/**
 * @route   PUT /api/v1/students/:id
 * @desc    Update student
 * @access  Private
 */
export const updateStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error, value } = updateStudentSchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const student = await studentService.updateStudent(parseInt(id), value);

  res.status(200).json({
    success: true,
    message: 'Student updated successfully',
    data: student
  });
});

/**
 * @route   DELETE /api/v1/students/:id
 * @desc    Delete student
 * @access  Private
 */
export const deleteStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await studentService.deleteStudent(parseInt(id));

  res.status(200).json({
    success: true,
    message: 'Student deleted successfully'
  });
});

/**
 * @route   GET /api/v1/students/:id/enrollments
 * @desc    Get student enrollments
 * @access  Private
 */
export const getStudentEnrollments = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const enrollments = await studentService.getStudentEnrollments(parseInt(id));

  res.status(200).json({
    success: true,
    count: enrollments.length,
    data: enrollments
  });
});

/**
 * @route   GET /api/v1/students/:id/performance
 * @desc    Get student performance summary
 * @access  Private
 */
export const getStudentPerformance = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const performance = await studentService.getStudentPerformance(parseInt(id));

  res.status(200).json({
    success: true,
    data: performance
  });
});
