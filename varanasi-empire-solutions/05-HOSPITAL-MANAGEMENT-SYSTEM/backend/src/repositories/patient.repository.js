import { query } from '../config/database.js';

/**
 * Create patient
 */
const create = async (patientData) => {
  const result = await query(
    `INSERT INTO patients (
      patient_id, hospital_id, first_name, middle_name, last_name,
      date_of_birth, age_years, gender, mobile, email, address_line1,
      address_line2, city, district, state, pincode, blood_group,
      registration_date, registered_by
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
    RETURNING *`,
    [
      patientData.patient_id,
      patientData.hospital_id,
      patientData.first_name,
      patientData.middle_name,
      patientData.last_name,
      patientData.date_of_birth,
      patientData.age_years,
      patientData.gender,
      patientData.mobile,
      patientData.email,
      patientData.address_line1,
      patientData.address_line2,
      patientData.city,
      patientData.district,
      patientData.state || 'Uttar Pradesh',
      patientData.pincode,
      patientData.blood_group,
      patientData.registration_date || new Date(),
      patientData.registered_by,
    ]
  );
  return result.rows[0];
};

/**
 * Find patient by ID
 */
const findById = async (id) => {
  const result = await query(
    `SELECT p.*, h.hospital_name
     FROM patients p
     LEFT JOIN hospitals h ON p.hospital_id = h.id
     WHERE p.id = $1`,
    [id]
  );
  return result.rows[0];
};

/**
 * Find patient by patient_id
 */
const findByPatientId = async (patientId) => {
  const result = await query(
    `SELECT p.*, h.hospital_name
     FROM patients p
     LEFT JOIN hospitals h ON p.hospital_id = h.id
     WHERE p.patient_id = $1`,
    [patientId]
  );
  return result.rows[0];
};

/**
 * Find patient by mobile
 */
const findByMobile = async (mobile, hospitalId) => {
  const result = await query(
    `SELECT * FROM patients
     WHERE mobile = $1 AND hospital_id = $2
     ORDER BY created_at DESC`,
    [mobile, hospitalId]
  );
  return result.rows;
};

/**
 * Search patients
 */
const search = async (searchTerm, hospitalId, limit = 20) => {
  const result = await query(
    `SELECT id, patient_id, first_name, middle_name, last_name,
            mobile, date_of_birth, gender, city
     FROM patients
     WHERE hospital_id = $1
     AND (
       patient_id ILIKE $2
       OR first_name ILIKE $2
       OR last_name ILIKE $2
       OR mobile ILIKE $2
       OR CONCAT(first_name, ' ', last_name) ILIKE $2
     )
     ORDER BY created_at DESC
     LIMIT $3`,
    [hospitalId, `%${searchTerm}%`, limit]
  );
  return result.rows;
};

/**
 * Update patient
 */
const update = async (id, patientData) => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  Object.keys(patientData).forEach((key) => {
    if (patientData[key] !== undefined) {
      fields.push(`${key} = $${paramCount}`);
      values.push(patientData[key]);
      paramCount++;
    }
  });

  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);

  const result = await query(
    `UPDATE patients SET ${fields.join(', ')}
     WHERE id = $${paramCount}
     RETURNING *`,
    values
  );

  return result.rows[0];
};

/**
 * Get patient statistics
 */
const getStats = async (hospitalId, filters = {}) => {
  const result = await query(
    `SELECT
       COUNT(*) as total_patients,
       COUNT(*) FILTER (WHERE registration_date >= CURRENT_DATE - INTERVAL '30 days') as new_this_month,
       COUNT(*) FILTER (WHERE gender = 'MALE') as male_count,
       COUNT(*) FILTER (WHERE gender = 'FEMALE') as female_count,
       COUNT(*) FILTER (WHERE has_insurance = true) as insured_count
     FROM patients
     WHERE hospital_id = $1`,
    [hospitalId]
  );
  return result.rows[0];
};

/**
 * Increment visit count
 */
const incrementVisitCount = async (patientId) => {
  await query(
    `UPDATE patients
     SET total_visits = total_visits + 1,
         last_visit_date = CURRENT_DATE
     WHERE id = $1`,
    [patientId]
  );
};

export const patientRepository = {
  create,
  findById,
  findByPatientId,
  findByMobile,
  search,
  update,
  getStats,
  incrementVisitCount,
};

export default patientRepository;
