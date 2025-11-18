import { query } from '../config/database.js';

/**
 * Create floor
 * @param {Object} floorData - Floor data
 * @returns {Promise<Object>} Created floor
 */
const createFloor = async (floorData) => {
  const sql = `
    INSERT INTO floors (restaurant_id, floor_name, floor_number, total_tables, is_active)
    VALUES ($1, $2, $3, $4, true)
    RETURNING id, restaurant_id, floor_name, floor_number, total_tables, created_at
  `;

  const values = [
    floorData.restaurant_id,
    floorData.floor_name,
    floorData.floor_number || null,
    floorData.total_tables || 0,
  ];

  const result = await query(sql, values);
  return result.rows[0];
};

/**
 * Create table
 * @param {Object} tableData - Table data
 * @returns {Promise<Object>} Created table
 */
const createTable = async (tableData) => {
  const sql = `
    INSERT INTO tables (
      restaurant_id, floor_id, table_number, table_name,
      seating_capacity, table_type, position_x, position_y,
      status, is_active
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'AVAILABLE', true)
    RETURNING id, restaurant_id, floor_id, table_number, table_name,
              seating_capacity, table_type, status, created_at
  `;

  const values = [
    tableData.restaurant_id,
    tableData.floor_id,
    tableData.table_number,
    tableData.table_name || null,
    tableData.seating_capacity || 4,
    tableData.table_type || 'REGULAR',
    tableData.position_x || null,
    tableData.position_y || null,
  ];

  const result = await query(sql, values);
  return result.rows[0];
};

/**
 * Find table by ID
 * @param {string} id - Table ID
 * @returns {Promise<Object>} Table object
 */
const findById = async (id) => {
  const sql = 'SELECT * FROM tables WHERE id = $1 AND is_active = true';
  const result = await query(sql, [id]);
  return result.rows[0];
};

/**
 * Find tables by restaurant
 * @param {string} restaurantId - Restaurant ID
 * @param {Object} options - Query options
 * @returns {Promise<Array>} Tables
 */
const findByRestaurant = async (restaurantId, { floorId = null, status = null } = {}) => {
  let sql = `
    SELECT id, restaurant_id, floor_id, table_number, table_name,
           seating_capacity, table_type, position_x, position_y,
           status, current_order_id, occupied_since, is_active
    FROM tables
    WHERE restaurant_id = $1 AND is_active = true
  `;

  const values = [restaurantId];
  let paramCount = 2;

  if (floorId) {
    sql += ` AND floor_id = $${paramCount}`;
    values.push(floorId);
    paramCount++;
  }

  if (status) {
    sql += ` AND status = $${paramCount}`;
    values.push(status);
    paramCount++;
  }

  sql += ` ORDER BY table_number`;

  const result = await query(sql, values);
  return result.rows;
};

/**
 * Find available tables
 * @param {string} restaurantId - Restaurant ID
 * @param {number} capacity - Minimum seating capacity
 * @returns {Promise<Array>} Available tables
 */
const findAvailable = async (restaurantId, capacity = 1) => {
  const sql = `
    SELECT id, restaurant_id, floor_id, table_number, table_name,
           seating_capacity, table_type, position_x, position_y, status
    FROM tables
    WHERE restaurant_id = $1 AND is_active = true
      AND status = 'AVAILABLE'
      AND seating_capacity >= $2
    ORDER BY seating_capacity, table_number
  `;

  const result = await query(sql, [restaurantId, capacity]);
  return result.rows;
};

/**
 * Update table status
 * @param {string} tableId - Table ID
 * @param {string} status - New status
 * @param {string} orderId - Order ID (optional)
 * @returns {Promise<Object>} Updated table
 */
const updateStatus = async (tableId, status, orderId = null) => {
  const sql = `
    UPDATE tables
    SET status = $1,
        current_order_id = $2,
        occupied_since = CASE WHEN $1 = 'OCCUPIED' THEN NOW() ELSE NULL END
    WHERE id = $3
    RETURNING id, restaurant_id, floor_id, table_number, status, current_order_id
  `;

  const values = [status, orderId, tableId];

  const result = await query(sql, values);
  return result.rows[0];
};

/**
 * Find floors by restaurant
 * @param {string} restaurantId - Restaurant ID
 * @returns {Promise<Array>} Floors
 */
const findFloors = async (restaurantId) => {
  const sql = `
    SELECT id, restaurant_id, floor_name, floor_number, total_tables, is_active
    FROM floors
    WHERE restaurant_id = $1 AND is_active = true
    ORDER BY floor_number
  `;

  const result = await query(sql, [restaurantId]);
  return result.rows;
};

/**
 * Create table reservation
 * @param {Object} reservationData - Reservation data
 * @returns {Promise<Object>} Created reservation
 */
const createReservation = async (reservationData) => {
  const sql = `
    INSERT INTO table_reservations (
      restaurant_id, table_id, customer_id, reservation_date, reservation_time,
      party_size, customer_name, customer_phone, customer_email,
      special_requests, occasion, status
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'CONFIRMED')
    RETURNING id, restaurant_id, table_id, reservation_date, reservation_time,
              party_size, customer_name, status, created_at
  `;

  const values = [
    reservationData.restaurant_id,
    reservationData.table_id || null,
    reservationData.customer_id || null,
    reservationData.reservation_date,
    reservationData.reservation_time,
    reservationData.party_size,
    reservationData.customer_name,
    reservationData.customer_phone,
    reservationData.customer_email || null,
    reservationData.special_requests || null,
    reservationData.occasion || null,
  ];

  const result = await query(sql, values);
  return result.rows[0];
};

/**
 * Find reservations by date
 * @param {string} restaurantId - Restaurant ID
 * @param {string} date - Date (YYYY-MM-DD)
 * @returns {Promise<Array>} Reservations
 */
const findReservationsByDate = async (restaurantId, date) => {
  const sql = `
    SELECT id, restaurant_id, table_id, reservation_date, reservation_time,
           party_size, customer_name, customer_phone, status
    FROM table_reservations
    WHERE restaurant_id = $1 AND DATE(reservation_date) = $2
    ORDER BY reservation_time
  `;

  const result = await query(sql, [restaurantId, date]);
  return result.rows;
};

/**
 * Update table
 * @param {string} id - Table ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated table
 */
const update = async (id, updateData) => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  Object.keys(updateData).forEach(key => {
    if (key !== 'id' && key !== 'restaurant_id') {
      fields.push(`${key} = $${paramCount}`);
      values.push(updateData[key]);
      paramCount++;
    }
  });

  if (fields.length === 0) {
    return await findById(id);
  }

  const sql = `
    UPDATE tables
    SET ${fields.join(', ')}
    WHERE id = $${paramCount}
    RETURNING id, restaurant_id, floor_id, table_number, status, is_active
  `;

  values.push(id);

  const result = await query(sql, values);
  return result.rows[0];
};

/**
 * Get table statistics
 * @param {string} restaurantId - Restaurant ID
 * @returns {Promise<Object>} Table statistics
 */
const getStatistics = async (restaurantId) => {
  const sql = `
    SELECT
      COUNT(*) as total_tables,
      COUNT(*) FILTER (WHERE status = 'AVAILABLE') as available_tables,
      COUNT(*) FILTER (WHERE status = 'OCCUPIED') as occupied_tables,
      COUNT(*) FILTER (WHERE status = 'RESERVED') as reserved_tables,
      SUM(seating_capacity) as total_capacity
    FROM tables
    WHERE restaurant_id = $1 AND is_active = true
  `;

  const result = await query(sql, [restaurantId]);
  return result.rows[0];
};

export const tableRepository = {
  createFloor,
  createTable,
  findById,
  findByRestaurant,
  findAvailable,
  updateStatus,
  findFloors,
  createReservation,
  findReservationsByDate,
  update,
  getStatistics,
};
