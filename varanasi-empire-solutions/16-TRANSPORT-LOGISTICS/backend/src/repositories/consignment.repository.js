import { pool } from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

export const consignmentRepository = {
  async create(data) {
    const query = \`
      INSERT INTO consignments (consignment_number, customer_id, origin, destination,
        pickup_address, delivery_address, pickup_date, delivery_date, weight_kg,
        volume_cbm, package_count, goods_type, goods_value, freight_charge, status, metadata)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *
    \`;
    const result = await pool.query(query, [data.consignment_number, data.customer_id,
      data.origin, data.destination, data.pickup_address, data.delivery_address,
      data.pickup_date, data.delivery_date, data.weight_kg, data.volume_cbm,
      data.package_count, data.goods_type, data.goods_value, data.freight_charge,
      data.status || 'pending', data.metadata || {}]);
    return result.rows[0];
  },
  
  async findAll(filters = {}) {
    let query = \`SELECT c.*, cu.name as customer_name FROM consignments c 
      LEFT JOIN customers cu ON c.customer_id = cu.id WHERE 1=1\`;
    const values = []; let paramCount = 1;
    if (filters.customer_id) { query += \` AND c.customer_id = $\${paramCount}\`; values.push(filters.customer_id); paramCount++; }
    if (filters.status) { query += \` AND c.status = $\${paramCount}\`; values.push(filters.status); paramCount++; }
    query += ' ORDER BY c.created_at DESC';
    if (filters.limit) { query += \` LIMIT $\${paramCount}\`; values.push(filters.limit); paramCount++; }
    if (filters.offset) { query += \` OFFSET $\${paramCount}\`; values.push(filters.offset); }
    const result = await pool.query(query, values);
    return result.rows;
  },
  
  async findById(id) {
    const query = \`SELECT c.*, cu.name as customer_name, cu.phone as customer_phone 
      FROM consignments c LEFT JOIN customers cu ON c.customer_id = cu.id WHERE c.id = $1\`;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) throw new NotFoundError('Consignment not found');
    return result.rows[0];
  },
  
  async update(id, data) {
    const fields = []; const values = []; let paramCount = 1;
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined) { fields.push(\`\${key} = $\${paramCount}\`); values.push(data[key]); paramCount++; }
    });
    if (fields.length === 0) throw new Error('No fields to update');
    fields.push('updated_at = NOW()'); values.push(id);
    const query = \`UPDATE consignments SET \${fields.join(', ')} WHERE id = $\${paramCount} RETURNING *\`;
    const result = await pool.query(query, values);
    if (result.rows.length === 0) throw new NotFoundError('Consignment not found');
    return result.rows[0];
  },

  async updateStatus(id, status, notes = null) {
    const query = 'UPDATE consignments SET status = $1, notes = COALESCE($2, notes), updated_at = NOW() WHERE id = $3 RETURNING *';
    const result = await pool.query(query, [status, notes, id]);
    if (result.rows.length === 0) throw new NotFoundError('Consignment not found');
    return result.rows[0];
  }
};
