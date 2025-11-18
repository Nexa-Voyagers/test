import { query } from '../config/database.js';

const create = async (customerData) => {
  const result = await query(
    `INSERT INTO customers (
      customer_code, agency_id, first_name, middle_name, last_name,
      phone, email, address, city, state, date_of_birth,
      passport_number, aadhar_number, created_by
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *`,
    [
      customerData.customer_code,
      customerData.agency_id,
      customerData.first_name,
      customerData.middle_name,
      customerData.last_name,
      customerData.phone,
      customerData.email,
      customerData.address,
      customerData.city,
      customerData.state || 'Uttar Pradesh',
      customerData.date_of_birth,
      customerData.passport_number,
      customerData.aadhar_number,
      customerData.created_by,
    ]
  );
  return result.rows[0];
};

const findById = async (id) => {
  const result = await query(
    'SELECT * FROM customers WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

const findByPhone = async (phone, agencyId) => {
  const result = await query(
    'SELECT * FROM customers WHERE phone = $1 AND agency_id = $2 ORDER BY created_at DESC',
    [phone, agencyId]
  );
  return result.rows;
};

const search = async (searchTerm, agencyId, limit = 20) => {
  const result = await query(
    `SELECT * FROM customers
     WHERE agency_id = $1
     AND (
       customer_code ILIKE $2
       OR first_name ILIKE $2
       OR last_name ILIKE $2
       OR phone ILIKE $2
       OR email ILIKE $2
     )
     ORDER BY created_at DESC
     LIMIT $3`,
    [agencyId, `%${searchTerm}%`, limit]
  );
  return result.rows;
};

const update = async (id, customerData) => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  Object.keys(customerData).forEach((key) => {
    if (customerData[key] !== undefined) {
      fields.push(`${key} = $${paramCount}`);
      values.push(customerData[key]);
      paramCount++;
    }
  });

  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);

  const result = await query(
    `UPDATE customers SET ${fields.join(', ')}
     WHERE id = $${paramCount}
     RETURNING *`,
    values
  );

  return result.rows[0];
};

const getCustomerStats = async (agencyId) => {
  const result = await query(
    `SELECT
       COUNT(*) as total_customers,
       COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as new_this_month
     FROM customers
     WHERE agency_id = $1`,
    [agencyId]
  );
  return result.rows[0];
};

export const customerRepository = {
  create,
  findById,
  findByPhone,
  search,
  update,
  getCustomerStats,
};

export default customerRepository;
