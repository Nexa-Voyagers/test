import express from 'express';
import companyController from '../controllers/company.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Company routes
router.post('/', companyController.createCompany);
router.get('/', companyController.getCompanies);
router.get('/:id/stats', companyController.getCompanyStats);
router.get('/:id/statistics', companyController.getCompanyStatistics);
router.get('/:id', companyController.getCompanyById);
router.put('/:id', companyController.updateCompany);
router.delete('/:id', companyController.deleteCompany);

export default router;
