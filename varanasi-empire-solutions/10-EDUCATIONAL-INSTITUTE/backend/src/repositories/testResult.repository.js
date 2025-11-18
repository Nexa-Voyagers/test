import { pool } from '../config/database.js';

/**
 * Test Result Repository
 * Handles all database operations for test results
 */
class TestResultRepository {
  /**
   * Create a new test result
   * @param {Object} resultData - Test result details
   * @returns {Promise<Object>} Created test result
   */
  async create(resultData) {
    const {
      test_id,
      enrollment_id,
      marks_obtained,
      percentage,
      grade,
      rank,
      remarks
    } = resultData;

    const query = `
      INSERT INTO test_results (
        test_id, enrollment_id, marks_obtained, percentage,
        grade, rank, remarks
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [test_id, enrollment_id, marks_obtained, percentage, grade, rank, remarks];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find test result by ID
   * @param {number} id - Test result ID
   * @returns {Promise<Object|null>} Test result or null
   */
  async findById(id) {
    const query = `
      SELECT
        tr.*,
        t.test_name,
        t.total_marks,
        t.passing_marks,
        s.name as student_name,
        s.enrollment_number,
        b.name as batch_name
      FROM test_results tr
      LEFT JOIN tests t ON tr.test_id = t.id
      LEFT JOIN enrollments e ON tr.enrollment_id = e.id
      LEFT JOIN students s ON e.student_id = s.id
      LEFT JOIN batches b ON e.batch_id = b.id
      WHERE tr.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Find test result by test and enrollment
   * @param {number} testId - Test ID
   * @param {number} enrollmentId - Enrollment ID
   * @returns {Promise<Object|null>} Test result or null
   */
  async findByTestAndEnrollment(testId, enrollmentId) {
    const query = 'SELECT * FROM test_results WHERE test_id = $1 AND enrollment_id = $2';
    const result = await pool.query(query, [testId, enrollmentId]);
    return result.rows[0] || null;
  }

  /**
   * Get all test results with filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of test results
   */
  async findAll(filters = {}) {
    let query = `
      SELECT
        tr.*,
        t.test_name,
        t.total_marks,
        t.passing_marks,
        s.name as student_name,
        s.enrollment_number,
        b.name as batch_name
      FROM test_results tr
      LEFT JOIN tests t ON tr.test_id = t.id
      LEFT JOIN enrollments e ON tr.enrollment_id = e.id
      LEFT JOIN students s ON e.student_id = s.id
      LEFT JOIN batches b ON e.batch_id = b.id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filters.test_id) {
      query += ` AND tr.test_id = $${paramCount}`;
      values.push(filters.test_id);
      paramCount++;
    }

    if (filters.enrollment_id) {
      query += ` AND tr.enrollment_id = $${paramCount}`;
      values.push(filters.enrollment_id);
      paramCount++;
    }

    if (filters.batch_id) {
      query += ` AND e.batch_id = $${paramCount}`;
      values.push(filters.batch_id);
      paramCount++;
    }

    if (filters.student_id) {
      query += ` AND e.student_id = $${paramCount}`;
      values.push(filters.student_id);
      paramCount++;
    }

    query += ' ORDER BY tr.rank ASC NULLS LAST, tr.percentage DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Update test result
   * @param {number} id - Test result ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object|null>} Updated test result or null
   */
  async update(id, updateData) {
    const allowedFields = ['marks_obtained', 'percentage', 'grade', 'rank', 'remarks'];

    const updates = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key) && updateData[key] !== undefined) {
        updates.push(`${key} = $${paramCount}`);
        values.push(updateData[key]);
        paramCount++;
      }
    });

    if (updates.length === 0) {
      return null;
    }

    values.push(id);
    const query = `
      UPDATE test_results
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Calculate and update ranks for a test
   * @param {number} testId - Test ID
   * @returns {Promise<Array>} Updated test results with ranks
   */
  async calculateRanks(testId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Get all results for the test ordered by percentage
      const resultsQuery = `
        SELECT id, percentage
        FROM test_results
        WHERE test_id = $1
        ORDER BY percentage DESC, marks_obtained DESC
      `;
      const results = await client.query(resultsQuery, [testId]);

      // Update ranks
      let rank = 1;
      for (const result of results.rows) {
        await client.query(
          'UPDATE test_results SET rank = $1 WHERE id = $2',
          [rank, result.id]
        );
        rank++;
      }

      await client.query('COMMIT');

      // Return updated results
      const updatedResults = await pool.query(
        'SELECT * FROM test_results WHERE test_id = $1 ORDER BY rank ASC',
        [testId]
      );
      return updatedResults.rows;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Delete test result
   * @param {number} id - Test result ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    const query = 'DELETE FROM test_results WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Get toppers for a test
   * @param {number} testId - Test ID
   * @param {number} limit - Number of toppers
   * @returns {Promise<Array>} List of toppers
   */
  async getToppers(testId, limit = 10) {
    const query = `
      SELECT
        tr.*,
        s.name as student_name,
        s.enrollment_number,
        t.test_name,
        t.total_marks
      FROM test_results tr
      LEFT JOIN enrollments e ON tr.enrollment_id = e.id
      LEFT JOIN students s ON e.student_id = s.id
      LEFT JOIN tests t ON tr.test_id = t.id
      WHERE tr.test_id = $1
      ORDER BY tr.rank ASC
      LIMIT $2
    `;
    const result = await pool.query(query, [testId, limit]);
    return result.rows;
  }

  /**
   * Get student test performance
   * @param {number} studentId - Student ID
   * @param {number} batchId - Batch ID (optional)
   * @returns {Promise<Array>} Test performance
   */
  async getStudentPerformance(studentId, batchId = null) {
    let query = `
      SELECT
        tr.*,
        t.test_name,
        t.test_type,
        t.test_date,
        t.total_marks,
        t.passing_marks,
        b.name as batch_name,
        c.name as course_name
      FROM test_results tr
      LEFT JOIN tests t ON tr.test_id = t.id
      LEFT JOIN enrollments e ON tr.enrollment_id = e.id
      LEFT JOIN batches b ON t.batch_id = b.id
      LEFT JOIN courses c ON b.course_id = c.id
      WHERE e.student_id = $1
    `;
    const values = [studentId];

    if (batchId) {
      query += ` AND b.id = $2`;
      values.push(batchId);
    }

    query += ' ORDER BY t.test_date DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }
}

export default new TestResultRepository();
