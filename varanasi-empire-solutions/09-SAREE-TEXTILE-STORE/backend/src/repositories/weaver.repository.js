import { pool, query, transaction } from '../config/database.js';

/**
 * Weaver Repository
 * Handles all database operations for weavers (manufacturers)
 */
class WeaverRepository {
  /**
   * Create a new weaver
   * @param {Object} weaverData - Weaver information
   * @returns {Promise<Object>} Created weaver
   */
  async create(weaverData) {
    const {
      weaver_name,
      contact_person,
      phone,
      email,
      address,
      city,
      state,
      pincode,
      specialization,
      weave_types,
      gst_number,
      bank_name,
      account_number,
      ifsc_code,
      quality_rating,
      is_active
    } = weaverData;

    const sql = `
      INSERT INTO weavers (
        weaver_name, contact_person, phone, email, address,
        city, state, pincode, specialization, weave_types,
        gst_number, bank_name, account_number, ifsc_code,
        quality_rating, is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `;

    const values = [
      weaver_name, contact_person, phone, email, address,
      city, state, pincode, specialization, weave_types,
      gst_number, bank_name, account_number, ifsc_code,
      quality_rating || 5.0,
      is_active !== undefined ? is_active : true
    ];

    const result = await query(sql, values);
    return result.rows[0];
  }

  /**
   * Find weaver by ID
   * @param {number} id - Weaver ID
   * @returns {Promise<Object|null>} Weaver or null
   */
  async findById(id) {
    const sql = 'SELECT * FROM weavers WHERE weaver_id = $1';
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  }

  /**
   * Find all weavers with optional filters
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} List of weavers
   */
  async findAll(filters = {}) {
    let sql = 'SELECT * FROM weavers WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (filters.city) {
      sql += ` AND city ILIKE $${paramCount}`;
      values.push(`%${filters.city}%`);
      paramCount++;
    }

    if (filters.state) {
      sql += ` AND state ILIKE $${paramCount}`;
      values.push(`%${filters.state}%`);
      paramCount++;
    }

    if (filters.specialization) {
      sql += ` AND specialization ILIKE $${paramCount}`;
      values.push(`%${filters.specialization}%`);
      paramCount++;
    }

    if (filters.min_rating) {
      sql += ` AND quality_rating >= $${paramCount}`;
      values.push(filters.min_rating);
      paramCount++;
    }

    if (filters.is_active !== undefined) {
      sql += ` AND is_active = $${paramCount}`;
      values.push(filters.is_active);
      paramCount++;
    }

    sql += ' ORDER BY quality_rating DESC, weaver_name';

    if (filters.limit) {
      sql += ` LIMIT $${paramCount}`;
      values.push(filters.limit);
      paramCount++;
    }

    if (filters.offset) {
      sql += ` OFFSET $${paramCount}`;
      values.push(filters.offset);
    }

    const result = await query(sql, values);
    return result.rows;
  }

  /**
   * Update weaver by ID
   * @param {number} id - Weaver ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object|null>} Updated weaver or null
   */
  async update(id, updates) {
    const allowedFields = [
      'weaver_name', 'contact_person', 'phone', 'email', 'address',
      'city', 'state', 'pincode', 'specialization', 'weave_types',
      'gst_number', 'bank_name', 'account_number', 'ifsc_code',
      'quality_rating', 'total_orders_completed', 'is_active'
    ];

    const setClause = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key) && updates[key] !== undefined) {
        setClause.push(`${key} = $${paramCount}`);
        values.push(updates[key]);
        paramCount++;
      }
    });

    if (setClause.length === 0) {
      return null;
    }

    setClause.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const sql = `
      UPDATE weavers
      SET ${setClause.join(', ')}
      WHERE weaver_id = $${paramCount}
      RETURNING *
    `;

    const result = await query(sql, values);
    return result.rows[0] || null;
  }

  /**
   * Update quality rating for weaver
   * @param {number} id - Weaver ID
   * @param {number} rating - New quality rating (0-10)
   * @returns {Promise<Object|null>} Updated weaver or null
   */
  async updateQualityRating(id, rating) {
    const sql = `
      UPDATE weavers
      SET quality_rating = $1, updated_at = CURRENT_TIMESTAMP
      WHERE weaver_id = $2
      RETURNING *
    `;
    const result = await query(sql, [rating, id]);
    return result.rows[0] || null;
  }

  /**
   * Increment total orders completed
   * @param {number} id - Weaver ID
   * @returns {Promise<Object|null>} Updated weaver or null
   */
  async incrementOrdersCompleted(id) {
    const sql = `
      UPDATE weavers
      SET total_orders_completed = total_orders_completed + 1,
          updated_at = CURRENT_TIMESTAMP
      WHERE weaver_id = $1
      RETURNING *
    `;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  }

  /**
   * Delete weaver by ID (soft delete)
   * @param {number} id - Weaver ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    const sql = `
      UPDATE weavers
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE weaver_id = $1
      RETURNING weaver_id
    `;
    const result = await query(sql, [id]);
    return result.rowCount > 0;
  }

  /**
   * Get weaver order history
   * @param {number} weaverId - Weaver ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Order history
   */
  async getOrderHistory(weaverId, options = {}) {
    const { limit = 50, offset = 0 } = options;

    const sql = `
      SELECT po.*,
        COUNT(DISTINCT poi.item_id) as total_items,
        SUM(poi.quantity) as total_quantity
      FROM purchase_orders po
      LEFT JOIN purchase_order_items poi ON po.order_id = poi.order_id
      WHERE po.weaver_id = $1
      GROUP BY po.order_id
      ORDER BY po.order_date DESC
      LIMIT $2 OFFSET $3
    `;

    const result = await query(sql, [weaverId, limit, offset]);
    return result.rows;
  }

  /**
   * Get weaver performance stats
   * @param {number} weaverId - Weaver ID
   * @returns {Promise<Object>} Performance statistics
   */
  async getPerformanceStats(weaverId) {
    const sql = `
      SELECT
        COUNT(*) as total_orders,
        SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as completed_orders,
        SUM(CASE WHEN status = 'CANCELLED' THEN 1 ELSE 0 END) as cancelled_orders,
        SUM(total_amount) as total_business,
        AVG(CASE WHEN status = 'COMPLETED' THEN
          EXTRACT(DAY FROM (delivery_date - order_date))
        END) as avg_delivery_days
      FROM purchase_orders
      WHERE weaver_id = $1
    `;

    const result = await query(sql, [weaverId]);
    return result.rows[0];
  }

  /**
   * Search weavers by name or specialization
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>} Matching weavers
   */
  async search(searchTerm) {
    const sql = `
      SELECT * FROM weavers
      WHERE weaver_name ILIKE $1
         OR specialization ILIKE $1
         OR city ILIKE $1
      ORDER BY quality_rating DESC, weaver_name
      LIMIT 50
    `;
    const result = await query(sql, [`%${searchTerm}%`]);
    return result.rows;
  }

  /**
   * Get top weavers by rating
   * @param {number} limit - Number of weavers to return
   * @returns {Promise<Array>} Top rated weavers
   */
  async getTopRated(limit = 10) {
    const sql = `
      SELECT * FROM weavers
      WHERE is_active = true
      ORDER BY quality_rating DESC, total_orders_completed DESC
      LIMIT $1
    `;
    const result = await query(sql, [limit]);
    return result.rows;
  }

  /**
   * Count weavers with optional filters
   * @param {Object} filters - Filter options
   * @returns {Promise<number>} Total count
   */
  async count(filters = {}) {
    let sql = 'SELECT COUNT(*) FROM weavers WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (filters.city) {
      sql += ` AND city ILIKE $${paramCount}`;
      values.push(`%${filters.city}%`);
      paramCount++;
    }

    if (filters.specialization) {
      sql += ` AND specialization ILIKE $${paramCount}`;
      values.push(`%${filters.specialization}%`);
      paramCount++;
    }

    if (filters.is_active !== undefined) {
      sql += ` AND is_active = $${paramCount}`;
      values.push(filters.is_active);
    }

    const result = await query(sql, values);
    return parseInt(result.rows[0].count);
  }
}

export default new WeaverRepository();
