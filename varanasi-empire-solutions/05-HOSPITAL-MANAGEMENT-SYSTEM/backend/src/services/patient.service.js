import { patientRepository } from '../repositories/patient.repository.js';
import { NotFoundError, ValidationError, ConflictError } from '../utils/errors.js';
import { generatePatientId } from '../utils/idGenerator.js';

/**
 * Register new patient
 */
const registerPatient = async (patientData) => {
  // Check if patient already exists with same mobile
  const existingPatients = await patientRepository.findByMobile(
    patientData.mobile,
    patientData.hospital_id
  );

  if (existingPatients.length > 0) {
    throw new ConflictError(
      'Patient with this mobile number already exists. Please search for existing patient.'
    );
  }

  // Generate patient ID
  const patientId = generatePatientId();

  // Calculate age from date of birth
  const dob = new Date(patientData.date_of_birth);
  const today = new Date();
  const ageYears = today.getFullYear() - dob.getFullYear();

  const patient = await patientRepository.create({
    ...patientData,
    patient_id: patientId,
    age_years: ageYears,
  });

  return patient;
};

/**
 * Get patient by ID
 */
const getPatient = async (id) => {
  const patient = await patientRepository.findById(id);
  if (!patient) {
    throw new NotFoundError('Patient');
  }
  return patient;
};

/**
 * Get patient by patient ID
 */
const getPatientByPatientId = async (patientId) => {
  const patient = await patientRepository.findByPatientId(patientId);
  if (!patient) {
    throw new NotFoundError('Patient');
  }
  return patient;
};

/**
 * Search patients
 */
const searchPatients = async (searchTerm, hospitalId) => {
  if (!searchTerm || searchTerm.length < 2) {
    throw new ValidationError([
      { field: 'searchTerm', message: 'Search term must be at least 2 characters' },
    ]);
  }

  const patients = await patientRepository.search(searchTerm, hospitalId);
  return patients;
};

/**
 * Update patient
 */
const updatePatient = async (id, patientData) => {
  const patient = await patientRepository.findById(id);
  if (!patient) {
    throw new NotFoundError('Patient');
  }

  // Recalculate age if date of birth is updated
  if (patientData.date_of_birth) {
    const dob = new Date(patientData.date_of_birth);
    const today = new Date();
    patientData.age_years = today.getFullYear() - dob.getFullYear();
  }

  const updatedPatient = await patientRepository.update(id, patientData);
  return updatedPatient;
};

/**
 * Get patient statistics
 */
const getPatientStats = async (hospitalId) => {
  const stats = await patientRepository.getStats(hospitalId);
  return stats;
};

/**
 * Record patient visit
 */
const recordVisit = async (patientId) => {
  await patientRepository.incrementVisitCount(patientId);
};

export const patientService = {
  registerPatient,
  getPatient,
  getPatientByPatientId,
  searchPatients,
  updatePatient,
  getPatientStats,
  recordVisit,
};

export default patientService;
