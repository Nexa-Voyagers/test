import express from 'express';
import {
  registerPatient,
  getPatient,
  getPatientByPatientId,
  searchPatients,
  updatePatient,
  getPatientStats,
} from '../controllers/patient.controller.js';

const router = express.Router();

router.post('/', registerPatient);
router.get('/search', searchPatients);
router.get('/stats', getPatientStats);
router.get('/patient-id/:patientId', getPatientByPatientId);
router.get('/:id', getPatient);
router.put('/:id', updatePatient);

export default router;
