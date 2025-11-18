import express from 'express';
import { propertyController } from '../controllers/property.controller.js';

const router = express.Router();

router.get('/statistics', propertyController.getStatistics);
router.get('/search', propertyController.searchByLocation);
router.get('/featured', propertyController.getFeatured);
router.get('/:id', propertyController.getProperty);
router.get('/', propertyController.getProperties);
router.post('/', propertyController.createProperty);
router.put('/:id', propertyController.updateProperty);
router.patch('/:id/status', propertyController.changeStatus);
router.post('/:id/images', propertyController.addImages);
router.delete('/:id', propertyController.deleteProperty);

export default router;
