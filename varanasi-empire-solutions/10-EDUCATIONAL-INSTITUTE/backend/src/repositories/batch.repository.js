import { pool } from '../config/database.js';

/**
 * Batch Repository
 * Handles all database operations for batches
 */
class BatchRepository {
  /**
   * Create a new batch
   * @param {Object} batchData - Batch details
   * @returns {Promise<Object>} Created batch
   */
  async create(batchData) {
    const {
      institute_id,
      course_id,
      name,
      batch_code,
      start_date,
      end_date,
      timings,
      max_students,
      enrolled_students = 0,
      faculty_id,
      classroom,
      status = 'UPCOMING'
    } = batchData;

    const query = `
      INSERT INTO batches (
        institute_id, course_id, name, batch_code, start_date, end_date,
        timings, max_students, enrolled_students, faculty_id, classroom, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const values = [
      institute_id, course_id, name, batch_code, start_date, end_date,
      timings, max_students, enrolled_students, faculty_id, classroom, status
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find batch by ID
   * @param {number} id - Batch ID
   * @returns {Promise<Object|null>} Batch or null
   */
  async findById(id) {
    const query = `
      SELECT
        b.*,
        c.name as course_name,
        c.code as course_code,
        i.name as institute_name,
        f.name as faculty_name,
        (b.max_students - b.enrolled_students) as available_seats
      FROM batches b
      LEFT JOIN courses c ON b.course_id = c.id
      LEFT JOIN institutes i ON b.institute_id = i.id
      LEFT JOIN faculty f ON b.faculty_id = f.id
      WHERE b.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Find batch by code
   * @param {string} batchCode - Batch code
   * @param {number} instituteId - Institute ID
   * @returns {Promise<Object|null>} Batch or null
   */
  async findByCode(batchCode, instituteId) {
    const query = 'SELECT * FROM batches WHERE batch_code = $1 AND institute_id = $2';
    const result = await pool.query(query, [batchCode, instituteId]);
    return result.rows[0] || null;
  }

  /**
   * Get all batches with filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of batches
   */
  async findAll(filters = {}) {
    let query = `
      SELECT
        b.*,
        c.name as course_name,
        c.code as course_code,
        i.name as institute_name,
        f.name as faculty_name,
        (b.max_students - b.enrolled_students) as available_seats
      FROM batches b
      LEFT JOIN courses c ON b.course_id = c.id
      LEFT JOIN institutes i ON b.institute_id = i.id
      LEFT JOIN faculty f ON b.faculty_id = f.id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filters.institute_id) {
      query += ` AND b.institute_id = $${paramCount}`;
      values.push(filters.institute_id);
      paramCount++;
    }

    if (filters.course_id) {
      query += ` AND b.course_id = $${paramCount}`;
      values.push(filters.course_id);
      paramCount++;
    }

    if (filters.faculty_id) {
      query += ` AND b.faculty_id = $${paramCount}`;
      values.push(filters.faculty_id);
      paramCount++;
    }

    if (filters.status) {
      query += ` AND b.status = $${paramCount}`;
      values.push(filters.status);
      paramCount++;
    }

    if (filters.has_available_seats) {
      query += ` AND (b.max_students - b.enrolled_students) > 0`;
    }

    if (filters.search) {
      query += ` AND (b.name ILIKE $${paramCount} OR b.batch_code ILIKE $${paramCount})`;
      values.push(`%${filters.search}%`);
      paramCount++;
    }

    query += ' ORDER BY b.start_date DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Update batch
   * @param {number} id - Batch ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object|null>} Updated batch or null
   */
  async update(id, updateData) {
    const allowedFields = [
      'name', 'batch_code', 'start_date', 'end_date', 'timings',
      'max_students', 'enrolled_students', 'faculty_id', 'classroom', 'status'
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
      UPDATE batches
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Increment enrolled students count
   * @param {number} batchId - Batch ID
   * @param {Object} client - Database client for transaction
   * @returns {Promise<Object>} Updated batch
   */
  async incrementEnrolledStudents(batchId, client = pool) {
    const query = `
      UPDATE batches
      SET enrolled_students = enrolled_students + 1,
          status = CASE
            WHEN (enrolled_students + 1) >= max_students THEN 'FULL'
            ELSE status
          END,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const result = await client.query(query, [batchId]);
    return result.rows[0];
  }

  /**
   * Decrement enrolled students count
   * @param {number} batchId - Batch ID
   * @param {Object} client - Database client for transaction
   * @returns {Promise<Object>} Updated batch
   */
  async decrementEnrolledStudents(batchId, client = pool) {
    const query = `
      UPDATE batches
      SET enrolled_students = GREATEST(enrolled_students - 1, 0),
          status = CASE
            WHEN status = 'FULL' AND (enrolled_students - 1) < max_students THEN 'ONGOING'
            ELSE status
          END,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const result = await client.query(query, [batchId]);
    return result.rows[0];
  }

  /**
   * Delete batch
   * @param {number} id - Batch ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    const query = 'DELETE FROM batches WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Get batch statistics
   * @param {number} batchId - Batch ID
   * @returns {Promise<Object>} Statistics
   */
  async getStatistics(batchId) {
    const query = `
      SELECT
        b.enrolled_students,
        b.max_students,
        (b.max_students - b.enrolled_students) as available_seats,
        COUNT(DISTINCT e.id) as total_enrollments,
        COUNT(DISTINCT CASE WHEN e.enrollment_status = 'ACTIVE' THEN e.id END) as active_enrollments,
        COALESCE(SUM(e.final_fee), 0) as total_fee,
        COALESCE(SUM(e.fee_paid), 0) as fee_collected,
        COALESCE(SUM(e.balance_fee), 0) as fee_pending
      FROM batches b
      LEFT JOIN enrollments e ON b.id = e.batch_id
      WHERE b.id = $1
      GROUP BY b.id, b.enrolled_students, b.max_students
    `;
    const result = await pool.query(query, [batchId]);
    return result.rows[0];
  }

  /**
   * Get available batches for enrollment
   * @param {number} courseId - Course ID
   * @returns {Promise<Array>} List of available batches
   */
  async getAvailableBatches(courseId) {
    const query = `
      SELECT
        b.*,
        (b.max_students - b.enrolled_students) as available_seats
      FROM batches b
      WHERE b.course_id = $1
        AND b.status IN ('UPCOMING', 'ONGOING')
        AND (b.max_students - b.enrolled_students) > 0
      ORDER BY b.start_date ASC
    `;
    const result = await pool.query(query, [courseId]);
    return result.rows;
  }
}

export default new BatchRepository();
