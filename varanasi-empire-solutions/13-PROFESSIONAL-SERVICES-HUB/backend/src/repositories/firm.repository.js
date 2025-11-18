import { pool } from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

/**
 * Service Firm Repository
 * Handles database operations for service_firms table
 */
class FirmRepository {
  /**
   * Create a new service firm
   * @param {Object} firmData - Firm data
   * @returns {Promise<Object>} Created firm
   */
  async create(firmData) {
    const {
      firm_name,
      firm_type,
      registration_number,
      address,
      phone,
      email,
    } = firmData;

    const query = `
      INSERT INTO service_firms (
        firm_name, firm_type, registration_number, address, phone, email
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [firm_name, firm_type, registration_number, address, phone, email];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find firm by ID
   * @param {string} id - Firm ID
   * @returns {Promise<Object>} Firm object
   */
  async findById(id) {
    const query = 'SELECT * FROM service_firms WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Find all firms with pagination and filters
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Firms and pagination info
   */
  async findAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      firm_type,
      is_active,
      search,
    } = options;

    const offset = (page - 1) * limit;
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (firm_type) {
      conditions.push(`firm_type = $${paramIndex++}`);
      values.push(firm_type);
    }

    if (is_active !== undefined) {
      conditions.push(`is_active = $${paramIndex++}`);
      values.push(is_active);
    }

    if (search) {
      conditions.push(`(firm_name ILIKE $${paramIndex} OR registration_number ILIKE $${paramIndex})`);
      values.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM service_firms ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    // Get paginated data
    const dataQuery = `
      SELECT * FROM service_firms
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    values.push(limit, offset);
    const dataResult = await pool.query(dataQuery, values);

    return {
      firms: dataResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update firm by ID
   * @param {string} id - Firm ID
   * @param {Object} firmData - Updated firm data
   * @returns {Promise<Object>} Updated firm
   */
  async update(id, firmData) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    const allowedFields = [
      'firm_name',
      'firm_type',
      'registration_number',
      'address',
      'phone',
      'email',
      'is_active',
    ];

    allowedFields.forEach((field) => {
      if (firmData[field] !== undefined) {
        fields.push(`${field} = $${paramIndex++}`);
        values.push(firmData[field]);
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);

    const query = `
      UPDATE service_firms
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new NotFoundError('Service firm');
    }

    return result.rows[0];
  }

  /**
   * Delete firm by ID (soft delete)
   * @param {string} id - Firm ID
   * @returns {Promise<Object>} Deleted firm
   */
  async delete(id) {
    const query = `
      UPDATE service_firms
      SET is_active = false
      WHERE id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Service firm');
    }

    return result.rows[0];
  }

  /**
   * Get firms by type
   * @param {string} firmType - Firm type (LEGAL, CONSULTING, etc.)
   * @returns {Promise<Array>} List of firms
   */
  async findByType(firmType) {
    const query = `
      SELECT * FROM service_firms
      WHERE firm_type = $1 AND is_active = true
      ORDER BY firm_name
    `;

    const result = await pool.query(query, [firmType]);
    return result.rows;
  }

  /**
   * Get firm statistics
   * @param {string} firmId - Firm ID
   * @returns {Promise<Object>} Firm statistics
   */
  async getStatistics(firmId) {
    const query = `
      SELECT
        sf.id,
        sf.firm_name,
        COUNT(DISTINCT p.id) as total_professionals,
        COUNT(DISTINCT c.id) as total_cases,
        COUNT(DISTINCT CASE WHEN c.case_status IN ('OPEN', 'IN_PROGRESS') THEN c.id END) as active_cases,
        COUNT(DISTINCT CASE WHEN c.case_status = 'CLOSED' THEN c.id END) as closed_cases,
        COUNT(DISTINCT CASE WHEN c.case_status = 'WON' THEN c.id END) as won_cases,
        COUNT(DISTINCT CASE WHEN c.case_status = 'LOST' THEN c.id END) as lost_cases,
        COALESCE(SUM(i.total_amount), 0) as total_revenue,
        COALESCE(SUM(CASE WHEN i.payment_status = 'PENDING' THEN i.total_amount ELSE 0 END), 0) as pending_payments
      FROM service_firms sf
      LEFT JOIN professionals p ON sf.id = p.firm_id AND p.is_active = true
      LEFT JOIN cases c ON sf.id = c.firm_id
      LEFT JOIN invoices i ON c.id = i.case_id
      WHERE sf.id = $1
      GROUP BY sf.id, sf.firm_name
    `;

    const result = await pool.query(query, [firmId]);
    return result.rows[0] || null;
  }
}

export default new FirmRepository();
