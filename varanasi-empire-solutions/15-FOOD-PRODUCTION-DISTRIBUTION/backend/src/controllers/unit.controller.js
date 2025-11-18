import { unitService } from '../services/unit.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { logger } from '../config/logger.js';

export const createUnit = asyncHandler(async (req, res) => {
  const unit = await unitService.createUnit(req.body);
  logger.info(`Production unit created: ${unit.code}`);

  res.status(201).json({
    success: true,
    message: 'Production unit created successfully',
    data: unit,
  });
});

export const getAllUnits = asyncHandler(async (req, res) => {
  const filters = {
    type: req.query.type,
    city: req.query.city,
    status: req.query.status,
    limit: parseInt(req.query.limit) || 50,
    offset: parseInt(req.query.offset) || 0,
  };

  const units = await unitService.getAllUnits(filters);

  res.json({
    success: true,
    count: units.length,
    data: units,
  });
});

export const getUnit = asyncHandler(async (req, res) => {
  const unit = await unitService.getUnit(req.params.id);

  res.json({
    success: true,
    data: unit,
  });
});

export const updateUnit = asyncHandler(async (req, res) => {
  const unit = await unitService.updateUnit(req.params.id, req.body);
  logger.info(`Production unit updated: ${unit.code}`);

  res.json({
    success: true,
    message: 'Production unit updated successfully',
    data: unit,
  });
});

export const deleteUnit = asyncHandler(async (req, res) => {
  await unitService.deleteUnit(req.params.id);
  logger.info(`Production unit deleted: ${req.params.id}`);

  res.json({
    success: true,
    message: 'Production unit deleted successfully',
  });
});

export const getUnitStats = asyncHandler(async (req, res) => {
  const stats = await unitService.getUnitStats(req.params.id);

  res.json({
    success: true,
    data: stats,
  });
});

export const activateUnit = asyncHandler(async (req, res) => {
  const unit = await unitService.activateUnit(req.params.id);

  res.json({
    success: true,
    message: 'Production unit activated',
    data: unit,
  });
});

export const deactivateUnit = asyncHandler(async (req, res) => {
  const unit = await unitService.deactivateUnit(req.params.id);

  res.json({
    success: true,
    message: 'Production unit deactivated',
    data: unit,
  });
});
