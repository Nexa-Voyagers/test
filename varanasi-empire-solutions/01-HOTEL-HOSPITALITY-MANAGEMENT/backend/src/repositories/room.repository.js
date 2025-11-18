import { query } from '../config/database.js';

/**
 * Create room
 * @param {Object} roomData - Room data
 * @returns {Promise<Object>}
 */
const create = async (roomData) => {
  const sql = `
    INSERT INTO rooms (
      property_id, room_category_id, room_number, floor_number,
      operational_status, housekeeping_status, is_active
    )
    VALUES ($1, $2, $3, $4, $5, $6, true)
    RETURNING *
  `;

  const values = [
    roomData.property_id,
    roomData.room_category_id,
    roomData.room_number,
    roomData.floor_number,
    roomData.operational_status || 'AVAILABLE',
    roomData.housekeeping_status || 'CLEAN',
  ];

  const result = await query(sql, values);
  return result.rows[0];
};

/**
 * Find room by ID
 * @param {string} id - Room ID
 * @returns {Promise<Object>}
 */
const findById = async (id) => {
  const sql = 'SELECT * FROM rooms WHERE id = $1 AND is_active = true';
  const result = await query(sql, [id]);
  return result.rows[0];
};

/**
 * Find rooms by property
 * @param {string} propertyId - Property ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>}
 */
const findByProperty = async (propertyId, { status = null, floor = null, limit = 50, offset = 0 } = {}) => {
  let sql = `
    SELECT r.* FROM rooms r
    WHERE r.property_id = $1 AND r.is_active = true
  `;

  const values = [propertyId];
  let paramCount = 2;

  if (status) {
    sql += ` AND r.operational_status = $${paramCount}`;
    values.push(status);
    paramCount++;
  }

  if (floor) {
    sql += ` AND r.floor_number = $${paramCount}`;
    values.push(floor);
    paramCount++;
  }

  sql += ` ORDER BY r.floor_number, r.room_number LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
  values.push(limit, offset);

  const result = await query(sql, values);

  let countSql = 'SELECT COUNT(*) FROM rooms WHERE property_id = $1 AND is_active = true';
  const countValues = [propertyId];

  if (status) {
    countSql += ` AND operational_status = $2`;
  }

  if (floor) {
    const floorParam = status ? '$3' : '$2';
    countSql += ` AND floor_number = ${floorParam}`;
  }

  const countResult = await query(countSql, countValues);

  return {
    rooms: result.rows,
    totalCount: parseInt(countResult.rows[0].count),
  };
};

/**
 * Find available rooms
 * @param {string} propertyId - Property ID
 * @param {string} categoryId - Room category ID
 * @param {string} checkInDate - Check-in date
 * @param {string} checkOutDate - Check-out date
 * @returns {Promise<Array>}
 */
const findAvailableRooms = async (propertyId, categoryId, checkInDate, checkOutDate) => {
  const sql = `
    SELECT r.* FROM rooms r
    WHERE r.property_id = $1
    AND r.room_category_id = $2
    AND r.operational_status = 'AVAILABLE'
    AND r.housekeeping_status IN ('CLEAN', 'INSPECTED')
    AND r.is_active = true
    AND NOT EXISTS (
      SELECT 1 FROM reservations res
      WHERE res.property_id = $1
      AND res.status NOT IN ('CANCELLED', 'NO_SHOW')
      AND res.check_in_date < $4
      AND res.check_out_date > $3
    )
    LIMIT 10
  `;

  const values = [propertyId, categoryId, checkInDate, checkOutDate];
  const result = await query(sql, values);
  return result.rows;
};

/**
 * Update room status
 * @param {string} id - Room ID
 * @param {string} status - New status
 * @returns {Promise<Object>}
 */
const updateStatus = async (id, status) => {
  const sql = `
    UPDATE rooms
    SET operational_status = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING *
  `;

  const result = await query(sql, [status, id]);
  return result.rows[0];
};

/**
 * Update housekeeping status
 * @param {string} id - Room ID
 * @param {string} status - New housekeeping status
 * @returns {Promise<Object>}
 */
const updateHousekeepingStatus = async (id, status) => {
  const sql = `
    UPDATE rooms
    SET housekeeping_status = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING *
  `;

  const result = await query(sql, [status, id]);
  return result.rows[0];
};

/**
 * Get room with category details
 * @param {string} roomId - Room ID
 * @returns {Promise<Object>}
 */
const findWithCategory = async (roomId) => {
  const sql = `
    SELECT r.*, rc.* FROM rooms r
    LEFT JOIN room_categories rc ON r.room_category_id = rc.id
    WHERE r.id = $1 AND r.is_active = true
  `;

  const result = await query(sql, [roomId]);
  return result.rows[0];
};

export const roomRepository = {
  create,
  findById,
  findByProperty,
  findAvailableRooms,
  updateStatus,
  updateHousekeepingStatus,
  findWithCategory,
};
