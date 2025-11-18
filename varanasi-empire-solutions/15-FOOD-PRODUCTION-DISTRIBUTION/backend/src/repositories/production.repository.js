import { pool } from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

export const productionRepository = {
  async createBatch(data) {
    const query = `
      INSERT INTO production_batches (
        batch_number, unit_id, product_id, recipe_id, quantity_planned,
        quantity_produced, production_date, expiry_date, status, supervisor_id,
        shift, production_line, raw_material_cost, labor_cost, overhead_cost,
        total_cost, notes, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING *
    `;

    const values = [
      data.batch_number, data.unit_id, data.product_id, data.recipe_id,
      data.quantity_planned, data.quantity_produced || 0, data.production_date,
      data.expiry_date, data.status || 'planned', data.supervisor_id,
      data.shift, data.production_line, data.raw_material_cost || 0,
      data.labor_cost || 0, data.overhead_cost || 0, data.total_cost || 0,
      data.notes, data.metadata || {}
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findAll(filters = {}) {
    let query = `
      SELECT pb.*, pu.name as unit_name, p.name as product_name, p.sku
      FROM production_batches pb
      LEFT JOIN production_units pu ON pb.unit_id = pu.id
      LEFT JOIN products p ON pb.product_id = p.id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filters.unit_id) {
      query += ` AND pb.unit_id = $${paramCount}`;
      values.push(filters.unit_id);
      paramCount++;
    }

    if (filters.product_id) {
      query += ` AND pb.product_id = $${paramCount}`;
      values.push(filters.product_id);
      paramCount++;
    }

    if (filters.status) {
      query += ` AND pb.status = $${paramCount}`;
      values.push(filters.status);
      paramCount++;
    }

    if (filters.from_date) {
      query += ` AND pb.production_date >= $${paramCount}`;
      values.push(filters.from_date);
      paramCount++;
    }

    if (filters.to_date) {
      query += ` AND pb.production_date <= $${paramCount}`;
      values.push(filters.to_date);
      paramCount++;
    }

    query += ' ORDER BY pb.production_date DESC, pb.created_at DESC';

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
      SELECT pb.*, pu.name as unit_name, p.name as product_name, p.sku
      FROM production_batches pb
      LEFT JOIN production_units pu ON pb.unit_id = pu.id
      LEFT JOIN products p ON pb.product_id = p.id
      WHERE pb.id = $1
    `;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Production batch not found');
    }

    return result.rows[0];
  },

  async findByBatchNumber(batchNumber) {
    const query = 'SELECT * FROM production_batches WHERE batch_number = $1';
    const result = await pool.query(query, [batchNumber]);
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
      UPDATE production_batches
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new NotFoundError('Production batch not found');
    }

    return result.rows[0];
  },

  async updateStatus(id, status, notes = null) {
    const query = `
      UPDATE production_batches
      SET status = $1, notes = COALESCE($2, notes), updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `;

    const result = await pool.query(query, [status, notes, id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Production batch not found');
    }

    return result.rows[0];
  },

  async getProductionStats(filters = {}) {
    let query = `
      SELECT
        COUNT(*) as total_batches,
        SUM(quantity_produced) as total_quantity,
        SUM(total_cost) as total_cost,
        AVG(total_cost / NULLIF(quantity_produced, 0)) as avg_cost_per_unit
      FROM production_batches
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filters.unit_id) {
      query += ` AND unit_id = $${paramCount}`;
      values.push(filters.unit_id);
      paramCount++;
    }

    if (filters.from_date) {
      query += ` AND production_date >= $${paramCount}`;
      values.push(filters.from_date);
      paramCount++;
    }

    if (filters.to_date) {
      query += ` AND production_date <= $${paramCount}`;
      values.push(filters.to_date);
    }

    const result = await pool.query(query, values);
    return result.rows[0];
  },
};
