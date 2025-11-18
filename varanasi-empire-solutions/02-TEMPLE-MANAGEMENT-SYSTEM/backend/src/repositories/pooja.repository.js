import { query } from '../config/database.js';

const createPoojaBooking = async (bookingData) => {
  const result = await query(
    `INSERT INTO pooja_bookings (
      booking_id, temple_id, devotee_id, pooja_id, pooja_date,
      pooja_time, amount, priest_id, devotee_details, created_by
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *`,
    [
      bookingData.booking_id,
      bookingData.temple_id,
      bookingData.devotee_id,
      bookingData.pooja_id,
      bookingData.pooja_date,
      bookingData.pooja_time,
      bookingData.amount,
      bookingData.priest_id,
      bookingData.devotee_details,
      bookingData.created_by,
    ]
  );
  return result.rows[0];
};

const findById = async (id) => {
  const result = await query(
    `SELECT pb.*, p.pooja_name, p.duration_minutes,
            d.first_name, d.last_name, d.phone,
            pr.first_name as priest_first_name, pr.last_name as priest_last_name
     FROM pooja_bookings pb
     JOIN poojas p ON pb.pooja_id = p.id
     JOIN devotees d ON pb.devotee_id = d.id
     LEFT JOIN priests pr ON pb.priest_id = pr.id
     WHERE pb.id = $1`,
    [id]
  );
  return result.rows[0];
};

const getPoojaSchedule = async (templeId, date) => {
  const result = await query(
    `SELECT pb.*, p.pooja_name, d.first_name, d.last_name, d.phone,
            pr.first_name as priest_first_name
     FROM pooja_bookings pb
     JOIN poojas p ON pb.pooja_id = p.id
     JOIN devotees d ON pb.devotee_id = d.id
     LEFT JOIN priests pr ON pb.priest_id = pr.id
     WHERE pb.temple_id = $1 AND pb.pooja_date = $2
     AND pb.status != 'CANCELLED'
     ORDER BY pb.pooja_time`,
    [templeId, date]
  );
  return result.rows;
};

const getAvailablePriests = async (templeId, date, time) => {
  const result = await query(
    `SELECT pr.* FROM priests pr
     WHERE pr.temple_id = $1
     AND pr.is_active = true
     AND NOT EXISTS (
       SELECT 1 FROM pooja_bookings pb
       WHERE pb.priest_id = pr.id
       AND pb.pooja_date = $2
       AND pb.pooja_time = $3
       AND pb.status != 'CANCELLED'
     )`,
    [templeId, date, time]
  );
  return result.rows;
};

const updateStatus = async (id, status) => {
  const result = await query(
    `UPDATE pooja_bookings
     SET status = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING *`,
    [status, id]
  );
  return result.rows[0];
};

const getPoojaRevenue = async (templeId, startDate, endDate) => {
  const result = await query(
    `SELECT
       p.pooja_name,
       COUNT(pb.id) as total_bookings,
       SUM(pb.amount) as total_revenue
     FROM pooja_bookings pb
     JOIN poojas p ON pb.pooja_id = p.id
     WHERE pb.temple_id = $1
     AND pb.pooja_date BETWEEN $2 AND $3
     AND pb.status = 'COMPLETED'
     GROUP BY p.id, p.pooja_name
     ORDER BY total_revenue DESC`,
    [templeId, startDate, endDate]
  );
  return result.rows;
};

export const poojaRepository = {
  createPoojaBooking,
  findById,
  getPoojaSchedule,
  getAvailablePriests,
  updateStatus,
  getPoojaRevenue,
};

export default poojaRepository;
