import { pool } from '../database.js';
import { NotFoundError } from '../utils/errors.js';

/**
 * Trainer Repository
 * Handles database operations for trainers
 */
class TrainerRepository {
  /**
   * Create a new trainer
   * @param {Object} trainerData - Trainer data
   * @returns {Promise<Object>} Created trainer
   */
  async create(trainerData) {
    const {
      gym_id, first_name, last_name, email, phone, specialization,
      certifications, experience_years, hourly_rate, photo_url, bio
    } = trainerData;

    const query = `
      INSERT INTO trainers (
        gym_id, first_name, last_name, email, phone, specialization,
        certifications, experience_years, hourly_rate, photo_url, bio
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const values = [
      gym_id, first_name, last_name, email, phone, specialization,
      certifications, experience_years, hourly_rate, photo_url, bio
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find all trainers with filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of trainers
   */
  async findAll(filters = {}) {
    const { gym_id, specialization, is_active, search, limit = 50, offset = 0 } = filters;

    let query = `
      SELECT t.*, g.name as gym_name
      FROM trainers t
      LEFT JOIN gyms g ON g.gym_id = t.gym_id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (gym_id) {
      query += ` AND t.gym_id = $${paramCount}`;
      values.push(gym_id);
      paramCount++;
    }

    if (specialization) {
      query += ` AND t.specialization ILIKE $${paramCount}`;
      values.push(`%${specialization}%`);
      paramCount++;
    }

    if (is_active !== undefined) {
      query += ` AND t.is_active = $${paramCount}`;
      values.push(is_active);
      paramCount++;
    }

    if (search) {
      query += ` AND (t.first_name ILIKE $${paramCount} OR t.last_name ILIKE $${paramCount} OR t.email ILIKE $${paramCount})`;
      values.push(`%${search}%`);
      paramCount++;
    }

    query += ` ORDER BY t.first_name, t.last_name LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Find trainer by ID
   * @param {number} id - Trainer ID
   * @returns {Promise<Object>} Trainer data
   */
  async findById(id) {
    const query = `
      SELECT t.*, g.name as gym_name
      FROM trainers t
      LEFT JOIN gyms g ON g.gym_id = t.gym_id
      WHERE t.trainer_id = $1
    `;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Trainer');
    }

    return result.rows[0];
  }

  /**
   * Find trainer by email
   * @param {string} email - Email address
   * @returns {Promise<Object|null>} Trainer data or null
   */
  async findByEmail(email) {
    const query = 'SELECT * FROM trainers WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }

  /**
   * Update trainer
   * @param {number} id - Trainer ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated trainer
   */
  async update(id, updateData) {
    await this.findById(id); // Check if exists

    const allowedFields = [
      'gym_id', 'first_name', 'last_name', 'email', 'phone', 'specialization',
      'certifications', 'experience_years', 'hourly_rate', 'photo_url', 'bio', 'is_active'
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
      UPDATE trainers
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE trainer_id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Delete trainer (soft delete)
   * @param {number} id - Trainer ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    await this.findById(id); // Check if exists

    const query = 'UPDATE trainers SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE trainer_id = $1';
    await pool.query(query, [id]);
    return true;
  }

  /**
   * Get active trainers by gym
   * @param {number} gymId - Gym ID
   * @returns {Promise<Array>} Active trainers
   */
  async findActiveByGym(gymId) {
    const query = `
      SELECT t.*
      FROM trainers t
      WHERE t.gym_id = $1 AND t.is_active = true
      ORDER BY t.first_name, t.last_name
    `;

    const result = await pool.query(query, [gymId]);
    return result.rows;
  }

  /**
   * Get trainer with statistics
   * @param {number} trainerId - Trainer ID
   * @returns {Promise<Object>} Trainer with stats
   */
  async findWithStats(trainerId) {
    const query = `
      SELECT
        t.*,
        g.name as gym_name,
        COUNT(DISTINCT pts.session_id) as total_sessions,
        COUNT(DISTINCT CASE WHEN pts.status = 'COMPLETED' THEN pts.session_id END) as completed_sessions,
        COUNT(DISTINCT CASE WHEN pts.status = 'SCHEDULED' THEN pts.session_id END) as upcoming_sessions,
        COALESCE(SUM(CASE WHEN pts.status = 'COMPLETED' THEN pts.session_fee END), 0) as total_earnings
      FROM trainers t
      LEFT JOIN gyms g ON g.gym_id = t.gym_id
      LEFT JOIN personal_training_sessions pts ON pts.trainer_id = t.trainer_id
      WHERE t.trainer_id = $1
      GROUP BY t.trainer_id, g.name
    `;

    const result = await pool.query(query, [trainerId]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Trainer');
    }

    return result.rows[0];
  }

  /**
   * Check trainer availability
   * @param {number} trainerId - Trainer ID
   * @param {Date} sessionDate - Session date
   * @param {string} startTime - Start time
   * @param {string} endTime - End time
   * @param {number} excludeSessionId - Session ID to exclude (for updates)
   * @returns {Promise<boolean>} Availability status
   */
  async checkAvailability(trainerId, sessionDate, startTime, endTime, excludeSessionId = null) {
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
    return parseInt(result.rows[0].conflicts) === 0;
  }

  /**
   * Get trainer schedule
   * @param {number} trainerId - Trainer ID
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<Array>} Trainer schedule
   */
  async getSchedule(trainerId, startDate, endDate) {
    const query = `
      SELECT
        pts.*,
        m.first_name as member_first_name,
        m.last_name as member_last_name,
        m.phone as member_phone
      FROM personal_training_sessions pts
      INNER JOIN members m ON m.member_id = pts.member_id
      WHERE pts.trainer_id = $1
        AND pts.session_date BETWEEN $2 AND $3
        AND pts.status IN ('SCHEDULED', 'IN_PROGRESS')
      ORDER BY pts.session_date, pts.start_time
    `;

    const result = await pool.query(query, [trainerId, startDate, endDate]);
    return result.rows;
  }

  /**
   * Get trainers by specialization
   * @param {string} specialization - Specialization
   * @param {number} gymId - Optional gym ID
   * @returns {Promise<Array>} Trainers with specialization
   */
  async findBySpecialization(specialization, gymId = null) {
    let query = `
      SELECT t.*, g.name as gym_name
      FROM trainers t
      LEFT JOIN gyms g ON g.gym_id = t.gym_id
      WHERE t.specialization ILIKE $1 AND t.is_active = true
    `;

    const values = [`%${specialization}%`];

    if (gymId) {
      query += ' AND t.gym_id = $2';
      values.push(gymId);
    }

    query += ' ORDER BY t.experience_years DESC, t.first_name';

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Count trainers
   * @param {Object} filters - Filter criteria
   * @returns {Promise<number>} Total count
   */
  async count(filters = {}) {
    const { gym_id, is_active } = filters;

    let query = 'SELECT COUNT(*) FROM trainers WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (gym_id) {
      query += ` AND gym_id = $${paramCount}`;
      values.push(gym_id);
      paramCount++;
    }

    if (is_active !== undefined) {
      query += ` AND is_active = $${paramCount}`;
      values.push(is_active);
      paramCount++;
    }

    const result = await pool.query(query, values);
    return parseInt(result.rows[0].count);
  }
}

export default new TrainerRepository();
