import { pool } from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

export const inventoryRepository = {
  async findAll(filters = {}) {
    let query = `
      SELECT i.*, p.name as product_name, p.sku, pu.name as unit_name
      FROM inventory i
      LEFT JOIN products p ON i.product_id = p.id
      LEFT JOIN production_units pu ON i.unit_id = pu.id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filters.unit_id) {
      query += ` AND i.unit_id = $${paramCount}`;
      values.push(filters.unit_id);
      paramCount++;
    }

    if (filters.product_id) {
      query += ` AND i.product_id = $${paramCount}`;
      values.push(filters.product_id);
      paramCount++;
    }

    if (filters.low_stock) {
      query += ` AND i.current_stock <= i.reorder_point`;
    }

    query += ' ORDER BY p.name ASC';

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
    const query = `
      SELECT i.*, p.name as product_name, p.sku, pu.name as unit_name
      FROM inventory i
      LEFT JOIN products p ON i.product_id = p.id
      LEFT JOIN production_units pu ON i.unit_id = pu.id
      WHERE i.id = $1
    `;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Inventory record not found');
    }

    return result.rows[0];
  },

  async findByProductAndUnit(productId, unitId) {
    const query = `
      SELECT * FROM inventory
      WHERE product_id = $1 AND unit_id = $2
    `;
    const result = await pool.query(query, [productId, unitId]);
    return result.rows[0];
  },

  async upsert(data) {
    const query = `
      INSERT INTO inventory (
        unit_id, product_id, current_stock, reserved_stock, available_stock,
        min_stock_level, reorder_point, last_restocked_at, location, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (unit_id, product_id)
      DO UPDATE SET
        current_stock = EXCLUDED.current_stock,
        reserved_stock = EXCLUDED.reserved_stock,
        available_stock = EXCLUDED.available_stock,
        last_restocked_at = EXCLUDED.last_restocked_at,
        updated_at = NOW()
      RETURNING *
    `;

    const values = [
      data.unit_id, data.product_id, data.current_stock, data.reserved_stock || 0,
      data.available_stock, data.min_stock_level, data.reorder_point,
      data.last_restocked_at, data.location, data.notes
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async updateStock(id, quantity, operation = 'add') {
    const operator = operation === 'add' ? '+' : '-';
    const query = `
      UPDATE inventory
      SET
        current_stock = current_stock ${operator} $1,
        available_stock = current_stock - reserved_stock,
        last_restocked_at = CASE WHEN $2 = 'add' THEN NOW() ELSE last_restocked_at END,
        updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `;

    const result = await pool.query(query, [quantity, operation, id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Inventory record not found');
    }

    return result.rows[0];
  },

  async reserveStock(id, quantity) {
    const query = `
      UPDATE inventory
      SET
        reserved_stock = reserved_stock + $1,
        available_stock = current_stock - (reserved_stock + $1),
        updated_at = NOW()
      WHERE id = $2 AND (current_stock - reserved_stock) >= $1
      RETURNING *
    `;

    const result = await pool.query(query, [quantity, id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Insufficient stock available');
    }

    return result.rows[0];
  },

  async releaseStock(id, quantity) {
    const query = `
      UPDATE inventory
      SET
        reserved_stock = GREATEST(reserved_stock - $1, 0),
        available_stock = current_stock - GREATEST(reserved_stock - $1, 0),
        updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [quantity, id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Inventory record not found');
    }

    return result.rows[0];
  },

  async getLowStockItems(unitId = null) {
    let query = `
      SELECT i.*, p.name as product_name, p.sku
      FROM inventory i
      LEFT JOIN products p ON i.product_id = p.id
      WHERE i.current_stock <= i.reorder_point
    `;
    const values = [];

    if (unitId) {
      query += ' AND i.unit_id = $1';
      values.push(unitId);
    }

    query += ' ORDER BY i.current_stock ASC';

    const result = await pool.query(query, values);
    return result.rows;
  },

  async getInventoryValue(unitId = null) {
    let query = `
      SELECT
        SUM(i.current_stock * p.base_price) as total_value,
        COUNT(DISTINCT i.product_id) as total_products,
        SUM(i.current_stock) as total_units
      FROM inventory i
      LEFT JOIN products p ON i.product_id = p.id
      WHERE 1=1
    `;
    const values = [];

    if (unitId) {
      query += ' AND i.unit_id = $1';
      values.push(unitId);
    }

    const result = await pool.query(query, values);
    return result.rows[0];
  },
};
