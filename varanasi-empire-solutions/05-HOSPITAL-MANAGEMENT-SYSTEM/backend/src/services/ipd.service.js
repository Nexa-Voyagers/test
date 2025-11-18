import { ipdRepository } from '../repositories/ipd.repository.js';
import { patientRepository } from '../repositories/patient.repository.js';
import { doctorRepository } from '../repositories/doctor.repository.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import { generateAdmissionId } from '../utils/idGenerator.js';

/**
 * Admit patient
 */
const admitPatient = async (admissionData) => {
  // Verify patient exists
  const patient = await patientRepository.findById(admissionData.patient_id);
  if (!patient) {
    throw new NotFoundError('Patient');
  }

  // Verify doctor exists
  const doctor = await doctorRepository.findById(admissionData.doctor_id);
  if (!doctor) {
    throw new NotFoundError('Doctor');
  }

  // Generate admission ID
  const admissionId = generateAdmissionId();

  const admission = await ipdRepository.createAdmission({
    ...admissionData,
    admission_id: admissionId,
  });

  // Increment patient admission count
  await patientRepository.update(patient.id, {
    total_admissions: (patient.total_admissions || 0) + 1,
  });

  return admission;
};

/**
 * Get admission details
 */
const getAdmission = async (id) => {
  const admission = await ipdRepository.findById(id);
  if (!admission) {
    throw new NotFoundError('Admission');
  }
  return admission;
};

/**
 * Get active admissions
 */
const getActiveAdmissions = async (hospitalId) => {
  const admissions = await ipdRepository.getActiveAdmissions(hospitalId);
  return admissions;
};

/**
 * Discharge patient
 */
const dischargePatient = async (admissionId, dischargeData) => {
  const admission = await ipdRepository.findById(admissionId);
  if (!admission) {
    throw new NotFoundError('Admission');
  }

  if (admission.status === 'DISCHARGED') {
    throw new ValidationError([
      { field: 'status', message: 'Patient is already discharged' },
    ]);
  }

  const dischargedAdmission = await ipdRepository.discharge(admissionId, dischargeData);
  return dischargedAdmission;
};

/**
 * Add treatment record
 */
const addTreatmentRecord = async (recordData) => {
  const admission = await ipdRepository.findById(recordData.admission_id);
  if (!admission) {
    throw new NotFoundError('Admission');
  }

  const record = await ipdRepository.addTreatmentRecord(recordData);
  return record;
};

/**
 * Get bed occupancy rate
 */
const getBedOccupancyRate = async (hospitalId) => {
  const occupancy = await ipdRepository.getOccupancyRate(hospitalId);
  return occupancy;
};

/**
 * Generate discharge summary (stub)
 */
const generateDischargeSummary = async (admissionId) => {
  const admission = await getAdmission(admissionId);

  // In real implementation, would generate PDF
  return {
    message: 'Discharge summary generation would be implemented here',
    admission,
  };
};

export const ipdService = {
  admitPatient,
  getAdmission,
  getActiveAdmissions,
  dischargePatient,
  addTreatmentRecord,
  getBedOccupancyRate,
  generateDischargeSummary,
};

export default ipdService;
