import express from 'express';
import * as membershipController from '../controllers/membership.controller.js';
const router = express.Router();
router.post('/', membershipController.create);
router.get('/', membershipController.getAll);
router.get('/:id', membershipController.getOne);
router.put('/:id', membershipController.update);
router.delete('/:id', membershipController.remove);
export default router;
