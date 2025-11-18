import { pool } from '../database.js';
import { NotFoundError } from '../utils/errors.js';

/**
 * Attendance Repository
 * Handles database operations for member attendance/check-ins
 */
class AttendanceRepository {
  /**
   * Create attendance record (check-in)
   * @param {Object} attendanceData - Attendance data
   * @returns {Promise<Object>} Created attendance record
   */
  async create(attendanceData) {
    const { member_id, check_in_time, notes } = attendanceData;

    const query = `
      INSERT INTO attendance (member_id, check_in_time, notes)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const values = [member_id, check_in_time || 'NOW()', notes];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Check-in member
   * @param {number} memberId - Member ID
   * @param {string} notes - Optional notes
   * @returns {Promise<Object>} Attendance record
   */
  async checkIn(memberId, notes = null) {
    // Check if member has an open check-in (no check-out)
    const openCheckIn = await this.findOpenCheckIn(memberId);
    if (openCheckIn) {
      throw new Error('Member already checked in. Please check out first.');
    }

    const query = `
      INSERT INTO attendance (member_id, check_in_time, notes)
      VALUES ($1, CURRENT_TIMESTAMP, $2)
      RETURNING *
    `;

    const result = await pool.query(query, [memberId, notes]);
    return result.rows[0];
  }

  /**
   * Check-out member
   * @param {number} attendanceId - Attendance ID
   * @returns {Promise<Object>} Updated attendance record
   */
  async checkOut(attendanceId) {
    const query = `
      UPDATE attendance
      SET check_out_time = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE attendance_id = $1 AND check_out_time IS NULL
      RETURNING *
    `;

    const result = await pool.query(query, [attendanceId]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Attendance record or already checked out');
    }

    return result.rows[0];
  }

  /**
   * Check-out member by member ID
   * @param {number} memberId - Member ID
   * @returns {Promise<Object>} Updated attendance record
   */
  async checkOutByMember(memberId) {
    const query = `
      UPDATE attendance
      SET check_out_time = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE member_id = $1 AND check_out_time IS NULL
        AND check_in_time >= CURRENT_DATE
      RETURNING *
    `;

    const result = await pool.query(query, [memberId]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Open check-in not found for member');
    }

    return result.rows[0];
  }

  /**
   * Find open check-in for member
   * @param {number} memberId - Member ID
   * @returns {Promise<Object|null>} Open attendance record or null
   */
  async findOpenCheckIn(memberId) {
    const query = `
      SELECT a.*, m.first_name, m.last_name
      FROM attendance a
      INNER JOIN members m ON m.member_id = a.member_id
      WHERE a.member_id = $1
        AND a.check_out_time IS NULL
        AND a.check_in_time >= CURRENT_DATE
      ORDER BY a.check_in_time DESC
      LIMIT 1
    `;

    const result = await pool.query(query, [memberId]);
    return result.rows[0] || null;
  }

  /**
   * Find all attendance records with filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of attendance records
   */
  async findAll(filters = {}) {
    const { member_id, gym_id, start_date, end_date, limit = 100, offset = 0 } = filters;

    let query = `
      SELECT
        a.*,
        m.first_name, m.last_name, m.email, m.phone,
        g.name as gym_name,
        EXTRACT(EPOCH FROM (COALESCE(a.check_out_time, CURRENT_TIMESTAMP) - a.check_in_time))/3600 as duration_hours
      FROM attendance a
      INNER JOIN members m ON m.member_id = a.member_id
      LEFT JOIN gyms g ON g.gym_id = m.gym_id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (member_id) {
      query += ` AND a.member_id = $${paramCount}`;
      values.push(member_id);
      paramCount++;
    }

    if (gym_id) {
      query += ` AND m.gym_id = $${paramCount}`;
      values.push(gym_id);
      paramCount++;
    }

    if (start_date) {
      query += ` AND a.check_in_time >= $${paramCount}`;
      values.push(start_date);
      paramCount++;
    }

    if (end_date) {
      query += ` AND a.check_in_time <= $${paramCount}`;
      values.push(end_date);
      paramCount++;
    }

    query += ` ORDER BY a.check_in_time DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Find attendance by ID
   * @param {number} id - Attendance ID
   * @returns {Promise<Object>} Attendance record
   */
  async findById(id) {
    const query = `
      SELECT
        a.*,
        m.first_name, m.last_name, m.email, m.phone,
        g.name as gym_name,
        EXTRACT(EPOCH FROM (COALESCE(a.check_out_time, CURRENT_TIMESTAMP) - a.check_in_time))/3600 as duration_hours
      FROM attendance a
      INNER JOIN members m ON m.member_id = a.member_id
      LEFT JOIN gyms g ON g.gym_id = m.gym_id
      WHERE a.attendance_id = $1
    `;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Attendance record');
    }

    return result.rows[0];
  }

  /**
   * Get attendance history for member
   * @param {number} memberId - Member ID
   * @param {number} limit - Result limit
   * @returns {Promise<Array>} Attendance history
   */
  async findByMember(memberId, limit = 50) {
    const query = `
      SELECT
        a.*,
        EXTRACT(EPOCH FROM (COALESCE(a.check_out_time, CURRENT_TIMESTAMP) - a.check_in_time))/3600 as duration_hours
      FROM attendance a
      WHERE a.member_id = $1
      ORDER BY a.check_in_time DESC
      LIMIT $2
    `;

    const result = await pool.query(query, [memberId, limit]);
    return result.rows;
  }

  /**
   * Get today's attendance for gym
   * @param {number} gymId - Gym ID
   * @returns {Promise<Array>} Today's attendance
   */
  async findTodayByGym(gymId) {
    const query = `
      SELECT
        a.*,
        m.first_name, m.last_name, m.phone,
        EXTRACT(EPOCH FROM (COALESCE(a.check_out_time, CURRENT_TIMESTAMP) - a.check_in_time))/3600 as duration_hours
      FROM attendance a
      INNER JOIN members m ON m.member_id = a.member_id
      WHERE m.gym_id = $1
        AND a.check_in_time >= CURRENT_DATE
      ORDER BY a.check_in_time DESC
    `;

    const result = await pool.query(query, [gymId]);
    return result.rows;
  }

  /**
   * Get currently checked-in members for gym
   * @param {number} gymId - Gym ID
   * @returns {Promise<Array>} Currently checked-in members
   */
  async findActiveByGym(gymId) {
    const query = `
      SELECT
        a.*,
        m.first_name, m.last_name, m.phone, m.photo_url,
        EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - a.check_in_time))/3600 as duration_hours
      FROM attendance a
      INNER JOIN members m ON m.member_id = a.member_id
      WHERE m.gym_id = $1
        AND a.check_out_time IS NULL
        AND a.check_in_time >= CURRENT_DATE
      ORDER BY a.check_in_time DESC
    `;

    const result = await pool.query(query, [gymId]);
    return result.rows;
  }

  /**
   * Get attendance frequency for member
   * @param {number} memberId - Member ID
   * @param {number} days - Number of days to analyze
   * @returns {Promise<Object>} Frequency statistics
   */
  async getFrequency(memberId, days = 30) {
    const query = `
      SELECT
        COUNT(*) as total_visits,
        COUNT(DISTINCT DATE(check_in_time)) as unique_days,
        ROUND(AVG(EXTRACT(EPOCH FROM (check_out_time - check_in_time))/3600)::numeric, 2) as avg_duration_hours,
        MIN(check_in_time) as first_visit,
        MAX(check_in_time) as last_visit
      FROM attendance
      WHERE member_id = $1
        AND check_in_time >= CURRENT_DATE - INTERVAL '${days} days'
        AND check_out_time IS NOT NULL
    `;

    const result = await pool.query(query, [memberId]);
    return result.rows[0];
  }

  /**
   * Get attendance statistics
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Object>} Attendance statistics
   */
  async getStatistics(filters = {}) {
    const { gym_id, start_date, end_date } = filters;

    let query = `
      SELECT
        COUNT(*) as total_check_ins,
        COUNT(DISTINCT a.member_id) as unique_members,
        COUNT(CASE WHEN a.check_out_time IS NULL THEN 1 END) as currently_checked_in,
        ROUND(AVG(EXTRACT(EPOCH FROM (a.check_out_time - a.check_in_time))/3600)::numeric, 2) as avg_duration_hours,
        MAX(a.check_in_time) as last_check_in
      FROM attendance a
      INNER JOIN members m ON m.member_id = a.member_id
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
      query += ` AND a.check_in_time >= $${paramCount}`;
      values.push(start_date);
      paramCount++;
    }

    if (end_date) {
      query += ` AND a.check_in_time <= $${paramCount}`;
      values.push(end_date);
      paramCount++;
    }

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Get peak hours analysis
   * @param {number} gymId - Gym ID
   * @param {number} days - Number of days to analyze
   * @returns {Promise<Array>} Peak hours data
   */
  async getPeakHours(gymId, days = 30) {
    const query = `
      SELECT
        EXTRACT(HOUR FROM check_in_time) as hour,
        COUNT(*) as check_ins,
        COUNT(DISTINCT member_id) as unique_members
      FROM attendance a
      INNER JOIN members m ON m.member_id = a.member_id
      WHERE m.gym_id = $1
        AND a.check_in_time >= CURRENT_DATE - INTERVAL '${days} days'
      GROUP BY EXTRACT(HOUR FROM check_in_time)
      ORDER BY hour
    `;

    const result = await pool.query(query, [gymId]);
    return result.rows;
  }

  /**
   * Get daily attendance trend
   * @param {number} gymId - Gym ID
   * @param {number} days - Number of days
   * @returns {Promise<Array>} Daily attendance data
   */
  async getDailyTrend(gymId, days = 30) {
    const query = `
      SELECT
        DATE(check_in_time) as date,
        COUNT(*) as check_ins,
        COUNT(DISTINCT member_id) as unique_members,
        ROUND(AVG(EXTRACT(EPOCH FROM (check_out_time - check_in_time))/3600)::numeric, 2) as avg_duration_hours
      FROM attendance a
      INNER JOIN members m ON m.member_id = a.member_id
      WHERE m.gym_id = $1
        AND a.check_in_time >= CURRENT_DATE - INTERVAL '${days} days'
      GROUP BY DATE(check_in_time)
      ORDER BY date DESC
    `;

    const result = await pool.query(query, [gymId]);
    return result.rows;
  }

  /**
   * Count attendance records
   * @param {Object} filters - Filter criteria
   * @returns {Promise<number>} Total count
   */
  async count(filters = {}) {
    const { member_id, gym_id, start_date, end_date } = filters;

    let query = `
      SELECT COUNT(*)
      FROM attendance a
      INNER JOIN members m ON m.member_id = a.member_id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (member_id) {
      query += ` AND a.member_id = $${paramCount}`;
      values.push(member_id);
      paramCount++;
    }

    if (gym_id) {
      query += ` AND m.gym_id = $${paramCount}`;
      values.push(gym_id);
      paramCount++;
    }

    if (start_date) {
      query += ` AND a.check_in_time >= $${paramCount}`;
      values.push(start_date);
      paramCount++;
    }

    if (end_date) {
      query += ` AND a.check_in_time <= $${paramCount}`;
      values.push(end_date);
      paramCount++;
    }

    const result = await pool.query(query, values);
    return parseInt(result.rows[0].count);
  }

  /**
   * Update attendance notes
   * @param {number} id - Attendance ID
   * @param {string} notes - Notes
   * @returns {Promise<Object>} Updated attendance
   */
  async updateNotes(id, notes) {
    const query = `
      UPDATE attendance
      SET notes = $2, updated_at = CURRENT_TIMESTAMP
      WHERE attendance_id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [id, notes]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Attendance record');
    }

    return result.rows[0];
  }
}

export default new AttendanceRepository();
