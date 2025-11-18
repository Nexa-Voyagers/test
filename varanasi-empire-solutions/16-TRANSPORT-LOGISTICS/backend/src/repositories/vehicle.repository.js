import { pool } from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

export const vehicleRepository = {
  async create(data) {
    const query = \`
      INSERT INTO vehicles (registration_number, company_id, type, make, model, year,
        capacity_kg, capacity_cbm, fuel_type, current_mileage, purchase_date, 
        insurance_expiry, fitness_expiry, permit_expiry, status, gps_device_id, metadata)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING *
    \`;
    const result = await pool.query(query, [data.registration_number, data.company_id,
      data.type, data.make, data.model, data.year, data.capacity_kg, data.capacity_cbm,
      data.fuel_type, data.current_mileage, data.purchase_date, data.insurance_expiry,
      data.fitness_expiry, data.permit_expiry, data.status || 'active', data.gps_device_id,
      data.metadata || {}]);
    return result.rows[0];
  },
  
  async findAll(filters = {}) {
    let query = 'SELECT v.*, c.name as company_name FROM vehicles v LEFT JOIN companies c ON v.company_id = c.id WHERE 1=1';
    const values = [];
    let paramCount = 1;
    if (filters.company_id) { query += \` AND v.company_id = $\${paramCount}\`; values.push(filters.company_id); paramCount++; }
    if (filters.type) { query += \` AND v.type = $\${paramCount}\`; values.push(filters.type); paramCount++; }
    if (filters.status) { query += \` AND v.status = $\${paramCount}\`; values.push(filters.status); paramCount++; }
    query += ' ORDER BY v.registration_number ASC';
    if (filters.limit) { query += \` LIMIT $\${paramCount}\`; values.push(filters.limit); paramCount++; }
    if (filters.offset) { query += \` OFFSET $\${paramCount}\`; values.push(filters.offset); }
    const result = await pool.query(query, values);
    return result.rows;
  },
  
  async findById(id) {
    const query = 'SELECT v.*, c.name as company_name FROM vehicles v LEFT JOIN companies c ON v.company_id = c.id WHERE v.id = $1';
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) throw new NotFoundError('Vehicle not found');
    return result.rows[0];
  },
  
  async update(id, data) {
    const fields = []; const values = []; let paramCount = 1;
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined) { fields.push(\`\${key} = $\${paramCount}\`); values.push(data[key]); paramCount++; }
    });
    if (fields.length === 0) throw new Error('No fields to update');
    fields.push('updated_at = NOW()'); values.push(id);
    const query = \`UPDATE vehicles SET \${fields.join(', ')} WHERE id = $\${paramCount} RETURNING *\`;
    const result = await pool.query(query, values);
    if (result.rows.length === 0) throw new NotFoundError('Vehicle not found');
    return result.rows[0];
  },
  
  async delete(id) {
    const result = await pool.query('DELETE FROM vehicles WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) throw new NotFoundError('Vehicle not found');
    return result.rows[0];
  },

  async updateMileage(id, mileage) {
    return this.update(id, { current_mileage: mileage });
  },

  async getMaintenanceDue() {
    const query = \`
      SELECT * FROM vehicles 
      WHERE status = 'active' 
        AND (current_mileage >= next_maintenance_km 
        OR EXTRACT(EPOCH FROM (NOW() - last_maintenance_date))/86400 >= 90)
    \`;
    const result = await pool.query(query);
    return result.rows;
  }
};
