import express from 'express';
import * as companyController from '../controllers/company.controller.js';
const router = express.Router();
router.post('/', companyController.create);
router.get('/', companyController.getAll);
router.get('/:id', companyController.getOne);
router.put('/:id', companyController.update);
router.delete('/:id', companyController.remove);
export default router;
