import { query } from '../config/database.js';

const createLabTest = async (testData) => {
  const result = await query(
    `INSERT INTO lab_tests (
      test_id, hospital_id, patient_id, doctor_id, test_name,
      test_category, sample_type, test_date, status, price, created_by
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *`,
    [
      testData.test_id,
      testData.hospital_id,
      testData.patient_id,
      testData.doctor_id,
      testData.test_name,
      testData.test_category,
      testData.sample_type,
      testData.test_date || new Date(),
      testData.status || 'PENDING',
      testData.price,
      testData.created_by,
    ]
  );
  return result.rows[0];
};

const findById = async (id) => {
  const result = await query(
    `SELECT lt.*,
            p.patient_id, p.first_name as patient_first_name,
            p.last_name as patient_last_name, p.age_years, p.gender,
            d.first_name as doctor_first_name, d.last_name as doctor_last_name
     FROM lab_tests lt
     JOIN patients p ON lt.patient_id = p.id
     LEFT JOIN doctors d ON lt.doctor_id = d.id
     WHERE lt.id = $1`,
    [id]
  );
  return result.rows[0];
};

const updateStatus = async (id, status, resultData = {}) => {
  const result = await query(
    `UPDATE lab_tests
     SET status = $1,
         result = $2,
         result_date = $3,
         technician_remarks = $4,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $5
     RETURNING *`,
    [
      status,
      resultData.result,
      resultData.result_date || new Date(),
      resultData.technician_remarks,
      id,
    ]
  );
  return result.rows[0];
};

const findByHospital = async (hospitalId, filters = {}) => {
  let queryText = `
    SELECT lt.*,
           p.patient_id, p.first_name as patient_first_name,
           p.last_name as patient_last_name
    FROM lab_tests lt
    JOIN patients p ON lt.patient_id = p.id
    WHERE lt.hospital_id = $1
  `;
  const values = [hospitalId];
  let paramCount = 2;

  if (filters.status) {
    queryText += ` AND lt.status = $${paramCount}`;
    values.push(filters.status);
    paramCount++;
  }

  if (filters.test_date) {
    queryText += ` AND lt.test_date = $${paramCount}`;
    values.push(filters.test_date);
    paramCount++;
  }

  queryText += ' ORDER BY lt.test_date DESC';

  if (filters.limit) {
    queryText += ` LIMIT $${paramCount}`;
    values.push(filters.limit);
  }

  const result = await query(queryText, values);
  return result.rows;
};

const getPendingTests = async (hospitalId) => {
  const result = await query(
    `SELECT lt.*,
            p.patient_id, p.first_name as patient_first_name,
            p.last_name as patient_last_name
     FROM lab_tests lt
     JOIN patients p ON lt.patient_id = p.id
     WHERE lt.hospital_id = $1
     AND lt.status IN ('PENDING', 'SAMPLE_COLLECTED', 'IN_PROGRESS')
     ORDER BY lt.test_date`,
    [hospitalId]
  );
  return result.rows;
};

export const labRepository = {
  createLabTest,
  findById,
  updateStatus,
  findByHospital,
  getPendingTests,
};

export default labRepository;
