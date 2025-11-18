import { pool } from '../config/database.js';

class '${repo^}'Repository {
  async findAll(pharmacyId, filters = {}) {
    const result = await pool.query('SELECT * FROM '${repo}'s WHERE pharmacy_id = $1 ORDER BY created_at DESC LIMIT 100', [pharmacyId]);
    return result.rows;
  }

  async findById(id) {
    const result = await pool.query('SELECT * FROM '${repo}'s WHERE id = $1', [id]);
    return result.rows[0];
  }

  async create(data) {
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    const result = await pool.query(
      `INSERT INTO '${repo}'s (${columns}) VALUES (${placeholders}) RETURNING *`,
      values
    );
    return result.rows[0];
  }

  async update(id, data) {
    const updates = Object.keys(data).map((key, i) => `${key} = $${i + 2}`).join(', ');
    const values = [id, ...Object.values(data)];
    const result = await pool.query(
      `UPDATE '${repo}'s SET ${updates}, updated_at = NOW() WHERE id = $1 RETURNING *`,
      values
    );
    return result.rows[0];
  }

  async delete(id) {
    await pool.query('DELETE FROM '${repo}'s WHERE id = $1', [id]);
  }
}

export const '${repo}'Repository = new '${repo^}'Repository();
