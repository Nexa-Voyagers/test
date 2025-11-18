import express from 'express';
import * as libraryController from '../controllers/library.controller.js';

const router = express.Router();

router.get('/', libraryController.getAllLibrarys || libraryController.getAllLibrary || libraryController.getTimetable || libraryController.getAdmissionReport);
router.get('/:id', libraryController.getLibraryById || libraryController.getLibrary);
router.post('/', libraryController.createLibrary);
router.put('/:id', libraryController.updateLibrary);
router.delete('/:id', libraryController.deleteLibrary);

export default router;
