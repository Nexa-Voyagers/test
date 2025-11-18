import { pool } from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

/**
 * Case Hearing Repository
 * Handles database operations for case_hearings table
 */
class HearingRepository {
  /**
   * Create a new case hearing
   * @param {Object} hearingData - Hearing data
   * @returns {Promise<Object>} Created hearing
   */
  async create(hearingData) {
    const {
      case_id,
      hearing_date,
      hearing_time,
      court_name,
      judge_name,
      outcome,
      next_hearing_date,
    } = hearingData;

    const query = `
      INSERT INTO case_hearings (
        case_id, hearing_date, hearing_time, court_name,
        judge_name, outcome, next_hearing_date
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [
      case_id,
      hearing_date,
      hearing_time,
      court_name,
      judge_name,
      outcome,
      next_hearing_date,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find hearing by ID
   * @param {string} id - Hearing ID
   * @returns {Promise<Object>} Hearing object
   */
  async findById(id) {
    const query = `
      SELECT
        ch.*,
        c.case_number,
        c.case_title,
        c.case_type
      FROM case_hearings ch
      LEFT JOIN cases c ON ch.case_id = c.id
      WHERE ch.id = $1
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Find all hearings for a case
   * @param {string} caseId - Case ID
   * @returns {Promise<Array>} List of hearings
   */
  async findByCaseId(caseId) {
    const query = `
      SELECT * FROM case_hearings
      WHERE case_id = $1
      ORDER BY hearing_date DESC
    `;

    const result = await pool.query(query, [caseId]);
    return result.rows;
  }

  /**
   * Find all hearings with pagination and filters
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Hearings and pagination info
   */
  async findAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      case_id,
      start_date,
      end_date,
      judge_name,
    } = options;

    const offset = (page - 1) * limit;
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (case_id) {
      conditions.push(`ch.case_id = $${paramIndex++}`);
      values.push(case_id);
    }

    if (start_date) {
      conditions.push(`ch.hearing_date >= $${paramIndex++}`);
      values.push(start_date);
    }

    if (end_date) {
      conditions.push(`ch.hearing_date <= $${paramIndex++}`);
      values.push(end_date);
    }

    if (judge_name) {
      conditions.push(`ch.judge_name ILIKE $${paramIndex++}`);
      values.push(`%${judge_name}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM case_hearings ch ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    // Get paginated data
    const dataQuery = `
      SELECT
        ch.*,
        c.case_number,
        c.case_title,
        c.case_type,
        c.case_status
      FROM case_hearings ch
      LEFT JOIN cases c ON ch.case_id = c.id
      ${whereClause}
      ORDER BY ch.hearing_date DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    values.push(limit, offset);
    const dataResult = await pool.query(dataQuery, values);

    return {
      hearings: dataResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update hearing by ID
   * @param {string} id - Hearing ID
   * @param {Object} hearingData - Updated hearing data
   * @returns {Promise<Object>} Updated hearing
   */
  async update(id, hearingData) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    const allowedFields = [
      'hearing_date',
      'hearing_time',
      'court_name',
      'judge_name',
      'outcome',
      'next_hearing_date',
    ];

    allowedFields.forEach((field) => {
      if (hearingData[field] !== undefined) {
        fields.push(`${field} = $${paramIndex++}`);
        values.push(hearingData[field]);
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);

    const query = `
      UPDATE case_hearings
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new NotFoundError('Hearing');
    }

    return result.rows[0];
  }

  /**
   * Delete hearing by ID
   * @param {string} id - Hearing ID
   * @returns {Promise<Object>} Deleted hearing
   */
  async delete(id) {
    const query = 'DELETE FROM case_hearings WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Hearing');
    }

    return result.rows[0];
  }

  /**
   * Get upcoming hearings
   * @param {number} days - Number of days to look ahead
   * @param {string} firmId - Firm ID (optional)
   * @returns {Promise<Array>} List of upcoming hearings
   */
  async getUpcomingHearings(days = 7, firmId = null) {
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    conditions.push(`ch.hearing_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '${days} days'`);

    if (firmId) {
      conditions.push(`c.firm_id = $${paramIndex++}`);
      values.push(firmId);
    }

    const query = `
      SELECT
        ch.*,
        c.case_number,
        c.case_title,
        c.case_type,
        c.case_status,
        cl.first_name as client_first_name,
        cl.last_name as client_last_name,
        cl.company_name as client_company_name,
        p.first_name as professional_first_name,
        p.last_name as professional_last_name
      FROM case_hearings ch
      INNER JOIN cases c ON ch.case_id = c.id
      LEFT JOIN clients cl ON c.client_id = cl.id
      LEFT JOIN professionals p ON c.assigned_to = p.id
      WHERE ${conditions.join(' AND ')}
      ORDER BY ch.hearing_date ASC, ch.hearing_time ASC
    `;

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Get hearings by date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @param {string} firmId - Firm ID (optional)
   * @returns {Promise<Array>} List of hearings
   */
  async getHearingsByDateRange(startDate, endDate, firmId = null) {
    const conditions = ['ch.hearing_date BETWEEN $1 AND $2'];
    const values = [startDate, endDate];
    let paramIndex = 3;

    if (firmId) {
      conditions.push(`c.firm_id = $${paramIndex++}`);
      values.push(firmId);
    }

    const query = `
      SELECT
        ch.*,
        c.case_number,
        c.case_title,
        c.case_type,
        c.case_status,
        cl.first_name as client_first_name,
        cl.last_name as client_last_name,
        cl.company_name as client_company_name,
        p.first_name as professional_first_name,
        p.last_name as professional_last_name
      FROM case_hearings ch
      INNER JOIN cases c ON ch.case_id = c.id
      LEFT JOIN clients cl ON c.client_id = cl.id
      LEFT JOIN professionals p ON c.assigned_to = p.id
      WHERE ${conditions.join(' AND ')}
      ORDER BY ch.hearing_date ASC, ch.hearing_time ASC
    `;

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Get latest hearing for a case
   * @param {string} caseId - Case ID
   * @returns {Promise<Object>} Latest hearing
   */
  async getLatestHearing(caseId) {
    const query = `
      SELECT * FROM case_hearings
      WHERE case_id = $1
      ORDER BY hearing_date DESC, created_at DESC
      LIMIT 1
    `;

    const result = await pool.query(query, [caseId]);
    return result.rows[0];
  }

  /**
   * Get hearing statistics
   * @param {string} firmId - Firm ID (optional)
   * @param {Date} startDate - Start date (optional)
   * @param {Date} endDate - End date (optional)
   * @returns {Promise<Object>} Hearing statistics
   */
  async getHearingStatistics(firmId = null, startDate = null, endDate = null) {
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (firmId) {
      conditions.push(`c.firm_id = $${paramIndex++}`);
      values.push(firmId);
    }

    if (startDate) {
      conditions.push(`ch.hearing_date >= $${paramIndex++}`);
      values.push(startDate);
    }

    if (endDate) {
      conditions.push(`ch.hearing_date <= $${paramIndex++}`);
      values.push(endDate);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
      SELECT
        COUNT(*) as total_hearings,
        COUNT(CASE WHEN ch.hearing_date < CURRENT_DATE THEN 1 END) as past_hearings,
        COUNT(CASE WHEN ch.hearing_date = CURRENT_DATE THEN 1 END) as today_hearings,
        COUNT(CASE WHEN ch.hearing_date > CURRENT_DATE THEN 1 END) as future_hearings,
        COUNT(CASE WHEN ch.outcome IS NOT NULL AND ch.outcome != '' THEN 1 END) as hearings_with_outcome
      FROM case_hearings ch
      LEFT JOIN cases c ON ch.case_id = c.id
      ${whereClause}
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }
}

export default new HearingRepository();
