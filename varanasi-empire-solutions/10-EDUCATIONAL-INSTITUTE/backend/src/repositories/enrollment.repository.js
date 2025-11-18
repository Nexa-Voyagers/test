import { pool } from '../config/database.js';

/**
 * Enrollment Repository
 * Handles all database operations for enrollments
 */
class EnrollmentRepository {
  /**
   * Create a new enrollment
   * @param {Object} enrollmentData - Enrollment details
   * @param {Object} client - Database client for transaction
   * @returns {Promise<Object>} Created enrollment
   */
  async create(enrollmentData, client = pool) {
    const {
      student_id,
      batch_id,
      enrollment_date,
      final_fee,
      discount_amount = 0,
      fee_paid = 0,
      balance_fee,
      payment_status = 'PENDING',
      enrollment_status = 'ACTIVE'
    } = enrollmentData;

    const query = `
      INSERT INTO enrollments (
        student_id, batch_id, enrollment_date, final_fee, discount_amount,
        fee_paid, balance_fee, payment_status, enrollment_status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      student_id, batch_id, enrollment_date, final_fee, discount_amount,
      fee_paid, balance_fee, payment_status, enrollment_status
    ];

    const result = await client.query(query, values);
    return result.rows[0];
  }

  /**
   * Find enrollment by ID
   * @param {number} id - Enrollment ID
   * @returns {Promise<Object|null>} Enrollment or null
   */
  async findById(id) {
    const query = `
      SELECT
        e.*,
        s.name as student_name,
        s.enrollment_number,
        s.phone as student_phone,
        b.name as batch_name,
        b.batch_code,
        c.name as course_name,
        c.code as course_code
      FROM enrollments e
      LEFT JOIN students s ON e.student_id = s.id
      LEFT JOIN batches b ON e.batch_id = b.id
      LEFT JOIN courses c ON b.course_id = c.id
      WHERE e.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Find enrollment by student and batch
   * @param {number} studentId - Student ID
   * @param {number} batchId - Batch ID
   * @returns {Promise<Object|null>} Enrollment or null
   */
  async findByStudentAndBatch(studentId, batchId) {
    const query = 'SELECT * FROM enrollments WHERE student_id = $1 AND batch_id = $2';
    const result = await pool.query(query, [studentId, batchId]);
    return result.rows[0] || null;
  }

  /**
   * Get all enrollments with filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of enrollments
   */
  async findAll(filters = {}) {
    let query = `
      SELECT
        e.*,
        s.name as student_name,
        s.enrollment_number,
        s.phone as student_phone,
        b.name as batch_name,
        b.batch_code,
        c.name as course_name,
        c.code as course_code,
        i.name as institute_name
      FROM enrollments e
      LEFT JOIN students s ON e.student_id = s.id
      LEFT JOIN batches b ON e.batch_id = b.id
      LEFT JOIN courses c ON b.course_id = c.id
      LEFT JOIN institutes i ON b.institute_id = i.id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filters.student_id) {
      query += ` AND e.student_id = $${paramCount}`;
      values.push(filters.student_id);
      paramCount++;
    }

    if (filters.batch_id) {
      query += ` AND e.batch_id = $${paramCount}`;
      values.push(filters.batch_id);
      paramCount++;
    }

    if (filters.institute_id) {
      query += ` AND b.institute_id = $${paramCount}`;
      values.push(filters.institute_id);
      paramCount++;
    }

    if (filters.payment_status) {
      query += ` AND e.payment_status = $${paramCount}`;
      values.push(filters.payment_status);
      paramCount++;
    }

    if (filters.enrollment_status) {
      query += ` AND e.enrollment_status = $${paramCount}`;
      values.push(filters.enrollment_status);
      paramCount++;
    }

    if (filters.has_pending_fee) {
      query += ` AND e.balance_fee > 0`;
    }

    query += ' ORDER BY e.enrollment_date DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Update enrollment
   * @param {number} id - Enrollment ID
   * @param {Object} updateData - Data to update
   * @param {Object} client - Database client for transaction
   * @returns {Promise<Object|null>} Updated enrollment or null
   */
  async update(id, updateData, client = pool) {
    const allowedFields = [
      'final_fee', 'discount_amount', 'fee_paid', 'balance_fee',
      'payment_status', 'enrollment_status'
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
      UPDATE enrollments
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await client.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Update payment details
   * @param {number} id - Enrollment ID
   * @param {number} amountPaid - Amount paid
   * @param {Object} client - Database client for transaction
   * @returns {Promise<Object>} Updated enrollment
   */
  async updatePayment(id, amountPaid, client = pool) {
    const query = `
      UPDATE enrollments
      SET fee_paid = fee_paid + $2,
          balance_fee = balance_fee - $2,
          payment_status = CASE
            WHEN (balance_fee - $2) <= 0 THEN 'PAID'
            WHEN (fee_paid + $2) > 0 THEN 'PARTIAL'
            ELSE 'PENDING'
          END,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const result = await client.query(query, [id, amountPaid]);
    return result.rows[0];
  }

  /**
   * Delete enrollment
   * @param {number} id - Enrollment ID
   * @param {Object} client - Database client for transaction
   * @returns {Promise<boolean>} Success status
   */
  async delete(id, client = pool) {
    const query = 'DELETE FROM enrollments WHERE id = $1';
    const result = await client.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Get fee defaulters
   * @param {number} instituteId - Institute ID
   * @param {number} daysOverdue - Days overdue (optional)
   * @returns {Promise<Array>} List of defaulters
   */
  async getFeeDefaulters(instituteId, daysOverdue = null) {
    let query = `
      SELECT
        e.*,
        s.name as student_name,
        s.enrollment_number,
        s.phone as student_phone,
        s.parent_phone,
        b.name as batch_name,
        c.name as course_name,
        EXTRACT(DAY FROM (CURRENT_DATE - e.enrollment_date)) as days_enrolled
      FROM enrollments e
      LEFT JOIN students s ON e.student_id = s.id
      LEFT JOIN batches b ON e.batch_id = b.id
      LEFT JOIN courses c ON b.course_id = c.id
      WHERE b.institute_id = $1
        AND e.balance_fee > 0
        AND e.enrollment_status = 'ACTIVE'
    `;
    const values = [instituteId];

    if (daysOverdue) {
      query += ` AND EXTRACT(DAY FROM (CURRENT_DATE - e.enrollment_date)) > $2`;
      values.push(daysOverdue);
    }

    query += ' ORDER BY e.balance_fee DESC, e.enrollment_date ASC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Get enrollment statistics
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Object>} Statistics
   */
  async getStatistics(filters = {}) {
    let query = `
      SELECT
        COUNT(*) as total_enrollments,
        COUNT(*) FILTER (WHERE enrollment_status = 'ACTIVE') as active_enrollments,
        COALESCE(SUM(final_fee), 0) as total_fee,
        COALESCE(SUM(fee_paid), 0) as total_collected,
        COALESCE(SUM(balance_fee), 0) as total_pending,
        COUNT(*) FILTER (WHERE payment_status = 'PAID') as fully_paid_count,
        COUNT(*) FILTER (WHERE payment_status = 'PARTIAL') as partial_paid_count,
        COUNT(*) FILTER (WHERE payment_status = 'PENDING') as pending_count
      FROM enrollments e
      LEFT JOIN batches b ON e.batch_id = b.id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filters.institute_id) {
      query += ` AND b.institute_id = $${paramCount}`;
      values.push(filters.institute_id);
      paramCount++;
    }

    if (filters.batch_id) {
      query += ` AND e.batch_id = $${paramCount}`;
      values.push(filters.batch_id);
      paramCount++;
    }

    const result = await pool.query(query, values);
    return result.rows[0];
  }
}

export default new EnrollmentRepository();
