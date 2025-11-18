import { query } from '../config/database.js';

const createBooking = async (bookingData) => {
  const result = await query(
    `INSERT INTO tour_bookings (
      booking_number, agency_id, customer_id, package_id, travel_date,
      number_of_travelers, total_amount, advance_paid, booking_status,
      special_requests, created_by
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *`,
    [
      bookingData.booking_number,
      bookingData.agency_id,
      bookingData.customer_id,
      bookingData.package_id,
      bookingData.travel_date,
      bookingData.number_of_travelers,
      bookingData.total_amount,
      bookingData.advance_paid || 0,
      bookingData.booking_status || 'PENDING',
      bookingData.special_requests,
      bookingData.created_by,
    ]
  );
  return result.rows[0];
};

const findById = async (id) => {
  const result = await query(
    `SELECT tb.*,
            c.first_name, c.last_name, c.phone, c.email,
            tp.package_name, tp.destination, tp.duration_days, tp.duration_nights
     FROM tour_bookings tb
     JOIN customers c ON tb.customer_id = c.id
     JOIN tour_packages tp ON tb.package_id = tp.id
     WHERE tb.id = $1`,
    [id]
  );
  return result.rows[0];
};

const findByBookingNumber = async (bookingNumber) => {
  const result = await query(
    `SELECT tb.*,
            c.first_name, c.last_name, c.phone, c.email,
            tp.package_name, tp.destination
     FROM tour_bookings tb
     JOIN customers c ON tb.customer_id = c.id
     JOIN tour_packages tp ON tb.package_id = tp.id
     WHERE tb.booking_number = $1`,
    [bookingNumber]
  );
  return result.rows[0];
};

const findByAgency = async (agencyId, filters = {}) => {
  let queryText = `
    SELECT tb.*,
           c.first_name, c.last_name, c.phone,
           tp.package_name, tp.destination
    FROM tour_bookings tb
    JOIN customers c ON tb.customer_id = c.id
    JOIN tour_packages tp ON tb.package_id = tp.id
    WHERE tb.agency_id = $1
  `;
  const values = [agencyId];
  let paramCount = 2;

  if (filters.booking_status) {
    queryText += ` AND tb.booking_status = $${paramCount}`;
    values.push(filters.booking_status);
    paramCount++;
  }

  if (filters.travel_date) {
    queryText += ` AND tb.travel_date = $${paramCount}`;
    values.push(filters.travel_date);
    paramCount++;
  }

  queryText += ' ORDER BY tb.created_at DESC';

  if (filters.limit) {
    queryText += ` LIMIT $${paramCount}`;
    values.push(filters.limit);
  }

  const result = await query(queryText, values);
  return result.rows;
};

const updateStatus = async (id, status) => {
  const result = await query(
    `UPDATE tour_bookings
     SET booking_status = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING *`,
    [status, id]
  );
  return result.rows[0];
};

const addPayment = async (bookingId, amount, paymentMethod) => {
  const result = await query(
    `UPDATE tour_bookings
     SET advance_paid = advance_paid + $1,
         payment_status = CASE
           WHEN (advance_paid + $1) >= total_amount THEN 'PAID'
           WHEN (advance_paid + $1) > 0 THEN 'PARTIAL'
           ELSE 'PENDING'
         END,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING *`,
    [amount, bookingId]
  );
  return result.rows[0];
};

const getBookingStats = async (agencyId, startDate, endDate) => {
  const result = await query(
    `SELECT
       COUNT(*) as total_bookings,
       SUM(number_of_travelers) as total_travelers,
       SUM(total_amount) as total_revenue,
       SUM(advance_paid) as total_collected,
       booking_status
     FROM tour_bookings
     WHERE agency_id = $1
     AND created_at BETWEEN $2 AND $3
     GROUP BY booking_status`,
    [agencyId, startDate, endDate]
  );
  return result.rows;
};

export const bookingRepository = {
  createBooking,
  findById,
  findByBookingNumber,
  findByAgency,
  updateStatus,
  addPayment,
  getBookingStats,
};

export default bookingRepository;
