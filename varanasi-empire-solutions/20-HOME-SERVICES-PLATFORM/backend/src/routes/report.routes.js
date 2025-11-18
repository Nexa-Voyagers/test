import express from 'express';
import * as reportController from '../controllers/report.controller.js';
const router = express.Router();
router.post('/', reportController.create);
router.get('/', reportController.getAll);
router.get('/:id', reportController.getOne);
router.put('/:id', reportController.update);
router.delete('/:id', reportController.remove);
export default router;
