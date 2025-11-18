import { pool } from '../database.js';
import { NotFoundError } from '../utils/errors.js';

/**
 * Personal Training Session Repository
 * Handles database operations for training sessions
 */
class SessionRepository {
  /**
   * Create a new training session
   * @param {Object} sessionData - Session data
   * @returns {Promise<Object>} Created session
   */
  async create(sessionData) {
    const {
      member_id, trainer_id, session_date, start_time, end_time,
      session_fee, session_type, notes, status
    } = sessionData;

    const query = `
      INSERT INTO personal_training_sessions (
        member_id, trainer_id, session_date, start_time, end_time,
        session_fee, session_type, notes, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      member_id, trainer_id, session_date, start_time, end_time,
      session_fee, session_type, notes, status || 'SCHEDULED'
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find all sessions with filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of sessions
   */
  async findAll(filters = {}) {
    const { member_id, trainer_id, status, session_date, gym_id, limit = 50, offset = 0 } = filters;

    let query = `
      SELECT
        pts.*,
        m.first_name as member_first_name,
        m.last_name as member_last_name,
        m.phone as member_phone,
        t.first_name as trainer_first_name,
        t.last_name as trainer_last_name,
        t.specialization,
        g.name as gym_name
      FROM personal_training_sessions pts
      INNER JOIN members m ON m.member_id = pts.member_id
      INNER JOIN trainers t ON t.trainer_id = pts.trainer_id
      LEFT JOIN gyms g ON g.gym_id = t.gym_id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (member_id) {
      query += ` AND pts.member_id = $${paramCount}`;
      values.push(member_id);
      paramCount++;
    }

    if (trainer_id) {
      query += ` AND pts.trainer_id = $${paramCount}`;
      values.push(trainer_id);
      paramCount++;
    }

    if (status) {
      query += ` AND pts.status = $${paramCount}`;
      values.push(status);
      paramCount++;
    }

    if (session_date) {
      query += ` AND pts.session_date = $${paramCount}`;
      values.push(session_date);
      paramCount++;
    }

    if (gym_id) {
      query += ` AND t.gym_id = $${paramCount}`;
      values.push(gym_id);
      paramCount++;
    }

    query += ` ORDER BY pts.session_date DESC, pts.start_time DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Find session by ID
   * @param {number} id - Session ID
   * @returns {Promise<Object>} Session data
   */
  async findById(id) {
    const query = `
      SELECT
        pts.*,
        m.first_name as member_first_name,
        m.last_name as member_last_name,
        m.email as member_email,
        m.phone as member_phone,
        t.first_name as trainer_first_name,
        t.last_name as trainer_last_name,
        t.email as trainer_email,
        t.phone as trainer_phone,
        t.specialization,
        t.hourly_rate,
        g.name as gym_name
      FROM personal_training_sessions pts
      INNER JOIN members m ON m.member_id = pts.member_id
      INNER JOIN trainers t ON t.trainer_id = pts.trainer_id
      LEFT JOIN gyms g ON g.gym_id = t.gym_id
      WHERE pts.session_id = $1
    `;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Session');
    }

    return result.rows[0];
  }

  /**
   * Update session
   * @param {number} id - Session ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated session
   */
  async update(id, updateData) {
    await this.findById(id); // Check if exists

    const allowedFields = [
      'trainer_id', 'session_date', 'start_time', 'end_time',
      'session_fee', 'session_type', 'notes', 'status', 'feedback'
    ];
    const updates = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key) && updateData[key] !== undefined) {
        updates.push(`${key} = $${paramCount}`);
        values.push(updateData[key]);
        paramCount++;
      }
    });

    if (updates.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(id);
    const query = `
      UPDATE personal_training_sessions
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE session_id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Update session status
   * @param {number} id - Session ID
   * @param {string} status - New status
   * @param {string} feedback - Optional feedback
   * @returns {Promise<Object>} Updated session
   */
  async updateStatus(id, status, feedback = null) {
    const updates = ['status = $2'];
    const values = [id, status];
    let paramCount = 3;

    if (feedback) {
      updates.push(`feedback = $${paramCount}`);
      values.push(feedback);
      paramCount++;
    }

    const query = `
      UPDATE personal_training_sessions
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE session_id = $1
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new NotFoundError('Session');
    }

    return result.rows[0];
  }

  /**
   * Cancel session
   * @param {number} id - Session ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise<Object>} Cancelled session
   */
  async cancel(id, reason) {
    const query = `
      UPDATE personal_training_sessions
      SET status = 'CANCELLED',
          notes = CONCAT(COALESCE(notes, ''), ' | Cancellation reason: ', $2),
          updated_at = CURRENT_TIMESTAMP
      WHERE session_id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [id, reason]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Session');
    }

    return result.rows[0];
  }

  /**
   * Complete session
   * @param {number} id - Session ID
   * @param {string} feedback - Session feedback
   * @returns {Promise<Object>} Completed session
   */
  async complete(id, feedback) {
    return await this.updateStatus(id, 'COMPLETED', feedback);
  }

  /**
   * Get upcoming sessions for member
   * @param {number} memberId - Member ID
   * @param {number} limit - Result limit
   * @returns {Promise<Array>} Upcoming sessions
   */
  async findUpcomingByMember(memberId, limit = 10) {
    const query = `
      SELECT
        pts.*,
        t.first_name as trainer_first_name,
        t.last_name as trainer_last_name,
        t.phone as trainer_phone,
        t.specialization
      FROM personal_training_sessions pts
      INNER JOIN trainers t ON t.trainer_id = pts.trainer_id
      WHERE pts.member_id = $1
        AND pts.status = 'SCHEDULED'
        AND pts.session_date >= CURRENT_DATE
      ORDER BY pts.session_date, pts.start_time
      LIMIT $2
    `;

    const result = await pool.query(query, [memberId, limit]);
    return result.rows;
  }

  /**
   * Get upcoming sessions for trainer
   * @param {number} trainerId - Trainer ID
   * @param {number} limit - Result limit
   * @returns {Promise<Array>} Upcoming sessions
   */
  async findUpcomingByTrainer(trainerId, limit = 20) {
    const query = `
      SELECT
        pts.*,
        m.first_name as member_first_name,
        m.last_name as member_last_name,
        m.phone as member_phone
      FROM personal_training_sessions pts
      INNER JOIN members m ON m.member_id = pts.member_id
      WHERE pts.trainer_id = $1
        AND pts.status = 'SCHEDULED'
        AND pts.session_date >= CURRENT_DATE
      ORDER BY pts.session_date, pts.start_time
      LIMIT $2
    `;

    const result = await pool.query(query, [trainerId, limit]);
    return result.rows;
  }

  /**
   * Get sessions by date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @param {Object} filters - Additional filters
   * @returns {Promise<Array>} Sessions in date range
   */
  async findByDateRange(startDate, endDate, filters = {}) {
    const { trainer_id, member_id, status } = filters;

    let query = `
      SELECT
        pts.*,
        m.first_name as member_first_name,
        m.last_name as member_last_name,
        t.first_name as trainer_first_name,
        t.last_name as trainer_last_name
      FROM personal_training_sessions pts
      INNER JOIN members m ON m.member_id = pts.member_id
      INNER JOIN trainers t ON t.trainer_id = pts.trainer_id
      WHERE pts.session_date BETWEEN $1 AND $2
    `;

    const values = [startDate, endDate];
    let paramCount = 3;

    if (trainer_id) {
      query += ` AND pts.trainer_id = $${paramCount}`;
      values.push(trainer_id);
      paramCount++;
    }

    if (member_id) {
      query += ` AND pts.member_id = $${paramCount}`;
      values.push(member_id);
      paramCount++;
    }

    if (status) {
      query += ` AND pts.status = $${paramCount}`;
      values.push(status);
      paramCount++;
    }

    query += ' ORDER BY pts.session_date, pts.start_time';

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Check for scheduling conflicts
   * @param {number} trainerId - Trainer ID
   * @param {Date} sessionDate - Session date
   * @param {string} startTime - Start time
   * @param {string} endTime - End time
   * @param {number} excludeSessionId - Session ID to exclude
   * @returns {Promise<boolean>} Has conflicts
   */
  async hasConflict(trainerId, sessionDate, startTime, endTime, excludeSessionId = null) {
    let query = `
      SELECT COUNT(*) as conflicts
      FROM personal_training_sessions
      WHERE trainer_id = $1
        AND session_date = $2
        AND status IN ('SCHEDULED', 'IN_PROGRESS')
        AND (
          (start_time <= $3 AND end_time > $3) OR
          (start_time < $4 AND end_time >= $4) OR
          (start_time >= $3 AND end_time <= $4)
        )
    `;

    const values = [trainerId, sessionDate, startTime, endTime];

    if (excludeSessionId) {
      query += ' AND session_id != $5';
      values.push(excludeSessionId);
    }

    const result = await pool.query(query, values);
    return parseInt(result.rows[0].conflicts) > 0;
  }

  /**
   * Get session statistics
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Object>} Session statistics
   */
  async getStatistics(filters = {}) {
    const { trainer_id, member_id, gym_id, start_date, end_date } = filters;

    let query = `
      SELECT
        COUNT(*) as total_sessions,
        COUNT(CASE WHEN pts.status = 'COMPLETED' THEN 1 END) as completed_sessions,
        COUNT(CASE WHEN pts.status = 'SCHEDULED' THEN 1 END) as scheduled_sessions,
        COUNT(CASE WHEN pts.status = 'CANCELLED' THEN 1 END) as cancelled_sessions,
        COUNT(CASE WHEN pts.status = 'NO_SHOW' THEN 1 END) as no_show_sessions,
        COALESCE(SUM(CASE WHEN pts.status = 'COMPLETED' THEN pts.session_fee END), 0) as total_revenue
      FROM personal_training_sessions pts
      INNER JOIN members m ON m.member_id = pts.member_id
      INNER JOIN trainers t ON t.trainer_id = pts.trainer_id
      WHERE 1=1
    `;

    const values = [];
    let paramCount = 1;

    if (trainer_id) {
      query += ` AND pts.trainer_id = $${paramCount}`;
      values.push(trainer_id);
      paramCount++;
    }

    if (member_id) {
      query += ` AND pts.member_id = $${paramCount}`;
      values.push(member_id);
      paramCount++;
    }

    if (gym_id) {
      query += ` AND t.gym_id = $${paramCount}`;
      values.push(gym_id);
      paramCount++;
    }

    if (start_date) {
      query += ` AND pts.session_date >= $${paramCount}`;
      values.push(start_date);
      paramCount++;
    }

    if (end_date) {
      query += ` AND pts.session_date <= $${paramCount}`;
      values.push(end_date);
      paramCount++;
    }

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Count sessions
   * @param {Object} filters - Filter criteria
   * @returns {Promise<number>} Total count
   */
  async count(filters = {}) {
    const { trainer_id, member_id, status } = filters;

    let query = 'SELECT COUNT(*) FROM personal_training_sessions WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (trainer_id) {
      query += ` AND trainer_id = $${paramCount}`;
      values.push(trainer_id);
      paramCount++;
    }

    if (member_id) {
      query += ` AND member_id = $${paramCount}`;
      values.push(member_id);
      paramCount++;
    }

    if (status) {
      query += ` AND status = $${paramCount}`;
      values.push(status);
      paramCount++;
    }

    const result = await pool.query(query, values);
    return parseInt(result.rows[0].count);
  }
}

export default new SessionRepository();
