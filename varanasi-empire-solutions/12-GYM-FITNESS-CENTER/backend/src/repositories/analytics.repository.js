import { pool } from '../database.js';

/**
 * Analytics Repository
 * Handles database operations for analytics and reporting
 */
class AnalyticsRepository {
  /**
   * Get dashboard statistics for gym
   * @param {number} gymId - Gym ID (optional)
   * @returns {Promise<Object>} Dashboard statistics
   */
  async getDashboardStats(gymId = null) {
    let memberQuery = `
      SELECT
        COUNT(*) as total_members,
        COUNT(CASE WHEN m.is_active = true THEN 1 END) as active_members
      FROM members m
    `;

    let membershipQuery = `
      SELECT
        COUNT(*) as total_memberships,
        COUNT(CASE WHEN ms.status = 'ACTIVE' THEN 1 END) as active_memberships,
        COUNT(CASE WHEN ms.status = 'EXPIRED' THEN 1 END) as expired_memberships,
        COALESCE(SUM(ms.final_fee), 0) as total_revenue,
        COALESCE(SUM(ms.amount_paid), 0) as collected_revenue,
        COALESCE(SUM(ms.final_fee - ms.amount_paid), 0) as pending_revenue
      FROM memberships ms
      INNER JOIN members m ON m.member_id = ms.member_id
    `;

    let attendanceQuery = `
      SELECT
        COUNT(*) as total_check_ins,
        COUNT(DISTINCT a.member_id) as unique_visitors,
        COUNT(CASE WHEN a.check_out_time IS NULL THEN 1 END) as currently_checked_in
      FROM attendance a
      INNER JOIN members m ON m.member_id = a.member_id
      WHERE a.check_in_time >= CURRENT_DATE
    `;

    let sessionQuery = `
      SELECT
        COUNT(*) as total_sessions,
        COUNT(CASE WHEN pts.status = 'SCHEDULED' THEN 1 END) as scheduled_sessions,
        COUNT(CASE WHEN pts.status = 'COMPLETED' THEN 1 END) as completed_sessions,
        COALESCE(SUM(CASE WHEN pts.status = 'COMPLETED' THEN pts.session_fee END), 0) as session_revenue
      FROM personal_training_sessions pts
      INNER JOIN trainers t ON t.trainer_id = pts.trainer_id
    `;

    const values = [];
    let paramIndex = 1;

    if (gymId) {
      memberQuery += ` WHERE m.gym_id = $${paramIndex}`;
      membershipQuery += ` WHERE m.gym_id = $${paramIndex}`;
      attendanceQuery += ` AND m.gym_id = $${paramIndex}`;
      sessionQuery += ` WHERE t.gym_id = $${paramIndex}`;
      values.push(gymId);
    }

    const [members, memberships, attendance, sessions] = await Promise.all([
      pool.query(memberQuery, values),
      pool.query(membershipQuery, values),
      pool.query(attendanceQuery, values),
      pool.query(sessionQuery, values)
    ]);

    return {
      members: members.rows[0],
      memberships: memberships.rows[0],
      attendance: attendance.rows[0],
      sessions: sessions.rows[0]
    };
  }

  /**
   * Get revenue report
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Object>} Revenue report
   */
  async getRevenueReport(filters = {}) {
    const { gym_id, start_date, end_date } = filters;

    let query = `
      SELECT
        DATE_TRUNC('month', ms.start_date) as month,
        COUNT(*) as membership_count,
        COALESCE(SUM(ms.final_fee), 0) as total_revenue,
        COALESCE(SUM(ms.amount_paid), 0) as collected_revenue,
        COALESCE(SUM(ms.final_fee - ms.amount_paid), 0) as pending_revenue,
        COALESCE(AVG(ms.final_fee), 0) as avg_membership_fee
      FROM memberships ms
      INNER JOIN members m ON m.member_id = ms.member_id
      WHERE 1=1
    `;

    const values = [];
    let paramCount = 1;

    if (gym_id) {
      query += ` AND m.gym_id = $${paramCount}`;
      values.push(gym_id);
      paramCount++;
    }

    if (start_date) {
      query += ` AND ms.start_date >= $${paramCount}`;
      values.push(start_date);
      paramCount++;
    }

    if (end_date) {
      query += ` AND ms.start_date <= $${paramCount}`;
      values.push(end_date);
      paramCount++;
    }

    query += ' GROUP BY month ORDER BY month DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Get membership retention statistics
   * @param {number} gymId - Gym ID (optional)
   * @returns {Promise<Object>} Retention statistics
   */
  async getRetentionStats(gymId = null) {
    let query = `
      WITH member_stats AS (
        SELECT
          m.member_id,
          m.created_at as join_date,
          COUNT(ms.membership_id) as total_renewals,
          MAX(ms.end_date) as last_membership_end,
          CASE
            WHEN MAX(ms.end_date) >= CURRENT_DATE THEN 'Active'
            WHEN MAX(ms.end_date) < CURRENT_DATE AND MAX(ms.end_date) >= CURRENT_DATE - INTERVAL '30 days' THEN 'Recent Expiry'
            ELSE 'Churned'
          END as status
        FROM members m
        LEFT JOIN memberships ms ON ms.member_id = m.member_id
        WHERE m.is_active = true
    `;

    const values = [];
    if (gymId) {
      query += ' AND m.gym_id = $1';
      values.push(gymId);
    }

    query += `
        GROUP BY m.member_id, m.created_at
      )
      SELECT
        COUNT(*) as total_members,
        COUNT(CASE WHEN status = 'Active' THEN 1 END) as active_members,
        COUNT(CASE WHEN status = 'Recent Expiry' THEN 1 END) as recent_expiry,
        COUNT(CASE WHEN status = 'Churned' THEN 1 END) as churned_members,
        ROUND(AVG(total_renewals)::numeric, 2) as avg_renewals,
        ROUND(
          COUNT(CASE WHEN status = 'Active' THEN 1 END)::numeric /
          NULLIF(COUNT(*)::numeric, 0) * 100, 2
        ) as retention_rate
      FROM member_stats
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Get member growth trend
   * @param {number} gymId - Gym ID (optional)
   * @param {number} months - Number of months to analyze
   * @returns {Promise<Array>} Growth trend data
   */
  async getMemberGrowthTrend(gymId = null, months = 12) {
    let query = `
      SELECT
        DATE_TRUNC('month', m.created_at) as month,
        COUNT(*) as new_members,
        SUM(COUNT(*)) OVER (ORDER BY DATE_TRUNC('month', m.created_at)) as cumulative_members
      FROM members m
      WHERE m.created_at >= CURRENT_DATE - INTERVAL '${months} months'
    `;

    const values = [];
    if (gymId) {
      query += ' AND m.gym_id = $1';
      values.push(gymId);
    }

    query += ' GROUP BY month ORDER BY month';

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Get attendance trends
   * @param {number} gymId - Gym ID (optional)
   * @param {number} days - Number of days to analyze
   * @returns {Promise<Array>} Attendance trend data
   */
  async getAttendanceTrend(gymId = null, days = 30) {
    let query = `
      SELECT
        DATE(a.check_in_time) as date,
        COUNT(*) as total_check_ins,
        COUNT(DISTINCT a.member_id) as unique_members,
        ROUND(AVG(EXTRACT(EPOCH FROM (a.check_out_time - a.check_in_time))/3600)::numeric, 2) as avg_duration_hours
      FROM attendance a
      INNER JOIN members m ON m.member_id = a.member_id
      WHERE a.check_in_time >= CURRENT_DATE - INTERVAL '${days} days'
    `;

    const values = [];
    if (gymId) {
      query += ' AND m.gym_id = $1';
      values.push(gymId);
    }

    query += ' GROUP BY DATE(a.check_in_time) ORDER BY date DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Get peak hours analysis
   * @param {number} gymId - Gym ID (optional)
   * @param {number} days - Number of days to analyze
   * @returns {Promise<Array>} Peak hours data
   */
  async getPeakHours(gymId = null, days = 30) {
    let query = `
      SELECT
        EXTRACT(HOUR FROM a.check_in_time) as hour,
        COUNT(*) as check_ins,
        COUNT(DISTINCT a.member_id) as unique_members,
        ROUND(AVG(EXTRACT(EPOCH FROM (a.check_out_time - a.check_in_time))/3600)::numeric, 2) as avg_duration
      FROM attendance a
      INNER JOIN members m ON m.member_id = a.member_id
      WHERE a.check_in_time >= CURRENT_DATE - INTERVAL '${days} days'
    `;

    const values = [];
    if (gymId) {
      query += ' AND m.gym_id = $1';
      values.push(gymId);
    }

    query += ' GROUP BY hour ORDER BY hour';

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Get trainer performance statistics
   * @param {number} gymId - Gym ID (optional)
   * @returns {Promise<Array>} Trainer performance data
   */
  async getTrainerPerformance(gymId = null) {
    let query = `
      SELECT
        t.trainer_id,
        t.first_name,
        t.last_name,
        t.specialization,
        t.hourly_rate,
        COUNT(pts.session_id) as total_sessions,
        COUNT(CASE WHEN pts.status = 'COMPLETED' THEN 1 END) as completed_sessions,
        COUNT(CASE WHEN pts.status = 'SCHEDULED' THEN 1 END) as scheduled_sessions,
        COUNT(CASE WHEN pts.status = 'CANCELLED' THEN 1 END) as cancelled_sessions,
        COALESCE(SUM(CASE WHEN pts.status = 'COMPLETED' THEN pts.session_fee END), 0) as total_revenue,
        ROUND(
          CASE
            WHEN COUNT(pts.session_id) > 0 THEN
              COUNT(CASE WHEN pts.status = 'COMPLETED' THEN 1 END)::numeric /
              COUNT(pts.session_id)::numeric * 100
            ELSE 0
          END, 2
        ) as completion_rate,
        COUNT(DISTINCT pts.member_id) as unique_clients
      FROM trainers t
      LEFT JOIN personal_training_sessions pts ON pts.trainer_id = t.trainer_id
      WHERE t.is_active = true
    `;

    const values = [];
    if (gymId) {
      query += ' AND t.gym_id = $1';
      values.push(gymId);
    }

    query += ' GROUP BY t.trainer_id, t.first_name, t.last_name, t.specialization, t.hourly_rate ORDER BY total_revenue DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Get membership plan popularity
   * @param {number} gymId - Gym ID (optional)
   * @returns {Promise<Array>} Plan popularity data
   */
  async getPlanPopularity(gymId = null) {
    let query = `
      SELECT
        mp.plan_id,
        mp.name as plan_name,
        mp.duration_months,
        mp.plan_fee,
        COUNT(ms.membership_id) as total_memberships,
        COUNT(CASE WHEN ms.status = 'ACTIVE' THEN 1 END) as active_memberships,
        COALESCE(SUM(ms.final_fee), 0) as total_revenue,
        ROUND(AVG(ms.final_fee)::numeric, 2) as avg_final_fee
      FROM membership_plans mp
      LEFT JOIN memberships ms ON ms.plan_id = mp.plan_id
    `;

    const values = [];
    if (gymId) {
      query += `
        LEFT JOIN members m ON m.member_id = ms.member_id
        WHERE m.gym_id = $1
      `;
      values.push(gymId);
    }

    query += ' GROUP BY mp.plan_id, mp.name, mp.duration_months, mp.plan_fee ORDER BY total_memberships DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Get expiring memberships alert
   * @param {number} gymId - Gym ID (optional)
   * @param {number} days - Days until expiry
   * @returns {Promise<Array>} Expiring memberships
   */
  async getExpiringMemberships(gymId = null, days = 7) {
    let query = `
      SELECT
        ms.membership_id,
        ms.end_date,
        (ms.end_date - CURRENT_DATE) as days_until_expiry,
        m.member_id,
        m.first_name,
        m.last_name,
        m.email,
        m.phone,
        mp.name as plan_name,
        ms.final_fee,
        g.name as gym_name
      FROM memberships ms
      INNER JOIN members m ON m.member_id = ms.member_id
      INNER JOIN membership_plans mp ON mp.plan_id = ms.plan_id
      LEFT JOIN gyms g ON g.gym_id = m.gym_id
      WHERE ms.status = 'ACTIVE'
        AND ms.end_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '${days} days'
    `;

    const values = [];
    if (gymId) {
      query += ' AND m.gym_id = $1';
      values.push(gymId);
    }

    query += ' ORDER BY ms.end_date';

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Get payment status summary
   * @param {number} gymId - Gym ID (optional)
   * @returns {Promise<Object>} Payment status summary
   */
  async getPaymentStatusSummary(gymId = null) {
    let query = `
      SELECT
        ms.payment_status,
        COUNT(*) as count,
        COALESCE(SUM(ms.final_fee), 0) as total_amount,
        COALESCE(SUM(ms.amount_paid), 0) as paid_amount,
        COALESCE(SUM(ms.final_fee - ms.amount_paid), 0) as pending_amount
      FROM memberships ms
      INNER JOIN members m ON m.member_id = ms.member_id
      WHERE ms.status = 'ACTIVE'
    `;

    const values = [];
    if (gymId) {
      query += ' AND m.gym_id = $1';
      values.push(gymId);
    }

    query += ' GROUP BY ms.payment_status ORDER BY ms.payment_status';

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Get top members by attendance
   * @param {number} gymId - Gym ID (optional)
   * @param {number} days - Number of days to analyze
   * @param {number} limit - Result limit
   * @returns {Promise<Array>} Top members
   */
  async getTopMembersByAttendance(gymId = null, days = 30, limit = 10) {
    let query = `
      SELECT
        m.member_id,
        m.first_name,
        m.last_name,
        m.email,
        m.phone,
        COUNT(a.attendance_id) as visit_count,
        ROUND(AVG(EXTRACT(EPOCH FROM (a.check_out_time - a.check_in_time))/3600)::numeric, 2) as avg_duration_hours,
        MAX(a.check_in_time) as last_visit
      FROM members m
      INNER JOIN attendance a ON a.member_id = m.member_id
      WHERE a.check_in_time >= CURRENT_DATE - INTERVAL '${days} days'
    `;

    const values = [];
    let paramCount = 1;

    if (gymId) {
      query += ` AND m.gym_id = $${paramCount}`;
      values.push(gymId);
      paramCount++;
    }

    values.push(limit);
    query += ` GROUP BY m.member_id, m.first_name, m.last_name, m.email, m.phone ORDER BY visit_count DESC LIMIT $${paramCount}`;

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Get revenue comparison (current vs previous period)
   * @param {number} gymId - Gym ID (optional)
   * @param {number} days - Period length in days
   * @returns {Promise<Object>} Revenue comparison
   */
  async getRevenueComparison(gymId = null, days = 30) {
    let query = `
      WITH current_period AS (
        SELECT
          COUNT(*) as membership_count,
          COALESCE(SUM(ms.final_fee), 0) as revenue,
          COALESCE(SUM(ms.amount_paid), 0) as collected
        FROM memberships ms
        INNER JOIN members m ON m.member_id = ms.member_id
        WHERE ms.start_date >= CURRENT_DATE - INTERVAL '${days} days'
    `;

    let previousQuery = `
      ), previous_period AS (
        SELECT
          COUNT(*) as membership_count,
          COALESCE(SUM(ms.final_fee), 0) as revenue,
          COALESCE(SUM(ms.amount_paid), 0) as collected
        FROM memberships ms
        INNER JOIN members m ON m.member_id = ms.member_id
        WHERE ms.start_date >= CURRENT_DATE - INTERVAL '${days * 2} days'
          AND ms.start_date < CURRENT_DATE - INTERVAL '${days} days'
    `;

    const values = [];
    if (gymId) {
      query += ' AND m.gym_id = $1';
      previousQuery += ' AND m.gym_id = $1';
      values.push(gymId);
    }

    const fullQuery = query + previousQuery + `
      )
      SELECT
        current_period.membership_count as current_memberships,
        current_period.revenue as current_revenue,
        current_period.collected as current_collected,
        previous_period.membership_count as previous_memberships,
        previous_period.revenue as previous_revenue,
        previous_period.collected as previous_collected,
        ROUND(
          CASE
            WHEN previous_period.revenue > 0 THEN
              ((current_period.revenue - previous_period.revenue) / previous_period.revenue * 100)
            ELSE 0
          END::numeric, 2
        ) as revenue_growth_percentage
      FROM current_period, previous_period
    `;

    const result = await pool.query(fullQuery, values);
    return result.rows[0];
  }

  /**
   * Get gym capacity utilization
   * @param {number} gymId - Gym ID
   * @returns {Promise<Object>} Capacity utilization
   */
  async getCapacityUtilization(gymId) {
    const query = `
      SELECT
        g.capacity,
        COUNT(DISTINCT m.member_id) as total_members,
        COUNT(DISTINCT CASE WHEN ms.status = 'ACTIVE' THEN m.member_id END) as active_members,
        ROUND(
          COUNT(DISTINCT CASE WHEN ms.status = 'ACTIVE' THEN m.member_id END)::numeric /
          NULLIF(g.capacity::numeric, 0) * 100, 2
        ) as utilization_percentage,
        g.capacity - COUNT(DISTINCT CASE WHEN ms.status = 'ACTIVE' THEN m.member_id END) as available_capacity
      FROM gyms g
      LEFT JOIN members m ON m.gym_id = g.gym_id
      LEFT JOIN memberships ms ON ms.member_id = m.member_id
      WHERE g.gym_id = $1
      GROUP BY g.gym_id, g.capacity
    `;

    const result = await pool.query(query, [gymId]);
    return result.rows[0];
  }
}

export default new AnalyticsRepository();
