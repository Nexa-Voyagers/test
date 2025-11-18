import { pool } from '../database.js';
import { NotFoundError } from '../utils/errors.js';

/**
 * Membership Plan Repository
 * Handles database operations for membership plans
 */
class MembershipPlanRepository {
  /**
   * Create a new membership plan
   * @param {Object} planData - Plan data
   * @returns {Promise<Object>} Created plan
   */
  async create(planData) {
    const { name, description, duration_months, plan_fee, registration_fee, benefits, is_active } = planData;

    const query = `
      INSERT INTO membership_plans (name, description, duration_months, plan_fee, registration_fee, benefits, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [name, description, duration_months, plan_fee, registration_fee, benefits, is_active !== undefined ? is_active : true];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find all membership plans
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of plans
   */
  async findAll(filters = {}) {
    const { is_active, duration_months, min_fee, max_fee, limit = 50, offset = 0 } = filters;

    let query = 'SELECT * FROM membership_plans WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (is_active !== undefined) {
      query += ` AND is_active = $${paramCount}`;
      values.push(is_active);
      paramCount++;
    }

    if (duration_months) {
      query += ` AND duration_months = $${paramCount}`;
      values.push(duration_months);
      paramCount++;
    }

    if (min_fee) {
      query += ` AND plan_fee >= $${paramCount}`;
      values.push(min_fee);
      paramCount++;
    }

    if (max_fee) {
      query += ` AND plan_fee <= $${paramCount}`;
      values.push(max_fee);
      paramCount++;
    }

    query += ` ORDER BY duration_months, plan_fee LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Find plan by ID
   * @param {number} id - Plan ID
   * @returns {Promise<Object>} Plan data
   */
  async findById(id) {
    const query = 'SELECT * FROM membership_plans WHERE plan_id = $1';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Membership Plan');
    }

    return result.rows[0];
  }

  /**
   * Update membership plan
   * @param {number} id - Plan ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated plan
   */
  async update(id, updateData) {
    await this.findById(id); // Check if exists

    const allowedFields = ['name', 'description', 'duration_months', 'plan_fee', 'registration_fee', 'benefits', 'is_active'];
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
      UPDATE membership_plans
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE plan_id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Delete plan (soft delete)
   * @param {number} id - Plan ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    await this.findById(id); // Check if exists

    const query = 'UPDATE membership_plans SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE plan_id = $1';
    await pool.query(query, [id]);
    return true;
  }

  /**
   * Get active plans
   * @returns {Promise<Array>} Active plans
   */
  async findActive() {
    const query = 'SELECT * FROM membership_plans WHERE is_active = true ORDER BY duration_months, plan_fee';
    const result = await pool.query(query);
    return result.rows;
  }

  /**
   * Get plan popularity (count of active memberships)
   * @param {number} planId - Plan ID
   * @returns {Promise<Object>} Popularity stats
   */
  async getPopularity(planId) {
    const query = `
      SELECT
        mp.plan_id,
        mp.name,
        COUNT(DISTINCT m.membership_id) as total_memberships,
        COUNT(DISTINCT CASE WHEN m.status = 'ACTIVE' THEN m.membership_id END) as active_memberships,
        COALESCE(SUM(CASE WHEN m.status = 'ACTIVE' THEN m.final_fee END), 0) as total_revenue
      FROM membership_plans mp
      LEFT JOIN memberships m ON m.plan_id = mp.plan_id
      WHERE mp.plan_id = $1
      GROUP BY mp.plan_id, mp.name
    `;

    const result = await pool.query(query, [planId]);
    return result.rows[0] || null;
  }

  /**
   * Get all plans with membership counts
   * @returns {Promise<Array>} Plans with statistics
   */
  async findAllWithStats() {
    const query = `
      SELECT
        mp.*,
        COUNT(DISTINCT m.membership_id) as total_memberships,
        COUNT(DISTINCT CASE WHEN m.status = 'ACTIVE' THEN m.membership_id END) as active_memberships
      FROM membership_plans mp
      LEFT JOIN memberships m ON m.plan_id = mp.plan_id
      WHERE mp.is_active = true
      GROUP BY mp.plan_id
      ORDER BY mp.duration_months, mp.plan_fee
    `;

    const result = await pool.query(query);
    return result.rows;
  }

  /**
   * Count plans
   * @param {Object} filters - Filter criteria
   * @returns {Promise<number>} Total count
   */
  async count(filters = {}) {
    const { is_active } = filters;

    let query = 'SELECT COUNT(*) FROM membership_plans WHERE 1=1';
    const values = [];

    if (is_active !== undefined) {
      query += ' AND is_active = $1';
      values.push(is_active);
    }

    const result = await pool.query(query, values);
    return parseInt(result.rows[0].count);
  }
}

export default new MembershipPlanRepository();
