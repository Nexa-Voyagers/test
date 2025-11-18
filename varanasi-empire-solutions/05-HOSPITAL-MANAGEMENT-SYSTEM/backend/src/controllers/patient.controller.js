import { patientService } from '../services/patient.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { logger } from '../config/logger.js';

/**
 * Register new patient
 * POST /api/patients
 */
export const registerPatient = asyncHandler(async (req, res) => {
  const patientData = {
    ...req.body,
    hospital_id: req.user.hospital_id,
    registered_by: req.user.id,
  };

  const patient = await patientService.registerPatient(patientData);

  logger.info(`Patient registered: ${patient.patient_id}`);

  res.status(201).json({
    success: true,
    message: 'Patient registered successfully',
    data: patient,
  });
});

/**
 * Get patient by ID
 * GET /api/patients/:id
 */
export const getPatient = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const patient = await patientService.getPatient(id);

  res.json({
    success: true,
    data: patient,
  });
});

/**
 * Get patient by patient ID
 * GET /api/patients/patient-id/:patientId
 */
export const getPatientByPatientId = asyncHandler(async (req, res) => {
  const { patientId } = req.params;
  const patient = await patientService.getPatientByPatientId(patientId);

  res.json({
    success: true,
    data: patient,
  });
});

/**
 * Search patients
 * GET /api/patients/search?q=searchTerm
 */
export const searchPatients = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const hospitalId = req.user.hospital_id;

  const patients = await patientService.searchPatients(q, hospitalId);

  res.json({
    success: true,
    data: patients,
    count: patients.length,
  });
});

/**
 * Update patient
 * PUT /api/patients/:id
 */
export const updatePatient = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const patient = await patientService.updatePatient(id, req.body);

  logger.info(`Patient updated: ${id}`);

  res.json({
    success: true,
    message: 'Patient updated successfully',
    data: patient,
  });
});

/**
 * Get patient statistics
 * GET /api/patients/stats
 */
export const getPatientStats = asyncHandler(async (req, res) => {
  const hospitalId = req.user.hospital_id;
  const stats = await patientService.getPatientStats(hospitalId);

  res.json({
    success: true,
    data: stats,
  });
});

export default {
  registerPatient,
  getPatient,
  getPatientByPatientId,
  searchPatients,
  updatePatient,
  getPatientStats,
};
