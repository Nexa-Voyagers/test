import { query } from '../config/database.js';

/**
 * Create property
 * @param {Object} propertyData - Property data
 * @returns {Promise<Object>}
 */
const create = async (propertyData) => {
  const sql = `
    INSERT INTO properties (
      group_id, property_name, property_code, property_type, star_rating,
      address_line1, address_line2, city, state, country, pincode,
      total_rooms, total_floors, check_in_time, check_out_time,
      currency, timezone, default_language, gst_number, is_active
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, true)
    RETURNING *
  `;

  const values = [
    propertyData.group_id,
    propertyData.property_name,
    propertyData.property_code,
    propertyData.property_type,
    propertyData.star_rating,
    propertyData.address_line1,
    propertyData.address_line2,
    propertyData.city,
    propertyData.state,
    propertyData.country,
    propertyData.pincode,
    propertyData.total_rooms,
    propertyData.total_floors,
    propertyData.check_in_time || '14:00:00',
    propertyData.check_out_time || '11:00:00',
    propertyData.currency || 'INR',
    propertyData.timezone || 'Asia/Kolkata',
    propertyData.default_language || 'hi',
    propertyData.gst_number,
    propertyData.is_active !== false,
  ];

  const result = await query(sql, values);
  return result.rows[0];
};

/**
 * Find property by ID
 * @param {string} id - Property ID
 * @returns {Promise<Object>}
 */
const findById = async (id) => {
  const sql = 'SELECT * FROM properties WHERE id = $1 AND is_active = true';
  const result = await query(sql, [id]);
  return result.rows[0];
};

/**
 * Find all properties by group
 * @param {string} groupId - Hotel group ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>}
 */
const findByGroup = async (groupId, { limit = 10, offset = 0 } = {}) => {
  const sql = `
    SELECT * FROM properties
    WHERE group_id = $1 AND is_active = true
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3
  `;

  const result = await query(sql, [groupId, limit, offset]);

  const countSql = 'SELECT COUNT(*) FROM properties WHERE group_id = $1 AND is_active = true';
  const countResult = await query(countSql, [groupId]);

  return {
    properties: result.rows,
    totalCount: parseInt(countResult.rows[0].count),
  };
};

/**
 * Update property
 * @param {string} id - Property ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>}
 */
const update = async (id, updateData) => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  Object.keys(updateData).forEach(key => {
    if (!['id', 'group_id'].includes(key)) {
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
    UPDATE properties
    SET ${fields.join(', ')}
    WHERE id = $${paramCount}
    RETURNING *
  `;

  values.push(id);

  const result = await query(sql, values);
  return result.rows[0];
};

/**
 * Get property statistics
 * @param {string} propertyId - Property ID
 * @returns {Promise<Object>}
 */
const getStats = async (propertyId) => {
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM rooms WHERE property_id = $1 AND is_active = true) as total_rooms,
      (SELECT COUNT(*) FROM rooms WHERE property_id = $1 AND operational_status = 'OCCUPIED') as occupied_rooms,
      (SELECT COUNT(*) FROM rooms WHERE property_id = $1 AND operational_status = 'AVAILABLE') as available_rooms,
      (SELECT ROUND(COUNT(*) FILTER (WHERE operational_status = 'OCCUPIED') * 100.0 / COUNT(*), 2)
       FROM rooms WHERE property_id = $1 AND is_active = true) as occupancy_percent,
      (SELECT COALESCE(SUM(total_amount), 0) FROM reservations
       WHERE property_id = $1 AND status IN ('CHECKED_IN', 'CHECKED_OUT')
       AND DATE(check_in_date) = CURRENT_DATE) as today_revenue
  `;

  const result = await query(sql, [propertyId]);
  return result.rows[0];
};

export const hotelRepository = {
  create,
  findById,
  findByGroup,
  update,
  getStats,
};
