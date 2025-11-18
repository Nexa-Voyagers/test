import express from 'express';
import {
  createTest,
  getTestById,
  getAllTests,
  updateTest,
  deleteTest,
  getTestStatistics,
  enterTestResult,
  updateTestResult,
  deleteTestResult,
  getToppers,
  getStudentPerformance
} from '../controllers/test.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tests
 *   description: Test and result management endpoints
 */

router.post('/', createTest);
router.get('/', getAllTests);
router.get('/:id', getTestById);
router.put('/:id', updateTest);
router.delete('/:id', deleteTest);
router.get('/:id/statistics', getTestStatistics);
router.get('/:testId/toppers', getToppers);

// Test results routes
router.post('/results', enterTestResult);
router.put('/results/:id', updateTestResult);
router.delete('/results/:id', deleteTestResult);

export default router;
