import express from 'express';
import * as sectionController from '../controllers/section.controller.js';

const router = express.Router();

router.get('/', sectionController.getAllSections || sectionController.getAllSection || sectionController.getTimetable || sectionController.getAdmissionReport);
router.get('/:id', sectionController.getSectionById || sectionController.getSection);
router.post('/', sectionController.createSection);
router.put('/:id', sectionController.updateSection);
router.delete('/:id', sectionController.deleteSection);

export default router;
