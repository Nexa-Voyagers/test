import express from 'express';
import * as artworkController from '../controllers/artwork.controller.js';
const router = express.Router();
router.post('/', artworkController.create);
router.get('/', artworkController.getAll);
router.get('/:id', artworkController.getOne);
router.put('/:id', artworkController.update);
router.delete('/:id', artworkController.remove);
export default router;
