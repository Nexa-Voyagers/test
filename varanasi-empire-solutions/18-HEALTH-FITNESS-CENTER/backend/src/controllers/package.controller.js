import { packageService } from '../services/package.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
export const create = asyncHandler(async (req, res) => {
  const data = await packageService.create(req.body);
  res.status(201).json({ success: true, data });
});
export const getAll = asyncHandler(async (req, res) => {
  const data = await packageService.getAll(req.query);
  res.json({ success: true, count: data.length, data });
});
export const getOne = asyncHandler(async (req, res) => {
  const data = await packageService.getById(req.params.id);
  res.json({ success: true, data });
});
export const update = asyncHandler(async (req, res) => {
  const data = await packageService.update(req.params.id, req.body);
  res.json({ success: true, data });
});
export const remove = asyncHandler(async (req, res) => {
  await packageService.delete(req.params.id);
  res.json({ success: true, message: 'Deleted successfully' });
});
