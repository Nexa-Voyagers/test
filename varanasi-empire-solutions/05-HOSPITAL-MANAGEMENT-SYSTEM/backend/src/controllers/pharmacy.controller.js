import { pharmacyRepository } from '../repositories/pharmacy.repository.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { logger } from '../config/logger.js';

export const createSale = asyncHandler(async (req, res) => {
  const { saleData, items } = req.body;

  const sale = await pharmacyRepository.createSale({
    ...saleData,
    hospital_id: req.user.hospital_id,
    created_by: req.user.id,
    sale_id: `SALE-${Date.now()}`,
  });

  // Add items and update stock
  for (const item of items) {
    await pharmacyRepository.addSaleItem({
      ...item,
      sale_id: sale.id,
    });
    await pharmacyRepository.updateStock(item.medicine_id, item.quantity);
  }

  logger.info(`Pharmacy sale created: ${sale.sale_id}`);

  res.status(201).json({
    success: true,
    message: 'Sale created successfully',
    data: sale,
  });
});

export const searchMedicine = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const hospitalId = req.user.hospital_id;

  const medicines = await pharmacyRepository.findMedicineByName(hospitalId, q);

  res.json({
    success: true,
    data: medicines,
  });
});

export const getLowStockMedicines = asyncHandler(async (req, res) => {
  const hospitalId = req.user.hospital_id;
  const medicines = await pharmacyRepository.getLowStockMedicines(hospitalId);

  res.json({
    success: true,
    data: medicines,
  });
});

export const getExpiringMedicines = asyncHandler(async (req, res) => {
  const hospitalId = req.user.hospital_id;
  const { days = 30 } = req.query;

  const medicines = await pharmacyRepository.getExpiringMedicines(hospitalId, days);

  res.json({
    success: true,
    data: medicines,
  });
});

export default { createSale, searchMedicine, getLowStockMedicines, getExpiringMedicines };
