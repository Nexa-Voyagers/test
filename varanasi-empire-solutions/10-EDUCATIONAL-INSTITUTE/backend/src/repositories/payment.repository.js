import { pool } from '../config/database.js';

/**
 * Payment Repository
 * Handles all database operations for fee payments
 */
class PaymentRepository {
  /**
   * Create a new payment
   * @param {Object} paymentData - Payment details
   * @param {Object} client - Database client for transaction
   * @returns {Promise<Object>} Created payment
   */
  async create(paymentData, client = pool) {
    const {
      enrollment_id,
      payment_date,
      amount,
      payment_method,
      transaction_id,
      received_by,
      remarks
    } = paymentData;

    const query = `
      INSERT INTO fee_payments (
        enrollment_id, payment_date, amount, payment_method,
        transaction_id, received_by, remarks
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [
      enrollment_id, payment_date, amount, payment_method,
      transaction_id, received_by, remarks
    ];

    const result = await client.query(query, values);
    return result.rows[0];
  }

  /**
   * Find payment by ID
   * @param {number} id - Payment ID
   * @returns {Promise<Object|null>} Payment or null
   */
  async findById(id) {
    const query = `
      SELECT
        fp.*,
        e.student_id,
        e.final_fee,
        e.fee_paid,
        e.balance_fee,
        s.name as student_name,
        s.enrollment_number,
        s.phone as student_phone,
        b.name as batch_name,
        c.name as course_name
      FROM fee_payments fp
      LEFT JOIN enrollments e ON fp.enrollment_id = e.id
      LEFT JOIN students s ON e.student_id = s.id
      LEFT JOIN batches b ON e.batch_id = b.id
      LEFT JOIN courses c ON b.course_id = c.id
      WHERE fp.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Find payment by transaction ID
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<Object|null>} Payment or null
   */
  async findByTransactionId(transactionId) {
    const query = 'SELECT * FROM fee_payments WHERE transaction_id = $1';
    const result = await pool.query(query, [transactionId]);
    return result.rows[0] || null;
  }

  /**
   * Get all payments with filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of payments
   */
  async findAll(filters = {}) {
    let query = `
      SELECT
        fp.*,
        e.student_id,
        e.final_fee,
        e.fee_paid,
        e.balance_fee,
        s.name as student_name,
        s.enrollment_number,
        s.phone as student_phone,
        b.name as batch_name,
        b.batch_code,
        c.name as course_name,
        i.name as institute_name
      FROM fee_payments fp
      LEFT JOIN enrollments e ON fp.enrollment_id = e.id
      LEFT JOIN students s ON e.student_id = s.id
      LEFT JOIN batches b ON e.batch_id = b.id
      LEFT JOIN courses c ON b.course_id = c.id
      LEFT JOIN institutes i ON b.institute_id = i.id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filters.enrollment_id) {
      query += ` AND fp.enrollment_id = $${paramCount}`;
      values.push(filters.enrollment_id);
      paramCount++;
    }

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

    if (filters.payment_method) {
      query += ` AND fp.payment_method = $${paramCount}`;
      values.push(filters.payment_method);
      paramCount++;
    }

    if (filters.date_from) {
      query += ` AND fp.payment_date >= $${paramCount}`;
      values.push(filters.date_from);
      paramCount++;
    }

    if (filters.date_to) {
      query += ` AND fp.payment_date <= $${paramCount}`;
      values.push(filters.date_to);
      paramCount++;
    }

    query += ' ORDER BY fp.payment_date DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Update payment
   * @param {number} id - Payment ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object|null>} Updated payment or null
   */
  async update(id, updateData) {
    const allowedFields = ['payment_method', 'transaction_id', 'remarks'];

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
      UPDATE fee_payments
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Delete payment
   * @param {number} id - Payment ID
   * @param {Object} client - Database client for transaction
   * @returns {Promise<boolean>} Success status
   */
  async delete(id, client = pool) {
    const query = 'DELETE FROM fee_payments WHERE id = $1 RETURNING *';
    const result = await client.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Get payment history for enrollment
   * @param {number} enrollmentId - Enrollment ID
   * @returns {Promise<Array>} Payment history
   */
  async getPaymentHistory(enrollmentId) {
    const query = `
      SELECT *
      FROM fee_payments
      WHERE enrollment_id = $1
      ORDER BY payment_date DESC
    `;
    const result = await pool.query(query, [enrollmentId]);
    return result.rows;
  }

  /**
   * Get pending payments
   * @param {number} instituteId - Institute ID
   * @returns {Promise<Array>} List of enrollments with pending payments
   */
  async getPendingPayments(instituteId) {
    const query = `
      SELECT
        e.*,
        s.name as student_name,
        s.enrollment_number,
        s.phone as student_phone,
        s.parent_phone,
        b.name as batch_name,
        c.name as course_name,
        COALESCE(SUM(fp.amount), 0) as total_paid_amount,
        COUNT(fp.id) as payment_count,
        MAX(fp.payment_date) as last_payment_date
      FROM enrollments e
      LEFT JOIN students s ON e.student_id = s.id
      LEFT JOIN batches b ON e.batch_id = b.id
      LEFT JOIN courses c ON b.course_id = c.id
      LEFT JOIN fee_payments fp ON e.id = fp.enrollment_id
      WHERE b.institute_id = $1
        AND e.balance_fee > 0
        AND e.enrollment_status = 'ACTIVE'
      GROUP BY e.id, s.name, s.enrollment_number, s.phone, s.parent_phone, b.name, c.name
      ORDER BY e.balance_fee DESC
    `;
    const result = await pool.query(query, [instituteId]);
    return result.rows;
  }

  /**
   * Get payment statistics
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Object>} Payment statistics
   */
  async getStatistics(filters = {}) {
    let query = `
      SELECT
        COUNT(*) as total_payments,
        COALESCE(SUM(fp.amount), 0) as total_amount,
        COALESCE(AVG(fp.amount), 0) as average_amount,
        COUNT(DISTINCT fp.enrollment_id) as unique_enrollments,
        COUNT(*) FILTER (WHERE fp.payment_method = 'CASH') as cash_payments,
        COUNT(*) FILTER (WHERE fp.payment_method = 'CARD') as card_payments,
        COUNT(*) FILTER (WHERE fp.payment_method = 'UPI') as upi_payments,
        COUNT(*) FILTER (WHERE fp.payment_method = 'BANK_TRANSFER') as bank_transfer_payments
      FROM fee_payments fp
      LEFT JOIN enrollments e ON fp.enrollment_id = e.id
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

    if (filters.date_from) {
      query += ` AND fp.payment_date >= $${paramCount}`;
      values.push(filters.date_from);
      paramCount++;
    }

    if (filters.date_to) {
      query += ` AND fp.payment_date <= $${paramCount}`;
      values.push(filters.date_to);
      paramCount++;
    }

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Get daily collection report
   * @param {number} instituteId - Institute ID
   * @param {string} date - Date
   * @returns {Promise<Object>} Daily collection report
   */
  async getDailyCollection(instituteId, date) {
    const query = `
      SELECT
        DATE(fp.payment_date) as collection_date,
        COUNT(*) as total_payments,
        SUM(fp.amount) as total_amount,
        COUNT(DISTINCT fp.enrollment_id) as unique_students,
        json_agg(
          json_build_object(
            'payment_id', fp.id,
            'student_name', s.name,
            'amount', fp.amount,
            'payment_method', fp.payment_method,
            'transaction_id', fp.transaction_id
          ) ORDER BY fp.created_at
        ) as payments
      FROM fee_payments fp
      LEFT JOIN enrollments e ON fp.enrollment_id = e.id
      LEFT JOIN students s ON e.student_id = s.id
      LEFT JOIN batches b ON e.batch_id = b.id
      WHERE b.institute_id = $1 AND DATE(fp.payment_date) = $2
      GROUP BY DATE(fp.payment_date)
    `;
    const result = await pool.query(query, [instituteId, date]);
    return result.rows[0] || null;
  }
}

export default new PaymentRepository();
