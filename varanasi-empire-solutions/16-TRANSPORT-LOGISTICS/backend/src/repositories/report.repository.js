import { pool } from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

export const reportRepository = {
  async create(data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, i) => \$${i + 1}).join(',');
    const query = \`INSERT INTO reports (${keys.join(',')}) VALUES (${placeholders}) RETURNING *\`;
    const result = await pool.query(query, values);
    return result.rows[0];
  },
  async findAll(filters = {}) {
    const query = 'SELECT * FROM reports ORDER BY created_at DESC LIMIT $1 OFFSET $2';
    const result = await pool.query(query, [filters.limit || 50, filters.offset || 0]);
    return result.rows;
  },
  async findById(id) {
    const result = await pool.query('SELECT * FROM reports WHERE id = $1', [id]);
    if (result.rows.length === 0) throw new NotFoundError('report not found');
    return result.rows[0];
  },
  async update(id, data) {
    const fields = []; const values = []; let paramCount = 1;
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined) { fields.push(\`${key} = \$${paramCount}\`); values.push(data[key]); paramCount++; }
    });
    if (fields.length === 0) throw new Error('No fields to update');
    fields.push('updated_at = NOW()'); values.push(id);
    const query = \`UPDATE reports SET ${fields.join(', ')} WHERE id = \$${paramCount} RETURNING *\`;
    const result = await pool.query(query, values);
    if (result.rows.length === 0) throw new NotFoundError('report not found');
    return result.rows[0];
  },
  async delete(id) {
    const result = await pool.query('DELETE FROM reports WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) throw new NotFoundError('report not found');
    return result.rows[0];
  }
};
