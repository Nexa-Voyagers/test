import { query } from '../config/database.js';

/**
 * Create new restaurant
 * @param {Object} restaurantData - Restaurant data
 * @returns {Promise<Object>} Created restaurant
 */
const create = async (restaurantData) => {
  const sql = `
    INSERT INTO restaurants (
      group_id, restaurant_name, restaurant_code, restaurant_type,
      cuisine_types, address_line1, address_line2, city, state, pincode,
      latitude, longitude, phone, email, website,
      opening_time, closing_time, seating_capacity, total_tables,
      has_dine_in, has_takeaway, has_delivery, has_catering,
      fssai_license, gst_number, default_currency,
      tax_rate_cgst, tax_rate_sgst, service_charge_percent, is_active
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
      $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
      $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, true
    )
    RETURNING id, restaurant_name, restaurant_code, restaurant_type,
              city, state, phone, email, is_active, created_at
  `;

  const values = [
    restaurantData.group_id || null,
    restaurantData.restaurant_name,
    restaurantData.restaurant_code,
    restaurantData.restaurant_type || 'casual_dining',
    restaurantData.cuisine_types || [],
    restaurantData.address_line1,
    restaurantData.address_line2 || null,
    restaurantData.city,
    restaurantData.state || 'Uttar Pradesh',
    restaurantData.pincode,
    restaurantData.latitude || null,
    restaurantData.longitude || null,
    restaurantData.phone,
    restaurantData.email,
    restaurantData.website || null,
    restaurantData.opening_time || '10:00:00',
    restaurantData.closing_time || '23:00:00',
    restaurantData.seating_capacity || 0,
    restaurantData.total_tables || 0,
    restaurantData.has_dine_in !== false,
    restaurantData.has_takeaway !== false,
    restaurantData.has_delivery || false,
    restaurantData.has_catering || false,
    restaurantData.fssai_license || null,
    restaurantData.gst_number || null,
    restaurantData.default_currency || 'INR',
    restaurantData.tax_rate_cgst || 2.5,
    restaurantData.tax_rate_sgst || 2.5,
    restaurantData.service_charge_percent || 0,
  ];

  const result = await query(sql, values);
  return result.rows[0];
};

/**
 * Find restaurant by ID
 * @param {string} id - Restaurant ID
 * @returns {Promise<Object>} Restaurant object
 */
const findById = async (id) => {
  const sql = 'SELECT * FROM restaurants WHERE id = $1 AND is_active = true';
  const result = await query(sql, [id]);
  return result.rows[0];
};

/**
 * Find restaurant by code
 * @param {string} code - Restaurant code
 * @returns {Promise<Object>} Restaurant object
 */
const findByCode = async (code) => {
  const sql = 'SELECT * FROM restaurants WHERE restaurant_code = $1 AND is_active = true';
  const result = await query(sql, [code]);
  return result.rows[0];
};

/**
 * Find restaurants by group
 * @param {string} groupId - Restaurant group ID
 * @param {Object} options - Query options
 * @returns {Promise<Array>} Array of restaurants
 */
const findByGroup = async (groupId, { limit = 10, offset = 0 } = {}) => {
  const sql = `
    SELECT id, group_id, restaurant_name, restaurant_code, restaurant_type,
           city, state, phone, email, is_active, created_at
    FROM restaurants
    WHERE group_id = $1 AND is_active = true
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3
  `;

  const result = await query(sql, [groupId, limit, offset]);
  return result.rows;
};

/**
 * Find all restaurants
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Restaurants and total count
 */
const findAll = async ({ limit = 10, offset = 0, search = null } = {}) => {
  let sql = `
    SELECT id, group_id, restaurant_name, restaurant_code, restaurant_type,
           city, state, phone, email, is_active, created_at
    FROM restaurants
    WHERE is_active = true
  `;

  const values = [];
  let paramCount = 1;

  if (search) {
    sql += ` AND (restaurant_name ILIKE $${paramCount} OR restaurant_code ILIKE $${paramCount} OR city ILIKE $${paramCount})`;
    values.push(`%${search}%`);
    paramCount++;
  }

  sql += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
  values.push(limit, offset);

  const result = await query(sql, values);

  // Get total count
  let countSql = 'SELECT COUNT(*) FROM restaurants WHERE is_active = true';
  const countValues = [];

  if (search) {
    countSql += ' AND (restaurant_name ILIKE $1 OR restaurant_code ILIKE $1 OR city ILIKE $1)';
    countValues.push(`%${search}%`);
  }

  const countResult = await query(countSql, countValues);

  return {
    restaurants: result.rows,
    totalCount: parseInt(countResult.rows[0].count),
  };
};

/**
 * Update restaurant
 * @param {string} id - Restaurant ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated restaurant
 */
const update = async (id, updateData) => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  Object.keys(updateData).forEach(key => {
    if (key !== 'id') {
      fields.push(`${key} = $${paramCount}`);
      values.push(updateData[key]);
      paramCount++;
    }
  });

  if (fields.length === 0) {
    return await findById(id);
  }

  fields.push('updated_at = NOW()');

  const sql = `
    UPDATE restaurants
    SET ${fields.join(', ')}
    WHERE id = $${paramCount}
    RETURNING id, restaurant_name, restaurant_code, restaurant_type,
              city, state, phone, email, is_active, created_at, updated_at
  `;

  values.push(id);

  const result = await query(sql, values);
  return result.rows[0];
};

/**
 * Get restaurant settings
 * @param {string} id - Restaurant ID
 * @returns {Promise<Object>} Restaurant settings
 */
const getSettings = async (id) => {
  const sql = `
    SELECT
      tax_rate_cgst,
      tax_rate_sgst,
      service_charge_percent,
      default_currency
    FROM restaurants
    WHERE id = $1 AND is_active = true
  `;

  const result = await query(sql, [id]);
  return result.rows[0];
};

/**
 * Soft delete restaurant
 * @param {string} id - Restaurant ID
 * @returns {Promise<void>}
 */
const softDelete = async (id) => {
  const sql = 'UPDATE restaurants SET is_active = false, updated_at = NOW() WHERE id = $1';
  await query(sql, [id]);
};

export const restaurantRepository = {
  create,
  findById,
  findByCode,
  findByGroup,
  findAll,
  update,
  getSettings,
  softDelete,
};
