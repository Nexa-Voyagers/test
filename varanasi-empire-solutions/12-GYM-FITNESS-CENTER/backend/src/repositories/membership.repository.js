import { pool, transaction } from '../database.js';
import { NotFoundError } from '../utils/errors.js';

/**
 * Membership Repository
 * Handles database operations for memberships
 */
class MembershipRepository {
  /**
   * Create a new membership with transaction
   * @param {Object} client - Database client (for transaction)
   * @param {Object} membershipData - Membership data
   * @returns {Promise<Object>} Created membership
   */
  async createWithTransaction(client, membershipData) {
    const {
      member_id, plan_id, start_date, end_date, final_fee,
      discount, registration_fee, amount_paid, payment_status, payment_method, notes
    } = membershipData;

    const query = `
      INSERT INTO memberships (
        member_id, plan_id, start_date, end_date, final_fee,
        discount, registration_fee, amount_paid, payment_status, payment_method, notes, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'ACTIVE')
      RETURNING *
    `;

    const values = [
      member_id, plan_id, start_date, end_date, final_fee,
      discount || 0, registration_fee || 0, amount_paid || 0, payment_status || 'PENDING', payment_method, notes
    ];

    const result = await client.query(query, values);
    return result.rows[0];
  }

  /**
   * Create a new membership
   * @param {Object} membershipData - Membership data
   * @returns {Promise<Object>} Created membership
   */
  async create(membershipData) {
    return transaction(async (client) => {
      return await this.createWithTransaction(client, membershipData);
    });
  }

  /**
   * Find all memberships with filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of memberships
   */
  async findAll(filters = {}) {
    const { member_id, plan_id, status, payment_status, gym_id, limit = 50, offset = 0 } = filters;

    let query = `
      SELECT
        ms.*,
        m.first_name, m.last_name, m.email, m.phone,
        mp.name as plan_name, mp.duration_months,
        g.name as gym_name
      FROM memberships ms
      INNER JOIN members m ON m.member_id = ms.member_id
      INNER JOIN membership_plans mp ON mp.plan_id = ms.plan_id
      LEFT JOIN gyms g ON g.gym_id = m.gym_id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (member_id) {
      query += ` AND ms.member_id = $${paramCount}`;
      values.push(member_id);
      paramCount++;
    }

    if (plan_id) {
      query += ` AND ms.plan_id = $${paramCount}`;
      values.push(plan_id);
      paramCount++;
    }

    if (status) {
      query += ` AND ms.status = $${paramCount}`;
      values.push(status);
      paramCount++;
    }

    if (payment_status) {
      query += ` AND ms.payment_status = $${paramCount}`;
      values.push(payment_status);
      paramCount++;
    }

    if (gym_id) {
      query += ` AND m.gym_id = $${paramCount}`;
      values.push(gym_id);
      paramCount++;
    }

    query += ` ORDER BY ms.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Find membership by ID
   * @param {number} id - Membership ID
   * @returns {Promise<Object>} Membership data
   */
  async findById(id) {
    const query = `
      SELECT
        ms.*,
        m.first_name, m.last_name, m.email, m.phone, m.gym_id,
        mp.name as plan_name, mp.duration_months, mp.plan_fee,
        g.name as gym_name
      FROM memberships ms
      INNER JOIN members m ON m.member_id = ms.member_id
      INNER JOIN membership_plans mp ON mp.plan_id = ms.plan_id
      LEFT JOIN gyms g ON g.gym_id = m.gym_id
      WHERE ms.membership_id = $1
    `;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Membership');
    }

    return result.rows[0];
  }

  /**
   * Find active membership by member ID
   * @param {number} memberId - Member ID
   * @returns {Promise<Object|null>} Active membership or null
   */
  async findActiveByMember(memberId) {
    const query = `
      SELECT
        ms.*,
        mp.name as plan_name, mp.duration_months,
        g.name as gym_name
      FROM memberships ms
      INNER JOIN members m ON m.member_id = ms.member_id
      INNER JOIN membership_plans mp ON mp.plan_id = ms.plan_id
      LEFT JOIN gyms g ON g.gym_id = m.gym_id
      WHERE ms.member_id = $1 AND ms.status = 'ACTIVE'
      ORDER BY ms.end_date DESC
      LIMIT 1
    `;
    const result = await pool.query(query, [memberId]);
    return result.rows[0] || null;
  }

  /**
   * Update membership
   * @param {number} id - Membership ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated membership
   */
  async update(id, updateData) {
    await this.findById(id); // Check if exists

    const allowedFields = [
      'status', 'end_date', 'amount_paid', 'payment_status',
      'payment_method', 'notes', 'discount'
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
      UPDATE memberships
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE membership_id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Update membership payment
   * @param {number} id - Membership ID
   * @param {number} amount - Payment amount
   * @param {string} paymentMethod - Payment method
   * @returns {Promise<Object>} Updated membership
   */
  async updatePayment(id, amount, paymentMethod) {
    const membership = await this.findById(id);

    const newAmountPaid = parseFloat(membership.amount_paid) + parseFloat(amount);
    const finalFee = parseFloat(membership.final_fee);

    let paymentStatus;
    if (newAmountPaid >= finalFee) {
      paymentStatus = 'PAID';
    } else if (newAmountPaid > 0) {
      paymentStatus = 'PARTIAL';
    } else {
      paymentStatus = 'PENDING';
    }

    const query = `
      UPDATE memberships
      SET amount_paid = $1, payment_status = $2, payment_method = $3, updated_at = CURRENT_TIMESTAMP
      WHERE membership_id = $4
      RETURNING *
    `;

    const result = await pool.query(query, [newAmountPaid, paymentStatus, paymentMethod, id]);
    return result.rows[0];
  }

  /**
   * Cancel membership
   * @param {number} id - Membership ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise<Object>} Cancelled membership
   */
  async cancel(id, reason) {
    const query = `
      UPDATE memberships
      SET status = 'CANCELLED', notes = CONCAT(COALESCE(notes, ''), ' | Cancellation reason: ', $2), updated_at = CURRENT_TIMESTAMP
      WHERE membership_id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [id, reason]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Membership');
    }

    return result.rows[0];
  }

  /**
   * Get expiring memberships
   * @param {number} days - Days until expiry
   * @param {number} gymId - Optional gym ID filter
   * @returns {Promise<Array>} Expiring memberships
   */
  async findExpiring(days = 7, gymId = null) {
    let query = `
      SELECT
        ms.*,
        m.first_name, m.last_name, m.email, m.phone,
        mp.name as plan_name,
        g.name as gym_name,
        (ms.end_date - CURRENT_DATE) as days_until_expiry
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
   * Get expired memberships (to be updated)
   * @returns {Promise<Array>} Expired memberships
   */
  async findExpired() {
    const query = `
      SELECT ms.*
      FROM memberships ms
      WHERE ms.status = 'ACTIVE'
        AND ms.end_date < CURRENT_DATE
    `;

    const result = await pool.query(query);
    return result.rows;
  }

  /**
   * Update expired memberships
   * @returns {Promise<number>} Number of updated memberships
   */
  async updateExpiredMemberships() {
    const query = `
      UPDATE memberships
      SET status = 'EXPIRED', updated_at = CURRENT_TIMESTAMP
      WHERE status = 'ACTIVE' AND end_date < CURRENT_DATE
      RETURNING membership_id
    `;

    const result = await pool.query(query);
    return result.rows.length;
  }

  /**
   * Get membership history for a member
   * @param {number} memberId - Member ID
   * @returns {Promise<Array>} Membership history
   */
  async findHistoryByMember(memberId) {
    const query = `
      SELECT
        ms.*,
        mp.name as plan_name, mp.duration_months
      FROM memberships ms
      INNER JOIN membership_plans mp ON mp.plan_id = ms.plan_id
      WHERE ms.member_id = $1
      ORDER BY ms.start_date DESC
    `;

    const result = await pool.query(query, [memberId]);
    return result.rows;
  }

  /**
   * Get revenue statistics
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Object>} Revenue statistics
   */
  async getRevenueStats(filters = {}) {
    const { gym_id, start_date, end_date } = filters;

    let query = `
      SELECT
        COUNT(*) as total_memberships,
        COUNT(CASE WHEN status = 'ACTIVE' THEN 1 END) as active_memberships,
        COALESCE(SUM(final_fee), 0) as total_revenue,
        COALESCE(SUM(amount_paid), 0) as collected_revenue,
        COALESCE(SUM(final_fee - amount_paid), 0) as pending_revenue,
        COALESCE(AVG(final_fee), 0) as average_membership_fee
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

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Count memberships
   * @param {Object} filters - Filter criteria
   * @returns {Promise<number>} Total count
   */
  async count(filters = {}) {
    const { status, gym_id } = filters;

    let query = `
      SELECT COUNT(*)
      FROM memberships ms
      INNER JOIN members m ON m.member_id = ms.member_id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (status) {
      query += ` AND ms.status = $${paramCount}`;
      values.push(status);
      paramCount++;
    }

    if (gym_id) {
      query += ` AND m.gym_id = $${paramCount}`;
      values.push(gym_id);
      paramCount++;
    }

    const result = await pool.query(query, values);
    return parseInt(result.rows[0].count);
  }
}

export default new MembershipRepository();
