import { pool } from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

export const distributorRepository = {
  async create(data) {
    const query = `
      INSERT INTO distributors (
        name, code, type, contact_person, contact_phone, contact_email,
        address, city, state, pincode, gst_number, pan_number, bank_name,
        account_number, ifsc_code, credit_limit, credit_days, commission_rate,
        territory, storage_capacity, has_cold_storage, delivery_vehicles,
        license_number, status, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)
      RETURNING *
    `;

    const values = [
      data.name, data.code, data.type, data.contact_person, data.contact_phone,
      data.contact_email, data.address, data.city, data.state, data.pincode,
      data.gst_number, data.pan_number, data.bank_name, data.account_number,
      data.ifsc_code, data.credit_limit, data.credit_days, data.commission_rate,
      data.territory, data.storage_capacity, data.has_cold_storage || false,
      data.delivery_vehicles, data.license_number, data.status || 'active',
      data.metadata || {}
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findAll(filters = {}) {
    let query = 'SELECT * FROM distributors WHERE 1=1';
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

    if (filters.state) {
      query += ` AND state = $${paramCount}`;
      values.push(filters.state);
      paramCount++;
    }

    if (filters.status) {
      query += ` AND status = $${paramCount}`;
      values.push(filters.status);
      paramCount++;
    }

    if (filters.has_cold_storage !== undefined) {
      query += ` AND has_cold_storage = $${paramCount}`;
      values.push(filters.has_cold_storage);
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
    const query = 'SELECT * FROM distributors WHERE id = $1';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Distributor not found');
    }

    return result.rows[0];
  },

  async findByCode(code) {
    const query = 'SELECT * FROM distributors WHERE code = $1';
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
      UPDATE distributors
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new NotFoundError('Distributor not found');
    }

    return result.rows[0];
  },

  async delete(id) {
    const query = 'DELETE FROM distributors WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Distributor not found');
    }

    return result.rows[0];
  },

  async getStats(distributorId) {
    const query = `
      SELECT
        (SELECT COUNT(*) FROM distribution_orders WHERE distributor_id = $1) as total_orders,
        (SELECT COUNT(*) FROM distribution_orders WHERE distributor_id = $1 AND status = 'delivered') as completed_orders,
        (SELECT COALESCE(SUM(total_amount), 0) FROM distribution_orders WHERE distributor_id = $1) as total_business,
        (SELECT COALESCE(SUM(paid_amount), 0) FROM distribution_orders WHERE distributor_id = $1) as total_paid,
        (SELECT COALESCE(SUM(total_amount - paid_amount), 0) FROM distribution_orders WHERE distributor_id = $1 AND payment_status != 'paid') as outstanding_amount
    `;

    const result = await pool.query(query, [distributorId]);
    return result.rows[0];
  },
};
