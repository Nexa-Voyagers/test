import { pool } from '../database.js';
import { NotFoundError } from '../utils/errors.js';

/**
 * Gym Repository
 * Handles database operations for gym locations
 */
class GymRepository {
  /**
   * Create a new gym
   * @param {Object} gymData - Gym data
   * @returns {Promise<Object>} Created gym
   */
  async create(gymData) {
    const { name, address, city, state, pincode, phone, email, capacity, amenities, opening_time, closing_time } = gymData;

    const query = `
      INSERT INTO gyms (name, address, city, state, pincode, phone, email, capacity, amenities, opening_time, closing_time)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const values = [name, address, city, state, pincode, phone, email, capacity, amenities, opening_time, closing_time];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find all gyms with optional filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of gyms
   */
  async findAll(filters = {}) {
    const { city, state, is_active, search, limit = 50, offset = 0 } = filters;

    let query = 'SELECT * FROM gyms WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (city) {
      query += ` AND city ILIKE $${paramCount}`;
      values.push(`%${city}%`);
      paramCount++;
    }

    if (state) {
      query += ` AND state ILIKE $${paramCount}`;
      values.push(`%${state}%`);
      paramCount++;
    }

    if (is_active !== undefined) {
      query += ` AND is_active = $${paramCount}`;
      values.push(is_active);
      paramCount++;
    }

    if (search) {
      query += ` AND (name ILIKE $${paramCount} OR address ILIKE $${paramCount} OR city ILIKE $${paramCount})`;
      values.push(`%${search}%`);
      paramCount++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Find gym by ID
   * @param {number} id - Gym ID
   * @returns {Promise<Object>} Gym data
   */
  async findById(id) {
    const query = 'SELECT * FROM gyms WHERE gym_id = $1';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Gym');
    }

    return result.rows[0];
  }

  /**
   * Update gym
   * @param {number} id - Gym ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated gym
   */
  async update(id, updateData) {
    await this.findById(id); // Check if exists

    const allowedFields = ['name', 'address', 'city', 'state', 'pincode', 'phone', 'email', 'capacity', 'amenities', 'opening_time', 'closing_time', 'is_active'];
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
      UPDATE gyms
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE gym_id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Delete gym (soft delete)
   * @param {number} id - Gym ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    await this.findById(id); // Check if exists

    const query = 'UPDATE gyms SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE gym_id = $1';
    await pool.query(query, [id]);
    return true;
  }

  /**
   * Get gym statistics
   * @param {number} gymId - Gym ID
   * @returns {Promise<Object>} Gym statistics
   */
  async getStatistics(gymId) {
    const query = `
      SELECT
        g.gym_id,
        g.name,
        g.capacity,
        COUNT(DISTINCT m.member_id) as total_members,
        COUNT(DISTINCT CASE WHEN ms.status = 'ACTIVE' THEN m.member_id END) as active_members,
        COUNT(DISTINCT t.trainer_id) as total_trainers,
        g.capacity - COUNT(DISTINCT CASE WHEN ms.status = 'ACTIVE' THEN m.member_id END) as available_capacity
      FROM gyms g
      LEFT JOIN members m ON m.gym_id = g.gym_id
      LEFT JOIN memberships ms ON ms.member_id = m.member_id
      LEFT JOIN trainers t ON t.gym_id = g.gym_id AND t.is_active = true
      WHERE g.gym_id = $1
      GROUP BY g.gym_id, g.name, g.capacity
    `;

    const result = await pool.query(query, [gymId]);
    return result.rows[0] || null;
  }

  /**
   * Get active gyms
   * @returns {Promise<Array>} Active gyms
   */
  async findActive() {
    const query = 'SELECT * FROM gyms WHERE is_active = true ORDER BY name';
    const result = await pool.query(query);
    return result.rows;
  }

  /**
   * Get gym count
   * @param {Object} filters - Filter criteria
   * @returns {Promise<number>} Total count
   */
  async count(filters = {}) {
    const { city, state, is_active } = filters;

    let query = 'SELECT COUNT(*) FROM gyms WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (city) {
      query += ` AND city ILIKE $${paramCount}`;
      values.push(`%${city}%`);
      paramCount++;
    }

    if (state) {
      query += ` AND state ILIKE $${paramCount}`;
      values.push(`%${state}%`);
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

export default new GymRepository();
