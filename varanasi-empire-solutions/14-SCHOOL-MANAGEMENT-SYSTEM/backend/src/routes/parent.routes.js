import express from 'express';
import * as parentController from '../controllers/parent.controller.js';

const router = express.Router();

router.get('/', parentController.getAllParents || parentController.getAllParent || parentController.getTimetable || parentController.getAdmissionReport);
router.get('/:id', parentController.getParentById || parentController.getParent);
router.post('/', parentController.createParent);
router.put('/:id', parentController.updateParent);
router.delete('/:id', parentController.deleteParent);

export default router;
