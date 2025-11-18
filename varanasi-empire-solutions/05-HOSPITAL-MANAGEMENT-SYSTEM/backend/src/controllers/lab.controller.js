import { labService } from '../services/lab.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { logger } from '../config/logger.js';

/**
 * Create lab test
 * POST /api/lab/tests
 */
export const createLabTest = asyncHandler(async (req, res) => {
  const testData = {
    ...req.body,
    hospital_id: req.user.hospital_id,
    created_by: req.user.id,
  };

  const test = await labService.createLabTest(testData);

  logger.info(`Lab test created: ${test.test_id}`);

  res.status(201).json({
    success: true,
    message: 'Lab test created successfully',
    data: test,
  });
});

/**
 * Get lab test by ID
 * GET /api/lab/tests/:id
 */
export const getLabTest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const test = await labService.getLabTest(id);

  res.json({
    success: true,
    data: test,
  });
});

/**
 * Update test status
 * PATCH /api/lab/tests/:id/status
 */
export const updateTestStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, result, technician_remarks } = req.body;

  const test = await labService.updateTestStatus(id, status, {
    result,
    technician_remarks,
  });

  logger.info(`Lab test status updated: ${id} -> ${status}`);

  res.json({
    success: true,
    message: 'Test status updated successfully',
    data: test,
  });
});

/**
 * Get pending tests
 * GET /api/lab/tests/pending
 */
export const getPendingTests = asyncHandler(async (req, res) => {
  const hospitalId = req.user.hospital_id;
  const tests = await labService.getPendingTests(hospitalId);

  res.json({
    success: true,
    data: tests,
    count: tests.length,
  });
});

/**
 * Get hospital tests with filters
 * GET /api/lab/tests?status=PENDING&test_date=YYYY-MM-DD
 */
export const getHospitalTests = asyncHandler(async (req, res) => {
  const hospitalId = req.user.hospital_id;
  const filters = req.query;

  const tests = await labService.getHospitalTests(hospitalId, filters);

  res.json({
    success: true,
    data: tests,
    count: tests.length,
  });
});

/**
 * Generate test report
 * GET /api/lab/tests/:id/report
 */
export const generateTestReport = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const report = await labService.generateTestReport(id);

  res.json({
    success: true,
    data: report,
  });
});

export default {
  createLabTest,
  getLabTest,
  updateTestStatus,
  getPendingTests,
  getHospitalTests,
  generateTestReport,
};
