import { pool } from '../config/database.js';

/**
 * Repository for analytics and reporting
 * Provides dashboard statistics and business insights
 */
class AnalyticsRepository {
  /**
   * Get dashboard overview statistics
   * @param {string} companyId - Company ID (optional)
   * @returns {Promise<Object>} Dashboard statistics
   */
  async getDashboardStats(companyId = null) {
    let eventStatsQuery = `
      SELECT
        COUNT(*) as total_events,
        COUNT(CASE WHEN event_status = 'PLANNING' THEN 1 END) as planning_events,
        COUNT(CASE WHEN event_status = 'CONFIRMED' THEN 1 END) as confirmed_events,
        COUNT(CASE WHEN event_status = 'IN_PROGRESS' THEN 1 END) as in_progress_events,
        COUNT(CASE WHEN event_status = 'COMPLETED' THEN 1 END) as completed_events,
        COUNT(CASE WHEN event_status = 'CANCELLED' THEN 1 END) as cancelled_events,
        COALESCE(SUM(total_budget), 0) as total_revenue,
        COALESCE(SUM(actual_cost), 0) as total_costs,
        COALESCE(AVG(total_budget), 0) as average_event_value
      FROM events
    `;

    let clientStatsQuery = `
      SELECT
        COUNT(*) as total_clients,
        COUNT(DISTINCT CASE WHEN e.id IS NOT NULL THEN c.id END) as active_clients
      FROM clients c
      LEFT JOIN events e ON c.id = e.client_id
    `;

    let vendorStatsQuery = `
      SELECT
        COUNT(*) as total_vendors,
        COUNT(CASE WHEN is_active = true THEN 1 END) as active_vendors
      FROM vendors
    `;

    let upcomingEventsQuery = `
      SELECT COUNT(*) as upcoming_events
      FROM events
      WHERE event_date >= CURRENT_DATE
        AND event_date <= CURRENT_DATE + INTERVAL '30 days'
        AND event_status NOT IN ('CANCELLED', 'COMPLETED')
    `;

    const values = [];
    if (companyId) {
      eventStatsQuery += ' WHERE company_id = $1';
      upcomingEventsQuery += (upcomingEventsQuery.includes('WHERE') ? ' AND' : ' WHERE') + ' company_id = $1';
      values.push(companyId);
    }

    const [eventStats, clientStats, vendorStats, upcomingEvents] = await Promise.all([
      pool.query(eventStatsQuery, values),
      pool.query(clientStatsQuery),
      pool.query(vendorStatsQuery),
      pool.query(upcomingEventsQuery, values),
    ]);

    return {
      events: eventStats.rows[0],
      clients: clientStats.rows[0],
      vendors: vendorStats.rows[0],
      upcoming_events: upcomingEvents.rows[0].upcoming_events,
    };
  }

  /**
   * Get revenue statistics
   * @param {string} companyId - Company ID (optional)
   * @param {string} startDate - Start date (optional)
   * @param {string} endDate - End date (optional)
   * @returns {Promise<Object>} Revenue statistics
   */
  async getRevenueStats(companyId = null, startDate = null, endDate = null) {
    let query = `
      SELECT
        COUNT(*) as total_events,
        COALESCE(SUM(total_budget), 0) as total_revenue,
        COALESCE(SUM(actual_cost), 0) as total_costs,
        COALESCE(SUM(total_budget - actual_cost), 0) as total_profit,
        COALESCE(AVG(total_budget), 0) as average_revenue_per_event,
        COALESCE(AVG(actual_cost), 0) as average_cost_per_event,
        MAX(total_budget) as highest_revenue_event,
        MIN(total_budget) as lowest_revenue_event
      FROM events
      WHERE 1=1
    `;

    const values = [];
    let paramCount = 1;

    if (companyId) {
      query += ` AND company_id = $${paramCount}`;
      values.push(companyId);
      paramCount++;
    }

    if (startDate) {
      query += ` AND event_date >= $${paramCount}`;
      values.push(startDate);
      paramCount++;
    }

    if (endDate) {
      query += ` AND event_date <= $${paramCount}`;
      values.push(endDate);
    }

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Get event statistics by type
   * @param {string} companyId - Company ID (optional)
   * @returns {Promise<Array>} Event type statistics
   */
  async getEventStatsByType(companyId = null) {
    let query = `
      SELECT
        event_type,
        COUNT(*) as event_count,
        COALESCE(SUM(total_budget), 0) as total_revenue,
        COALESCE(AVG(total_budget), 0) as average_revenue,
        COALESCE(AVG(expected_guests), 0) as average_guests
      FROM events
      WHERE event_type IS NOT NULL
    `;

    const values = [];
    if (companyId) {
      query += ' AND company_id = $1';
      values.push(companyId);
    }

    query += ' GROUP BY event_type ORDER BY event_count DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Get vendor performance metrics
   * @param {number} limit - Number of vendors to return
   * @returns {Promise<Array>} Top performing vendors
   */
  async getTopPerformingVendors(limit = 10) {
    const query = `
      SELECT
        v.id,
        v.vendor_name,
        v.vendor_code,
        vc.category_name,
        v.rating,
        COUNT(ev.id) as total_bookings,
        COALESCE(SUM(ev.final_price), 0) as total_revenue,
        COALESCE(AVG(ev.final_price), 0) as average_booking_value,
        COUNT(CASE WHEN ev.payment_status = 'PAID' THEN 1 END) as paid_bookings,
        ROUND((COUNT(CASE WHEN ev.payment_status = 'PAID' THEN 1 END)::numeric / COUNT(ev.id)::numeric * 100), 2) as payment_completion_rate
      FROM vendors v
      LEFT JOIN vendor_categories vc ON v.category_id = vc.id
      LEFT JOIN event_vendors ev ON v.id = ev.vendor_id
      WHERE v.is_active = true
      GROUP BY v.id, v.vendor_name, v.vendor_code, vc.category_name, v.rating
      ORDER BY total_bookings DESC, total_revenue DESC
      LIMIT $1
    `;

    const result = await pool.query(query, [limit]);
    return result.rows;
  }

  /**
   * Get vendor statistics by category
   * @returns {Promise<Array>} Vendor category statistics
   */
  async getVendorStatsByCategory() {
    const query = `
      SELECT
        vc.category_name,
        COUNT(DISTINCT v.id) as vendor_count,
        COUNT(DISTINCT ev.id) as total_bookings,
        COALESCE(SUM(ev.final_price), 0) as total_revenue,
        COALESCE(AVG(v.rating), 0) as average_rating,
        COALESCE(AVG(v.base_price), 0) as average_base_price
      FROM vendor_categories vc
      LEFT JOIN vendors v ON vc.id = v.category_id
      LEFT JOIN event_vendors ev ON v.id = ev.vendor_id
      GROUP BY vc.id, vc.category_name
      ORDER BY total_bookings DESC
    `;

    const result = await pool.query(query);
    return result.rows;
  }

  /**
   * Get monthly event trends
   * @param {number} months - Number of months to look back
   * @param {string} companyId - Company ID (optional)
   * @returns {Promise<Array>} Monthly event trends
   */
  async getMonthlyEventTrends(months = 12, companyId = null) {
    let query = `
      SELECT
        DATE_TRUNC('month', event_date) as month,
        COUNT(*) as event_count,
        COALESCE(SUM(total_budget), 0) as total_revenue,
        COALESCE(SUM(actual_cost), 0) as total_costs,
        COALESCE(AVG(expected_guests), 0) as average_guests
      FROM events
      WHERE event_date >= CURRENT_DATE - INTERVAL '${months} months'
    `;

    const values = [];
    if (companyId) {
      query += ' AND company_id = $1';
      values.push(companyId);
    }

    query += ' GROUP BY DATE_TRUNC(\'month\', event_date) ORDER BY month DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Get event completion rate
   * @param {string} companyId - Company ID (optional)
   * @returns {Promise<Object>} Completion rate statistics
   */
  async getEventCompletionRate(companyId = null) {
    let query = `
      SELECT
        COUNT(*) as total_events,
        COUNT(CASE WHEN event_status = 'COMPLETED' THEN 1 END) as completed_events,
        COUNT(CASE WHEN event_status = 'CANCELLED' THEN 1 END) as cancelled_events,
        ROUND((COUNT(CASE WHEN event_status = 'COMPLETED' THEN 1 END)::numeric / COUNT(*)::numeric * 100), 2) as completion_rate,
        ROUND((COUNT(CASE WHEN event_status = 'CANCELLED' THEN 1 END)::numeric / COUNT(*)::numeric * 100), 2) as cancellation_rate
      FROM events
      WHERE event_status IN ('COMPLETED', 'CANCELLED')
    `;

    const values = [];
    if (companyId) {
      query += ' AND company_id = $1';
      values.push(companyId);
    }

    const result = await pool.query(query, values);
    return result.rows[0] || {
      total_events: 0,
      completed_events: 0,
      cancelled_events: 0,
      completion_rate: 0,
      cancellation_rate: 0,
    };
  }

  /**
   * Get payment collection statistics
   * @param {string} companyId - Company ID (optional)
   * @returns {Promise<Object>} Payment collection statistics
   */
  async getPaymentCollectionStats(companyId = null) {
    let query = `
      SELECT
        COALESCE(SUM(e.total_budget), 0) as total_revenue_expected,
        COALESCE(SUM(CASE WHEN ep.payment_type IN ('ADVANCE', 'INSTALLMENT', 'FINAL') THEN ep.amount ELSE 0 END), 0) as total_collected,
        COALESCE(SUM(e.total_budget) - SUM(CASE WHEN ep.payment_type IN ('ADVANCE', 'INSTALLMENT', 'FINAL') THEN ep.amount ELSE 0 END), 0) as total_pending,
        COUNT(DISTINCT e.id) as total_events_with_payments,
        ROUND((COALESCE(SUM(CASE WHEN ep.payment_type IN ('ADVANCE', 'INSTALLMENT', 'FINAL') THEN ep.amount ELSE 0 END), 0) / NULLIF(SUM(e.total_budget), 0) * 100), 2) as collection_rate
      FROM events e
      LEFT JOIN event_payments ep ON e.id = ep.event_id
      WHERE 1=1
    `;

    const values = [];
    if (companyId) {
      query += ' AND e.company_id = $1';
      values.push(companyId);
    }

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Get vendor payment statistics
   * @param {string} companyId - Company ID (optional)
   * @returns {Promise<Object>} Vendor payment statistics
   */
  async getVendorPaymentStats(companyId = null) {
    let query = `
      SELECT
        COALESCE(SUM(ev.final_price), 0) as total_vendor_costs,
        COALESCE(SUM(ev.advance_paid), 0) as total_paid_to_vendors,
        COALESCE(SUM(ev.balance_amount), 0) as total_pending_to_vendors,
        COUNT(CASE WHEN ev.payment_status = 'PAID' THEN 1 END) as fully_paid_vendors,
        COUNT(CASE WHEN ev.payment_status = 'PARTIAL' THEN 1 END) as partially_paid_vendors,
        COUNT(CASE WHEN ev.payment_status = 'PENDING' THEN 1 END) as unpaid_vendors,
        COUNT(*) as total_vendor_bookings
      FROM event_vendors ev
      JOIN events e ON ev.event_id = e.id
      WHERE 1=1
    `;

    const values = [];
    if (companyId) {
      query += ' AND e.company_id = $1';
      values.push(companyId);
    }

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Get top clients by revenue
   * @param {number} limit - Number of clients to return
   * @param {string} companyId - Company ID (optional)
   * @returns {Promise<Array>} Top clients
   */
  async getTopClientsByRevenue(limit = 10, companyId = null) {
    let query = `
      SELECT
        c.id,
        c.client_code,
        c.first_name || ' ' || COALESCE(c.last_name, '') as client_name,
        c.phone,
        c.email,
        COUNT(e.id) as total_events,
        COALESCE(SUM(e.total_budget), 0) as total_revenue,
        COALESCE(AVG(e.total_budget), 0) as average_event_value,
        MAX(e.event_date) as last_event_date
      FROM clients c
      JOIN events e ON c.id = e.client_id
    `;

    const values = [];
    let paramCount = 1;

    if (companyId) {
      query += ' WHERE e.company_id = $1';
      values.push(companyId);
      paramCount++;
    }

    query += ` GROUP BY c.id, c.client_code, c.first_name, c.last_name, c.phone, c.email
               ORDER BY total_revenue DESC
               LIMIT $${paramCount}`;
    values.push(limit);

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Get event budget analysis
   * @param {string} companyId - Company ID (optional)
   * @returns {Promise<Object>} Budget analysis
   */
  async getEventBudgetAnalysis(companyId = null) {
    let query = `
      SELECT
        COUNT(*) as total_events,
        COUNT(CASE WHEN actual_cost > estimated_cost THEN 1 END) as over_budget_events,
        COUNT(CASE WHEN actual_cost <= estimated_cost THEN 1 END) as within_budget_events,
        COALESCE(SUM(total_budget), 0) as total_budgeted,
        COALESCE(SUM(estimated_cost), 0) as total_estimated,
        COALESCE(SUM(actual_cost), 0) as total_actual,
        COALESCE(AVG(total_budget), 0) as average_budget,
        COALESCE(AVG(actual_cost - estimated_cost), 0) as average_budget_variance,
        ROUND((COUNT(CASE WHEN actual_cost > estimated_cost THEN 1 END)::numeric / NULLIF(COUNT(*), 0) * 100), 2) as over_budget_percentage
      FROM events
      WHERE estimated_cost > 0 AND actual_cost > 0
    `;

    const values = [];
    if (companyId) {
      query += ' AND company_id = $1';
      values.push(companyId);
    }

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Get task completion statistics
   * @param {string} companyId - Company ID (optional)
   * @returns {Promise<Object>} Task statistics
   */
  async getTaskCompletionStats(companyId = null) {
    let query = `
      SELECT
        COUNT(*) as total_tasks,
        COUNT(CASE WHEN task_status = 'COMPLETED' THEN 1 END) as completed_tasks,
        COUNT(CASE WHEN task_status = 'IN_PROGRESS' THEN 1 END) as in_progress_tasks,
        COUNT(CASE WHEN task_status = 'PENDING' THEN 1 END) as pending_tasks,
        COUNT(CASE WHEN due_date < CURRENT_DATE AND task_status != 'COMPLETED' THEN 1 END) as overdue_tasks,
        ROUND((COUNT(CASE WHEN task_status = 'COMPLETED' THEN 1 END)::numeric / NULLIF(COUNT(*), 0) * 100), 2) as completion_rate
      FROM event_tasks et
      JOIN events e ON et.event_id = e.id
      WHERE 1=1
    `;

    const values = [];
    if (companyId) {
      query += ' AND e.company_id = $1';
      values.push(companyId);
    }

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Get guest RSVP statistics
   * @param {string} companyId - Company ID (optional)
   * @returns {Promise<Object>} RSVP statistics
   */
  async getGuestRSVPStats(companyId = null) {
    let query = `
      SELECT
        COUNT(*) as total_guests,
        SUM(number_of_attendees) as total_attendees,
        COUNT(CASE WHEN invitation_sent = true THEN 1 END) as invitations_sent,
        COUNT(CASE WHEN rsvp_status = 'CONFIRMED' THEN 1 END) as confirmed_guests,
        SUM(CASE WHEN rsvp_status = 'CONFIRMED' THEN number_of_attendees ELSE 0 END) as confirmed_attendees,
        COUNT(CASE WHEN rsvp_status = 'DECLINED' THEN 1 END) as declined_guests,
        COUNT(CASE WHEN rsvp_status = 'PENDING' OR rsvp_status IS NULL THEN 1 END) as pending_rsvp,
        ROUND((COUNT(CASE WHEN rsvp_status = 'CONFIRMED' THEN 1 END)::numeric / NULLIF(COUNT(CASE WHEN invitation_sent = true THEN 1 END), 0) * 100), 2) as confirmation_rate
      FROM event_guests eg
      JOIN events e ON eg.event_id = e.id
      WHERE 1=1
    `;

    const values = [];
    if (companyId) {
      query += ' AND e.company_id = $1';
      values.push(companyId);
    }

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Get upcoming events with details
   * @param {number} days - Number of days to look ahead
   * @param {string} companyId - Company ID (optional)
   * @returns {Promise<Array>} Upcoming events
   */
  async getUpcomingEventsDetailed(days = 30, companyId = null) {
    let query = `
      SELECT
        e.*,
        c.first_name || ' ' || COALESCE(c.last_name, '') as client_name,
        c.phone as client_phone,
        COUNT(DISTINCT ev.id) as vendor_count,
        COUNT(DISTINCT et.id) as task_count,
        COUNT(DISTINCT CASE WHEN et.task_status = 'COMPLETED' THEN et.id END) as completed_tasks,
        COUNT(DISTINCT eg.id) as guest_count,
        COUNT(DISTINCT CASE WHEN eg.rsvp_status = 'CONFIRMED' THEN eg.id END) as confirmed_guests,
        e.event_date - CURRENT_DATE as days_until_event
      FROM events e
      LEFT JOIN clients c ON e.client_id = c.id
      LEFT JOIN event_vendors ev ON e.id = ev.event_id
      LEFT JOIN event_tasks et ON e.id = et.event_id
      LEFT JOIN event_guests eg ON e.id = eg.event_id
      WHERE e.event_date >= CURRENT_DATE
        AND e.event_date <= CURRENT_DATE + $1
        AND e.event_status NOT IN ('CANCELLED', 'COMPLETED')
    `;

    const values = [days];
    if (companyId) {
      query += ' AND e.company_id = $2';
      values.push(companyId);
    }

    query += ' GROUP BY e.id, c.first_name, c.last_name, c.phone ORDER BY e.event_date ASC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Get event statistics by city
   * @param {string} companyId - Company ID (optional)
   * @returns {Promise<Array>} City-wise event statistics
   */
  async getEventStatsByCity(companyId = null) {
    let query = `
      SELECT
        venue_city,
        COUNT(*) as event_count,
        COALESCE(SUM(total_budget), 0) as total_revenue,
        COALESCE(AVG(expected_guests), 0) as average_guests
      FROM events
      WHERE venue_city IS NOT NULL
    `;

    const values = [];
    if (companyId) {
      query += ' AND company_id = $1';
      values.push(companyId);
    }

    query += ' GROUP BY venue_city ORDER BY event_count DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }
}

export default new AnalyticsRepository();
