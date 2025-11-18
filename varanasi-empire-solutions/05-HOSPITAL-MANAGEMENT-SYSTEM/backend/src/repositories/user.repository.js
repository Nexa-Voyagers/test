import { query } from '../config/database.js';

/**
 * Find user by ID
 */
const findById = async (id) => {
  const result = await query(
    `SELECT id, username, email, role, hospital_id, department_id,
            first_name, last_name, phone, is_active, created_at
     FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

/**
 * Find user by email
 */
const findByEmail = async (email) => {
  const result = await query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
};

/**
 * Find user by username
 */
const findByUsername = async (username) => {
  const result = await query(
    'SELECT * FROM users WHERE username = $1',
    [username]
  );
  return result.rows[0];
};

/**
 * Create user
 */
const create = async (userData) => {
  const result = await query(
    `INSERT INTO users (
      username, email, password_hash, role, hospital_id, department_id,
      first_name, last_name, phone, created_by
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING id, username, email, role, hospital_id, department_id,
              first_name, last_name, phone, is_active, created_at`,
    [
      userData.username,
      userData.email,
      userData.password_hash,
      userData.role,
      userData.hospital_id,
      userData.department_id,
      userData.first_name,
      userData.last_name,
      userData.phone,
      userData.created_by,
    ]
  );
  return result.rows[0];
};

/**
 * Update user
 */
const update = async (id, userData) => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  Object.keys(userData).forEach((key) => {
    if (userData[key] !== undefined) {
      fields.push(`${key} = $${paramCount}`);
      values.push(userData[key]);
      paramCount++;
    }
  });

  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);

  const result = await query(
    `UPDATE users SET ${fields.join(', ')}
     WHERE id = $${paramCount}
     RETURNING id, username, email, role, hospital_id, department_id,
               first_name, last_name, phone, is_active, created_at, updated_at`,
    values
  );

  return result.rows[0];
};

/**
 * Get all users with filters
 */
const findAll = async (filters = {}) => {
  let queryText = `
    SELECT u.id, u.username, u.email, u.role, u.hospital_id, u.department_id,
           u.first_name, u.last_name, u.phone, u.is_active, u.created_at,
           h.hospital_name, d.department_name
    FROM users u
    LEFT JOIN hospitals h ON u.hospital_id = h.id
    LEFT JOIN departments d ON u.department_id = d.id
    WHERE 1=1
  `;
  const values = [];
  let paramCount = 1;

  if (filters.hospital_id) {
    queryText += ` AND u.hospital_id = $${paramCount}`;
    values.push(filters.hospital_id);
    paramCount++;
  }

  if (filters.role) {
    queryText += ` AND u.role = $${paramCount}`;
    values.push(filters.role);
    paramCount++;
  }

  if (filters.is_active !== undefined) {
    queryText += ` AND u.is_active = $${paramCount}`;
    values.push(filters.is_active);
    paramCount++;
  }

  queryText += ' ORDER BY u.created_at DESC';

  if (filters.limit) {
    queryText += ` LIMIT $${paramCount}`;
    values.push(filters.limit);
    paramCount++;
  }

  if (filters.offset) {
    queryText += ` OFFSET $${paramCount}`;
    values.push(filters.offset);
  }

  const result = await query(queryText, values);
  return result.rows;
};

export const userRepository = {
  findById,
  findByEmail,
  findByUsername,
  create,
  update,
  findAll,
};

export default userRepository;
