import { query } from '../config/database.js';

const createBooking = async (bookingData) => {
  const result = await query(
    `INSERT INTO darshan_bookings (
      booking_id, temple_id, devotee_id, darshan_type, darshan_date,
      darshan_slot, number_of_devotees, amount, payment_status, created_by
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *`,
    [
      bookingData.booking_id,
      bookingData.temple_id,
      bookingData.devotee_id,
      bookingData.darshan_type,
      bookingData.darshan_date,
      bookingData.darshan_slot,
      bookingData.number_of_devotees,
      bookingData.amount,
      bookingData.payment_status || 'PENDING',
      bookingData.created_by,
    ]
  );
  return result.rows[0];
};

const findById = async (id) => {
  const result = await query(
    `SELECT db.*, d.first_name, d.last_name, d.phone
     FROM darshan_bookings db
     JOIN devotees d ON db.devotee_id = d.id
     WHERE db.id = $1`,
    [id]
  );
  return result.rows[0];
};

const findByDate = async (templeId, darshanDate) => {
  const result = await query(
    `SELECT db.*, d.first_name, d.last_name, d.phone
     FROM darshan_bookings db
     JOIN devotees d ON db.devotee_id = d.id
     WHERE db.temple_id = $1 AND db.darshan_date = $2
     AND db.status != 'CANCELLED'
     ORDER BY db.darshan_slot`,
    [templeId, darshanDate]
  );
  return result.rows;
};

const checkSlotAvailability = async (templeId, darshanDate, slot, darshanType) => {
  const result = await query(
    `SELECT COUNT(*) as count, SUM(number_of_devotees) as total_devotees
     FROM darshan_bookings
     WHERE temple_id = $1 AND darshan_date = $2 AND darshan_slot = $3
     AND darshan_type = $4 AND status != 'CANCELLED'`,
    [templeId, darshanDate, slot, darshanType]
  );
  return result.rows[0];
};

const updateStatus = async (id, status) => {
  const result = await query(
    `UPDATE darshan_bookings
     SET status = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING *`,
    [status, id]
  );
  return result.rows[0];
};

const getDailyStats = async (templeId, date) => {
  const result = await query(
    `SELECT
       COUNT(*) as total_bookings,
       SUM(number_of_devotees) as total_devotees,
       SUM(amount) as total_revenue,
       darshan_type,
       status
     FROM darshan_bookings
     WHERE temple_id = $1 AND darshan_date = $2
     GROUP BY darshan_type, status`,
    [templeId, date]
  );
  return result.rows;
};

export const darshanRepository = {
  createBooking,
  findById,
  findByDate,
  checkSlotAvailability,
  updateStatus,
  getDailyStats,
};

export default darshanRepository;
