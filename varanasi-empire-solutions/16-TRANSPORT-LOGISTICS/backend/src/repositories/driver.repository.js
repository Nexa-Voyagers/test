import { pool } from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

export const driverRepository = {
  async create(data) {
    const query = \`
      INSERT INTO drivers (name, phone, email, license_number, license_expiry, 
        address, city, state, dob, blood_group, emergency_contact, experience_years,
        company_id, status, metadata)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *
    \`;
    const result = await pool.query(query, [data.name, data.phone, data.email,
      data.license_number, data.license_expiry, data.address, data.city, data.state,
      data.dob, data.blood_group, data.emergency_contact, data.experience_years,
      data.company_id, data.status || 'active', data.metadata || {}]);
    return result.rows[0];
  },
  
  async findAll(filters = {}) {
    let query = 'SELECT * FROM drivers WHERE 1=1';
    const values = []; let paramCount = 1;
    if (filters.company_id) { query += \` AND company_id = $\${paramCount}\`; values.push(filters.company_id); paramCount++; }
    if (filters.status) { query += \` AND status = $\${paramCount}\`; values.push(filters.status); paramCount++; }
    query += ' ORDER BY name ASC';
    if (filters.limit) { query += \` LIMIT $\${paramCount}\`; values.push(filters.limit); paramCount++; }
    if (filters.offset) { query += \` OFFSET $\${paramCount}\`; values.push(filters.offset); }
    const result = await pool.query(query, values);
    return result.rows;
  },
  
  async findById(id) {
    const result = await pool.query('SELECT * FROM drivers WHERE id = $1', [id]);
    if (result.rows.length === 0) throw new NotFoundError('Driver not found');
    return result.rows[0];
  },
  
  async update(id, data) {
    const fields = []; const values = []; let paramCount = 1;
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined) { fields.push(\`\${key} = $\${paramCount}\`); values.push(data[key]); paramCount++; }
    });
    if (fields.length === 0) throw new Error('No fields to update');
    fields.push('updated_at = NOW()'); values.push(id);
    const query = \`UPDATE drivers SET \${fields.join(', ')} WHERE id = $\${paramCount} RETURNING *\`;
    const result = await pool.query(query, values);
    if (result.rows.length === 0) throw new NotFoundError('Driver not found');
    return result.rows[0];
  }
};
