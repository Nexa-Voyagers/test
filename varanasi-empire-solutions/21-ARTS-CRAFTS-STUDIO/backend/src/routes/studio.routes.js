import express from 'express';
import * as studioController from '../controllers/studio.controller.js';
const router = express.Router();
router.post('/', studioController.create);
router.get('/', studioController.getAll);
router.get('/:id', studioController.getOne);
router.put('/:id', studioController.update);
router.delete('/:id', studioController.remove);
export default router;
