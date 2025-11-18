import { query } from '../config/database.js';

const createAdmission = async (admissionData) => {
  const result = await query(
    `INSERT INTO ipd_admissions (
      admission_id, hospital_id, patient_id, doctor_id, department_id,
      bed_id, ward_id, admission_date, admission_time, admission_type,
      diagnosis, status, created_by
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING *`,
    [
      admissionData.admission_id,
      admissionData.hospital_id,
      admissionData.patient_id,
      admissionData.doctor_id,
      admissionData.department_id,
      admissionData.bed_id,
      admissionData.ward_id,
      admissionData.admission_date || new Date(),
      admissionData.admission_time || new Date(),
      admissionData.admission_type || 'PLANNED',
      admissionData.diagnosis,
      admissionData.status || 'ADMITTED',
      admissionData.created_by,
    ]
  );
  return result.rows[0];
};

const findById = async (id) => {
  const result = await query(
    `SELECT a.*,
            p.patient_id, p.first_name as patient_first_name,
            p.last_name as patient_last_name, p.age_years, p.gender,
            d.first_name as doctor_first_name, d.last_name as doctor_last_name,
            b.bed_number, w.ward_name
     FROM ipd_admissions a
     JOIN patients p ON a.patient_id = p.id
     JOIN doctors d ON a.doctor_id = d.id
     LEFT JOIN beds b ON a.bed_id = b.id
     LEFT JOIN wards w ON a.ward_id = w.id
     WHERE a.id = $1`,
    [id]
  );
  return result.rows[0];
};

const getActiveAdmissions = async (hospitalId) => {
  const result = await query(
    `SELECT a.*,
            p.patient_id, p.first_name as patient_first_name,
            p.last_name as patient_last_name, p.age_years, p.gender,
            b.bed_number, w.ward_name
     FROM ipd_admissions a
     JOIN patients p ON a.patient_id = p.id
     LEFT JOIN beds b ON a.bed_id = b.id
     LEFT JOIN wards w ON a.ward_id = w.id
     WHERE a.hospital_id = $1
     AND a.status IN ('ADMITTED', 'UNDER_TREATMENT')
     ORDER BY a.admission_date DESC`,
    [hospitalId]
  );
  return result.rows;
};

const discharge = async (admissionId, dischargeData) => {
  const result = await query(
    `UPDATE ipd_admissions
     SET status = 'DISCHARGED',
         discharge_date = $1,
         discharge_time = $2,
         discharge_summary = $3,
         discharge_type = $4,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $5
     RETURNING *`,
    [
      dischargeData.discharge_date || new Date(),
      dischargeData.discharge_time || new Date(),
      dischargeData.discharge_summary,
      dischargeData.discharge_type || 'NORMAL',
      admissionId,
    ]
  );
  return result.rows[0];
};

const addTreatmentRecord = async (recordData) => {
  const result = await query(
    `INSERT INTO ipd_treatment_records (
      admission_id, record_date, vital_signs, diagnosis, treatment_given,
      doctor_id, notes
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
    [
      recordData.admission_id,
      recordData.record_date || new Date(),
      recordData.vital_signs,
      recordData.diagnosis,
      recordData.treatment_given,
      recordData.doctor_id,
      recordData.notes,
    ]
  );
  return result.rows[0];
};

const getOccupancyRate = async (hospitalId) => {
  const result = await query(
    `SELECT
       COUNT(*) FILTER (WHERE status = 'OCCUPIED') as occupied_beds,
       COUNT(*) as total_beds,
       ROUND(
         COUNT(*) FILTER (WHERE status = 'OCCUPIED')::numeric /
         NULLIF(COUNT(*), 0)::numeric * 100,
         2
       ) as occupancy_rate
     FROM beds
     WHERE hospital_id = $1`,
    [hospitalId]
  );
  return result.rows[0];
};

export const ipdRepository = {
  createAdmission,
  findById,
  getActiveAdmissions,
  discharge,
  addTreatmentRecord,
  getOccupancyRate,
};

export default ipdRepository;
