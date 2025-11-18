import express from 'express';
import {
  admitPatient,
  getAdmission,
  getActiveAdmissions,
  dischargePatient,
  addTreatmentRecord,
  getBedOccupancyRate,
  generateDischargeSummary,
} from '../controllers/ipd.controller.js';

const router = express.Router();

router.post('/admissions', admitPatient);
router.get('/admissions/active', getActiveAdmissions);
router.get('/occupancy', getBedOccupancyRate);
router.get('/admissions/:id', getAdmission);
router.get('/admissions/:id/discharge-summary', generateDischargeSummary);
router.post('/admissions/:id/discharge', dischargePatient);
router.post('/admissions/:id/treatment', addTreatmentRecord);

export default router;
