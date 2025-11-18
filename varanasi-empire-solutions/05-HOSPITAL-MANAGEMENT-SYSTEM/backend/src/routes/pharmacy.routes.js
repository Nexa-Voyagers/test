import express from 'express';
import {
  createSale,
  searchMedicine,
  getLowStockMedicines,
  getExpiringMedicines,
} from '../controllers/pharmacy.controller.js';

const router = express.Router();

router.post('/sales', createSale);
router.get('/medicines/search', searchMedicine);
router.get('/medicines/low-stock', getLowStockMedicines);
router.get('/medicines/expiring', getExpiringMedicines);

export default router;
