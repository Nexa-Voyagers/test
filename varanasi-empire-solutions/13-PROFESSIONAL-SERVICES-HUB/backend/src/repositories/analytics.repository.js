import { pool } from '../config/database.js';

/**
 * Analytics Repository
 * Handles complex analytics and reporting queries
 */
class AnalyticsRepository {
  /**
   * Get dashboard statistics
   * @param {string} firmId - Firm ID (optional)
   * @returns {Promise<Object>} Dashboard statistics
   */
  async getDashboardStats(firmId = null) {
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (firmId) {
      conditions.push(`sf.id = $${paramIndex++}`);
      values.push(firmId);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
      SELECT
        COUNT(DISTINCT sf.id) as total_firms,
        COUNT(DISTINCT p.id) FILTER (WHERE p.is_active = true) as active_professionals,
        COUNT(DISTINCT cl.id) FILTER (WHERE cl.is_active = true) as active_clients,
        COUNT(DISTINCT c.id) as total_cases,
        COUNT(DISTINCT c.id) FILTER (WHERE c.case_status IN ('OPEN', 'IN_PROGRESS')) as active_cases,
        COUNT(DISTINCT c.id) FILTER (WHERE c.case_status = 'CLOSED') as closed_cases,
        COUNT(DISTINCT c.id) FILTER (WHERE c.case_status = 'WON') as won_cases,
        COUNT(DISTINCT c.id) FILTER (WHERE c.case_status = 'LOST') as lost_cases,
        COUNT(DISTINCT ch.id) FILTER (WHERE ch.hearing_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days') as upcoming_hearings_week,
        COUNT(DISTINCT ch.id) FILTER (WHERE ch.hearing_date = CURRENT_DATE) as today_hearings,
        COUNT(DISTINCT i.id) as total_invoices,
        COALESCE(SUM(i.total_amount), 0) as total_revenue,
        COALESCE(SUM(i.total_amount) FILTER (WHERE i.payment_status = 'PAID'), 0) as collected_revenue,
        COALESCE(SUM(i.total_amount) FILTER (WHERE i.payment_status IN ('PENDING', 'PARTIAL')), 0) as outstanding_revenue,
        COUNT(DISTINCT d.id) as total_documents
      FROM service_firms sf
      LEFT JOIN professionals p ON sf.id = p.firm_id
      LEFT JOIN cases c ON sf.id = c.firm_id
      LEFT JOIN clients cl ON c.client_id = cl.id
      LEFT JOIN case_hearings ch ON c.id = ch.case_id
      LEFT JOIN invoices i ON c.id = i.case_id
      LEFT JOIN documents d ON c.id = d.case_id
      ${whereClause}
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Get case statistics by status
   * @param {string} firmId - Firm ID (optional)
   * @param {Date} startDate - Start date (optional)
   * @param {Date} endDate - End date (optional)
   * @returns {Promise<Array>} Case statistics by status
   */
  async getCaseStatsByStatus(firmId = null, startDate = null, endDate = null) {
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (firmId) {
      conditions.push(`firm_id = $${paramIndex++}`);
      values.push(firmId);
    }

    if (startDate) {
      conditions.push(`created_at >= $${paramIndex++}`);
      values.push(startDate);
    }

    if (endDate) {
      conditions.push(`created_at <= $${paramIndex++}`);
      values.push(endDate);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
      SELECT
        case_status,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
      FROM cases
      ${whereClause}
      GROUP BY case_status
      ORDER BY count DESC
    `;

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Get case statistics by type
   * @param {string} firmId - Firm ID (optional)
   * @returns {Promise<Array>} Case statistics by type
   */
  async getCaseStatsByType(firmId = null) {
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
        case_type,
        COUNT(*) as total_cases,
        COUNT(CASE WHEN case_status IN ('OPEN', 'IN_PROGRESS') THEN 1 END) as active_cases,
        COUNT(CASE WHEN case_status = 'WON' THEN 1 END) as won_cases,
        COUNT(CASE WHEN case_status = 'LOST' THEN 1 END) as lost_cases,
        ROUND(COUNT(CASE WHEN case_status = 'WON' THEN 1 END) * 100.0 / NULLIF(COUNT(CASE WHEN case_status IN ('WON', 'LOST') THEN 1 END), 0), 2) as win_rate
      FROM cases
      ${whereClause}
      GROUP BY case_type
      ORDER BY total_cases DESC
    `;

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Get professional performance rankings
   * @param {string} firmId - Firm ID (optional)
   * @param {number} limit - Number of professionals to return
   * @returns {Promise<Array>} Professional performance rankings
   */
  async getProfessionalPerformance(firmId = null, limit = 10) {
    const conditions = ['p.is_active = true'];
    const values = [];
    let paramIndex = 1;

    if (firmId) {
      conditions.push(`p.firm_id = $${paramIndex++}`);
      values.push(firmId);
    }

    values.push(limit);

    const query = `
      SELECT
        p.id,
        p.professional_code,
        p.first_name,
        p.last_name,
        p.designation,
        COUNT(DISTINCT c.id) as total_cases,
        COUNT(DISTINCT CASE WHEN c.case_status IN ('OPEN', 'IN_PROGRESS') THEN c.id END) as active_cases,
        COUNT(DISTINCT CASE WHEN c.case_status = 'CLOSED' THEN c.id END) as closed_cases,
        COUNT(DISTINCT CASE WHEN c.case_status = 'WON' THEN c.id END) as won_cases,
        COUNT(DISTINCT CASE WHEN c.case_status = 'LOST' THEN c.id END) as lost_cases,
        ROUND(COUNT(DISTINCT CASE WHEN c.case_status = 'WON' THEN c.id END) * 100.0 /
              NULLIF(COUNT(DISTINCT CASE WHEN c.case_status IN ('WON', 'LOST') THEN c.id END), 0), 2) as win_rate,
        COALESCE(SUM(i.total_amount), 0) as total_revenue,
        COUNT(DISTINCT ch.id) as total_hearings
      FROM professionals p
      LEFT JOIN cases c ON p.id = c.assigned_to
      LEFT JOIN invoices i ON c.id = i.case_id
      LEFT JOIN case_hearings ch ON c.id = ch.case_id
      WHERE ${conditions.join(' AND ')}
      GROUP BY p.id, p.professional_code, p.first_name, p.last_name, p.designation
      ORDER BY total_cases DESC, total_revenue DESC
      LIMIT $${paramIndex}
    `;

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Get revenue trends by month
   * @param {string} firmId - Firm ID (optional)
   * @param {number} months - Number of months to look back
   * @returns {Promise<Array>} Monthly revenue trends
   */
  async getRevenueTrends(firmId = null, months = 12) {
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
        COUNT(DISTINCT i.id) as invoice_count,
        COUNT(DISTINCT c.id) as case_count,
        COALESCE(SUM(i.total_amount), 0) as total_billed,
        COALESCE(SUM(CASE WHEN i.payment_status = 'PAID' THEN i.total_amount ELSE 0 END), 0) as total_collected,
        COALESCE(SUM(CASE WHEN i.payment_status IN ('PENDING', 'PARTIAL') THEN i.total_amount ELSE 0 END), 0) as total_outstanding
      FROM invoices i
      LEFT JOIN cases c ON i.case_id = c.id
      ${whereClause}
      GROUP BY TO_CHAR(i.invoice_date, 'YYYY-MM')
      ORDER BY month DESC
    `;

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Get client statistics
   * @param {string} firmId - Firm ID (optional)
   * @returns {Promise<Object>} Client statistics
   */
  async getClientStatistics(firmId = null) {
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (firmId) {
      conditions.push(`c.firm_id = $${paramIndex++}`);
      values.push(firmId);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
      SELECT
        COUNT(DISTINCT cl.id) as total_clients,
        COUNT(DISTINCT CASE WHEN cl.client_type = 'INDIVIDUAL' THEN cl.id END) as individual_clients,
        COUNT(DISTINCT CASE WHEN cl.client_type = 'CORPORATE' THEN cl.id END) as corporate_clients,
        COUNT(DISTINCT CASE WHEN cl.is_active = true THEN cl.id END) as active_clients
      FROM clients cl
      LEFT JOIN cases c ON cl.id = c.client_id
      ${whereClause}
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Get top clients by revenue
   * @param {string} firmId - Firm ID (optional)
   * @param {number} limit - Number of clients to return
   * @returns {Promise<Array>} Top clients by revenue
   */
  async getTopClientsByRevenue(firmId = null, limit = 10) {
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (firmId) {
      conditions.push(`c.firm_id = $${paramIndex++}`);
      values.push(firmId);
    }

    values.push(limit);

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
      SELECT
        cl.id,
        cl.client_code,
        cl.client_type,
        cl.first_name,
        cl.last_name,
        cl.company_name,
        COUNT(DISTINCT c.id) as total_cases,
        COUNT(DISTINCT CASE WHEN c.case_status IN ('OPEN', 'IN_PROGRESS') THEN c.id END) as active_cases,
        COUNT(DISTINCT i.id) as total_invoices,
        COALESCE(SUM(i.total_amount), 0) as total_revenue,
        COALESCE(SUM(CASE WHEN i.payment_status = 'PAID' THEN i.total_amount ELSE 0 END), 0) as paid_amount,
        COALESCE(SUM(CASE WHEN i.payment_status IN ('PENDING', 'PARTIAL') THEN i.total_amount ELSE 0 END), 0) as outstanding_amount
      FROM clients cl
      LEFT JOIN cases c ON cl.id = c.client_id
      LEFT JOIN invoices i ON c.id = i.case_id
      ${whereClause}
      GROUP BY cl.id, cl.client_code, cl.client_type, cl.first_name, cl.last_name, cl.company_name
      HAVING COALESCE(SUM(i.total_amount), 0) > 0
      ORDER BY total_revenue DESC
      LIMIT $${paramIndex}
    `;

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Get hearing trends
   * @param {string} firmId - Firm ID (optional)
   * @param {number} months - Number of months to look back
   * @returns {Promise<Array>} Hearing trends by month
   */
  async getHearingTrends(firmId = null, months = 12) {
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (firmId) {
      conditions.push(`c.firm_id = $${paramIndex++}`);
      values.push(firmId);
    }

    conditions.push(`ch.hearing_date >= CURRENT_DATE - INTERVAL '${months} months'`);

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
      SELECT
        TO_CHAR(ch.hearing_date, 'YYYY-MM') as month,
        COUNT(*) as total_hearings,
        COUNT(CASE WHEN ch.hearing_date < CURRENT_DATE THEN 1 END) as completed_hearings,
        COUNT(CASE WHEN ch.hearing_date >= CURRENT_DATE THEN 1 END) as upcoming_hearings
      FROM case_hearings ch
      LEFT JOIN cases c ON ch.case_id = c.id
      ${whereClause}
      GROUP BY TO_CHAR(ch.hearing_date, 'YYYY-MM')
      ORDER BY month DESC
    `;

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Get case aging report
   * @param {string} firmId - Firm ID (optional)
   * @returns {Promise<Array>} Case aging statistics
   */
  async getCaseAgingReport(firmId = null) {
    const conditions = [`c.case_status IN ('OPEN', 'IN_PROGRESS')`];
    const values = [];
    let paramIndex = 1;

    if (firmId) {
      conditions.push(`c.firm_id = $${paramIndex++}`);
      values.push(firmId);
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;

    const query = `
      SELECT
        COUNT(CASE WHEN EXTRACT(DAY FROM (CURRENT_DATE - c.filing_date)) <= 30 THEN 1 END) as cases_0_30_days,
        COUNT(CASE WHEN EXTRACT(DAY FROM (CURRENT_DATE - c.filing_date)) BETWEEN 31 AND 60 THEN 1 END) as cases_31_60_days,
        COUNT(CASE WHEN EXTRACT(DAY FROM (CURRENT_DATE - c.filing_date)) BETWEEN 61 AND 90 THEN 1 END) as cases_61_90_days,
        COUNT(CASE WHEN EXTRACT(DAY FROM (CURRENT_DATE - c.filing_date)) BETWEEN 91 AND 180 THEN 1 END) as cases_91_180_days,
        COUNT(CASE WHEN EXTRACT(DAY FROM (CURRENT_DATE - c.filing_date)) > 180 THEN 1 END) as cases_over_180_days,
        ROUND(AVG(EXTRACT(DAY FROM (CURRENT_DATE - c.filing_date))), 2) as average_case_age_days
      FROM cases c
      ${whereClause}
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Get payment collection report
   * @param {string} firmId - Firm ID (optional)
   * @param {Date} startDate - Start date (optional)
   * @param {Date} endDate - End date (optional)
   * @returns {Promise<Object>} Payment collection statistics
   */
  async getPaymentCollectionReport(firmId = null, startDate = null, endDate = null) {
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
        COUNT(i.id) as total_invoices,
        COALESCE(SUM(i.total_amount), 0) as total_billed,
        COALESCE(SUM(CASE WHEN i.payment_status = 'PAID' THEN i.total_amount ELSE 0 END), 0) as total_collected,
        COALESCE(SUM(CASE WHEN i.payment_status = 'PENDING' THEN i.total_amount ELSE 0 END), 0) as pending_payments,
        COALESCE(SUM(CASE WHEN i.payment_status = 'PARTIAL' THEN i.total_amount ELSE 0 END), 0) as partial_payments,
        ROUND(COALESCE(SUM(CASE WHEN i.payment_status = 'PAID' THEN i.total_amount ELSE 0 END), 0) * 100.0 /
              NULLIF(COALESCE(SUM(i.total_amount), 0), 0), 2) as collection_rate
      FROM invoices i
      LEFT JOIN cases c ON i.case_id = c.id
      ${whereClause}
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }
}

export default new AnalyticsRepository();
