import { distributorService } from '../services/distributor.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createDistributor = asyncHandler(async (req, res) => {
  const distributor = await distributorService.createDistributor(req.body);
  res.status(201).json({ success: true, message: 'Distributor created', data: distributor });
});

export const getAllDistributors = asyncHandler(async (req, res) => {
  const filters = {
    type: req.query.type,
    city: req.query.city,
    state: req.query.state,
    status: req.query.status,
    has_cold_storage: req.query.has_cold_storage,
    limit: parseInt(req.query.limit) || 50,
    offset: parseInt(req.query.offset) || 0,
  };
  const distributors = await distributorService.getAllDistributors(filters);
  res.json({ success: true, count: distributors.length, data: distributors });
});

export const getDistributor = asyncHandler(async (req, res) => {
  const distributor = await distributorService.getDistributor(req.params.id);
  res.json({ success: true, data: distributor });
});

export const updateDistributor = asyncHandler(async (req, res) => {
  const distributor = await distributorService.updateDistributor(req.params.id, req.body);
  res.json({ success: true, message: 'Distributor updated', data: distributor });
});

export const deleteDistributor = asyncHandler(async (req, res) => {
  await distributorService.deleteDistributor(req.params.id);
  res.json({ success: true, message: 'Distributor deleted' });
});

export const getDistributorStats = asyncHandler(async (req, res) => {
  const stats = await distributorService.getDistributorStats(req.params.id);
  res.json({ success: true, data: stats });
});
