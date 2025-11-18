import { pool } from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

/**
 * Repository for event_payments table
 * Handles all database operations for payment tracking
 */
class PaymentRepository {
  /**
   * Create a new payment record
   * @param {Object} paymentData - Payment data
   * @returns {Promise<Object>} Created payment
   */
  async create(paymentData) {
    const {
      event_id,
      payment_date,
      payment_to,
      amount,
      payment_type,
      payment_mode,
    } = paymentData;

    const query = `
      INSERT INTO event_payments (
        event_id, payment_date, payment_to, amount, payment_type, payment_mode
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [
      event_id,
      payment_date,
      payment_to,
      amount,
      payment_type,
      payment_mode,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find all payments with filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of payments
   */
  async findAll(filters = {}) {
    let query = `
      SELECT
        ep.*,
        e.event_number,
        e.event_name,
        e.event_date,
        c.first_name || ' ' || COALESCE(c.last_name, '') as client_name
      FROM event_payments ep
      JOIN events e ON ep.event_id = e.id
      LEFT JOIN clients c ON e.client_id = c.id
      WHERE 1=1
    `;

    const values = [];
    let paramCount = 1;

    if (filters.event_id) {
      query += ` AND ep.event_id = $${paramCount}`;
      values.push(filters.event_id);
      paramCount++;
    }

    if (filters.payment_type) {
      query += ` AND ep.payment_type = $${paramCount}`;
      values.push(filters.payment_type);
      paramCount++;
    }

    if (filters.payment_mode) {
      query += ` AND ep.payment_mode = $${paramCount}`;
      values.push(filters.payment_mode);
      paramCount++;
    }

    if (filters.date_from) {
      query += ` AND ep.payment_date >= $${paramCount}`;
      values.push(filters.date_from);
      paramCount++;
    }

    if (filters.date_to) {
      query += ` AND ep.payment_date <= $${paramCount}`;
      values.push(filters.date_to);
      paramCount++;
    }

    if (filters.payment_to) {
      query += ` AND ep.payment_to ILIKE $${paramCount}`;
      values.push(`%${filters.payment_to}%`);
      paramCount++;
    }

    query += ' ORDER BY ep.payment_date DESC, ep.created_at DESC';

    if (filters.limit) {
      query += ` LIMIT $${paramCount}`;
      values.push(filters.limit);
      paramCount++;
    }

    if (filters.offset) {
      query += ` OFFSET $${paramCount}`;
      values.push(filters.offset);
    }

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Find payment by ID
   * @param {string} id - Payment ID
   * @returns {Promise<Object>} Payment data
   */
  async findById(id) {
    const query = `
      SELECT
        ep.*,
        e.event_number,
        e.event_name,
        e.event_date,
        c.first_name || ' ' || COALESCE(c.last_name, '') as client_name,
        c.phone as client_phone
      FROM event_payments ep
      JOIN events e ON ep.event_id = e.id
      LEFT JOIN clients c ON e.client_id = c.id
      WHERE ep.id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Payment');
    }

    return result.rows[0];
  }

  /**
   * Find payments by event ID
   * @param {string} eventId - Event ID
   * @returns {Promise<Array>} List of payments
   */
  async findByEventId(eventId) {
    const query = `
      SELECT * FROM event_payments
      WHERE event_id = $1
      ORDER BY payment_date DESC, created_at DESC
    `;

    const result = await pool.query(query, [eventId]);
    return result.rows;
  }

  /**
   * Get client payments for an event
   * @param {string} eventId - Event ID
   * @returns {Promise<Array>} Client payments
   */
  async getClientPayments(eventId) {
    const query = `
      SELECT * FROM event_payments
      WHERE event_id = $1
        AND payment_type IN ('ADVANCE', 'INSTALLMENT', 'FINAL')
      ORDER BY payment_date DESC
    `;

    const result = await pool.query(query, [eventId]);
    return result.rows;
  }

  /**
   * Get vendor payments for an event
   * @param {string} eventId - Event ID
   * @returns {Promise<Array>} Vendor payments
   */
  async getVendorPayments(eventId) {
    const query = `
      SELECT * FROM event_payments
      WHERE event_id = $1
        AND payment_type = 'VENDOR_PAYMENT'
      ORDER BY payment_date DESC
    `;

    const result = await pool.query(query, [eventId]);
    return result.rows;
  }

  /**
   * Update payment
   * @param {string} id - Payment ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated payment
   */
  async update(id, updateData) {
    const allowedFields = [
      'payment_date',
      'payment_to',
      'amount',
      'payment_type',
      'payment_mode',
    ];

    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach((key) => {
      if (allowedFields.includes(key) && updateData[key] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(updateData[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(id);
    const query = `
      UPDATE event_payments
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new NotFoundError('Payment');
    }

    return result.rows[0];
  }

  /**
   * Delete payment
   * @param {string} id - Payment ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    const query = 'DELETE FROM event_payments WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Payment');
    }

    return true;
  }

  /**
   * Get payment summary for an event
   * @param {string} eventId - Event ID
   * @returns {Promise<Object>} Payment summary
   */
  async getEventPaymentSummary(eventId) {
    const query = `
      SELECT
        COALESCE(SUM(CASE WHEN payment_type IN ('ADVANCE', 'INSTALLMENT', 'FINAL') THEN amount ELSE 0 END), 0) as total_client_payments,
        COALESCE(SUM(CASE WHEN payment_type = 'VENDOR_PAYMENT' THEN amount ELSE 0 END), 0) as total_vendor_payments,
        COUNT(CASE WHEN payment_type IN ('ADVANCE', 'INSTALLMENT', 'FINAL') THEN 1 END) as client_payment_count,
        COUNT(CASE WHEN payment_type = 'VENDOR_PAYMENT' THEN 1 END) as vendor_payment_count,
        e.total_budget,
        e.actual_cost,
        (e.total_budget - COALESCE(SUM(CASE WHEN payment_type IN ('ADVANCE', 'INSTALLMENT', 'FINAL') THEN amount ELSE 0 END), 0)) as client_balance_due
      FROM event_payments ep
      RIGHT JOIN events e ON ep.event_id = e.id
      WHERE e.id = $1
      GROUP BY e.id, e.total_budget, e.actual_cost
    `;

    const result = await pool.query(query, [eventId]);
    return result.rows[0] || {
      total_client_payments: 0,
      total_vendor_payments: 0,
      client_payment_count: 0,
      vendor_payment_count: 0,
      total_budget: 0,
      actual_cost: 0,
      client_balance_due: 0,
    };
  }

  /**
   * Get payments by date range
   * @param {string} startDate - Start date
   * @param {string} endDate - End date
   * @param {string} companyId - Company ID (optional)
   * @returns {Promise<Array>} List of payments
   */
  async getPaymentsByDateRange(startDate, endDate, companyId = null) {
    let query = `
      SELECT
        ep.*,
        e.event_number,
        e.event_name,
        c.first_name || ' ' || COALESCE(c.last_name, '') as client_name
      FROM event_payments ep
      JOIN events e ON ep.event_id = e.id
      LEFT JOIN clients c ON e.client_id = c.id
      WHERE ep.payment_date BETWEEN $1 AND $2
    `;

    const values = [startDate, endDate];

    if (companyId) {
      query += ' AND e.company_id = $3';
      values.push(companyId);
    }

    query += ' ORDER BY ep.payment_date DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Get payment statistics by type
   * @param {string} eventId - Event ID (optional)
   * @returns {Promise<Array>} Payment statistics by type
   */
  async getPaymentStatisticsByType(eventId = null) {
    let query = `
      SELECT
        payment_type,
        COUNT(*) as transaction_count,
        COALESCE(SUM(amount), 0) as total_amount,
        COALESCE(AVG(amount), 0) as average_amount
      FROM event_payments
    `;

    const values = [];
    if (eventId) {
      query += ' WHERE event_id = $1';
      values.push(eventId);
    }

    query += ' GROUP BY payment_type ORDER BY total_amount DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Get payment statistics by mode
   * @param {string} eventId - Event ID (optional)
   * @returns {Promise<Array>} Payment statistics by mode
   */
  async getPaymentStatisticsByMode(eventId = null) {
    let query = `
      SELECT
        payment_mode,
        COUNT(*) as transaction_count,
        COALESCE(SUM(amount), 0) as total_amount
      FROM event_payments
    `;

    const values = [];
    if (eventId) {
      query += ' WHERE event_id = $1';
      values.push(eventId);
    }

    query += ' GROUP BY payment_mode ORDER BY total_amount DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Get payment history for a date range with summary
   * @param {string} startDate - Start date
   * @param {string} endDate - End date
   * @returns {Promise<Object>} Payment history with summary
   */
  async getPaymentHistoryWithSummary(startDate, endDate) {
    const paymentsQuery = `
      SELECT
        ep.*,
        e.event_number,
        e.event_name,
        c.first_name || ' ' || COALESCE(c.last_name, '') as client_name
      FROM event_payments ep
      JOIN events e ON ep.event_id = e.id
      LEFT JOIN clients c ON e.client_id = c.id
      WHERE ep.payment_date BETWEEN $1 AND $2
      ORDER BY ep.payment_date DESC
    `;

    const summaryQuery = `
      SELECT
        COUNT(*) as total_transactions,
        COALESCE(SUM(amount), 0) as total_amount,
        COALESCE(SUM(CASE WHEN payment_type IN ('ADVANCE', 'INSTALLMENT', 'FINAL') THEN amount ELSE 0 END), 0) as client_payments,
        COALESCE(SUM(CASE WHEN payment_type = 'VENDOR_PAYMENT' THEN amount ELSE 0 END), 0) as vendor_payments
      FROM event_payments
      WHERE payment_date BETWEEN $1 AND $2
    `;

    const paymentsResult = await pool.query(paymentsQuery, [startDate, endDate]);
    const summaryResult = await pool.query(summaryQuery, [startDate, endDate]);

    return {
      payments: paymentsResult.rows,
      summary: summaryResult.rows[0],
    };
  }

  /**
   * Get recent payments
   * @param {number} limit - Number of recent payments
   * @param {string} companyId - Company ID (optional)
   * @returns {Promise<Array>} Recent payments
   */
  async getRecentPayments(limit = 10, companyId = null) {
    let query = `
      SELECT
        ep.*,
        e.event_number,
        e.event_name,
        c.first_name || ' ' || COALESCE(c.last_name, '') as client_name
      FROM event_payments ep
      JOIN events e ON ep.event_id = e.id
      LEFT JOIN clients c ON e.client_id = c.id
    `;

    const values = [];
    if (companyId) {
      query += ' WHERE e.company_id = $1';
      values.push(companyId);
    }

    query += ' ORDER BY ep.created_at DESC LIMIT $' + (values.length + 1);
    values.push(limit);

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Check if payment exists
   * @param {string} id - Payment ID
   * @returns {Promise<boolean>} Existence status
   */
  async exists(id) {
    const query = 'SELECT 1 FROM event_payments WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows.length > 0;
  }

  /**
   * Get monthly payment trends
   * @param {number} months - Number of months to look back
   * @param {string} companyId - Company ID (optional)
   * @returns {Promise<Array>} Monthly payment trends
   */
  async getMonthlyPaymentTrends(months = 12, companyId = null) {
    let query = `
      SELECT
        DATE_TRUNC('month', ep.payment_date) as month,
        COUNT(*) as transaction_count,
        COALESCE(SUM(ep.amount), 0) as total_amount,
        COALESCE(SUM(CASE WHEN ep.payment_type IN ('ADVANCE', 'INSTALLMENT', 'FINAL') THEN ep.amount ELSE 0 END), 0) as client_payments,
        COALESCE(SUM(CASE WHEN ep.payment_type = 'VENDOR_PAYMENT' THEN ep.amount ELSE 0 END), 0) as vendor_payments
      FROM event_payments ep
      JOIN events e ON ep.event_id = e.id
      WHERE ep.payment_date >= CURRENT_DATE - INTERVAL '${months} months'
    `;

    const values = [];
    if (companyId) {
      query += ' AND e.company_id = $1';
      values.push(companyId);
    }

    query += ' GROUP BY DATE_TRUNC(\'month\', ep.payment_date) ORDER BY month DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }
}

export default new PaymentRepository();
