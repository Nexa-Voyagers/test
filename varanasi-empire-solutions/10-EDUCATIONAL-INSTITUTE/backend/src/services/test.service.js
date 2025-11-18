import testRepository from '../repositories/test.repository.js';
import testResultRepository from '../repositories/testResult.repository.js';
import batchRepository from '../repositories/batch.repository.js';
import enrollmentRepository from '../repositories/enrollment.repository.js';
import { NotFoundError, ValidationError } from '../errors.js';

/**
 * Test Service
 * Contains business logic for test management
 */
class TestService {
  /**
   * Create a new test
   * @param {Object} testData - Test details
   * @returns {Promise<Object>} Created test
   */
  async createTest(testData) {
    // Verify batch exists
    const batch = await batchRepository.findById(testData.batch_id);
    if (!batch) {
      throw new NotFoundError('Batch not found');
    }

    // Validate marks
    if (testData.total_marks <= 0) {
      throw new ValidationError('Total marks must be greater than 0');
    }

    if (testData.passing_marks < 0) {
      throw new ValidationError('Passing marks cannot be negative');
    }

    if (testData.passing_marks > testData.total_marks) {
      throw new ValidationError('Passing marks cannot exceed total marks');
    }

    // Validate duration
    if (testData.duration_minutes && testData.duration_minutes <= 0) {
      throw new ValidationError('Duration must be greater than 0');
    }

    return await testRepository.create(testData);
  }

  /**
   * Get test by ID
   * @param {number} id - Test ID
   * @returns {Promise<Object>} Test details
   */
  async getTestById(id) {
    const test = await testRepository.findById(id);
    if (!test) {
      throw new NotFoundError('Test not found');
    }
    return test;
  }

  /**
   * Get all tests
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of tests
   */
  async getAllTests(filters = {}) {
    return await testRepository.findAll(filters);
  }

  /**
   * Update test
   * @param {number} id - Test ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated test
   */
  async updateTest(id, updateData) {
    const test = await testRepository.findById(id);
    if (!test) {
      throw new NotFoundError('Test not found');
    }

    // Validate marks if being updated
    const totalMarks = updateData.total_marks || test.total_marks;
    const passingMarks = updateData.passing_marks !== undefined ? updateData.passing_marks : test.passing_marks;

    if (updateData.total_marks !== undefined && updateData.total_marks <= 0) {
      throw new ValidationError('Total marks must be greater than 0');
    }

    if (updateData.passing_marks !== undefined && updateData.passing_marks < 0) {
      throw new ValidationError('Passing marks cannot be negative');
    }

    if (passingMarks > totalMarks) {
      throw new ValidationError('Passing marks cannot exceed total marks');
    }

    // Validate duration if being updated
    if (updateData.duration_minutes !== undefined && updateData.duration_minutes <= 0) {
      throw new ValidationError('Duration must be greater than 0');
    }

    const updated = await testRepository.update(id, updateData);
    if (!updated) {
      throw new Error('Failed to update test');
    }

    return await testRepository.findById(id);
  }

  /**
   * Delete test
   * @param {number} id - Test ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteTest(id) {
    const test = await testRepository.findById(id);
    if (!test) {
      throw new NotFoundError('Test not found');
    }

    // Check if test has results
    const results = await testResultRepository.findAll({ test_id: id });
    if (results.length > 0) {
      throw new ValidationError('Cannot delete test with existing results');
    }

    return await testRepository.delete(id);
  }

  /**
   * Get test statistics
   * @param {number} id - Test ID
   * @returns {Promise<Object>} Statistics
   */
  async getTestStatistics(id) {
    const test = await testRepository.findById(id);
    if (!test) {
      throw new NotFoundError('Test not found');
    }

    const stats = await testRepository.getStatistics(id);
    return {
      test_id: id,
      test_name: test.test_name,
      test_type: test.test_type,
      total_marks: test.total_marks,
      passing_marks: test.passing_marks,
      ...stats
    };
  }

  /**
   * Enter test result
   * @param {Object} resultData - Test result details
   * @returns {Promise<Object>} Created test result
   */
  async enterTestResult(resultData) {
    const { test_id, enrollment_id, marks_obtained } = resultData;

    // Verify test exists
    const test = await testRepository.findById(test_id);
    if (!test) {
      throw new NotFoundError('Test not found');
    }

    // Verify enrollment exists
    const enrollment = await enrollmentRepository.findById(enrollment_id);
    if (!enrollment) {
      throw new NotFoundError('Enrollment not found');
    }

    // Verify enrollment belongs to test's batch
    if (enrollment.batch_id !== test.batch_id) {
      throw new ValidationError('Enrollment does not belong to this test\'s batch');
    }

    if (enrollment.enrollment_status !== 'ACTIVE') {
      throw new ValidationError('Cannot enter result for inactive enrollment');
    }

    // Check if result already exists
    const existing = await testResultRepository.findByTestAndEnrollment(test_id, enrollment_id);
    if (existing) {
      throw new ValidationError('Result already exists for this test and enrollment');
    }

    // Validate marks
    if (marks_obtained < 0) {
      throw new ValidationError('Marks obtained cannot be negative');
    }

    if (marks_obtained > test.total_marks) {
      throw new ValidationError('Marks obtained cannot exceed total marks');
    }

    // Calculate percentage
    const percentage = (marks_obtained / test.total_marks * 100).toFixed(2);

    // Determine grade (simple grading logic)
    let grade = 'F';
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'B+';
    else if (percentage >= 60) grade = 'B';
    else if (percentage >= 50) grade = 'C';
    else if (percentage >= 40) grade = 'D';

    // Create result
    const result = await testResultRepository.create({
      test_id,
      enrollment_id,
      marks_obtained,
      percentage: parseFloat(percentage),
      grade,
      rank: resultData.rank || null,
      remarks: resultData.remarks || null
    });

    // Calculate ranks for all results in this test
    await testResultRepository.calculateRanks(test_id);

    return await testResultRepository.findById(result.id);
  }

  /**
   * Update test result
   * @param {number} id - Test result ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated test result
   */
  async updateTestResult(id, updateData) {
    const result = await testResultRepository.findById(id);
    if (!result) {
      throw new NotFoundError('Test result not found');
    }

    // If marks are being updated, recalculate percentage and grade
    if (updateData.marks_obtained !== undefined) {
      const test = await testRepository.findById(result.test_id);

      if (updateData.marks_obtained < 0) {
        throw new ValidationError('Marks obtained cannot be negative');
      }

      if (updateData.marks_obtained > test.total_marks) {
        throw new ValidationError('Marks obtained cannot exceed total marks');
      }

      // Recalculate percentage
      updateData.percentage = parseFloat((updateData.marks_obtained / test.total_marks * 100).toFixed(2));

      // Recalculate grade
      const percentage = updateData.percentage;
      if (percentage >= 90) updateData.grade = 'A+';
      else if (percentage >= 80) updateData.grade = 'A';
      else if (percentage >= 70) updateData.grade = 'B+';
      else if (percentage >= 60) updateData.grade = 'B';
      else if (percentage >= 50) updateData.grade = 'C';
      else if (percentage >= 40) updateData.grade = 'D';
      else updateData.grade = 'F';
    }

    const updated = await testResultRepository.update(id, updateData);
    if (!updated) {
      throw new Error('Failed to update test result');
    }

    // Recalculate ranks if marks were updated
    if (updateData.marks_obtained !== undefined) {
      await testResultRepository.calculateRanks(result.test_id);
    }

    return await testResultRepository.findById(id);
  }

  /**
   * Delete test result
   * @param {number} id - Test result ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteTestResult(id) {
    const result = await testResultRepository.findById(id);
    if (!result) {
      throw new NotFoundError('Test result not found');
    }

    const deleted = await testResultRepository.delete(id);

    // Recalculate ranks after deletion
    if (deleted) {
      await testResultRepository.calculateRanks(result.test_id);
    }

    return deleted;
  }

  /**
   * Get toppers for a test
   * @param {number} testId - Test ID
   * @param {number} limit - Number of toppers
   * @returns {Promise<Array>} List of toppers
   */
  async getToppers(testId, limit = 10) {
    const test = await testRepository.findById(testId);
    if (!test) {
      throw new NotFoundError('Test not found');
    }

    return await testResultRepository.getToppers(testId, limit);
  }

  /**
   * Get student test performance
   * @param {number} studentId - Student ID
   * @param {number} batchId - Batch ID (optional)
   * @returns {Promise<Array>} Test performance
   */
  async getStudentPerformance(studentId, batchId = null) {
    return await testResultRepository.getStudentPerformance(studentId, batchId);
  }
}

export default new TestService();
