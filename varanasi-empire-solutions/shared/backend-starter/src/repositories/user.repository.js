import { query } from '../config/database.js';

/**
 * Create new user
 */
const create = async (userData) => {
  const sql = `
    INSERT INTO users (email, password, full_name, phone, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, email, full_name, phone, role, is_active, created_at
  `;

  const values = [
    userData.email,
    userData.password,
    userData.full_name,
    userData.phone || null,
    userData.role || 'customer',
  ];

  const result = await query(sql, values);
  return result.rows[0];
};

/**
 * Find user by email
 */
const findByEmail = async (email) => {
  const sql = 'SELECT * FROM users WHERE email = $1 AND is_active = true';
  const result = await query(sql, [email]);
  return result.rows[0];
};

/**
 * Find user by ID
 */
const findById = async (id) => {
  const sql = 'SELECT * FROM users WHERE id = $1 AND is_active = true';
  const result = await query(sql, [id]);
  return result.rows[0];
};

/**
 * Find all users with pagination and search
 */
const findAll = async ({ limit, offset, search }) => {
  let sql = `
    SELECT id, email, full_name, phone, role, is_active, created_at, last_login
    FROM users
    WHERE is_active = true
  `;

  const values = [];
  let paramCount = 1;

  if (search) {
    sql += ` AND (full_name ILIKE $${paramCount} OR email ILIKE $${paramCount})`;
    values.push(`%${search}%`);
    paramCount++;
  }

  sql += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
  values.push(limit, offset);

  const result = await query(sql, values);

  // Get total count
  let countSql = 'SELECT COUNT(*) FROM users WHERE is_active = true';
  const countValues = [];

  if (search) {
    countSql += ' AND (full_name ILIKE $1 OR email ILIKE $1)';
    countValues.push(`%${search}%`);
  }

  const countResult = await query(countSql, countValues);

  return {
    users: result.rows,
    totalCount: parseInt(countResult.rows[0].count),
  };
};

/**
 * Update user
 */
const update = async (id, updateData) => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  Object.keys(updateData).forEach(key => {
    fields.push(`${key} = $${paramCount}`);
    values.push(updateData[key]);
    paramCount++;
  });

  if (fields.length === 0) {
    return await findById(id);
  }

  const sql = `
    UPDATE users
    SET ${fields.join(', ')}, updated_at = NOW()
    WHERE id = $${paramCount}
    RETURNING id, email, full_name, phone, role, is_active, created_at, updated_at
  `;

  values.push(id);

  const result = await query(sql, values);
  return result.rows[0];
};

/**
 * Update last login
 */
const updateLastLogin = async (id) => {
  const sql = 'UPDATE users SET last_login = NOW() WHERE id = $1';
  await query(sql, [id]);
};

/**
 * Soft delete user
 */
const softDelete = async (id) => {
  const sql = 'UPDATE users SET is_active = false, updated_at = NOW() WHERE id = $1';
  await query(sql, [id]);
};

/**
 * Hard delete user (use with caution)
 */
const hardDelete = async (id) => {
  const sql = 'DELETE FROM users WHERE id = $1';
  await query(sql, [id]);
};

export const userRepository = {
  create,
  findByEmail,
  findById,
  findAll,
  update,
  updateLastLogin,
  softDelete,
  hardDelete,
};
