import express from 'express';
import * as classController from '../controllers/class.controller.js';
const router = express.Router();
router.post('/', classController.create);
router.get('/', classController.getAll);
router.get('/:id', classController.getOne);
router.put('/:id', classController.update);
router.delete('/:id', classController.remove);
export default router;
