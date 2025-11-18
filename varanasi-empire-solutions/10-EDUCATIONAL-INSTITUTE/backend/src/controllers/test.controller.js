import Joi from 'joi';
import testService from '../services/test.service.js';
import { asyncHandler } from '../asyncHandler.js';
import { ValidationError } from '../errors.js';

/**
 * Test Controller
 * Handles HTTP requests for test management
 */

// Validation schemas
const createTestSchema = Joi.object({
  batch_id: Joi.number().integer().required(),
  test_name: Joi.string().required().min(2).max(255),
  test_type: Joi.string().valid('UNIT_TEST', 'MID_TERM', 'FINAL_EXAM', 'MOCK_TEST', 'PRACTICE_TEST').required(),
  test_date: Joi.date().required(),
  total_marks: Joi.number().min(1).required(),
  passing_marks: Joi.number().min(0).required(),
  duration_minutes: Joi.number().integer().min(1).optional(),
  syllabus_covered: Joi.string().optional().allow('', null),
  instructions: Joi.string().optional().allow('', null)
});

const updateTestSchema = Joi.object({
  test_name: Joi.string().min(2).max(255).optional(),
  test_type: Joi.string().valid('UNIT_TEST', 'MID_TERM', 'FINAL_EXAM', 'MOCK_TEST', 'PRACTICE_TEST').optional(),
  test_date: Joi.date().optional(),
  total_marks: Joi.number().min(1).optional(),
  passing_marks: Joi.number().min(0).optional(),
  duration_minutes: Joi.number().integer().min(1).optional(),
  syllabus_covered: Joi.string().optional().allow('', null),
  instructions: Joi.string().optional().allow('', null)
});

const enterResultSchema = Joi.object({
  test_id: Joi.number().integer().required(),
  enrollment_id: Joi.number().integer().required(),
  marks_obtained: Joi.number().min(0).required(),
  remarks: Joi.string().optional().allow('', null)
});

const updateResultSchema = Joi.object({
  marks_obtained: Joi.number().min(0).optional(),
  remarks: Joi.string().optional().allow('', null)
});

/**
 * @route   POST /api/v1/tests
 * @desc    Create a new test
 * @access  Private
 */
export const createTest = asyncHandler(async (req, res) => {
  const { error, value } = createTestSchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const test = await testService.createTest(value);

  res.status(201).json({
    success: true,
    message: 'Test created successfully',
    data: test
  });
});

/**
 * @route   GET /api/v1/tests/:id
 * @desc    Get test by ID
 * @access  Private
 */
export const getTestById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const test = await testService.getTestById(parseInt(id));

  res.status(200).json({
    success: true,
    data: test
  });
});

/**
 * @route   GET /api/v1/tests
 * @desc    Get all tests
 * @access  Private
 */
export const getAllTests = asyncHandler(async (req, res) => {
  const { batch_id, test_type, date_from, date_to } = req.query;

  const filters = {};
  if (batch_id) filters.batch_id = parseInt(batch_id);
  if (test_type) filters.test_type = test_type;
  if (date_from) filters.date_from = date_from;
  if (date_to) filters.date_to = date_to;

  const tests = await testService.getAllTests(filters);

  res.status(200).json({
    success: true,
    count: tests.length,
    data: tests
  });
});

/**
 * @route   PUT /api/v1/tests/:id
 * @desc    Update test
 * @access  Private
 */
export const updateTest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error, value } = updateTestSchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const test = await testService.updateTest(parseInt(id), value);

  res.status(200).json({
    success: true,
    message: 'Test updated successfully',
    data: test
  });
});

/**
 * @route   DELETE /api/v1/tests/:id
 * @desc    Delete test
 * @access  Private
 */
export const deleteTest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await testService.deleteTest(parseInt(id));

  res.status(200).json({
    success: true,
    message: 'Test deleted successfully'
  });
});

/**
 * @route   GET /api/v1/tests/:id/statistics
 * @desc    Get test statistics
 * @access  Private
 */
export const getTestStatistics = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const statistics = await testService.getTestStatistics(parseInt(id));

  res.status(200).json({
    success: true,
    data: statistics
  });
});

/**
 * @route   POST /api/v1/test-results
 * @desc    Enter test result
 * @access  Private
 */
export const enterTestResult = asyncHandler(async (req, res) => {
  const { error, value } = enterResultSchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const result = await testService.enterTestResult(value);

  res.status(201).json({
    success: true,
    message: 'Test result entered successfully',
    data: result
  });
});

/**
 * @route   PUT /api/v1/test-results/:id
 * @desc    Update test result
 * @access  Private
 */
export const updateTestResult = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error, value } = updateResultSchema.validate(req.body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const result = await testService.updateTestResult(parseInt(id), value);

  res.status(200).json({
    success: true,
    message: 'Test result updated successfully',
    data: result
  });
});

/**
 * @route   DELETE /api/v1/test-results/:id
 * @desc    Delete test result
 * @access  Private
 */
export const deleteTestResult = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await testService.deleteTestResult(parseInt(id));

  res.status(200).json({
    success: true,
    message: 'Test result deleted successfully'
  });
});

/**
 * @route   GET /api/v1/tests/:testId/toppers
 * @desc    Get toppers for a test
 * @access  Private
 */
export const getToppers = asyncHandler(async (req, res) => {
  const { testId } = req.params;
  const { limit } = req.query;

  const toppers = await testService.getToppers(
    parseInt(testId),
    limit ? parseInt(limit) : 10
  );

  res.status(200).json({
    success: true,
    count: toppers.length,
    data: toppers
  });
});

/**
 * @route   GET /api/v1/students/:studentId/test-performance
 * @desc    Get student test performance
 * @access  Private
 */
export const getStudentPerformance = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const { batch_id } = req.query;

  const performance = await testService.getStudentPerformance(
    parseInt(studentId),
    batch_id ? parseInt(batch_id) : null
  );

  res.status(200).json({
    success: true,
    count: performance.length,
    data: performance
  });
});
