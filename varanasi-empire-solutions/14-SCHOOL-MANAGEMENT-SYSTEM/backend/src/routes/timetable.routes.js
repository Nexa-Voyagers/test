import express from 'express';
import * as timetableController from '../controllers/timetable.controller.js';

const router = express.Router();

router.get('/', timetableController.getAllTimetables || timetableController.getAllTimetable || timetableController.getTimetable || timetableController.getAdmissionReport);
router.get('/:id', timetableController.getTimetableById || timetableController.getTimetable);
router.post('/', timetableController.createTimetable);
router.put('/:id', timetableController.updateTimetable);
router.delete('/:id', timetableController.deleteTimetable);

export default router;
