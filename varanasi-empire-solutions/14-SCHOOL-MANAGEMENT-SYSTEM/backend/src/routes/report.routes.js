import express from 'express';
import * as reportController from '../controllers/report.controller.js';

const router = express.Router();

router.get('/', reportController.getAllReports || reportController.getAllReport || reportController.getTimetable || reportController.getAdmissionReport);
router.get('/:id', reportController.getReportById || reportController.getReport);
router.post('/', reportController.createReport);
router.put('/:id', reportController.updateReport);
router.delete('/:id', reportController.deleteReport);

export default router;
