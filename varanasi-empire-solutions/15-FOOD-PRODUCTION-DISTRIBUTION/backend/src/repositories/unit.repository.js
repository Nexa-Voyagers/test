import { pool } from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

export const unitRepository = {
  async create(data) {
    const query = `
      INSERT INTO production_units (
        name, code, type, location, address, city, state, pincode,
        contact_person, contact_phone, contact_email, capacity_per_day,
        operating_hours, license_number, fssai_number, status, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `;

    const values = [
      data.name, data.code, data.type, data.location, data.address,
      data.city, data.state, data.pincode, data.contact_person,
      data.contact_phone, data.contact_email, data.capacity_per_day,
      data.operating_hours, data.license_number, data.fssai_number,
      data.status || 'active', data.metadata || {}
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findAll(filters = {}) {
    let query = 'SELECT * FROM production_units WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (filters.type) {
      query += ` AND type = $${paramCount}`;
      values.push(filters.type);
      paramCount++;
    }

    if (filters.city) {
      query += ` AND city = $${paramCount}`;
      values.push(filters.city);
      paramCount++;
    }

    if (filters.status) {
      query += ` AND status = $${paramCount}`;
      values.push(filters.status);
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
    const query = 'SELECT * FROM production_units WHERE id = $1';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Production unit not found');
    }

    return result.rows[0];
  },

  async findByCode(code) {
    const query = 'SELECT * FROM production_units WHERE code = $1';
    const result = await pool.query(query, [code]);
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
      UPDATE production_units
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new NotFoundError('Production unit not found');
    }

    return result.rows[0];
  },

  async delete(id) {
    const query = 'DELETE FROM production_units WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Production unit not found');
    }

    return result.rows[0];
  },

  async getStats(unitId) {
    const query = `
      SELECT
        (SELECT COUNT(*) FROM production_batches WHERE unit_id = $1) as total_batches,
        (SELECT COUNT(*) FROM production_batches WHERE unit_id = $1 AND status = 'in_progress') as active_batches,
        (SELECT COALESCE(SUM(quantity_produced), 0) FROM production_batches WHERE unit_id = $1 AND DATE(created_at) = CURRENT_DATE) as today_production,
        (SELECT COALESCE(SUM(quantity_produced), 0) FROM production_batches WHERE unit_id = $1 AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)) as month_production
    `;

    const result = await pool.query(query, [unitId]);
    return result.rows[0];
  },
};
