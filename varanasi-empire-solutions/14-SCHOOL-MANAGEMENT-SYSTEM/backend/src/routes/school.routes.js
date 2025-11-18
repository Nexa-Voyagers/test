import express from 'express';
import * as schoolController from '../controllers/school.controller.js';

const router = express.Router();

router.get('/', schoolController.getAllSchools || schoolController.getAllSchool || schoolController.getTimetable || schoolController.getAdmissionReport);
router.get('/:id', schoolController.getSchoolById || schoolController.getSchool);
router.post('/', schoolController.createSchool);
router.put('/:id', schoolController.updateSchool);
router.delete('/:id', schoolController.deleteSchool);

export default router;
