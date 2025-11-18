#!/bin/bash
BASE="/home/user/test/varanasi-empire-solutions/16-TRANSPORT-LOGISTICS/backend/src/repositories"

# Vehicle Repository
cat > "$BASE/vehicle.repository.js" << 'EOF'
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
EOF

# Driver Repository
cat > "$BASE/driver.repository.js" << 'EOF'
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
EOF

# Consignment Repository
cat > "$BASE/consignment.repository.js" << 'EOF'
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
EOF

echo "Repositories created"
