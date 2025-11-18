import { query, transaction } from '../config/database.js';

/**
 * Create reservation
 * @param {Object} reservationData - Reservation data
 * @returns {Promise<Object>}
 */
const create = async (reservationData) => {
  const sql = `
    INSERT INTO reservations (
      property_id, primary_guest_id, booking_reference, check_in_date, check_out_date,
      nights, adults, children, infants, status, booking_source, room_total, subtotal,
      cgst_amount, sgst_amount, total_amount, payment_status, created_by
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
    RETURNING *
  `;

  const values = [
    reservationData.property_id,
    reservationData.primary_guest_id,
    reservationData.booking_reference,
    reservationData.check_in_date,
    reservationData.check_out_date,
    reservationData.nights,
    reservationData.adults,
    reservationData.children || 0,
    reservationData.infants || 0,
    reservationData.status || 'CONFIRMED',
    reservationData.booking_source,
    reservationData.room_total,
    reservationData.subtotal,
    reservationData.cgst_amount || 0,
    reservationData.sgst_amount || 0,
    reservationData.total_amount,
    reservationData.payment_status || 'PENDING',
    reservationData.created_by,
  ];

  const result = await query(sql, values);
  return result.rows[0];
};

/**
 * Find reservation by ID
 * @param {string} id - Reservation ID
 * @returns {Promise<Object>}
 */
const findById = async (id) => {
  const sql = `
    SELECT r.*, g.first_name, g.last_name, g.email, g.phone
    FROM reservations r
    LEFT JOIN guests g ON r.primary_guest_id = g.id
    WHERE r.id = $1
  `;

  const result = await query(sql, [id]);
  return result.rows[0];
};

/**
 * Find reservations by property
 * @param {string} propertyId - Property ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>}
 */
const findByProperty = async (propertyId, { status = null, limit = 20, offset = 0 } = {}) => {
  let sql = `
    SELECT r.*, g.first_name, g.last_name, g.email
    FROM reservations r
    LEFT JOIN guests g ON r.primary_guest_id = g.id
    WHERE r.property_id = $1
  `;

  const values = [propertyId];
  let paramCount = 2;

  if (status) {
    sql += ` AND r.status = $${paramCount}`;
    values.push(status);
    paramCount++;
  }

  sql += ` ORDER BY r.check_in_date DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
  values.push(limit, offset);

  const result = await query(sql, values);

  let countSql = 'SELECT COUNT(*) FROM reservations WHERE property_id = $1';
  const countValues = [propertyId];

  if (status) {
    countSql += ` AND status = $2`;
  }

  const countResult = await query(countSql, countValues);

  return {
    reservations: result.rows,
    totalCount: parseInt(countResult.rows[0].count),
  };
};

/**
 * Find reservations by guest
 * @param {string} guestId - Guest ID
 * @returns {Promise<Array>}
 */
const findByGuest = async (guestId) => {
  const sql = `
    SELECT * FROM reservations
    WHERE primary_guest_id = $1
    ORDER BY check_in_date DESC
  `;

  const result = await query(sql, [guestId]);
  return result.rows;
};

/**
 * Update reservation
 * @param {string} id - Reservation ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>}
 */
const update = async (id, updateData) => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  Object.keys(updateData).forEach(key => {
    if (!['id', 'property_id', 'booking_reference', 'created_by'].includes(key)) {
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
    UPDATE reservations
    SET ${fields.join(', ')}
    WHERE id = $${paramCount}
    RETURNING *
  `;

  values.push(id);

  const result = await query(sql, values);
  return result.rows[0];
};

/**
 * Update payment status
 * @param {string} id - Reservation ID
 * @param {string} paymentStatus - New payment status
 * @param {number} paidAmount - Paid amount
 * @returns {Promise<Object>}
 */
const updatePaymentStatus = async (id, paymentStatus, paidAmount = 0) => {
  const sql = `
    UPDATE reservations
    SET payment_status = $1, paid_amount = $2, balance_amount = total_amount - $2, updated_at = NOW()
    WHERE id = $3
    RETURNING *
  `;

  const result = await query(sql, [paymentStatus, paidAmount, id]);
  return result.rows[0];
};

/**
 * Find current reservations (checked in)
 * @param {string} propertyId - Property ID
 * @returns {Promise<Array>}
 */
const findCurrentReservations = async (propertyId) => {
  const sql = `
    SELECT r.*, g.first_name, g.last_name
    FROM reservations r
    LEFT JOIN guests g ON r.primary_guest_id = g.id
    WHERE r.property_id = $1 AND r.status = 'CHECKED_IN'
    ORDER BY r.check_out_date ASC
  `;

  const result = await query(sql, [propertyId]);
  return result.rows;
};

/**
 * Find upcoming arrivals
 * @param {string} propertyId - Property ID
 * @param {number} daysAhead - Number of days ahead
 * @returns {Promise<Array>}
 */
const findUpcomingArrivals = async (propertyId, daysAhead = 7) => {
  const sql = `
    SELECT r.*, g.first_name, g.last_name, g.email, g.phone
    FROM reservations r
    LEFT JOIN guests g ON r.primary_guest_id = g.id
    WHERE r.property_id = $1
    AND r.status IN ('CONFIRMED', 'TENTATIVE')
    AND r.check_in_date >= CURRENT_DATE
    AND r.check_in_date <= CURRENT_DATE + INTERVAL '${daysAhead} days'
    ORDER BY r.check_in_date ASC
  `;

  const result = await query(sql, [propertyId]);
  return result.rows;
};

export const bookingRepository = {
  create,
  findById,
  findByProperty,
  findByGuest,
  update,
  updatePaymentStatus,
  findCurrentReservations,
  findUpcomingArrivals,
};
