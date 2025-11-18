import express from 'express';
import {
  createPackage,
  getPackage,
  getAgencyPackages,
  searchPackages,
  updatePackage,
  getPopularPackages,
} from '../controllers/tourPackage.controller.js';

const router = express.Router();

router.post('/', createPackage);
router.get('/search', searchPackages);
router.get('/popular', getPopularPackages);
router.get('/', getAgencyPackages);
router.get('/:id', getPackage);
router.put('/:id', updatePackage);

export default router;
