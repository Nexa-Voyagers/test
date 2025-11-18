import { pool, query, transaction } from '../config/database.js';

/**
 * Product Repository
 * Handles all database operations for products
 */
class ProductRepository {
  /**
   * Create a new product
   * @param {Object} productData - Product information
   * @returns {Promise<Object>} Created product
   */
  async create(productData) {
    const {
      store_id,
      category_id,
      product_name,
      product_code,
      fabric_type,
      weave_type,
      design_pattern,
      colors,
      work_type,
      length,
      width,
      occasion,
      has_gi_tag,
      gi_tag_name,
      wholesale_price,
      retail_price,
      gst_percentage,
      stock_quantity,
      reorder_level,
      product_images,
      description,
      is_active
    } = productData;

    const sql = `
      INSERT INTO products (
        store_id, category_id, product_name, product_code,
        fabric_type, weave_type, design_pattern, colors, work_type,
        length, width, occasion, has_gi_tag, gi_tag_name,
        wholesale_price, retail_price, gst_percentage,
        stock_quantity, reorder_level, product_images, description, is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
      RETURNING *
    `;

    const values = [
      store_id, category_id, product_name, product_code,
      fabric_type, weave_type, design_pattern || null,
      colors || null, work_type || null,
      length || null, width || null, occasion || null,
      has_gi_tag || false, gi_tag_name || null,
      wholesale_price, retail_price,
      gst_percentage || 5.0,
      stock_quantity || 0, reorder_level || 10,
      product_images ? JSON.stringify(product_images) : null,
      description || null,
      is_active !== undefined ? is_active : true
    ];

    const result = await query(sql, values);
    return result.rows[0];
  }

  /**
   * Find product by ID
   * @param {number} id - Product ID
   * @returns {Promise<Object|null>} Product or null
   */
  async findById(id) {
    const sql = `
      SELECT p.*,
        c.category_name,
        s.store_name
      FROM products p
      LEFT JOIN product_categories c ON p.category_id = c.category_id
      LEFT JOIN textile_stores s ON p.store_id = s.store_id
      WHERE p.product_id = $1
    `;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  }

  /**
   * Find product by product code
   * @param {string} productCode - Product code
   * @returns {Promise<Object|null>} Product or null
   */
  async findByProductCode(productCode) {
    const sql = 'SELECT * FROM products WHERE product_code = $1';
    const result = await query(sql, [productCode]);
    return result.rows[0] || null;
  }

  /**
   * Find all products with advanced filters
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} List of products
   */
  async findAll(filters = {}) {
    let sql = `
      SELECT p.*,
        c.category_name,
        s.store_name
      FROM products p
      LEFT JOIN product_categories c ON p.category_id = c.category_id
      LEFT JOIN textile_stores s ON p.store_id = s.store_id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    // Store filter
    if (filters.store_id) {
      sql += ` AND p.store_id = $${paramCount}`;
      values.push(filters.store_id);
      paramCount++;
    }

    // Category filter
    if (filters.category_id) {
      sql += ` AND p.category_id = $${paramCount}`;
      values.push(filters.category_id);
      paramCount++;
    }

    // Fabric type filter
    if (filters.fabric_type) {
      sql += ` AND p.fabric_type ILIKE $${paramCount}`;
      values.push(`%${filters.fabric_type}%`);
      paramCount++;
    }

    // Weave type filter
    if (filters.weave_type) {
      sql += ` AND p.weave_type ILIKE $${paramCount}`;
      values.push(`%${filters.weave_type}%`);
      paramCount++;
    }

    // Color filter
    if (filters.color) {
      sql += ` AND p.colors ILIKE $${paramCount}`;
      values.push(`%${filters.color}%`);
      paramCount++;
    }

    // Work type filter
    if (filters.work_type) {
      sql += ` AND p.work_type ILIKE $${paramCount}`;
      values.push(`%${filters.work_type}%`);
      paramCount++;
    }

    // Occasion filter
    if (filters.occasion) {
      sql += ` AND p.occasion ILIKE $${paramCount}`;
      values.push(`%${filters.occasion}%`);
      paramCount++;
    }

    // Price range filter
    if (filters.min_price !== undefined) {
      sql += ` AND p.retail_price >= $${paramCount}`;
      values.push(filters.min_price);
      paramCount++;
    }

    if (filters.max_price !== undefined) {
      sql += ` AND p.retail_price <= $${paramCount}`;
      values.push(filters.max_price);
      paramCount++;
    }

    // Stock status filter
    if (filters.stock_status === 'in_stock') {
      sql += ` AND p.stock_quantity > 0`;
    } else if (filters.stock_status === 'out_of_stock') {
      sql += ` AND p.stock_quantity = 0`;
    } else if (filters.stock_status === 'low_stock') {
      sql += ` AND p.stock_quantity > 0 AND p.stock_quantity <= p.reorder_level`;
    }

    // GI tag filter
    if (filters.has_gi_tag !== undefined) {
      sql += ` AND p.has_gi_tag = $${paramCount}`;
      values.push(filters.has_gi_tag);
      paramCount++;
    }

    // Active filter
    if (filters.is_active !== undefined) {
      sql += ` AND p.is_active = $${paramCount}`;
      values.push(filters.is_active);
      paramCount++;
    }

    // Search term
    if (filters.search) {
      sql += ` AND (p.product_name ILIKE $${paramCount} OR p.product_code ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
      values.push(`%${filters.search}%`);
      paramCount++;
    }

    // Sorting
    const sortBy = filters.sort_by || 'created_at';
    const sortOrder = filters.sort_order || 'DESC';
    sql += ` ORDER BY p.${sortBy} ${sortOrder}`;

    // Pagination
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
   * Update product by ID
   * @param {number} id - Product ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object|null>} Updated product or null
   */
  async update(id, updates) {
    const allowedFields = [
      'store_id', 'category_id', 'product_name', 'product_code',
      'fabric_type', 'weave_type', 'design_pattern', 'colors', 'work_type',
      'length', 'width', 'occasion', 'has_gi_tag', 'gi_tag_name',
      'wholesale_price', 'retail_price', 'gst_percentage',
      'stock_quantity', 'reorder_level', 'product_images', 'description', 'is_active'
    ];

    const setClause = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key) && updates[key] !== undefined) {
        if (key === 'product_images' && typeof updates[key] === 'object') {
          setClause.push(`${key} = $${paramCount}`);
          values.push(JSON.stringify(updates[key]));
        } else {
          setClause.push(`${key} = $${paramCount}`);
          values.push(updates[key]);
        }
        paramCount++;
      }
    });

    if (setClause.length === 0) {
      return null;
    }

    setClause.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const sql = `
      UPDATE products
      SET ${setClause.join(', ')}
      WHERE product_id = $${paramCount}
      RETURNING *
    `;

    const result = await query(sql, values);
    return result.rows[0] || null;
  }

  /**
   * Update stock quantity
   * @param {number} id - Product ID
   * @param {number} quantity - Quantity to add/subtract
   * @param {string} operation - 'add' or 'subtract'
   * @returns {Promise<Object|null>} Updated product or null
   */
  async updateStock(id, quantity, operation = 'subtract') {
    const operator = operation === 'add' ? '+' : '-';
    const sql = `
      UPDATE products
      SET stock_quantity = stock_quantity ${operator} $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE product_id = $2
      RETURNING *
    `;
    const result = await query(sql, [quantity, id]);
    return result.rows[0] || null;
  }

  /**
   * Delete product by ID (soft delete)
   * @param {number} id - Product ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    const sql = `
      UPDATE products
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE product_id = $1
      RETURNING product_id
    `;
    const result = await query(sql, [id]);
    return result.rowCount > 0;
  }

  /**
   * Get low stock products
   * @param {number} storeId - Store ID (optional)
   * @returns {Promise<Array>} Low stock products
   */
  async getLowStockProducts(storeId = null) {
    let sql = `
      SELECT p.*,
        c.category_name,
        s.store_name
      FROM products p
      LEFT JOIN product_categories c ON p.category_id = c.category_id
      LEFT JOIN textile_stores s ON p.store_id = s.store_id
      WHERE p.stock_quantity > 0
        AND p.stock_quantity <= p.reorder_level
        AND p.is_active = true
    `;
    const values = [];

    if (storeId) {
      sql += ' AND p.store_id = $1';
      values.push(storeId);
    }

    sql += ' ORDER BY p.stock_quantity ASC';

    const result = await query(sql, values);
    return result.rows;
  }

  /**
   * Get out of stock products
   * @param {number} storeId - Store ID (optional)
   * @returns {Promise<Array>} Out of stock products
   */
  async getOutOfStockProducts(storeId = null) {
    let sql = `
      SELECT p.*,
        c.category_name,
        s.store_name
      FROM products p
      LEFT JOIN product_categories c ON p.category_id = c.category_id
      LEFT JOIN textile_stores s ON p.store_id = s.store_id
      WHERE p.stock_quantity = 0
        AND p.is_active = true
    `;
    const values = [];

    if (storeId) {
      sql += ' AND p.store_id = $1';
      values.push(storeId);
    }

    sql += ' ORDER BY p.product_name';

    const result = await query(sql, values);
    return result.rows;
  }

  /**
   * Get products with GI tag
   * @returns {Promise<Array>} GI tagged products
   */
  async getGITaggedProducts() {
    const sql = `
      SELECT p.*,
        c.category_name,
        s.store_name
      FROM products p
      LEFT JOIN product_categories c ON p.category_id = c.category_id
      LEFT JOIN textile_stores s ON p.store_id = s.store_id
      WHERE p.has_gi_tag = true
        AND p.is_active = true
      ORDER BY p.gi_tag_name, p.product_name
    `;
    const result = await query(sql);
    return result.rows;
  }

  /**
   * Count products with optional filters
   * @param {Object} filters - Filter options
   * @returns {Promise<number>} Total count
   */
  async count(filters = {}) {
    let sql = 'SELECT COUNT(*) FROM products WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (filters.store_id) {
      sql += ` AND store_id = $${paramCount}`;
      values.push(filters.store_id);
      paramCount++;
    }

    if (filters.category_id) {
      sql += ` AND category_id = $${paramCount}`;
      values.push(filters.category_id);
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
   * Search products
   * @param {string} searchTerm - Search term
   * @param {number} limit - Limit results
   * @returns {Promise<Array>} Matching products
   */
  async search(searchTerm, limit = 50) {
    const sql = `
      SELECT p.*,
        c.category_name,
        s.store_name
      FROM products p
      LEFT JOIN product_categories c ON p.category_id = c.category_id
      LEFT JOIN textile_stores s ON p.store_id = s.store_id
      WHERE (p.product_name ILIKE $1
         OR p.product_code ILIKE $1
         OR p.description ILIKE $1
         OR p.fabric_type ILIKE $1
         OR p.weave_type ILIKE $1)
        AND p.is_active = true
      ORDER BY p.product_name
      LIMIT $2
    `;
    const result = await query(sql, [`%${searchTerm}%`, limit]);
    return result.rows;
  }
}

export default new ProductRepository();
