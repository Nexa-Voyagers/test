import { pool } from '../config/database.js';

/**
 * Test Repository
 * Handles all database operations for tests
 */
class TestRepository {
  /**
   * Create a new test
   * @param {Object} testData - Test details
   * @returns {Promise<Object>} Created test
   */
  async create(testData) {
    const {
      batch_id,
      test_name,
      test_type,
      test_date,
      total_marks,
      passing_marks,
      duration_minutes,
      syllabus_covered,
      instructions
    } = testData;

    const query = `
      INSERT INTO tests (
        batch_id, test_name, test_type, test_date, total_marks,
        passing_marks, duration_minutes, syllabus_covered, instructions
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      batch_id, test_name, test_type, test_date, total_marks,
      passing_marks, duration_minutes, syllabus_covered, instructions
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find test by ID
   * @param {number} id - Test ID
   * @returns {Promise<Object|null>} Test or null
   */
  async findById(id) {
    const query = `
      SELECT
        t.*,
        b.name as batch_name,
        b.batch_code,
        c.name as course_name,
        c.code as course_code
      FROM tests t
      LEFT JOIN batches b ON t.batch_id = b.id
      LEFT JOIN courses c ON b.course_id = c.id
      WHERE t.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Get all tests with filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of tests
   */
  async findAll(filters = {}) {
    let query = `
      SELECT
        t.*,
        b.name as batch_name,
        b.batch_code,
        c.name as course_name,
        c.code as course_code
      FROM tests t
      LEFT JOIN batches b ON t.batch_id = b.id
      LEFT JOIN courses c ON b.course_id = c.id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filters.batch_id) {
      query += ` AND t.batch_id = $${paramCount}`;
      values.push(filters.batch_id);
      paramCount++;
    }

    if (filters.test_type) {
      query += ` AND t.test_type = $${paramCount}`;
      values.push(filters.test_type);
      paramCount++;
    }

    if (filters.date_from) {
      query += ` AND t.test_date >= $${paramCount}`;
      values.push(filters.date_from);
      paramCount++;
    }

    if (filters.date_to) {
      query += ` AND t.test_date <= $${paramCount}`;
      values.push(filters.date_to);
      paramCount++;
    }

    query += ' ORDER BY t.test_date DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Update test
   * @param {number} id - Test ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object|null>} Updated test or null
   */
  async update(id, updateData) {
    const allowedFields = [
      'test_name', 'test_type', 'test_date', 'total_marks',
      'passing_marks', 'duration_minutes', 'syllabus_covered', 'instructions'
    ];

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
      UPDATE tests
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Delete test
   * @param {number} id - Test ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    const query = 'DELETE FROM tests WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Get test statistics
   * @param {number} testId - Test ID
   * @returns {Promise<Object>} Statistics
   */
  async getStatistics(testId) {
    const query = `
      SELECT
        COUNT(*) as total_students,
        COUNT(*) FILTER (WHERE marks_obtained >= t.passing_marks) as passed_count,
        COUNT(*) FILTER (WHERE marks_obtained < t.passing_marks) as failed_count,
        COALESCE(AVG(marks_obtained), 0) as average_marks,
        COALESCE(MAX(marks_obtained), 0) as highest_marks,
        COALESCE(MIN(marks_obtained), 0) as lowest_marks,
        COALESCE(AVG(percentage), 0) as average_percentage
      FROM test_results tr
      RIGHT JOIN tests t ON tr.test_id = t.id
      WHERE t.id = $1
      GROUP BY t.id, t.passing_marks
    `;
    const result = await pool.query(query, [testId]);
    return result.rows[0] || {
      total_students: 0,
      passed_count: 0,
      failed_count: 0,
      average_marks: 0,
      highest_marks: 0,
      lowest_marks: 0,
      average_percentage: 0
    };
  }
}

export default new TestRepository();
