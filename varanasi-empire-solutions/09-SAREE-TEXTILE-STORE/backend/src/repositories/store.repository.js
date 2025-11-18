import { pool, query, transaction } from '../config/database.js';

/**
 * Store Repository
 * Handles all database operations for textile stores
 */
class StoreRepository {
  /**
   * Create a new textile store
   * @param {Object} storeData - Store information
   * @returns {Promise<Object>} Created store
   */
  async create(storeData) {
    const {
      store_name,
      owner_name,
      phone,
      email,
      gst_number,
      address,
      city,
      state,
      pincode,
      store_type,
      established_year,
      is_active
    } = storeData;

    const sql = `
      INSERT INTO textile_stores (
        store_name, owner_name, phone, email, gst_number,
        address, city, state, pincode, store_type,
        established_year, is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const values = [
      store_name, owner_name, phone, email, gst_number,
      address, city, state, pincode, store_type,
      established_year, is_active !== undefined ? is_active : true
    ];

    const result = await query(sql, values);
    return result.rows[0];
  }

  /**
   * Find store by ID
   * @param {number} id - Store ID
   * @returns {Promise<Object|null>} Store or null
   */
  async findById(id) {
    const sql = 'SELECT * FROM textile_stores WHERE store_id = $1';
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  }

  /**
   * Find all stores with optional filters
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} List of stores
   */
  async findAll(filters = {}) {
    let sql = 'SELECT * FROM textile_stores WHERE 1=1';
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

    if (filters.store_type) {
      sql += ` AND store_type = $${paramCount}`;
      values.push(filters.store_type);
      paramCount++;
    }

    if (filters.is_active !== undefined) {
      sql += ` AND is_active = $${paramCount}`;
      values.push(filters.is_active);
      paramCount++;
    }

    sql += ' ORDER BY created_at DESC';

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
   * Update store by ID
   * @param {number} id - Store ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object|null>} Updated store or null
   */
  async update(id, updates) {
    const allowedFields = [
      'store_name', 'owner_name', 'phone', 'email', 'gst_number',
      'address', 'city', 'state', 'pincode', 'store_type',
      'established_year', 'is_active'
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
      UPDATE textile_stores
      SET ${setClause.join(', ')}
      WHERE store_id = $${paramCount}
      RETURNING *
    `;

    const result = await query(sql, values);
    return result.rows[0] || null;
  }

  /**
   * Delete store by ID (soft delete by marking inactive)
   * @param {number} id - Store ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    const sql = `
      UPDATE textile_stores
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE store_id = $1
      RETURNING store_id
    `;
    const result = await query(sql, [id]);
    return result.rowCount > 0;
  }

  /**
   * Hard delete store by ID
   * @param {number} id - Store ID
   * @returns {Promise<boolean>} Success status
   */
  async hardDelete(id) {
    const sql = 'DELETE FROM textile_stores WHERE store_id = $1';
    const result = await query(sql, [id]);
    return result.rowCount > 0;
  }

  /**
   * Count stores with optional filters
   * @param {Object} filters - Filter options
   * @returns {Promise<number>} Total count
   */
  async count(filters = {}) {
    let sql = 'SELECT COUNT(*) FROM textile_stores WHERE 1=1';
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

    if (filters.is_active !== undefined) {
      sql += ` AND is_active = $${paramCount}`;
      values.push(filters.is_active);
    }

    const result = await query(sql, values);
    return parseInt(result.rows[0].count);
  }

  /**
   * Search stores by name or owner
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>} Matching stores
   */
  async search(searchTerm) {
    const sql = `
      SELECT * FROM textile_stores
      WHERE store_name ILIKE $1
         OR owner_name ILIKE $1
         OR city ILIKE $1
      ORDER BY store_name
      LIMIT 50
    `;
    const result = await query(sql, [`%${searchTerm}%`]);
    return result.rows;
  }
}

export default new StoreRepository();
