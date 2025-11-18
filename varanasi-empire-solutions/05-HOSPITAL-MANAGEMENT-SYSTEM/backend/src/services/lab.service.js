import { labRepository } from '../repositories/lab.repository.js';
import { patientRepository } from '../repositories/patient.repository.js';
import { NotFoundError } from '../utils/errors.js';
import { generateLabTestId } from '../utils/idGenerator.js';

/**
 * Create lab test
 */
const createLabTest = async (testData) => {
  // Verify patient exists
  const patient = await patientRepository.findById(testData.patient_id);
  if (!patient) {
    throw new NotFoundError('Patient');
  }

  // Generate test ID
  const testId = generateLabTestId();

  const test = await labRepository.createLabTest({
    ...testData,
    test_id: testId,
  });

  return test;
};

/**
 * Get lab test details
 */
const getLabTest = async (id) => {
  const test = await labRepository.findById(id);
  if (!test) {
    throw new NotFoundError('Lab test');
  }
  return test;
};

/**
 * Update test status and results
 */
const updateTestStatus = async (id, status, resultData) => {
  const test = await labRepository.findById(id);
  if (!test) {
    throw new NotFoundError('Lab test');
  }

  const updatedTest = await labRepository.updateStatus(id, status, resultData);
  return updatedTest;
};

/**
 * Get pending tests
 */
const getPendingTests = async (hospitalId) => {
  const tests = await labRepository.getPendingTests(hospitalId);
  return tests;
};

/**
 * Get tests by hospital with filters
 */
const getHospitalTests = async (hospitalId, filters) => {
  const tests = await labRepository.findByHospital(hospitalId, filters);
  return tests;
};

/**
 * Generate test report (stub)
 */
const generateTestReport = async (testId) => {
  const test = await getLabTest(testId);

  // In real implementation, would generate PDF report
  return {
    message: 'Report generation would be implemented here',
    test,
  };
};

export const labService = {
  createLabTest,
  getLabTest,
  updateTestStatus,
  getPendingTests,
  getHospitalTests,
  generateTestReport,
};

export default labService;
