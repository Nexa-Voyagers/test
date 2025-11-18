import express from 'express';
import * as salonController from '../controllers/salon.controller.js';
const router = express.Router();
router.post('/', salonController.create);
router.get('/', salonController.getAll);
router.get('/:id', salonController.getOne);
router.put('/:id', salonController.update);
router.delete('/:id', salonController.remove);
export default router;
