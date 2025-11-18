import { routeService } from '../services/route.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const create = asyncHandler(async (req, res) => {
  const data = await routeService.createRoute(req.body);
  res.status(201).json({ success: true, data });
});

export const getAll = asyncHandler(async (req, res) => {
  const data = await routeService.getAllRoutes(req.query);
  res.json({ success: true, count: data.length, data });
});

export const getOne = asyncHandler(async (req, res) => {
  const data = await routeService.getRoute(req.params.id);
  res.json({ success: true, data });
});

export const update = asyncHandler(async (req, res) => {
  const data = await routeService.updateRoute(req.params.id, req.body);
  res.json({ success: true, data });
});

export const remove = asyncHandler(async (req, res) => {
  await routeService.deleteRoute(req.params.id);
  res.json({ success: true, message: 'route deleted' });
});
