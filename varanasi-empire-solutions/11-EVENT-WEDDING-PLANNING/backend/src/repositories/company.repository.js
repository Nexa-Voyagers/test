import { pool } from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

/**
 * Repository for event_companies table
 * Handles all database operations for event planning companies
 */
class CompanyRepository {
  /**
   * Create a new event planning company
   * @param {Object} companyData - Company data
   * @returns {Promise<Object>} Created company
   */
  async create(companyData) {
    const {
      company_name,
      gstin,
      address,
      city,
      phone,
      email,
      specialization,
    } = companyData;

    const query = `
      INSERT INTO event_companies (
        company_name, gstin, address, city, phone, email, specialization
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [company_name, gstin, address, city, phone, email, specialization];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find all companies with optional filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of companies
   */
  async findAll(filters = {}) {
    let query = 'SELECT * FROM event_companies WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (filters.city) {
      query += ` AND city ILIKE $${paramCount}`;
      values.push(`%${filters.city}%`);
      paramCount++;
    }

    if (filters.is_active !== undefined) {
      query += ` AND is_active = $${paramCount}`;
      values.push(filters.is_active);
      paramCount++;
    }

    if (filters.specialization) {
      query += ` AND $${paramCount} = ANY(specialization)`;
      values.push(filters.specialization);
      paramCount++;
    }

    query += ' ORDER BY created_at DESC';

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
   * Find company by ID
   * @param {string} id - Company ID
   * @returns {Promise<Object>} Company data
   */
  async findById(id) {
    const query = 'SELECT * FROM event_companies WHERE id = $1';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Company');
    }

    return result.rows[0];
  }

  /**
   * Update company
   * @param {string} id - Company ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated company
   */
  async update(id, updateData) {
    const allowedFields = [
      'company_name',
      'gstin',
      'address',
      'city',
      'phone',
      'email',
      'specialization',
      'is_active',
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
      UPDATE event_companies
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new NotFoundError('Company');
    }

    return result.rows[0];
  }

  /**
   * Delete company (soft delete by setting is_active to false)
   * @param {string} id - Company ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    const query = `
      UPDATE event_companies
      SET is_active = false
      WHERE id = $1
      RETURNING id
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Company');
    }

    return true;
  }

  /**
   * Get company statistics
   * @param {string} companyId - Company ID
   * @returns {Promise<Object>} Company statistics
   */
  async getStatistics(companyId) {
    const query = `
      SELECT
        COUNT(DISTINCT e.id) as total_events,
        COUNT(DISTINCT CASE WHEN e.event_status = 'COMPLETED' THEN e.id END) as completed_events,
        COUNT(DISTINCT CASE WHEN e.event_status = 'IN_PROGRESS' THEN e.id END) as ongoing_events,
        COUNT(DISTINCT c.id) as total_clients,
        COALESCE(SUM(e.total_budget), 0) as total_revenue
      FROM event_companies ec
      LEFT JOIN events e ON ec.id = e.company_id
      LEFT JOIN clients c ON e.client_id = c.id
      WHERE ec.id = $1
      GROUP BY ec.id
    `;

    const result = await pool.query(query, [companyId]);
    return result.rows[0] || {
      total_events: 0,
      completed_events: 0,
      ongoing_events: 0,
      total_clients: 0,
      total_revenue: 0,
    };
  }

  /**
   * Check if company exists
   * @param {string} id - Company ID
   * @returns {Promise<boolean>} Existence status
   */
  async exists(id) {
    const query = 'SELECT 1 FROM event_companies WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows.length > 0;
  }
}

export default new CompanyRepository();
