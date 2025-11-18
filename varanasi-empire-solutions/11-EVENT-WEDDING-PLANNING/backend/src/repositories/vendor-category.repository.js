import { pool } from '../config/database.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';

/**
 * Repository for vendor_categories table
 * Handles all database operations for vendor category management
 */
class VendorCategoryRepository {
  /**
   * Create a new vendor category
   * @param {Object} categoryData - Category data
   * @returns {Promise<Object>} Created category
   */
  async create(categoryData) {
    const { category_name } = categoryData;

    // Check if category already exists
    const existing = await this.findByName(category_name);
    if (existing) {
      throw new ConflictError('Category name already exists');
    }

    const query = `
      INSERT INTO vendor_categories (category_name)
      VALUES ($1)
      RETURNING *
    `;

    const result = await pool.query(query, [category_name]);
    return result.rows[0];
  }

  /**
   * Find all vendor categories
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of categories
   */
  async findAll(filters = {}) {
    let query = `
      SELECT
        vc.*,
        COUNT(v.id) as vendor_count
      FROM vendor_categories vc
      LEFT JOIN vendors v ON vc.id = v.category_id AND v.is_active = true
      GROUP BY vc.id
      ORDER BY vc.category_name ASC
    `;

    const values = [];

    if (filters.limit) {
      query += ` LIMIT $1`;
      values.push(filters.limit);
    }

    if (filters.offset) {
      query += ` OFFSET $${values.length + 1}`;
      values.push(filters.offset);
    }

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Find category by ID
   * @param {string} id - Category ID
   * @returns {Promise<Object>} Category data
   */
  async findById(id) {
    const query = `
      SELECT
        vc.*,
        COUNT(v.id) as vendor_count
      FROM vendor_categories vc
      LEFT JOIN vendors v ON vc.id = v.category_id AND v.is_active = true
      WHERE vc.id = $1
      GROUP BY vc.id
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Vendor Category');
    }

    return result.rows[0];
  }

  /**
   * Find category by name
   * @param {string} name - Category name
   * @returns {Promise<Object|null>} Category data or null
   */
  async findByName(name) {
    const query = 'SELECT * FROM vendor_categories WHERE LOWER(category_name) = LOWER($1)';
    const result = await pool.query(query, [name]);
    return result.rows[0] || null;
  }

  /**
   * Update vendor category
   * @param {string} id - Category ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated category
   */
  async update(id, updateData) {
    const { category_name } = updateData;

    if (!category_name) {
      throw new Error('Category name is required');
    }

    // Check if new name conflicts with existing category
    const existing = await this.findByName(category_name);
    if (existing && existing.id !== id) {
      throw new ConflictError('Category name already exists');
    }

    const query = `
      UPDATE vendor_categories
      SET category_name = $1
      WHERE id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [category_name, id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Vendor Category');
    }

    return result.rows[0];
  }

  /**
   * Delete vendor category
   * @param {string} id - Category ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    // Check if category has vendors
    const vendorCheck = await pool.query(
      'SELECT COUNT(*) FROM vendors WHERE category_id = $1',
      [id]
    );

    if (parseInt(vendorCheck.rows[0].count) > 0) {
      throw new ConflictError('Cannot delete category with existing vendors');
    }

    const query = 'DELETE FROM vendor_categories WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Vendor Category');
    }

    return true;
  }

  /**
   * Get category with vendors
   * @param {string} id - Category ID
   * @returns {Promise<Object>} Category with vendors
   */
  async findByIdWithVendors(id) {
    const query = `
      SELECT
        vc.*,
        json_agg(
          json_build_object(
            'id', v.id,
            'vendor_code', v.vendor_code,
            'vendor_name', v.vendor_name,
            'contact_person', v.contact_person,
            'phone', v.phone,
            'city', v.city,
            'rating', v.rating,
            'base_price', v.base_price
          ) ORDER BY v.vendor_name
        ) FILTER (WHERE v.id IS NOT NULL) as vendors
      FROM vendor_categories vc
      LEFT JOIN vendors v ON vc.id = v.category_id AND v.is_active = true
      WHERE vc.id = $1
      GROUP BY vc.id
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Vendor Category');
    }

    return result.rows[0];
  }

  /**
   * Get popular categories by booking count
   * @param {number} limit - Number of categories to return
   * @returns {Promise<Array>} Popular categories
   */
  async getPopularCategories(limit = 10) {
    const query = `
      SELECT
        vc.id,
        vc.category_name,
        COUNT(DISTINCT v.id) as vendor_count,
        COUNT(DISTINCT ev.id) as booking_count,
        COALESCE(AVG(v.rating), 0) as average_rating
      FROM vendor_categories vc
      LEFT JOIN vendors v ON vc.id = v.category_id
      LEFT JOIN event_vendors ev ON v.id = ev.vendor_id
      GROUP BY vc.id, vc.category_name
      ORDER BY booking_count DESC, vendor_count DESC
      LIMIT $1
    `;

    const result = await pool.query(query, [limit]);
    return result.rows;
  }

  /**
   * Check if category exists
   * @param {string} id - Category ID
   * @returns {Promise<boolean>} Existence status
   */
  async exists(id) {
    const query = 'SELECT 1 FROM vendor_categories WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows.length > 0;
  }

  /**
   * Get category statistics
   * @param {string} categoryId - Category ID
   * @returns {Promise<Object>} Category statistics
   */
  async getStatistics(categoryId) {
    const query = `
      SELECT
        COUNT(DISTINCT v.id) as total_vendors,
        COUNT(DISTINCT CASE WHEN v.is_active = true THEN v.id END) as active_vendors,
        COUNT(DISTINCT ev.id) as total_bookings,
        COALESCE(AVG(v.rating), 0) as average_rating,
        COALESCE(MIN(v.base_price), 0) as min_price,
        COALESCE(MAX(v.base_price), 0) as max_price,
        COALESCE(AVG(v.base_price), 0) as average_price
      FROM vendor_categories vc
      LEFT JOIN vendors v ON vc.id = v.category_id
      LEFT JOIN event_vendors ev ON v.id = ev.vendor_id
      WHERE vc.id = $1
      GROUP BY vc.id
    `;

    const result = await pool.query(query, [categoryId]);
    return result.rows[0] || {
      total_vendors: 0,
      active_vendors: 0,
      total_bookings: 0,
      average_rating: 0,
      min_price: 0,
      max_price: 0,
      average_price: 0,
    };
  }
}

export default new VendorCategoryRepository();
