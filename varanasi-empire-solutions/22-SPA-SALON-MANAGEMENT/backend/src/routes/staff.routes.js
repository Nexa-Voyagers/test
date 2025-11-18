import express from 'express';
import * as staffController from '../controllers/staff.controller.js';
const router = express.Router();
router.post('/', staffController.create);
router.get('/', staffController.getAll);
router.get('/:id', staffController.getOne);
router.put('/:id', staffController.update);
router.delete('/:id', staffController.remove);
export default router;
