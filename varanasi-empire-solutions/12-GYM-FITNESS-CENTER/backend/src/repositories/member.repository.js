import { pool } from '../database.js';
import { NotFoundError } from '../utils/errors.js';

/**
 * Member Repository
 * Handles database operations for gym members
 */
class MemberRepository {
  /**
   * Create a new member
   * @param {Object} memberData - Member data
   * @returns {Promise<Object>} Created member
   */
  async create(memberData) {
    const {
      gym_id, first_name, last_name, email, phone, date_of_birth, gender,
      address, city, state, pincode, emergency_contact_name, emergency_contact_phone,
      health_conditions, fitness_goals, photo_url
    } = memberData;

    const query = `
      INSERT INTO members (
        gym_id, first_name, last_name, email, phone, date_of_birth, gender,
        address, city, state, pincode, emergency_contact_name, emergency_contact_phone,
        health_conditions, fitness_goals, photo_url
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `;

    const values = [
      gym_id, first_name, last_name, email, phone, date_of_birth, gender,
      address, city, state, pincode, emergency_contact_name, emergency_contact_phone,
      health_conditions, fitness_goals, photo_url
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find all members with filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of members
   */
  async findAll(filters = {}) {
    const { gym_id, search, gender, city, is_active, limit = 50, offset = 0 } = filters;

    let query = `
      SELECT m.*, g.name as gym_name
      FROM members m
      LEFT JOIN gyms g ON g.gym_id = m.gym_id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (gym_id) {
      query += ` AND m.gym_id = $${paramCount}`;
      values.push(gym_id);
      paramCount++;
    }

    if (search) {
      query += ` AND (m.first_name ILIKE $${paramCount} OR m.last_name ILIKE $${paramCount} OR m.email ILIKE $${paramCount} OR m.phone ILIKE $${paramCount})`;
      values.push(`%${search}%`);
      paramCount++;
    }

    if (gender) {
      query += ` AND m.gender = $${paramCount}`;
      values.push(gender);
      paramCount++;
    }

    if (city) {
      query += ` AND m.city ILIKE $${paramCount}`;
      values.push(`%${city}%`);
      paramCount++;
    }

    if (is_active !== undefined) {
      query += ` AND m.is_active = $${paramCount}`;
      values.push(is_active);
      paramCount++;
    }

    query += ` ORDER BY m.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Find member by ID
   * @param {number} id - Member ID
   * @returns {Promise<Object>} Member data
   */
  async findById(id) {
    const query = `
      SELECT m.*, g.name as gym_name
      FROM members m
      LEFT JOIN gyms g ON g.gym_id = m.gym_id
      WHERE m.member_id = $1
    `;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Member');
    }

    return result.rows[0];
  }

  /**
   * Find member by email
   * @param {string} email - Email address
   * @returns {Promise<Object|null>} Member data or null
   */
  async findByEmail(email) {
    const query = 'SELECT * FROM members WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }

  /**
   * Find member by phone
   * @param {string} phone - Phone number
   * @returns {Promise<Object|null>} Member data or null
   */
  async findByPhone(phone) {
    const query = 'SELECT * FROM members WHERE phone = $1';
    const result = await pool.query(query, [phone]);
    return result.rows[0] || null;
  }

  /**
   * Update member
   * @param {number} id - Member ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated member
   */
  async update(id, updateData) {
    await this.findById(id); // Check if exists

    const allowedFields = [
      'gym_id', 'first_name', 'last_name', 'email', 'phone', 'date_of_birth', 'gender',
      'address', 'city', 'state', 'pincode', 'emergency_contact_name', 'emergency_contact_phone',
      'health_conditions', 'fitness_goals', 'photo_url', 'is_active'
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
      UPDATE members
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE member_id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Delete member (soft delete)
   * @param {number} id - Member ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    await this.findById(id); // Check if exists

    const query = 'UPDATE members SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE member_id = $1';
    await pool.query(query, [id]);
    return true;
  }

  /**
   * Get member with current membership
   * @param {number} id - Member ID
   * @returns {Promise<Object>} Member with membership data
   */
  async findWithMembership(id) {
    const query = `
      SELECT
        m.*,
        g.name as gym_name,
        ms.membership_id,
        ms.status as membership_status,
        ms.start_date,
        ms.end_date,
        ms.final_fee,
        ms.amount_paid,
        ms.payment_status,
        mp.name as plan_name,
        mp.duration_months
      FROM members m
      LEFT JOIN gyms g ON g.gym_id = m.gym_id
      LEFT JOIN memberships ms ON ms.member_id = m.member_id AND ms.status = 'ACTIVE'
      LEFT JOIN membership_plans mp ON mp.plan_id = ms.plan_id
      WHERE m.member_id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Member');
    }

    return result.rows[0];
  }

  /**
   * Get members with expiring memberships
   * @param {number} days - Days until expiry
   * @returns {Promise<Array>} Members with expiring memberships
   */
  async findWithExpiringMemberships(days = 7) {
    const query = `
      SELECT
        m.*,
        ms.membership_id,
        ms.end_date,
        ms.final_fee,
        mp.name as plan_name,
        (ms.end_date - CURRENT_DATE) as days_until_expiry
      FROM members m
      INNER JOIN memberships ms ON ms.member_id = m.member_id
      INNER JOIN membership_plans mp ON mp.plan_id = ms.plan_id
      WHERE ms.status = 'ACTIVE'
        AND ms.end_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '${days} days'
        AND m.is_active = true
      ORDER BY ms.end_date
    `;

    const result = await pool.query(query);
    return result.rows;
  }

  /**
   * Get active members by gym
   * @param {number} gymId - Gym ID
   * @returns {Promise<Array>} Active members
   */
  async findActiveByGym(gymId) {
    const query = `
      SELECT m.*, ms.status as membership_status, ms.end_date
      FROM members m
      LEFT JOIN memberships ms ON ms.member_id = m.member_id AND ms.status = 'ACTIVE'
      WHERE m.gym_id = $1 AND m.is_active = true
      ORDER BY m.first_name, m.last_name
    `;

    const result = await pool.query(query, [gymId]);
    return result.rows;
  }

  /**
   * Count members
   * @param {Object} filters - Filter criteria
   * @returns {Promise<number>} Total count
   */
  async count(filters = {}) {
    const { gym_id, is_active } = filters;

    let query = 'SELECT COUNT(*) FROM members WHERE 1=1';
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

  /**
   * Search members by name or phone
   * @param {string} searchTerm - Search term
   * @param {number} limit - Result limit
   * @returns {Promise<Array>} Matching members
   */
  async search(searchTerm, limit = 20) {
    const query = `
      SELECT m.*, g.name as gym_name
      FROM members m
      LEFT JOIN gyms g ON g.gym_id = m.gym_id
      WHERE (
        m.first_name ILIKE $1 OR
        m.last_name ILIKE $1 OR
        m.email ILIKE $1 OR
        m.phone ILIKE $1 OR
        CONCAT(m.first_name, ' ', m.last_name) ILIKE $1
      )
      AND m.is_active = true
      ORDER BY m.first_name, m.last_name
      LIMIT $2
    `;

    const result = await pool.query(query, [`%${searchTerm}%`, limit]);
    return result.rows;
  }
}

export default new MemberRepository();
