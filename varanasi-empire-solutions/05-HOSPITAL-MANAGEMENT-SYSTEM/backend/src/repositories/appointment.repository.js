import { query } from '../config/database.js';

/**
 * Create appointment
 */
const create = async (appointmentData) => {
  const result = await query(
    `INSERT INTO appointments (
      appointment_id, hospital_id, patient_id, doctor_id, department_id,
      appointment_date, appointment_time, appointment_type, status,
      chief_complaint, booking_source, created_by
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *`,
    [
      appointmentData.appointment_id,
      appointmentData.hospital_id,
      appointmentData.patient_id,
      appointmentData.doctor_id,
      appointmentData.department_id,
      appointmentData.appointment_date,
      appointmentData.appointment_time,
      appointmentData.appointment_type,
      appointmentData.status || 'SCHEDULED',
      appointmentData.chief_complaint,
      appointmentData.booking_source || 'COUNTER',
      appointmentData.created_by,
    ]
  );
  return result.rows[0];
};

/**
 * Find appointment by ID
 */
const findById = async (id) => {
  const result = await query(
    `SELECT a.*,
            p.patient_id, p.first_name as patient_first_name,
            p.last_name as patient_last_name, p.mobile as patient_mobile,
            p.age_years, p.gender,
            d.first_name as doctor_first_name, d.last_name as doctor_last_name,
            d.specialization, d.qualification,
            dept.department_name
     FROM appointments a
     JOIN patients p ON a.patient_id = p.id
     JOIN doctors d ON a.doctor_id = d.id
     JOIN departments dept ON a.department_id = dept.id
     WHERE a.id = $1`,
    [id]
  );
  return result.rows[0];
};

/**
 * Get appointments by date and doctor
 */
const findByDateAndDoctor = async (doctorId, appointmentDate) => {
  const result = await query(
    `SELECT a.*,
            p.patient_id, p.first_name as patient_first_name,
            p.last_name as patient_last_name, p.mobile as patient_mobile,
            p.age_years, p.gender
     FROM appointments a
     JOIN patients p ON a.patient_id = p.id
     WHERE a.doctor_id = $1
     AND a.appointment_date = $2
     AND a.status != 'CANCELLED'
     ORDER BY a.appointment_time`,
    [doctorId, appointmentDate]
  );
  return result.rows;
};

/**
 * Get appointments by hospital
 */
const findByHospital = async (hospitalId, filters = {}) => {
  let queryText = `
    SELECT a.*,
           p.patient_id, p.first_name as patient_first_name,
           p.last_name as patient_last_name, p.mobile as patient_mobile,
           d.first_name as doctor_first_name, d.last_name as doctor_last_name,
           dept.department_name
    FROM appointments a
    JOIN patients p ON a.patient_id = p.id
    JOIN doctors d ON a.doctor_id = d.id
    JOIN departments dept ON a.department_id = dept.id
    WHERE a.hospital_id = $1
  `;
  const values = [hospitalId];
  let paramCount = 2;

  if (filters.appointment_date) {
    queryText += ` AND a.appointment_date = $${paramCount}`;
    values.push(filters.appointment_date);
    paramCount++;
  }

  if (filters.doctor_id) {
    queryText += ` AND a.doctor_id = $${paramCount}`;
    values.push(filters.doctor_id);
    paramCount++;
  }

  if (filters.status) {
    queryText += ` AND a.status = $${paramCount}`;
    values.push(filters.status);
    paramCount++;
  }

  queryText += ' ORDER BY a.appointment_date DESC, a.appointment_time DESC';

  if (filters.limit) {
    queryText += ` LIMIT $${paramCount}`;
    values.push(filters.limit);
    paramCount++;
  }

  if (filters.offset) {
    queryText += ` OFFSET $${paramCount}`;
    values.push(filters.offset);
  }

  const result = await query(queryText, values);
  return result.rows;
};

/**
 * Update appointment status
 */
const updateStatus = async (id, status, updatedBy) => {
  const result = await query(
    `UPDATE appointments
     SET status = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING *`,
    [status, id]
  );
  return result.rows[0];
};

/**
 * Check slot availability
 */
const checkSlotAvailability = async (doctorId, appointmentDate, appointmentTime) => {
  const result = await query(
    `SELECT COUNT(*) as count
     FROM appointments
     WHERE doctor_id = $1
     AND appointment_date = $2
     AND appointment_time = $3
     AND status NOT IN ('CANCELLED', 'NO_SHOW')`,
    [doctorId, appointmentDate, appointmentTime]
  );
  return result.rows[0].count === '0';
};

/**
 * Get today's appointments for doctor
 */
const getTodayAppointments = async (doctorId) => {
  const result = await query(
    `SELECT a.*,
            p.patient_id, p.first_name as patient_first_name,
            p.last_name as patient_last_name, p.mobile as patient_mobile,
            p.age_years, p.gender
     FROM appointments a
     JOIN patients p ON a.patient_id = p.id
     WHERE a.doctor_id = $1
     AND a.appointment_date = CURRENT_DATE
     AND a.status != 'CANCELLED'
     ORDER BY a.appointment_time`,
    [doctorId]
  );
  return result.rows;
};

/**
 * Get appointment statistics
 */
const getStats = async (hospitalId, startDate, endDate) => {
  const result = await query(
    `SELECT
       COUNT(*) as total_appointments,
       COUNT(*) FILTER (WHERE status = 'COMPLETED') as completed,
       COUNT(*) FILTER (WHERE status = 'SCHEDULED') as scheduled,
       COUNT(*) FILTER (WHERE status = 'CANCELLED') as cancelled,
       COUNT(*) FILTER (WHERE status = 'NO_SHOW') as no_show
     FROM appointments
     WHERE hospital_id = $1
     AND appointment_date BETWEEN $2 AND $3`,
    [hospitalId, startDate, endDate]
  );
  return result.rows[0];
};

export const appointmentRepository = {
  create,
  findById,
  findByDateAndDoctor,
  findByHospital,
  updateStatus,
  checkSlotAvailability,
  getTodayAppointments,
  getStats,
};

export default appointmentRepository;
