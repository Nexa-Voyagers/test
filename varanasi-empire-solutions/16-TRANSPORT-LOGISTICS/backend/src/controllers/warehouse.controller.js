import { warehouseService } from '../services/warehouse.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const create = asyncHandler(async (req, res) => {
  const data = await warehouseService.createWarehouse(req.body);
  res.status(201).json({ success: true, data });
});

export const getAll = asyncHandler(async (req, res) => {
  const data = await warehouseService.getAllWarehouses(req.query);
  res.json({ success: true, count: data.length, data });
});

export const getOne = asyncHandler(async (req, res) => {
  const data = await warehouseService.getWarehouse(req.params.id);
  res.json({ success: true, data });
});

export const update = asyncHandler(async (req, res) => {
  const data = await warehouseService.updateWarehouse(req.params.id, req.body);
  res.json({ success: true, data });
});

export const remove = asyncHandler(async (req, res) => {
  await warehouseService.deleteWarehouse(req.params.id);
  res.json({ success: true, message: 'warehouse deleted' });
});
