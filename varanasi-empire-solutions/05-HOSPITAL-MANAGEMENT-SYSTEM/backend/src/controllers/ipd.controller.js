import { ipdService } from '../services/ipd.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { logger } from '../config/logger.js';

/**
 * Admit patient
 * POST /api/ipd/admissions
 */
export const admitPatient = asyncHandler(async (req, res) => {
  const admissionData = {
    ...req.body,
    hospital_id: req.user.hospital_id,
    created_by: req.user.id,
  };

  const admission = await ipdService.admitPatient(admissionData);

  logger.info(`Patient admitted: ${admission.admission_id}`);

  res.status(201).json({
    success: true,
    message: 'Patient admitted successfully',
    data: admission,
  });
});

/**
 * Get admission details
 * GET /api/ipd/admissions/:id
 */
export const getAdmission = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const admission = await ipdService.getAdmission(id);

  res.json({
    success: true,
    data: admission,
  });
});

/**
 * Get active admissions
 * GET /api/ipd/admissions/active
 */
export const getActiveAdmissions = asyncHandler(async (req, res) => {
  const hospitalId = req.user.hospital_id;
  const admissions = await ipdService.getActiveAdmissions(hospitalId);

  res.json({
    success: true,
    data: admissions,
    count: admissions.length,
  });
});

/**
 * Discharge patient
 * POST /api/ipd/admissions/:id/discharge
 */
export const dischargePatient = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const dischargeData = req.body;

  const admission = await ipdService.dischargePatient(id, dischargeData);

  logger.info(`Patient discharged: ${admission.admission_id}`);

  res.json({
    success: true,
    message: 'Patient discharged successfully',
    data: admission,
  });
});

/**
 * Add treatment record
 * POST /api/ipd/admissions/:id/treatment
 */
export const addTreatmentRecord = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const recordData = {
    ...req.body,
    admission_id: id,
    doctor_id: req.user.id,
  };

  const record = await ipdService.addTreatmentRecord(recordData);

  logger.info(`Treatment record added for admission: ${id}`);

  res.status(201).json({
    success: true,
    message: 'Treatment record added successfully',
    data: record,
  });
});

/**
 * Get bed occupancy rate
 * GET /api/ipd/occupancy
 */
export const getBedOccupancyRate = asyncHandler(async (req, res) => {
  const hospitalId = req.user.hospital_id;
  const occupancy = await ipdService.getBedOccupancyRate(hospitalId);

  res.json({
    success: true,
    data: occupancy,
  });
});

/**
 * Generate discharge summary
 * GET /api/ipd/admissions/:id/discharge-summary
 */
export const generateDischargeSummary = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const summary = await ipdService.generateDischargeSummary(id);

  res.json({
    success: true,
    data: summary,
  });
});

export default {
  admitPatient,
  getAdmission,
  getActiveAdmissions,
  dischargePatient,
  addTreatmentRecord,
  getBedOccupancyRate,
  generateDischargeSummary,
};
