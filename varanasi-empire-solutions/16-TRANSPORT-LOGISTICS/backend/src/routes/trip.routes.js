import express from 'express';
import * as tripController from '../controllers/trip.controller.js';
const router = express.Router();
router.post('/', tripController.create);
router.get('/', tripController.getAll);
router.get('/:id', tripController.getOne);
router.put('/:id', tripController.update);
router.delete('/:id', tripController.remove);
export default router;
