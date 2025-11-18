import express from 'express';
import {
  createLabTest,
  getLabTest,
  updateTestStatus,
  getPendingTests,
  getHospitalTests,
  generateTestReport,
} from '../controllers/lab.controller.js';

const router = express.Router();

router.post('/tests', createLabTest);
router.get('/tests/pending', getPendingTests);
router.get('/tests', getHospitalTests);
router.get('/tests/:id', getLabTest);
router.get('/tests/:id/report', generateTestReport);
router.patch('/tests/:id/status', updateTestStatus);

export default router;
