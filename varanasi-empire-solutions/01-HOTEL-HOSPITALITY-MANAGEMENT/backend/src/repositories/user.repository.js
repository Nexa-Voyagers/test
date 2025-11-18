import { query } from '../config/database.js';

/**
 * Create new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user
 */
const create = async (userData) => {
  const sql = `
    INSERT INTO users (
      property_id, first_name, last_name, email, phone,
      password_hash, role, department, is_active
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)
    RETURNING id, property_id, first_name, last_name, email, phone,
              role, department, is_active, created_at
  `;

  const values = [
    userData.property_id,
    userData.first_name,
    userData.last_name || null,
    userData.email,
    userData.phone || null,
    userData.password_hash,
    userData.role || 'STAFF',
    userData.department || null,
  ];

  const result = await query(sql, values);
  return result.rows[0];
};

/**
 * Find user by email
 * @param {string} email - User email
 * @returns {Promise<Object>} User object
 */
const findByEmail = async (email) => {
  const sql = 'SELECT * FROM users WHERE email = $1 AND is_active = true';
  const result = await query(sql, [email]);
  return result.rows[0];
};

/**
 * Find user by ID
 * @param {string} id - User ID
 * @returns {Promise<Object>} User object
 */
const findById = async (id) => {
  const sql = 'SELECT * FROM users WHERE id = $1 AND is_active = true';
  const result = await query(sql, [id]);
  return result.rows[0];
};

/**
 * Find users by property
 * @param {string} propertyId - Property ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Users and total count
 */
const findByProperty = async (propertyId, { limit = 10, offset = 0, role = null, search = null } = {}) => {
  let sql = `
    SELECT id, property_id, first_name, last_name, email, phone, role,
           department, is_active, created_at, updated_at
    FROM users
    WHERE property_id = $1 AND is_active = true
  `;

  const values = [propertyId];
  let paramCount = 2;

  if (role) {
    sql += ` AND role = $${paramCount}`;
    values.push(role);
    paramCount++;
  }

  if (search) {
    sql += ` AND (first_name ILIKE $${paramCount} OR last_name ILIKE $${paramCount} OR email ILIKE $${paramCount})`;
    values.push(`%${search}%`);
    paramCount++;
  }

  sql += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
  values.push(limit, offset);

  const result = await query(sql, values);

  let countSql = 'SELECT COUNT(*) FROM users WHERE property_id = $1 AND is_active = true';
  const countValues = [propertyId];

  if (role) {
    countSql += ` AND role = $2`;
  }

  if (search) {
    const searchParam = role ? '$3' : '$2';
    countSql += ` AND (first_name ILIKE ${searchParam} OR last_name ILIKE ${searchParam} OR email ILIKE ${searchParam})`;
  }

  const countResult = await query(countSql, countValues);

  return {
    users: result.rows,
    totalCount: parseInt(countResult.rows[0].count),
  };
};

/**
 * Update user
 * @param {string} id - User ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated user
 */
const update = async (id, updateData) => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  const excludeFields = ['password_hash', 'password', 'id'];

  Object.keys(updateData).forEach(key => {
    if (!excludeFields.includes(key)) {
      fields.push(`${key} = $${paramCount}`);
      values.push(updateData[key]);
      paramCount++;
    }
  });

  if (fields.length === 0) {
    return await findById(id);
  }

  fields.push(`updated_at = NOW()`);

  const sql = `
    UPDATE users
    SET ${fields.join(', ')}
    WHERE id = $${paramCount}
    RETURNING id, property_id, first_name, last_name, email, phone,
              role, department, is_active, created_at, updated_at
  `;

  values.push(id);

  const result = await query(sql, values);
  return result.rows[0];
};

/**
 * Update password
 * @param {string} id - User ID
 * @param {string} passwordHash - Hashed password
 * @returns {Promise<void>}
 */
const updatePassword = async (id, passwordHash) => {
  const sql = 'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2';
  await query(sql, [passwordHash, id]);
};

/**
 * Update last login
 * @param {string} id - User ID
 * @returns {Promise<void>}
 */
const updateLastLogin = async (id) => {
  const sql = 'UPDATE users SET last_login_at = NOW() WHERE id = $1';
  await query(sql, [id]);
};

/**
 * Soft delete user
 * @param {string} id - User ID
 * @returns {Promise<void>}
 */
const softDelete = async (id) => {
  const sql = 'UPDATE users SET is_active = false, updated_at = NOW() WHERE id = $1';
  await query(sql, [id]);
};

/**
 * Check if user exists
 * @param {string} email - User email
 * @returns {Promise<boolean>}
 */
const exists = async (email) => {
  const sql = 'SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)';
  const result = await query(sql, [email]);
  return result.rows[0].exists;
};

export const userRepository = {
  create,
  findByEmail,
  findById,
  findByProperty,
  update,
  updatePassword,
  updateLastLogin,
  softDelete,
  exists,
};
