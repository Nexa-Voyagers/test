import express from 'express';
import * as packageController from '../controllers/package.controller.js';
const router = express.Router();
router.post('/', packageController.create);
router.get('/', packageController.getAll);
router.get('/:id', packageController.getOne);
router.put('/:id', packageController.update);
router.delete('/:id', packageController.remove);
export default router;
