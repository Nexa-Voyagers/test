import { productionService } from '../services/production.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createBatch = asyncHandler(async (req, res) => {
  const batch = await productionService.createBatch(req.body);
  res.status(201).json({ success: true, message: 'Production batch created', data: batch });
});

export const getAllBatches = asyncHandler(async (req, res) => {
  const filters = {
    unit_id: req.query.unit_id,
    product_id: req.query.product_id,
    status: req.query.status,
    from_date: req.query.from_date,
    to_date: req.query.to_date,
    limit: parseInt(req.query.limit) || 50,
    offset: parseInt(req.query.offset) || 0,
  };
  const batches = await productionService.getAllBatches(filters);
  res.json({ success: true, count: batches.length, data: batches });
});

export const getBatch = asyncHandler(async (req, res) => {
  const batch = await productionService.getBatch(req.params.id);
  res.json({ success: true, data: batch });
});

export const updateBatch = asyncHandler(async (req, res) => {
  const batch = await productionService.updateBatch(req.params.id, req.body);
  res.json({ success: true, message: 'Batch updated', data: batch });
});

export const startProduction = asyncHandler(async (req, res) => {
  const batch = await productionService.startProduction(req.params.id);
  res.json({ success: true, message: 'Production started', data: batch });
});

export const completeProduction = asyncHandler(async (req, res) => {
  const { quantity_produced, notes } = req.body;
  const batch = await productionService.completeProduction(req.params.id, quantity_produced, notes);
  res.json({ success: true, message: 'Production completed', data: batch });
});

export const cancelBatch = asyncHandler(async (req, res) => {
  const batch = await productionService.cancelBatch(req.params.id, req.body.reason);
  res.json({ success: true, message: 'Batch cancelled', data: batch });
});

export const getProductionStats = asyncHandler(async (req, res) => {
  const stats = await productionService.getProductionStats(req.query);
  res.json({ success: true, data: stats });
});
