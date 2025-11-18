import { query } from '../config/database.js';

const create = async (devoteeData) => {
  const result = await query(
    `INSERT INTO devotees (
      devotee_code, temple_id, first_name, middle_name, last_name,
      phone, email, address, city, state, gotra, created_by
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *`,
    [
      devoteeData.devotee_code,
      devoteeData.temple_id,
      devoteeData.first_name,
      devoteeData.middle_name,
      devoteeData.last_name,
      devoteeData.phone,
      devoteeData.email,
      devoteeData.address,
      devoteeData.city,
      devoteeData.state || 'Uttar Pradesh',
      devoteeData.gotra,
      devoteeData.created_by,
    ]
  );
  return result.rows[0];
};

const findById = async (id) => {
  const result = await query(
    'SELECT * FROM devotees WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

const findByPhone = async (phone, templeId) => {
  const result = await query(
    'SELECT * FROM devotees WHERE phone = $1 AND temple_id = $2 ORDER BY created_at DESC',
    [phone, templeId]
  );
  return result.rows;
};

const search = async (searchTerm, templeId, limit = 20) => {
  const result = await query(
    `SELECT * FROM devotees
     WHERE temple_id = $1
     AND (
       devotee_code ILIKE $2
       OR first_name ILIKE $2
       OR last_name ILIKE $2
       OR phone ILIKE $2
     )
     ORDER BY created_at DESC
     LIMIT $3`,
    [templeId, `%${searchTerm}%`, limit]
  );
  return result.rows;
};

const update = async (id, devoteeData) => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  Object.keys(devoteeData).forEach((key) => {
    if (devoteeData[key] !== undefined) {
      fields.push(`${key} = $${paramCount}`);
      values.push(devoteeData[key]);
      paramCount++;
    }
  });

  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);

  const result = await query(
    `UPDATE devotees SET ${fields.join(', ')}
     WHERE id = $${paramCount}
     RETURNING *`,
    values
  );

  return result.rows[0];
};

export const devoteeRepository = {
  create,
  findById,
  findByPhone,
  search,
  update,
};

export default devoteeRepository;
