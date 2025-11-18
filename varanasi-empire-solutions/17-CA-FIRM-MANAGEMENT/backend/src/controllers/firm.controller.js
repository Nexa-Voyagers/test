import { asyncHandler } from '../utils/asyncHandler.js';
import { '${controller}'Service } from '../services/'${controller}'.service.js';

export const getAll = asyncHandler(async (req, res) => {
  const result = await '${controller}'Service.getAll(req.user.firmId, req.query);
  res.json({ success: true, data: result });
});

export const getById = asyncHandler(async (req, res) => {
  const result = await '${controller}'Service.getById(req.params.id);
  res.json({ success: true, data: result });
});

export const create = asyncHandler(async (req, res) => {
  const result = await '${controller}'Service.create({ ...req.body, firmId: req.user.firmId, createdBy: req.user.id });
  res.status(201).json({ success: true, message: 'Created successfully', data: result });
});

export const update = asyncHandler(async (req, res) => {
  const result = await '${controller}'Service.update(req.params.id, req.body);
  res.json({ success: true, message: 'Updated successfully', data: result });
});

export const deleteRecord = asyncHandler(async (req, res) => {
  await '${controller}'Service.delete(req.params.id);
  res.json({ success: true, message: 'Deleted successfully' });
});
