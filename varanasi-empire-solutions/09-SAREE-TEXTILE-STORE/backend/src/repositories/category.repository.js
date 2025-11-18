import { pool, query, transaction } from '../config/database.js';

/**
 * Category Repository
 * Handles all database operations for product categories
 */
class CategoryRepository {
  /**
   * Create a new category
   * @param {Object} categoryData - Category information
   * @returns {Promise<Object>} Created category
   */
  async create(categoryData) {
    const {
      category_name,
      parent_category_id,
      description,
      display_order,
      is_active
    } = categoryData;

    const sql = `
      INSERT INTO product_categories (
        category_name, parent_category_id, description,
        display_order, is_active
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [
      category_name,
      parent_category_id || null,
      description || null,
      display_order || 0,
      is_active !== undefined ? is_active : true
    ];

    const result = await query(sql, values);
    return result.rows[0];
  }

  /**
   * Find category by ID
   * @param {number} id - Category ID
   * @returns {Promise<Object|null>} Category or null
   */
  async findById(id) {
    const sql = 'SELECT * FROM product_categories WHERE category_id = $1';
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  }

  /**
   * Find all categories with optional filters
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} List of categories
   */
  async findAll(filters = {}) {
    let sql = 'SELECT * FROM product_categories WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (filters.parent_category_id !== undefined) {
      if (filters.parent_category_id === null) {
        sql += ` AND parent_category_id IS NULL`;
      } else {
        sql += ` AND parent_category_id = $${paramCount}`;
        values.push(filters.parent_category_id);
        paramCount++;
      }
    }

    if (filters.is_active !== undefined) {
      sql += ` AND is_active = $${paramCount}`;
      values.push(filters.is_active);
      paramCount++;
    }

    sql += ' ORDER BY display_order, category_name';

    const result = await query(sql, values);
    return result.rows;
  }

  /**
   * Get category hierarchy (parent categories)
   * @returns {Promise<Array>} Root categories with children
   */
  async getHierarchy() {
    const sql = `
      WITH RECURSIVE category_tree AS (
        -- Root categories
        SELECT
          category_id,
          category_name,
          parent_category_id,
          description,
          display_order,
          is_active,
          0 as level,
          ARRAY[category_id] as path
        FROM product_categories
        WHERE parent_category_id IS NULL AND is_active = true

        UNION ALL

        -- Child categories
        SELECT
          c.category_id,
          c.category_name,
          c.parent_category_id,
          c.description,
          c.display_order,
          c.is_active,
          ct.level + 1,
          ct.path || c.category_id
        FROM product_categories c
        INNER JOIN category_tree ct ON c.parent_category_id = ct.category_id
        WHERE c.is_active = true
      )
      SELECT * FROM category_tree
      ORDER BY path, display_order, category_name
    `;

    const result = await query(sql);
    return this.buildTree(result.rows);
  }

  /**
   * Build hierarchical tree structure from flat list
   * @param {Array} categories - Flat list of categories
   * @returns {Array} Hierarchical tree
   */
  buildTree(categories) {
    const map = {};
    const roots = [];

    // Create map of all categories
    categories.forEach(cat => {
      map[cat.category_id] = { ...cat, children: [] };
    });

    // Build tree
    categories.forEach(cat => {
      if (cat.parent_category_id === null) {
        roots.push(map[cat.category_id]);
      } else if (map[cat.parent_category_id]) {
        map[cat.parent_category_id].children.push(map[cat.category_id]);
      }
    });

    return roots;
  }

  /**
   * Get all subcategories for a parent category
   * @param {number} parentId - Parent category ID
   * @returns {Promise<Array>} Subcategories
   */
  async getSubcategories(parentId) {
    const sql = `
      SELECT * FROM product_categories
      WHERE parent_category_id = $1
      ORDER BY display_order, category_name
    `;
    const result = await query(sql, [parentId]);
    return result.rows;
  }

  /**
   * Get category with product count
   * @param {number} id - Category ID
   * @returns {Promise<Object|null>} Category with product count
   */
  async findByIdWithProductCount(id) {
    const sql = `
      SELECT
        c.*,
        COUNT(p.product_id) as product_count
      FROM product_categories c
      LEFT JOIN products p ON c.category_id = p.category_id
      WHERE c.category_id = $1
      GROUP BY c.category_id
    `;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  }

  /**
   * Update category by ID
   * @param {number} id - Category ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object|null>} Updated category or null
   */
  async update(id, updates) {
    const allowedFields = [
      'category_name', 'parent_category_id', 'description',
      'display_order', 'is_active'
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
      UPDATE product_categories
      SET ${setClause.join(', ')}
      WHERE category_id = $${paramCount}
      RETURNING *
    `;

    const result = await query(sql, values);
    return result.rows[0] || null;
  }

  /**
   * Delete category by ID (soft delete)
   * @param {number} id - Category ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    const sql = `
      UPDATE product_categories
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE category_id = $1
      RETURNING category_id
    `;
    const result = await query(sql, [id]);
    return result.rowCount > 0;
  }

  /**
   * Hard delete category by ID
   * @param {number} id - Category ID
   * @returns {Promise<boolean>} Success status
   */
  async hardDelete(id) {
    const sql = 'DELETE FROM product_categories WHERE category_id = $1';
    const result = await query(sql, [id]);
    return result.rowCount > 0;
  }

  /**
   * Check if category has products
   * @param {number} id - Category ID
   * @returns {Promise<boolean>} True if has products
   */
  async hasProducts(id) {
    const sql = 'SELECT COUNT(*) FROM products WHERE category_id = $1';
    const result = await query(sql, [id]);
    return parseInt(result.rows[0].count) > 0;
  }

  /**
   * Check if category has subcategories
   * @param {number} id - Category ID
   * @returns {Promise<boolean>} True if has subcategories
   */
  async hasSubcategories(id) {
    const sql = 'SELECT COUNT(*) FROM product_categories WHERE parent_category_id = $1';
    const result = await query(sql, [id]);
    return parseInt(result.rows[0].count) > 0;
  }

  /**
   * Search categories by name
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>} Matching categories
   */
  async search(searchTerm) {
    const sql = `
      SELECT c.*,
        COUNT(p.product_id) as product_count
      FROM product_categories c
      LEFT JOIN products p ON c.category_id = p.category_id
      WHERE c.category_name ILIKE $1
         OR c.description ILIKE $1
      GROUP BY c.category_id
      ORDER BY c.category_name
      LIMIT 50
    `;
    const result = await query(sql, [`%${searchTerm}%`]);
    return result.rows;
  }

  /**
   * Count categories
   * @returns {Promise<number>} Total count
   */
  async count() {
    const sql = 'SELECT COUNT(*) FROM product_categories';
    const result = await query(sql);
    return parseInt(result.rows[0].count);
  }
}

export default new CategoryRepository();
