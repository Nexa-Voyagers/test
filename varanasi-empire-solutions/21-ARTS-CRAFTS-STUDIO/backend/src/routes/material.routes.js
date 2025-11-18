import express from 'express';
import * as materialController from '../controllers/material.controller.js';
const router = express.Router();
router.post('/', materialController.create);
router.get('/', materialController.getAll);
router.get('/:id', materialController.getOne);
router.put('/:id', materialController.update);
router.delete('/:id', materialController.remove);
export default router;
