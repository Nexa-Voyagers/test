import { query } from '../config/database.js';

const findById = async (id) => {
  const result = await query(
    `SELECT d.*, dept.department_name, h.hospital_name
     FROM doctors d
     LEFT JOIN departments dept ON d.department_id = dept.id
     LEFT JOIN hospitals h ON d.hospital_id = h.id
     WHERE d.id = $1`,
    [id]
  );
  return result.rows[0];
};

const findByHospital = async (hospitalId, filters = {}) => {
  let queryText = `
    SELECT d.*, dept.department_name
    FROM doctors d
    LEFT JOIN departments dept ON d.department_id = dept.id
    WHERE d.hospital_id = $1
  `;
  const values = [hospitalId];
  let paramCount = 2;

  if (filters.department_id) {
    queryText += ` AND d.department_id = $${paramCount}`;
    values.push(filters.department_id);
    paramCount++;
  }

  if (filters.is_active !== undefined) {
    queryText += ` AND d.is_active = $${paramCount}`;
    values.push(filters.is_active);
    paramCount++;
  }

  queryText += ' ORDER BY d.first_name, d.last_name';

  const result = await query(queryText, values);
  return result.rows;
};

const create = async (doctorData) => {
  const result = await query(
    `INSERT INTO doctors (
      doctor_code, hospital_id, department_id, first_name, last_name,
      specialization, qualification, registration_number, experience_years,
      consultation_fee, phone, email, created_by
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING *`,
    [
      doctorData.doctor_code,
      doctorData.hospital_id,
      doctorData.department_id,
      doctorData.first_name,
      doctorData.last_name,
      doctorData.specialization,
      doctorData.qualification,
      doctorData.registration_number,
      doctorData.experience_years,
      doctorData.consultation_fee,
      doctorData.phone,
      doctorData.email,
      doctorData.created_by,
    ]
  );
  return result.rows[0];
};

const update = async (id, doctorData) => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  Object.keys(doctorData).forEach((key) => {
    if (doctorData[key] !== undefined) {
      fields.push(`${key} = $${paramCount}`);
      values.push(doctorData[key]);
      paramCount++;
    }
  });

  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);

  const result = await query(
    `UPDATE doctors SET ${fields.join(', ')}
     WHERE id = $${paramCount}
     RETURNING *`,
    values
  );

  return result.rows[0];
};

const getAvailableSlots = async (doctorId, date) => {
  const result = await query(
    `SELECT ds.*
     FROM doctor_schedules ds
     WHERE ds.doctor_id = $1
     AND ds.day_of_week = EXTRACT(DOW FROM $2::date)
     AND ds.is_active = true`,
    [doctorId, date]
  );
  return result.rows;
};

export const doctorRepository = {
  findById,
  findByHospital,
  create,
  update,
  getAvailableSlots,
};

export default doctorRepository;
