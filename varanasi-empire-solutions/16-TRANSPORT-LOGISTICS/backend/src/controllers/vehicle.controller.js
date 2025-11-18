import { vehicleService } from '../services/vehicle.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const create = asyncHandler(async (req, res) => {
  const data = await vehicleService.createVehicle(req.body);
  res.status(201).json({ success: true, data });
});

export const getAll = asyncHandler(async (req, res) => {
  const data = await vehicleService.getAllVehicles(req.query);
  res.json({ success: true, count: data.length, data });
});

export const getOne = asyncHandler(async (req, res) => {
  const data = await vehicleService.getVehicle(req.params.id);
  res.json({ success: true, data });
});

export const update = asyncHandler(async (req, res) => {
  const data = await vehicleService.updateVehicle(req.params.id, req.body);
  res.json({ success: true, data });
});

export const remove = asyncHandler(async (req, res) => {
  await vehicleService.deleteVehicle(req.params.id);
  res.json({ success: true, message: 'vehicle deleted' });
});
