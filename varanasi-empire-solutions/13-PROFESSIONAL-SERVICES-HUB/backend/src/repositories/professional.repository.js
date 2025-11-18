import { pool } from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

/**
 * Professional Repository
 * Handles database operations for professionals table
 */
class ProfessionalRepository {
  /**
   * Create a new professional
   * @param {Object} professionalData - Professional data
   * @returns {Promise<Object>} Created professional
   */
  async create(professionalData) {
    const {
      firm_id,
      professional_code,
      first_name,
      last_name,
      designation,
      specialization,
      bar_council_number,
      phone,
      email,
      hourly_rate,
    } = professionalData;

    const query = `
      INSERT INTO professionals (
        firm_id, professional_code, first_name, last_name, designation,
        specialization, bar_council_number, phone, email, hourly_rate
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const values = [
      firm_id,
      professional_code,
      first_name,
      last_name,
      designation,
      specialization,
      bar_council_number,
      phone,
      email,
      hourly_rate,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find professional by ID
   * @param {string} id - Professional ID
   * @returns {Promise<Object>} Professional object
   */
  async findById(id) {
    const query = `
      SELECT p.*, sf.firm_name, sf.firm_type
      FROM professionals p
      LEFT JOIN service_firms sf ON p.firm_id = sf.id
      WHERE p.id = $1
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Find professional by code
   * @param {string} code - Professional code
   * @returns {Promise<Object>} Professional object
   */
  async findByCode(code) {
    const query = 'SELECT * FROM professionals WHERE professional_code = $1';
    const result = await pool.query(query, [code]);
    return result.rows[0];
  }

  /**
   * Find all professionals with pagination and filters
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Professionals and pagination info
   */
  async findAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      firm_id,
      specialization,
      is_active,
      search,
    } = options;

    const offset = (page - 1) * limit;
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (firm_id) {
      conditions.push(`p.firm_id = $${paramIndex++}`);
      values.push(firm_id);
    }

    if (specialization) {
      conditions.push(`$${paramIndex} = ANY(p.specialization)`);
      values.push(specialization);
      paramIndex++;
    }

    if (is_active !== undefined) {
      conditions.push(`p.is_active = $${paramIndex++}`);
      values.push(is_active);
    }

    if (search) {
      conditions.push(`(p.first_name ILIKE $${paramIndex} OR p.last_name ILIKE $${paramIndex} OR p.professional_code ILIKE $${paramIndex})`);
      values.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countQuery = `
      SELECT COUNT(*) FROM professionals p
      ${whereClause}
    `;
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    // Get paginated data
    const dataQuery = `
      SELECT p.*, sf.firm_name, sf.firm_type
      FROM professionals p
      LEFT JOIN service_firms sf ON p.firm_id = sf.id
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    values.push(limit, offset);
    const dataResult = await pool.query(dataQuery, values);

    return {
      professionals: dataResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update professional by ID
   * @param {string} id - Professional ID
   * @param {Object} professionalData - Updated professional data
   * @returns {Promise<Object>} Updated professional
   */
  async update(id, professionalData) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    const allowedFields = [
      'firm_id',
      'first_name',
      'last_name',
      'designation',
      'specialization',
      'bar_council_number',
      'phone',
      'email',
      'hourly_rate',
      'is_active',
    ];

    allowedFields.forEach((field) => {
      if (professionalData[field] !== undefined) {
        fields.push(`${field} = $${paramIndex++}`);
        values.push(professionalData[field]);
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);

    const query = `
      UPDATE professionals
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new NotFoundError('Professional');
    }

    return result.rows[0];
  }

  /**
   * Delete professional by ID (soft delete)
   * @param {string} id - Professional ID
   * @returns {Promise<Object>} Deleted professional
   */
  async delete(id) {
    const query = `
      UPDATE professionals
      SET is_active = false
      WHERE id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Professional');
    }

    return result.rows[0];
  }

  /**
   * Get professional workload and statistics
   * @param {string} professionalId - Professional ID
   * @returns {Promise<Object>} Professional statistics
   */
  async getWorkload(professionalId) {
    const query = `
      SELECT
        p.id,
        p.first_name,
        p.last_name,
        p.professional_code,
        COUNT(c.id) as total_cases,
        COUNT(CASE WHEN c.case_status IN ('OPEN', 'IN_PROGRESS') THEN 1 END) as active_cases,
        COUNT(CASE WHEN c.case_status = 'CLOSED' THEN 1 END) as closed_cases,
        COUNT(CASE WHEN c.case_status = 'WON' THEN 1 END) as won_cases,
        COUNT(CASE WHEN c.case_status = 'LOST' THEN 1 END) as lost_cases,
        COUNT(CASE WHEN c.next_hearing_date >= CURRENT_DATE AND c.next_hearing_date <= CURRENT_DATE + INTERVAL '7 days' THEN 1 END) as upcoming_hearings_week
      FROM professionals p
      LEFT JOIN cases c ON p.id = c.assigned_to
      WHERE p.id = $1
      GROUP BY p.id, p.first_name, p.last_name, p.professional_code
    `;

    const result = await pool.query(query, [professionalId]);
    return result.rows[0] || null;
  }

  /**
   * Get professionals with low workload (for case assignment)
   * @param {string} firmId - Firm ID
   * @param {number} maxCases - Maximum active cases threshold
   * @returns {Promise<Array>} Available professionals
   */
  async findAvailableProfessionals(firmId, maxCases = 10) {
    const query = `
      SELECT
        p.id,
        p.first_name,
        p.last_name,
        p.professional_code,
        p.specialization,
        COUNT(c.id) as active_cases
      FROM professionals p
      LEFT JOIN cases c ON p.id = c.assigned_to AND c.case_status IN ('OPEN', 'IN_PROGRESS')
      WHERE p.firm_id = $1 AND p.is_active = true
      GROUP BY p.id, p.first_name, p.last_name, p.professional_code, p.specialization
      HAVING COUNT(c.id) < $2
      ORDER BY COUNT(c.id) ASC, p.created_at ASC
    `;

    const result = await pool.query(query, [firmId, maxCases]);
    return result.rows;
  }

  /**
   * Get professional performance metrics
   * @param {string} professionalId - Professional ID
   * @param {Date} startDate - Start date for metrics
   * @param {Date} endDate - End date for metrics
   * @returns {Promise<Object>} Performance metrics
   */
  async getPerformanceMetrics(professionalId, startDate, endDate) {
    const query = `
      SELECT
        p.id,
        p.first_name,
        p.last_name,
        COUNT(DISTINCT c.id) as cases_handled,
        COUNT(DISTINCT CASE WHEN c.case_status = 'WON' THEN c.id END) as cases_won,
        COUNT(DISTINCT CASE WHEN c.case_status = 'LOST' THEN c.id END) as cases_lost,
        COUNT(DISTINCT CASE WHEN c.case_status = 'CLOSED' THEN c.id END) as cases_closed,
        COALESCE(SUM(i.total_amount), 0) as total_revenue,
        COUNT(DISTINCT ch.id) as hearings_attended
      FROM professionals p
      LEFT JOIN cases c ON p.id = c.assigned_to
        AND c.created_at BETWEEN $2 AND $3
      LEFT JOIN invoices i ON c.id = i.case_id
      LEFT JOIN case_hearings ch ON c.id = ch.case_id
        AND ch.hearing_date BETWEEN $2 AND $3
      WHERE p.id = $1
      GROUP BY p.id, p.first_name, p.last_name
    `;

    const result = await pool.query(query, [professionalId, startDate, endDate]);
    return result.rows[0] || null;
  }
}

export default new ProfessionalRepository();
