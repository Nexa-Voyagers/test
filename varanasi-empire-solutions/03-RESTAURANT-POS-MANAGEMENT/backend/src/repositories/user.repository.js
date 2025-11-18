import { query } from '../config/database.js';

/**
 * Create new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user
 */
const create = async (userData) => {
  const sql = `
    INSERT INTO users (
      restaurant_id, first_name, last_name, email, phone,
      password_hash, role, employee_id, joining_date, is_active
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
    RETURNING id, restaurant_id, first_name, last_name, email, phone,
              role, employee_id, joining_date, is_active, created_at
  `;

  const values = [
    userData.restaurant_id,
    userData.first_name,
    userData.last_name || null,
    userData.email,
    userData.phone || null,
    userData.password_hash,
    userData.role || 'WAITER',
    userData.employee_id || null,
    userData.joining_date || new Date().toISOString().split('T')[0],
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
 * Find users by restaurant
 * @param {string} restaurantId - Restaurant ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Users and total count
 */
const findByRestaurant = async (restaurantId, { limit = 10, offset = 0, role = null, search = null } = {}) => {
  let sql = `
    SELECT id, restaurant_id, first_name, last_name, email, phone, role,
           employee_id, joining_date, is_active, created_at, updated_at
    FROM users
    WHERE restaurant_id = $1 AND is_active = true
  `;

  const values = [restaurantId];
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

  // Get total count
  let countSql = 'SELECT COUNT(*) FROM users WHERE restaurant_id = $1 AND is_active = true';
  const countValues = [restaurantId];

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

  // Exclude password from this update (use updatePassword for that)
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
    RETURNING id, restaurant_id, first_name, last_name, email, phone,
              role, employee_id, joining_date, is_active, created_at, updated_at
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
 * Check if user exists in a restaurant
 * @param {string} restaurantId - Restaurant ID
 * @param {string} email - User email
 * @returns {Promise<boolean>}
 */
const existsInRestaurant = async (restaurantId, email) => {
  const sql = 'SELECT EXISTS(SELECT 1 FROM users WHERE restaurant_id = $1 AND email = $2)';
  const result = await query(sql, [restaurantId, email]);
  return result.rows[0].exists;
};

export const userRepository = {
  create,
  findByEmail,
  findById,
  findByRestaurant,
  update,
  updatePassword,
  updateLastLogin,
  softDelete,
  existsInRestaurant,
};
