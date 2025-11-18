import { pool } from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

export const productRepository = {
  async create(data) {
    const query = `
      INSERT INTO products (
        name, sku, category, subcategory, description, unit_of_measure,
        base_price, mrp, hsn_code, gst_rate, shelf_life_days,
        storage_conditions, allergens, nutritional_info, certifications,
        packaging_type, package_weight, package_dimensions, min_order_qty,
        is_perishable, requires_cold_chain, status, image_url, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
      RETURNING *
    `;

    const values = [
      data.name, data.sku, data.category, data.subcategory, data.description,
      data.unit_of_measure, data.base_price, data.mrp, data.hsn_code,
      data.gst_rate, data.shelf_life_days, data.storage_conditions,
      data.allergens, data.nutritional_info, data.certifications,
      data.packaging_type, data.package_weight, data.package_dimensions,
      data.min_order_qty, data.is_perishable || false,
      data.requires_cold_chain || false, data.status || 'active',
      data.image_url, data.metadata || {}
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findAll(filters = {}) {
    let query = 'SELECT * FROM products WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (filters.category) {
      query += ` AND category = $${paramCount}`;
      values.push(filters.category);
      paramCount++;
    }

    if (filters.status) {
      query += ` AND status = $${paramCount}`;
      values.push(filters.status);
      paramCount++;
    }

    if (filters.is_perishable !== undefined) {
      query += ` AND is_perishable = $${paramCount}`;
      values.push(filters.is_perishable);
      paramCount++;
    }

    if (filters.search) {
      query += ` AND (name ILIKE $${paramCount} OR sku ILIKE $${paramCount})`;
      values.push(`%${filters.search}%`);
      paramCount++;
    }

    query += ' ORDER BY name ASC';

    if (filters.limit) {
      query += ` LIMIT $${paramCount}`;
      values.push(filters.limit);
      paramCount++;
    }

    if (filters.offset) {
      query += ` OFFSET $${paramCount}`;
      values.push(filters.offset);
    }

    const result = await pool.query(query, values);
    return result.rows;
  },

  async findById(id) {
    const query = 'SELECT * FROM products WHERE id = $1';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Product not found');
    }

    return result.rows[0];
  },

  async findBySku(sku) {
    const query = 'SELECT * FROM products WHERE sku = $1';
    const result = await pool.query(query, [sku]);
    return result.rows[0];
  },

  async update(id, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(data[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE products
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new NotFoundError('Product not found');
    }

    return result.rows[0];
  },

  async delete(id) {
    const query = 'DELETE FROM products WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Product not found');
    }

    return result.rows[0];
  },

  async getCategories() {
    const query = 'SELECT DISTINCT category FROM products WHERE status = $1 ORDER BY category';
    const result = await pool.query(query, ['active']);
    return result.rows.map(row => row.category);
  },
};
