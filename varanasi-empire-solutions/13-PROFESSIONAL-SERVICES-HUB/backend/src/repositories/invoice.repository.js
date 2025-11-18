import { pool } from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

/**
 * Invoice Repository
 * Handles database operations for invoices table
 */
class InvoiceRepository {
  /**
   * Create a new invoice
   * @param {Object} invoiceData - Invoice data
   * @returns {Promise<Object>} Created invoice
   */
  async create(invoiceData) {
    const {
      case_id,
      client_id,
      invoice_number,
      invoice_date,
      total_amount,
      payment_status,
    } = invoiceData;

    const query = `
      INSERT INTO invoices (
        case_id, client_id, invoice_number, invoice_date,
        total_amount, payment_status
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [
      case_id,
      client_id,
      invoice_number,
      invoice_date,
      total_amount,
      payment_status || 'PENDING',
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find invoice by ID
   * @param {string} id - Invoice ID
   * @returns {Promise<Object>} Invoice object
   */
  async findById(id) {
    const query = `
      SELECT
        i.*,
        c.case_number,
        c.case_title,
        cl.client_code,
        cl.client_type,
        cl.first_name as client_first_name,
        cl.last_name as client_last_name,
        cl.company_name as client_company_name,
        cl.phone as client_phone,
        cl.email as client_email
      FROM invoices i
      LEFT JOIN cases c ON i.case_id = c.id
      LEFT JOIN clients cl ON i.client_id = cl.id
      WHERE i.id = $1
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Find invoice by invoice number
   * @param {string} invoiceNumber - Invoice number
   * @returns {Promise<Object>} Invoice object
   */
  async findByInvoiceNumber(invoiceNumber) {
    const query = 'SELECT * FROM invoices WHERE invoice_number = $1';
    const result = await pool.query(query, [invoiceNumber]);
    return result.rows[0];
  }

  /**
   * Find all invoices with pagination and filters
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Invoices and pagination info
   */
  async findAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      case_id,
      client_id,
      payment_status,
      start_date,
      end_date,
      search,
    } = options;

    const offset = (page - 1) * limit;
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (case_id) {
      conditions.push(`i.case_id = $${paramIndex++}`);
      values.push(case_id);
    }

    if (client_id) {
      conditions.push(`i.client_id = $${paramIndex++}`);
      values.push(client_id);
    }

    if (payment_status) {
      conditions.push(`i.payment_status = $${paramIndex++}`);
      values.push(payment_status);
    }

    if (start_date) {
      conditions.push(`i.invoice_date >= $${paramIndex++}`);
      values.push(start_date);
    }

    if (end_date) {
      conditions.push(`i.invoice_date <= $${paramIndex++}`);
      values.push(end_date);
    }

    if (search) {
      conditions.push(`i.invoice_number ILIKE $${paramIndex++}`);
      values.push(`%${search}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM invoices i ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    // Get paginated data
    const dataQuery = `
      SELECT
        i.*,
        c.case_number,
        c.case_title,
        cl.client_code,
        cl.client_type,
        cl.first_name as client_first_name,
        cl.last_name as client_last_name,
        cl.company_name as client_company_name
      FROM invoices i
      LEFT JOIN cases c ON i.case_id = c.id
      LEFT JOIN clients cl ON i.client_id = cl.id
      ${whereClause}
      ORDER BY i.invoice_date DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    values.push(limit, offset);
    const dataResult = await pool.query(dataQuery, values);

    return {
      invoices: dataResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update invoice by ID
   * @param {string} id - Invoice ID
   * @param {Object} invoiceData - Updated invoice data
   * @returns {Promise<Object>} Updated invoice
   */
  async update(id, invoiceData) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    const allowedFields = [
      'total_amount',
      'payment_status',
    ];

    allowedFields.forEach((field) => {
      if (invoiceData[field] !== undefined) {
        fields.push(`${field} = $${paramIndex++}`);
        values.push(invoiceData[field]);
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);

    const query = `
      UPDATE invoices
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new NotFoundError('Invoice');
    }

    return result.rows[0];
  }

  /**
   * Update payment status
   * @param {string} id - Invoice ID
   * @param {string} status - Payment status
   * @returns {Promise<Object>} Updated invoice
   */
  async updatePaymentStatus(id, status) {
    const query = `
      UPDATE invoices
      SET payment_status = $1
      WHERE id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [status, id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Invoice');
    }

    return result.rows[0];
  }

  /**
   * Delete invoice by ID
   * @param {string} id - Invoice ID
   * @returns {Promise<Object>} Deleted invoice
   */
  async delete(id) {
    const query = 'DELETE FROM invoices WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Invoice');
    }

    return result.rows[0];
  }

  /**
   * Get outstanding invoices
   * @param {string} clientId - Client ID (optional)
   * @returns {Promise<Array>} List of outstanding invoices
   */
  async getOutstandingInvoices(clientId = null) {
    const conditions = [`i.payment_status IN ('PENDING', 'PARTIAL')`];
    const values = [];
    let paramIndex = 1;

    if (clientId) {
      conditions.push(`i.client_id = $${paramIndex++}`);
      values.push(clientId);
    }

    const query = `
      SELECT
        i.*,
        c.case_number,
        c.case_title,
        cl.client_code,
        cl.client_type,
        cl.first_name as client_first_name,
        cl.last_name as client_last_name,
        cl.company_name as client_company_name,
        cl.phone as client_phone,
        cl.email as client_email,
        EXTRACT(DAY FROM (CURRENT_DATE - i.invoice_date)) as days_overdue
      FROM invoices i
      LEFT JOIN cases c ON i.case_id = c.id
      LEFT JOIN clients cl ON i.client_id = cl.id
      WHERE ${conditions.join(' AND ')}
      ORDER BY i.invoice_date ASC
    `;

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Get invoices by case
   * @param {string} caseId - Case ID
   * @returns {Promise<Array>} List of invoices
   */
  async getInvoicesByCase(caseId) {
    const query = `
      SELECT * FROM invoices
      WHERE case_id = $1
      ORDER BY invoice_date DESC
    `;

    const result = await pool.query(query, [caseId]);
    return result.rows;
  }

  /**
   * Get invoices by client
   * @param {string} clientId - Client ID
   * @returns {Promise<Array>} List of invoices
   */
  async getInvoicesByClient(clientId) {
    const query = `
      SELECT
        i.*,
        c.case_number,
        c.case_title
      FROM invoices i
      LEFT JOIN cases c ON i.case_id = c.id
      WHERE i.client_id = $1
      ORDER BY i.invoice_date DESC
    `;

    const result = await pool.query(query, [clientId]);
    return result.rows;
  }

  /**
   * Get invoice statistics
   * @param {string} firmId - Firm ID (optional)
   * @param {Date} startDate - Start date (optional)
   * @param {Date} endDate - End date (optional)
   * @returns {Promise<Object>} Invoice statistics
   */
  async getInvoiceStatistics(firmId = null, startDate = null, endDate = null) {
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (firmId) {
      conditions.push(`c.firm_id = $${paramIndex++}`);
      values.push(firmId);
    }

    if (startDate) {
      conditions.push(`i.invoice_date >= $${paramIndex++}`);
      values.push(startDate);
    }

    if (endDate) {
      conditions.push(`i.invoice_date <= $${paramIndex++}`);
      values.push(endDate);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
      SELECT
        COUNT(*) as total_invoices,
        COALESCE(SUM(i.total_amount), 0) as total_amount,
        COALESCE(SUM(CASE WHEN i.payment_status = 'PAID' THEN i.total_amount ELSE 0 END), 0) as paid_amount,
        COALESCE(SUM(CASE WHEN i.payment_status = 'PENDING' THEN i.total_amount ELSE 0 END), 0) as pending_amount,
        COALESCE(SUM(CASE WHEN i.payment_status = 'PARTIAL' THEN i.total_amount ELSE 0 END), 0) as partial_amount,
        COUNT(CASE WHEN i.payment_status = 'PAID' THEN 1 END) as paid_count,
        COUNT(CASE WHEN i.payment_status = 'PENDING' THEN 1 END) as pending_count,
        COUNT(CASE WHEN i.payment_status = 'PARTIAL' THEN 1 END) as partial_count
      FROM invoices i
      LEFT JOIN cases c ON i.case_id = c.id
      ${whereClause}
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Get revenue by month
   * @param {string} firmId - Firm ID (optional)
   * @param {number} months - Number of months to look back
   * @returns {Promise<Array>} Monthly revenue data
   */
  async getRevenueByMonth(firmId = null, months = 12) {
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (firmId) {
      conditions.push(`c.firm_id = $${paramIndex++}`);
      values.push(firmId);
    }

    conditions.push(`i.invoice_date >= CURRENT_DATE - INTERVAL '${months} months'`);

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
      SELECT
        TO_CHAR(i.invoice_date, 'YYYY-MM') as month,
        COUNT(*) as invoice_count,
        COALESCE(SUM(i.total_amount), 0) as total_revenue,
        COALESCE(SUM(CASE WHEN i.payment_status = 'PAID' THEN i.total_amount ELSE 0 END), 0) as collected_revenue
      FROM invoices i
      LEFT JOIN cases c ON i.case_id = c.id
      ${whereClause}
      GROUP BY TO_CHAR(i.invoice_date, 'YYYY-MM')
      ORDER BY month DESC
    `;

    const result = await pool.query(query, values);
    return result.rows;
  }
}

export default new InvoiceRepository();
