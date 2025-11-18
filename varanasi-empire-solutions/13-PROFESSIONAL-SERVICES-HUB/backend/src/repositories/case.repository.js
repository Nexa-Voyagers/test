import { pool, transaction } from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

/**
 * Case Repository
 * Handles database operations for cases table
 */
class CaseRepository {
  /**
   * Create a new case
   * @param {Object} caseData - Case data
   * @returns {Promise<Object>} Created case
   */
  async create(caseData) {
    const {
      firm_id,
      client_id,
      case_number,
      case_title,
      case_type,
      court_name,
      case_status,
      filing_date,
      next_hearing_date,
      assigned_to,
    } = caseData;

    const query = `
      INSERT INTO cases (
        firm_id, client_id, case_number, case_title, case_type,
        court_name, case_status, filing_date, next_hearing_date, assigned_to
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const values = [
      firm_id,
      client_id,
      case_number,
      case_title,
      case_type,
      court_name,
      case_status || 'OPEN',
      filing_date,
      next_hearing_date,
      assigned_to,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Create case with initial hearing (transaction)
   * @param {Object} caseData - Case data
   * @param {Object} hearingData - Initial hearing data
   * @returns {Promise<Object>} Created case with hearing
   */
  async createWithHearing(caseData, hearingData) {
    return await transaction(async (client) => {
      // Create case
      const caseQuery = `
        INSERT INTO cases (
          firm_id, client_id, case_number, case_title, case_type,
          court_name, case_status, filing_date, next_hearing_date, assigned_to
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;

      const caseValues = [
        caseData.firm_id,
        caseData.client_id,
        caseData.case_number,
        caseData.case_title,
        caseData.case_type,
        caseData.court_name,
        caseData.case_status || 'OPEN',
        caseData.filing_date,
        caseData.next_hearing_date,
        caseData.assigned_to,
      ];

      const caseResult = await client.query(caseQuery, caseValues);
      const createdCase = caseResult.rows[0];

      // Create initial hearing if provided
      if (hearingData) {
        const hearingQuery = `
          INSERT INTO case_hearings (
            case_id, hearing_date, hearing_time, court_name,
            judge_name, next_hearing_date
          )
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *
        `;

        const hearingValues = [
          createdCase.id,
          hearingData.hearing_date,
          hearingData.hearing_time,
          hearingData.court_name || caseData.court_name,
          hearingData.judge_name,
          hearingData.next_hearing_date,
        ];

        await client.query(hearingQuery, hearingValues);
      }

      return createdCase;
    });
  }

  /**
   * Find case by ID
   * @param {string} id - Case ID
   * @returns {Promise<Object>} Case object
   */
  async findById(id) {
    const query = `
      SELECT
        c.*,
        cl.client_code,
        cl.client_type,
        cl.first_name as client_first_name,
        cl.last_name as client_last_name,
        cl.company_name as client_company_name,
        cl.phone as client_phone,
        p.professional_code,
        p.first_name as professional_first_name,
        p.last_name as professional_last_name,
        sf.firm_name
      FROM cases c
      LEFT JOIN clients cl ON c.client_id = cl.id
      LEFT JOIN professionals p ON c.assigned_to = p.id
      LEFT JOIN service_firms sf ON c.firm_id = sf.id
      WHERE c.id = $1
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Find case by case number
   * @param {string} caseNumber - Case number
   * @returns {Promise<Object>} Case object
   */
  async findByCaseNumber(caseNumber) {
    const query = 'SELECT * FROM cases WHERE case_number = $1';
    const result = await pool.query(query, [caseNumber]);
    return result.rows[0];
  }

  /**
   * Find all cases with pagination and filters
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Cases and pagination info
   */
  async findAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      firm_id,
      client_id,
      assigned_to,
      case_status,
      case_type,
      search,
    } = options;

    const offset = (page - 1) * limit;
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (firm_id) {
      conditions.push(`c.firm_id = $${paramIndex++}`);
      values.push(firm_id);
    }

    if (client_id) {
      conditions.push(`c.client_id = $${paramIndex++}`);
      values.push(client_id);
    }

    if (assigned_to) {
      conditions.push(`c.assigned_to = $${paramIndex++}`);
      values.push(assigned_to);
    }

    if (case_status) {
      conditions.push(`c.case_status = $${paramIndex++}`);
      values.push(case_status);
    }

    if (case_type) {
      conditions.push(`c.case_type = $${paramIndex++}`);
      values.push(case_type);
    }

    if (search) {
      conditions.push(`(c.case_number ILIKE $${paramIndex} OR c.case_title ILIKE $${paramIndex})`);
      values.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM cases c ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    // Get paginated data
    const dataQuery = `
      SELECT
        c.*,
        cl.client_code,
        cl.client_type,
        cl.first_name as client_first_name,
        cl.last_name as client_last_name,
        cl.company_name as client_company_name,
        p.professional_code,
        p.first_name as professional_first_name,
        p.last_name as professional_last_name,
        sf.firm_name
      FROM cases c
      LEFT JOIN clients cl ON c.client_id = cl.id
      LEFT JOIN professionals p ON c.assigned_to = p.id
      LEFT JOIN service_firms sf ON c.firm_id = sf.id
      ${whereClause}
      ORDER BY c.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    values.push(limit, offset);
    const dataResult = await pool.query(dataQuery, values);

    return {
      cases: dataResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update case by ID
   * @param {string} id - Case ID
   * @param {Object} caseData - Updated case data
   * @returns {Promise<Object>} Updated case
   */
  async update(id, caseData) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    const allowedFields = [
      'case_title',
      'case_type',
      'court_name',
      'case_status',
      'next_hearing_date',
      'assigned_to',
    ];

    allowedFields.forEach((field) => {
      if (caseData[field] !== undefined) {
        fields.push(`${field} = $${paramIndex++}`);
        values.push(caseData[field]);
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);

    const query = `
      UPDATE cases
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new NotFoundError('Case');
    }

    return result.rows[0];
  }

  /**
   * Update case status
   * @param {string} id - Case ID
   * @param {string} status - New case status
   * @returns {Promise<Object>} Updated case
   */
  async updateStatus(id, status) {
    const query = `
      UPDATE cases
      SET case_status = $1
      WHERE id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [status, id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Case');
    }

    return result.rows[0];
  }

  /**
   * Update next hearing date
   * @param {string} caseId - Case ID
   * @param {Date} nextHearingDate - Next hearing date
   * @returns {Promise<Object>} Updated case
   */
  async updateNextHearingDate(caseId, nextHearingDate) {
    const query = `
      UPDATE cases
      SET next_hearing_date = $1
      WHERE id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [nextHearingDate, caseId]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Case');
    }

    return result.rows[0];
  }

  /**
   * Delete case by ID
   * @param {string} id - Case ID
   * @returns {Promise<Object>} Deleted case
   */
  async delete(id) {
    const query = 'DELETE FROM cases WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Case');
    }

    return result.rows[0];
  }

  /**
   * Get upcoming hearings (next 7 days)
   * @param {string} firmId - Firm ID (optional)
   * @param {number} days - Number of days to look ahead
   * @returns {Promise<Array>} List of cases with upcoming hearings
   */
  async getUpcomingHearings(firmId = null, days = 7) {
    const conditions = ['c.next_hearing_date IS NOT NULL'];
    const values = [];
    let paramIndex = 1;

    conditions.push(`c.next_hearing_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '${days} days'`);

    if (firmId) {
      conditions.push(`c.firm_id = $${paramIndex++}`);
      values.push(firmId);
    }

    const query = `
      SELECT
        c.*,
        cl.client_code,
        cl.first_name as client_first_name,
        cl.last_name as client_last_name,
        cl.company_name as client_company_name,
        p.first_name as professional_first_name,
        p.last_name as professional_last_name
      FROM cases c
      LEFT JOIN clients cl ON c.client_id = cl.id
      LEFT JOIN professionals p ON c.assigned_to = p.id
      WHERE ${conditions.join(' AND ')}
      ORDER BY c.next_hearing_date ASC
    `;

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Get cases older than specified days
   * @param {number} days - Number of days threshold
   * @param {string} firmId - Firm ID (optional)
   * @returns {Promise<Array>} List of old cases
   */
  async getOldCases(days = 90, firmId = null) {
    const conditions = [`c.filing_date < CURRENT_DATE - INTERVAL '${days} days'`];
    conditions.push(`c.case_status IN ('OPEN', 'IN_PROGRESS')`);

    const values = [];
    let paramIndex = 1;

    if (firmId) {
      conditions.push(`c.firm_id = $${paramIndex++}`);
      values.push(firmId);
    }

    const query = `
      SELECT
        c.*,
        EXTRACT(DAY FROM (CURRENT_DATE - c.filing_date)) as case_age_days,
        cl.client_code,
        cl.first_name as client_first_name,
        cl.last_name as client_last_name,
        cl.company_name as client_company_name,
        p.first_name as professional_first_name,
        p.last_name as professional_last_name
      FROM cases c
      LEFT JOIN clients cl ON c.client_id = cl.id
      LEFT JOIN professionals p ON c.assigned_to = p.id
      WHERE ${conditions.join(' AND ')}
      ORDER BY c.filing_date ASC
    `;

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Get case statistics by status
   * @param {string} firmId - Firm ID (optional)
   * @returns {Promise<Object>} Case statistics
   */
  async getCaseStatistics(firmId = null) {
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (firmId) {
      conditions.push(`firm_id = $${paramIndex++}`);
      values.push(firmId);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
      SELECT
        COUNT(*) as total_cases,
        COUNT(CASE WHEN case_status = 'OPEN' THEN 1 END) as open_cases,
        COUNT(CASE WHEN case_status = 'IN_PROGRESS' THEN 1 END) as in_progress_cases,
        COUNT(CASE WHEN case_status = 'ON_HOLD' THEN 1 END) as on_hold_cases,
        COUNT(CASE WHEN case_status = 'CLOSED' THEN 1 END) as closed_cases,
        COUNT(CASE WHEN case_status = 'WON' THEN 1 END) as won_cases,
        COUNT(CASE WHEN case_status = 'LOST' THEN 1 END) as lost_cases,
        COUNT(CASE WHEN next_hearing_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days' THEN 1 END) as upcoming_hearings_week
      FROM cases
      ${whereClause}
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }
}

export default new CaseRepository();
