import express from 'express';
import * as memberController from '../controllers/member.controller.js';
const router = express.Router();
router.post('/', memberController.create);
router.get('/', memberController.getAll);
router.get('/:id', memberController.getOne);
router.put('/:id', memberController.update);
router.delete('/:id', memberController.remove);
export default router;
